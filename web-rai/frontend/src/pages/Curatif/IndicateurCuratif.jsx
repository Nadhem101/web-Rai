import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { curativeMaintenanceService } from '../../services/api';
import { formatMinutes } from '../../utils/curativeMaintenance';
import { BarChart2, Clock, Timer, TrendingUp, AlertCircle, CalendarDays } from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import GrowBar from '../../components/motion/GrowBar.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const buildChartData = (summary = {}) =>
  (summary.months || []).map((m) => ({ ...m, averageMinutesValue: m.averageMinutes ?? 0 }));

const IndicateurCuratif = () => {
  const [summary,        setSummary]        = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear,   setSelectedYear]   = useState('');
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');

  const loadSummary = async (year = null) => {
    setLoading(true); setError('');
    try {
      const response = await curativeMaintenanceService.getMonthlySummary(year ? { year } : {});
      setSummary(response);
      setAvailableYears(Array.isArray(response?.availableYears) ? response.availableYears : []);
      setSelectedYear(response?.selectedYear ?? '');
    } catch {
      setSummary(null); setAvailableYears([]);
      setError('Impossible de charger l\'indicateur curatif.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSummary(); }, []);

  const chartData = useMemo(() => buildChartData(summary || {}), [summary]);
  const hasData   = useMemo(() => chartData.some((m) => m.count > 0), [chartData]);
  const maxAverage = useMemo(() => Math.max(1, ...chartData.map((m) => m.averageMinutesValue)), [chartData]);

  const handleYearChange = (e) => {
    const y = Number(e.target.value);
    if (Number.isFinite(y)) loadSummary(y);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]">

        {/* ── Header ── */}
        <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>
              Indicateur curatif {summary ? `— ${summary.selectedYear}` : ''}
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Moyenne mensuelle des temps d'arrêt par incident</p>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-[11px]" style={{ border: '1px solid var(--border)', background: 'var(--panel)' }}>
            <CalendarDays className="w-[15px] h-[15px]" style={{ color: 'var(--text3)' }} strokeWidth={1.8} />
            <div className="leading-none">
              <DataLabel className="mb-1 !text-[8.5px]">Année</DataLabel>
              <select
                value={selectedYear} onChange={handleYearChange} disabled={loading}
                className="font-display font-bold text-[14px] bg-transparent outline-none"
                style={{ color: 'var(--text)' }}
              >
                {(availableYears.length > 0
                  ? availableYears
                  : [new Date().getFullYear(), new Date().getFullYear() + 1]
                ).map((y) => <option key={y} value={y} style={{ color: '#000' }}>{y}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {error && (
          <div
            className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm"
            style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <KpiCard label="Incidents · période" value={summary?.totalCount ?? 0} icon={TrendingUp} accentVariant="accent" loading={loading} />
          <KpiCard
            label="Temps d'arrêt moyen"
            value={summary?.averageMinutes ?? 0} suffix=" min" icon={Clock} accentVariant="warn"
            loading={loading || summary?.averageMinutes === null || summary?.averageMinutes === undefined}
          />
          <KpiCard label="Temps d'arrêt total" value={summary?.totalMinutes ?? 0} suffix=" min" icon={Timer} accentVariant="crit" loading={loading} />
        </div>

        {/* ── Chart + Table ── */}
        <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr] items-start">

          {/* Chart */}
          <motion.div
            variants={staggerItemVariants}
            className="rounded-[14px] p-5"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[13.5px] flex items-center gap-2.5" style={{ color: 'var(--text)' }}>
                <BarChart2 className="w-[15px] h-[15px]" style={{ color: 'var(--text3)' }} strokeWidth={1.8} />
                Moyenne mensuelle
              </span>
              <DataLabel>Min / incident</DataLabel>
            </div>
            <p className="text-[11.5px] mb-[18px]" style={{ color: 'var(--text3)' }}>Les mois sans incident restent à zéro.</p>

            <div className="h-[230px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
                </div>
              ) : hasData ? (
                <div className="flex items-end gap-1.5 h-full">
                  {chartData.map((m, i) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center min-w-0">
                      <span className="font-mono text-[9px] font-semibold mb-1" style={{ color: 'var(--text2)' }}>
                        {m.averageMinutes === null || m.averageMinutes === undefined ? '—' : Math.round(m.averageMinutesValue)}
                      </span>
                      <div className="w-full h-[172px] flex items-end justify-center">
                        <GrowBar
                          delay={0.1 + i * 0.04}
                          className="w-[64%] max-w-[22px] rounded-[5px_5px_2px_2px]"
                          style={{
                            height: `${Math.max(4, (m.averageMinutesValue / maxAverage) * 172)}px`,
                            background: 'linear-gradient(180deg, var(--accent3), var(--accent))',
                            boxShadow: '0 0 12px var(--accent-soft)',
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px] mt-[7px]" style={{ color: 'var(--text3)' }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center rounded-[10px]" style={{ border: '1px dashed var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--text3)' }}>Aucune donnée disponible pour cette période</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            variants={staggerItemVariants}
            className="rounded-[14px] overflow-hidden flex flex-col"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <div className="px-[18px] py-[14px]" style={{ borderBottom: '1px solid var(--border2)' }}>
              <p className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>Détail par mois</p>
              <DataLabel className="mt-0.5">Agrégation des incidents</DataLabel>
            </div>
            <div className="overflow-auto flex-1 max-h-[430px]">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="sticky top-0" style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                    {['Mois','Incidents','Total','Moyenne'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left whitespace-nowrap"><DataLabel>{h}</DataLabel></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="py-8 text-center text-xs" style={{ color: 'var(--text3)' }}>Chargement…</td></tr>
                  ) : chartData.map((month) => (
                    <tr key={month.month} className="transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                      <td className="px-4 py-2.5 font-mono font-semibold" style={{ color: 'var(--text)' }}>{month.label}</td>
                      <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>{month.count}</td>
                      <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--text2)' }}>{formatMinutes(month.totalMinutes)}</td>
                      <td className="px-4 py-2.5">
                        {month.averageMinutes === null || month.averageMinutes === undefined ? (
                          <span style={{ color: 'var(--text3)' }}>—</span>
                        ) : (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-[18px] font-mono text-[11px] font-bold"
                            style={{ background: 'var(--warn-soft)', color: 'var(--warn)', border: '1px solid var(--warn)' }}
                          >
                            {formatMinutes(month.averageMinutes)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IndicateurCuratif;
