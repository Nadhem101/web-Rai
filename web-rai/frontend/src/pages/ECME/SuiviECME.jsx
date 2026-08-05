import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecmeService } from '../../services/api';
import { FlaskConical, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

function daysFromToday(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

function DaysBadge({ days }) {
  if (days === null) return <span style={{ color: 'var(--text3)' }}>—</span>;
  if (days < 0)
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--crit-soft)', color: 'var(--crit)' }}>
      {Math.abs(days)}j de retard
    </span>;
  if (days === 0)
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--crit-soft)', color: 'var(--crit)' }}>
      Aujourd'hui
    </span>;
  if (days <= 30)
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
      Dans {days}j
    </span>;
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>
    Dans {days}j
  </span>;
}

function EcmeRow({ row, navigate }) {
  const days = daysFromToday(row.date_prochaine_verification);
  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-[var(--panel2)]"
      style={{ borderBottom: '1px solid var(--border2)' }}
      onClick={() => navigate(`/ecme/${row.code}`)}
    >
      <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{row.code}</td>
      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>{row.designation}</td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text2)' }}>
        {row.marque || '—'}
      </td>
      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
        {row.n_serie || '—'}
      </td>
      <td className="px-4 py-3">
        {row.affectation
          ? <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{row.affectation}</span>
          : <span style={{ color: 'var(--text3)' }}>—</span>}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text3)' }}>{fmtDate(row.date_prochaine_verification)}</td>
      <td className="px-4 py-3"><DaysBadge days={days} /></td>
      <td className="px-4 py-3">
        <button className="p-1.5 rounded-lg transition-colors hover:bg-[var(--accent-soft)]" style={{ color: 'var(--accent)' }}>
          <ArrowRight size={14} />
        </button>
      </td>
    </tr>
  );
}

function Section({ title, icon: Icon, color, colorSoft, rows, navigate, emptyText }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ border: `1px solid ${color}33`, boxShadow: 'var(--shadow)' }}>
      {/* Section header */}
      <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: colorSoft, borderBottom: `1px solid ${color}33` }}>
        <div className="flex items-center gap-2.5">
          <Icon size={16} style={{ color }} />
          <h2 className="text-sm font-bold" style={{ color }}>{title}</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: color, color: '#fff' }}>
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text3)', background: 'var(--panel)' }}>
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ background: 'var(--panel)' }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                {['Code', 'Désignation', 'Marque', 'N° Série', 'Affectation', 'Prochaine vérif.', 'Délai', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => <EcmeRow key={row.code} row={row} navigate={navigate} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SuiviECME() {
  const navigate = useNavigate();
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    ecmeService.getAll({})
      .then(({ data }) => { setRecords(data); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Only operational ECMEs (exclude DECLASSE and EXEMPTE from main view)
  const toVerify  = records
    .filter(r => r.alerte === 'VERIFICATION')
    .sort((a, b) => {
      // Most overdue first
      const da = daysFromToday(a.date_prochaine_verification) ?? 9999;
      const db = daysFromToday(b.date_prochaine_verification) ?? 9999;
      return da - db;
    });

  const valable = records
    .filter(r => r.alerte === 'VALABLE')
    .sort((a, b) => {
      // Closest expiry first
      const da = daysFromToday(a.date_prochaine_verification) ?? 9999;
      const db = daysFromToday(b.date_prochaine_verification) ?? 9999;
      return da - db;
    });

  const exempte = records.filter(r => r.alerte === 'EXEMPTE');

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-5" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <FlaskConical className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Suivi des ECME</h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text3)' }}>
              Vue opérationnelle — {toVerify.length} à vérifier · {valable.length} valables
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/ecme')}
          className="px-4 py-2 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-[var(--panel3)]"
          style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
          Vue complète →
        </button>
      </div>

      {error && (
        <div className="rounded-[10px] p-3 text-sm" style={{ background: 'var(--crit-soft)', border: '1px solid var(--crit)', color: 'var(--crit)' }}>⚠ {error}</div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-16 text-sm animate-pulse" style={{ color: 'var(--text3)' }}>Chargement...</div>
      ) : (
        <>
          {/* À vérifier — urgent */}
          <Section
            title="À vérifier — Action requise"
            icon={AlertTriangle}
            color="var(--crit)"
            colorSoft="var(--crit-soft)"
            rows={toVerify}
            navigate={navigate}
            emptyText="✓ Aucun ECME en attente de vérification"
          />

          {/* Valables */}
          <Section
            title="Valables"
            icon={CheckCircle2}
            color="var(--ok)"
            colorSoft="var(--ok-soft)"
            rows={valable}
            navigate={navigate}
            emptyText="Aucun ECME valable"
          />

          {/* Exemptés — collapsed summary */}
          {exempte.length > 0 && (
            <div className="rounded-[12px] px-4 py-3 flex items-center justify-between"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--text3)' }}>
                <Clock size={14} />
                <span className="text-sm">{exempte.length} ECME exempté(s) de vérification</span>
              </div>
              <button onClick={() => navigate('/ecme?alerte=EXEMPTE')} className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                Voir →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
