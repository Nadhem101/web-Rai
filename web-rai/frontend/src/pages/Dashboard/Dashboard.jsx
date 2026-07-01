import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { equipementService, maintenanceEventService, ecmeService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentWeek, getTasksForWeek, getOverdueTasks } from '../../utils/maintenanceSchedule';
import {
  Package, CheckCircle2, XCircle, Wrench,
  FlaskConical, BoxIcon, ArrowRight, BarChart2,
  CalendarClock, Clock,
} from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import HudCorner from '../../components/ui/HudCorner.jsx';
import CountUp from '../../components/motion/CountUp.jsx';
import GrowRing from '../../components/motion/GrowRing.jsx';
import GrowBar from '../../components/motion/GrowBar.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

// ── Helpers ────────────────────────────────────────────────
const PDR_LOW_STOCK_THRESHOLD = 1;

const normalizeCategory = (v = '') => String(v).toLowerCase().trim();

const parseQuantity = (value) => {
  const n = String(value ?? '').replace(',', '.').trim();
  if (!n) return null;
  const p = Number(n);
  return Number.isFinite(p) ? p : null;
};

const buildPdrStockAlerts = (equipements = []) =>
  equipements
    .filter((e) => normalizeCategory(e.categorie) === 'pdr' && e.pdr_details)
    .map((e) => {
      const d = e.pdr_details || {};
      const parts = [
        { key: 'lame_cuivre',      label: 'Lame cuivre',    quantity: d.lame_cuivre?.quantity },
        { key: 'lame_isolant',     label: 'Lame isolant',   quantity: d.lame_isolant?.quantity },
        { key: 'enclume_cuivre',   label: 'Encl. cuivre',  quantity: d.enclume_cuivre?.quantity },
        { key: 'enclume_isolant',  label: 'Encl. isolant', quantity: d.enclume_isolant?.quantity },
        { key: 'lame_denudage',    label: 'Dénudage',      quantity: d.lame_denudage_jeux },
      ];
      const lowParts = parts.map((p) => {
        const qty = parseQuantity(p.quantity);
        if (qty === null || qty > PDR_LOW_STOCK_THRESHOLD) return null;
        return { ...p, quantity: qty, level: qty === 0 ? 'critical' : 'warning' };
      }).filter(Boolean);
      if (!lowParts.length) return null;
      return {
        id: e.id, codeRai: e.code_rai, designation: e.designation,
        level: lowParts.some((p) => p.level === 'critical') ? 'critical' : 'warning',
        lowParts,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.level !== b.level) return a.level === 'critical' ? -1 : 1;
      return String(a.codeRai || '').localeCompare(String(b.codeRai || ''), 'fr', { numeric: true, sensitivity: 'base' });
    });

// ── Alert section wrapper ──────────────────────────────────
const AlertSection = ({ title, icon: Icon, alertCount, loading, children }) => {
  const hasAlert = !loading && alertCount > 0;
  return (
    <motion.div
      variants={staggerItemVariants}
      className="rounded-[14px] overflow-hidden"
      style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-[13px]"
        style={{ borderBottom: '1px solid var(--border2)', background: 'var(--panel2)' }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" style={{ color: hasAlert ? 'var(--warn)' : 'var(--text3)' }} strokeWidth={1.8} />
          <span className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>{title}</span>
        </div>
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        ) : hasAlert ? (
          <StatusBadge variant="crit">{alertCount}</StatusBadge>
        ) : (
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--ok)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> À jour
          </span>
        )}
      </div>
      {loading ? (
        <div className="px-4 py-3 text-xs animate-pulse" style={{ color: 'var(--text3)' }}>Chargement…</div>
      ) : (
        <div>{children}</div>
      )}
    </motion.div>
  );
};

// ── Alert item row ─────────────────────────────────────────
const SEVERITY_TOKENS = {
  critical: { bg: 'var(--crit-soft)', text: 'var(--text)', dot: 'var(--crit)', pulse: true },
  warning:  { bg: 'var(--warn-soft)', text: 'var(--text)', dot: 'var(--warn)', pulse: false },
  info:     { bg: 'var(--info-soft)', text: 'var(--text)', dot: 'var(--info)', pulse: false },
  ok:       { bg: 'transparent',      text: 'var(--text2)', dot: 'var(--ok)',  pulse: false },
  neutral:  { bg: 'transparent',      text: 'var(--text2)', dot: 'var(--text3)', pulse: false },
};

const AlertItem = ({ severity = 'neutral', children, action, onAction }) => {
  const cfg = SEVERITY_TOKENS[severity];
  return (
    <div
      className={`flex items-start justify-between gap-3 px-4 py-[11px] text-[13px] ${onAction ? 'cursor-pointer hover:brightness-95 transition-all' : ''}`}
      style={{ background: cfg.bg, color: cfg.text }}
      onClick={onAction}
    >
      <div className="flex items-center gap-[11px]">
        <span
          className="w-[7px] h-[7px] rounded-full flex-shrink-0"
          style={{ background: cfg.dot, color: cfg.dot, animation: cfg.pulse ? 'led-pulse 1.8s infinite' : undefined }}
        />
        <span className="leading-snug">{children}</span>
      </div>
      {action && onAction && (
        <span className="text-xs underline whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text3)' }}>
          {action} <ArrowRight className="w-2.5 h-2.5" />
        </span>
      )}
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────
const Dashboard = () => {
  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canMaintenance = can('maintenance');
  const canEcme        = can('ecme');

  const [stats, setStats] = useState({ total: 0, enService: 0, horsService: 0, enMaintenance: 0, parZone: [] });
  const [loading, setLoading] = useState(true);
  const [weekTasks, setWeekTasks] = useState([]);
  const [cellStates, setCellStates] = useState({});
  const [loadingMaint, setLoadingMaint] = useState(true);
  const [ecmeToVerif, setEcmeToVerif] = useState([]);
  const [ecmeOverdue, setEcmeOverdue] = useState([]);
  const [loadingEcme, setLoadingEcme] = useState(true);
  const [pdrStockAlerts, setPdrStockAlerts] = useState([]);

  useEffect(() => {
    equipementService.getAll()
      .then(({ data: equipements }) => {
        const list = Array.isArray(equipements) ? equipements : [];
        const total = list.length;
        const enService = list.filter((e) => e.statut === 'En service').length;
        const horsService = list.filter((e) => e.statut === 'Hors service').length;
        const enMaintenance = list.filter((e) => e.statut === 'En maintenance').length;
        const zonesMap = {};
        list.forEach((eq) => {
          const n = eq.Zone?.nom_zone || 'Non affecté';
          if (!zonesMap[n]) zonesMap[n] = { name: n, total: 0, enService: 0 };
          zonesMap[n].total++;
          if (eq.statut === 'En service') zonesMap[n].enService++;
        });
        const parZone = Object.values(zonesMap).map((z) => ({
          ...z, taux: Math.round((z.enService / z.total) * 100) || 0,
        }));
        setStats({ total, enService, horsService, enMaintenance, parZone });
        setPdrStockAlerts(buildPdrStockAlerts(list));
      })
      .catch((e) => console.error('Erreur stats:', e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!canMaintenance) { setLoadingMaint(false); return; }
    setWeekTasks(getTasksForWeek(currentWeek));
    maintenanceEventService.getByYear(currentYear)
      .then(({ data }) => {
        const states = {};
        data.forEach(({ equip_code, interval_type, week, status, new_week }) => {
          states[`${equip_code}__${interval_type}__${week}`] = { status, newWeek: new_week || undefined };
        });
        setCellStates(states);
      })
      .catch((e) => console.error('Erreur evenements maintenance:', e))
      .finally(() => setLoadingMaint(false));
  }, [currentWeek, currentYear, canMaintenance]);

  useEffect(() => {
    if (!canEcme) { setLoadingEcme(false); return; }
    ecmeService.getAll({ alerte: 'VERIFICATION' })
      .then(({ data }) => {
        setEcmeToVerif(data);
        const today = new Date();
        setEcmeOverdue(data.filter((e) => e.date_prochaine_verification && new Date(e.date_prochaine_verification) < today));
      })
      .catch((e) => console.error('Erreur ECME verif:', e))
      .finally(() => setLoadingEcme(false));
  }, [canEcme]);

  // ── Derived ───────────────────────────────────────────────
  const weekDone        = weekTasks.filter((t) => cellStates[t.key]?.status === 'done').length;
  const weekPending     = weekTasks.filter((t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled').length;
  const weekRescheduled = weekTasks.filter((t) => cellStates[t.key]?.status === 'rescheduled').length;
  const weekTotal       = weekTasks.length;
  const overdueTasks    = getOverdueTasks(currentWeek).filter(
    (t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled'
  );
  const progressPct     = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
  const servicePct      = stats.total ? Math.round((stats.enService / stats.total) * 100) : 0;
  const pdrCriticalCount = pdrStockAlerts.filter((i) => i.level === 'critical').length;
  const pdrWarningCount  = pdrStockAlerts.filter((i) => i.level === 'warning').length;

  // Alert counts per section
  const maintAlertCount = canMaintenance ? overdueTasks.length + weekPending + stats.horsService : 0;
  const allClear = !loadingMaint && !loadingEcme && !loading &&
    (!canMaintenance || (maintAlertCount === 0 && pdrStockAlerts.length === 0)) &&
    (!canEcme || ecmeToVerif.length === 0);

  if (loading && loadingMaint && loadingEcme) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text3)' }}>Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]">

      {/* ── Page title ─────────────────────────────────── */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5 mb-1">
        <div>
          <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Vue d'ensemble</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>
            Supervision en temps réel du parc d'équipements · {loading ? '…' : stats.total} actifs surveillés
          </p>
        </div>
        {!loading && (
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-[10px]"
            style={{ border: '1px solid var(--border)', background: 'var(--panel)' }}
          >
            <DataLabel>Disponibilité</DataLabel>
            <span className="font-display font-bold text-[15px]" style={{ color: 'var(--ok)' }}>
              <CountUp value={servicePct} suffix="%" />
            </span>
          </div>
        )}
      </motion.div>

      {/* ── Row 1: Equipment KPIs ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard label="Total équipements" value={stats.total} icon={Package} accentVariant="accent" loading={loading} />
        <KpiCard
          label="En service" value={stats.enService} icon={CheckCircle2} accentVariant="ok" loading={loading}
          badge={{ text: `${servicePct}%`, variant: 'ok' }}
        />
        <KpiCard
          label="Hors service" value={stats.horsService} icon={XCircle} accentVariant="crit" loading={loading}
          badge={!loading && stats.horsService > 0 ? { text: 'ALERTE', variant: 'crit', pulse: true } : undefined}
        />
        {canMaintenance && (
          <KpiCard label="En maintenance" value={stats.enMaintenance} icon={Wrench} accentVariant="warn" loading={loading} />
        )}
      </div>

      {/* ── Row 2: Alerts (left) + Progress/Chart (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">

        {/* ── LEFT: Alert sections ──────────────────────── */}
        <div className="flex flex-col gap-3.5">

          {/* All-clear banner */}
          {allClear && (
            <motion.div
              variants={staggerItemVariants}
              className="rounded-[14px] px-4 py-4 flex items-center gap-3"
              style={{ border: '1px solid var(--ok)', background: 'var(--ok-soft)' }}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--ok)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--ok)' }}>Situation nominale</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Aucune alerte active — tous les systèmes sont à jour</p>
              </div>
            </motion.div>
          )}

          {/* ── Maintenance préventive ── */}
          {canMaintenance && <AlertSection
            title="Maintenance préventive"
            icon={CalendarClock}
            alertCount={maintAlertCount}
            loading={loadingMaint || loading}
          >
            {overdueTasks.length > 0 ? (
              <AlertItem severity="critical">
                <strong>{overdueTasks.length}</strong> maintenance(s) préventive(s) en retard (semaines passées)
              </AlertItem>
            ) : (
              <AlertItem severity="ok">Aucun retard — maintenances passées à jour</AlertItem>
            )}

            {weekPending > 0 ? (
              <AlertItem severity="warning">
                <strong>{weekPending}</strong> à réaliser cette semaine (KW{String(currentWeek).padStart(2, '0')})
              </AlertItem>
            ) : weekTotal > 0 && (
              <AlertItem severity="ok">
                Semaine KW{String(currentWeek).padStart(2, '0')} — toutes les maintenances réalisées
              </AlertItem>
            )}

            {weekRescheduled > 0 && (
              <AlertItem severity="info">
                <strong>{weekRescheduled}</strong> maintenance(s) reprogrammée(s) cette semaine
              </AlertItem>
            )}

            {stats.horsService > 0 && (
              <AlertItem severity="critical">
                <strong>{stats.horsService}</strong> équipement(s) hors service nécessite(nt) une attention
              </AlertItem>
            )}
          </AlertSection>}

          {/* ── État des ECME ── */}
          {canEcme && <AlertSection
            title="État des ECME"
            icon={FlaskConical}
            alertCount={ecmeToVerif.length}
            loading={loadingEcme}
          >
            {ecmeToVerif.length === 0 ? (
              <AlertItem severity="ok">Tous les ECME sont à jour — aucune vérification requise</AlertItem>
            ) : (
              <>
                {ecmeOverdue.length > 0 && (
                  <>
                    <AlertItem severity="critical" action="Voir tout" onAction={() => navigate('/ecme?alerte=VERIFICATION')}>
                      <strong>{ecmeOverdue.length}</strong> ECME en retard de vérification (date dépassée)
                    </AlertItem>
                    <div className="max-h-36 overflow-y-auto" style={{ background: 'rgba(224,71,75,0.04)' }}>
                      {ecmeOverdue.slice(0, 5).map((e) => (
                        <div key={e.code}
                          className="flex items-center gap-3 px-4 py-2 text-xs cursor-pointer transition-colors hover:bg-[var(--panel3)]"
                          style={{ borderTop: '1px solid var(--border2)' }}
                          onClick={() => navigate(`/ecme/${e.code}`)}>
                          <span className="font-mono font-bold flex-shrink-0 w-20 truncate" style={{ color: 'var(--accent)' }}>{e.code}</span>
                          <span className="flex-1 truncate" style={{ color: 'var(--text2)' }}>{e.designation}</span>
                          <span className="font-semibold whitespace-nowrap flex-shrink-0" style={{ color: 'var(--crit)' }}>
                            {e.date_prochaine_verification
                              ? new Date(e.date_prochaine_verification).toLocaleDateString('fr-FR')
                              : '—'}
                          </span>
                        </div>
                      ))}
                      {ecmeOverdue.length > 5 && (
                        <div className="px-4 py-2 text-xs" style={{ color: 'var(--text3)' }}>
                          +{ecmeOverdue.length - 5} autres —{' '}
                          <button className="underline" style={{ color: 'var(--accent)' }} onClick={() => navigate('/ecme?alerte=VERIFICATION')}>
                            voir tous
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(ecmeToVerif.length - ecmeOverdue.length) > 0 && (
                  <AlertItem severity="info" action="Voir" onAction={() => navigate('/ecme?alerte=VERIFICATION')}>
                    <strong>{ecmeToVerif.length - ecmeOverdue.length}</strong> ECME à vérifier prochainement
                  </AlertItem>
                )}
              </>
            )}
          </AlertSection>}

          {/* ── Stock PDR ── */}
          {canMaintenance && <AlertSection
            title="Stock PDR"
            icon={BoxIcon}
            alertCount={pdrStockAlerts.length}
            loading={loading}
          >
            {pdrStockAlerts.length === 0 ? (
              <AlertItem severity="ok">Tous les stocks PDR sont à niveau</AlertItem>
            ) : (
              <>
                <AlertItem
                  severity={pdrCriticalCount > 0 ? 'critical' : 'warning'}
                  action="Voir le stock"
                  onAction={() => navigate('/inventaire?categorie=pdr')}
                >
                  {pdrCriticalCount > 0 && <><strong>{pdrCriticalCount}</strong> PDR en rupture</>}
                  {pdrCriticalCount > 0 && pdrWarningCount > 0 && ' et '}
                  {pdrWarningCount > 0 && <><strong>{pdrWarningCount}</strong> à surveiller</>}
                </AlertItem>
                <div className="max-h-52 overflow-y-auto">
                  {pdrStockAlerts.slice(0, 6).map((item) => (
                    <div key={item.id}
                      className="flex items-center gap-3 px-4 py-2 text-xs cursor-pointer transition-colors hover:bg-[var(--panel3)]"
                      style={{ borderTop: '1px solid var(--border2)' }}
                      onClick={() => navigate('/inventaire?categorie=pdr')}>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: item.level === 'critical' ? 'var(--crit-soft)' : 'var(--warn-soft)',
                          color: item.level === 'critical' ? 'var(--crit)' : 'var(--warn)',
                        }}
                      >
                        {item.level === 'critical' ? '✗' : '!'}
                      </span>
                      <span className="font-mono font-semibold flex-shrink-0" style={{ color: 'var(--warn)' }}>{item.codeRai}</span>
                      <span className="flex-1 truncate" style={{ color: 'var(--text2)' }}>{item.designation}</span>
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {item.lowParts.map((part) => (
                          <span key={part.key}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              background: part.level === 'critical' ? 'var(--crit-soft)' : 'var(--warn-soft)',
                              color: part.level === 'critical' ? 'var(--crit)' : 'var(--warn)',
                              border: `1px solid ${part.level === 'critical' ? 'var(--crit)' : 'var(--warn)'}`,
                            }}>
                            {part.label.split(' ')[0]}: {part.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {pdrStockAlerts.length > 6 && (
                    <div className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text3)' }}>
                      +{pdrStockAlerts.length - 6} autres —{' '}
                      <button className="underline" style={{ color: 'var(--accent)' }} onClick={() => navigate('/inventaire?categorie=pdr')}>
                        voir tous
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </AlertSection>}
        </div>

        {/* ── RIGHT: Progress gauge + Chart ───────────────────── */}
        <div className="flex flex-col gap-3.5">

          {/* Week maintenance ring gauge — maintenance only */}
          {canMaintenance && (
            <motion.div
              variants={staggerItemVariants}
              className="relative overflow-hidden rounded-[14px] p-[18px]"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <HudCorner position="tl" />
              <HudCorner position="tr" />
              <div className="flex items-center justify-between mb-1.5">
                <DataLabel>Préventives · KW{String(currentWeek).padStart(2, '0')}</DataLabel>
                {!loadingMaint && <StatusBadge variant="warn">EN COURS</StatusBadge>}
              </div>

              <div className="flex items-center justify-center relative h-[172px]">
                <svg width="172" height="172" viewBox="0 0 172 172">
                  <circle cx="86" cy="86" r="64" fill="none" stroke="var(--panel3)" strokeWidth="13" />
                  {!loadingMaint && (
                    <GrowRing cx={86} cy={86} radius={64} percent={progressPct} strokeWidth={13} />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display font-bold text-[34px] leading-none">
                    <CountUp value={weekDone} />
                    <span className="text-[18px] font-medium" style={{ color: 'var(--text3)' }}>/{weekTotal}</span>
                  </div>
                  <DataLabel className="mt-1">Réalisées</DataLabel>
                </div>
              </div>

              <div className="flex justify-between mt-1.5 pt-3.5" style={{ borderTop: '1px solid var(--border2)' }}>
                <div className="text-center">
                  <div className="font-display font-bold text-[16px]" style={{ color: 'var(--ok)' }}>{weekDone}</div>
                  <DataLabel className="mt-0.5">Faites</DataLabel>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-[16px]" style={{ color: 'var(--warn)' }}>{weekPending}</div>
                  <DataLabel className="mt-0.5">Restantes</DataLabel>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-[16px]" style={{ color: 'var(--info)' }}>{weekRescheduled}</div>
                  <DataLabel className="mt-0.5">Reprog.</DataLabel>
                </div>
              </div>

              {/* Compact task list */}
              {loadingMaint ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
                </div>
              ) : weekTasks.length === 0 ? (
                <div className="flex flex-col items-center py-4" style={{ color: 'var(--text3)' }}>
                  <Clock className="w-5 h-5 mb-1 opacity-50" />
                  <p className="text-xs">Aucune tâche planifiée</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-44 overflow-y-auto mt-3.5">
                  {weekTasks.map((t) => {
                    const state = cellStates[t.key];
                    const isDone = state?.status === 'done';
                    const isRescheduled = state?.status === 'rescheduled';
                    const bg = isDone ? 'var(--ok-soft)' : isRescheduled ? 'var(--info-soft)' : 'var(--panel2)';
                    const fg = isDone ? 'var(--ok)' : isRescheduled ? 'var(--info)' : 'var(--text2)';
                    return (
                      <div key={t.key} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-[8px]" style={{ background: bg, color: fg }}>
                        <span className="font-mono font-semibold flex-shrink-0 w-16 truncate">{t.equip.code}</span>
                        <span className="flex-1 truncate text-[11px]" style={{ color: 'var(--text3)' }}>{t.equip.designation}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0"
                          style={{ background: t.color === 'blue' ? 'var(--info-soft)' : 'var(--ok-soft)', color: t.color === 'blue' ? 'var(--info)' : 'var(--ok)' }}
                        >{t.intType}</span>
                        <span className="w-10 text-right font-semibold flex-shrink-0 text-[10px]">
                          {isDone ? '✓' : isRescheduled ? `→${state.newWeek}` : '⏳'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Availability chart */}
          <motion.div
            variants={staggerItemVariants}
            className="rounded-[14px] p-[18px]"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <BarChart2 className="w-[15px] h-[15px]" style={{ color: 'var(--text3)' }} strokeWidth={1.8} />
              <span className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>Disponibilité par zone</span>
            </div>
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="w-6 h-6 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
              </div>
            ) : stats.parZone.length === 0 ? (
              <div className="h-[120px] flex items-center justify-center text-xs" style={{ color: 'var(--text3)' }}>
                Aucune donnée de zone
              </div>
            ) : (
              <div className="flex items-end gap-2">
                {stats.parZone.map((z, i) => (
                  <div key={z.name} className="flex-1 flex flex-col items-center min-w-0">
                    <span className="font-mono text-[10px] font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>{z.taux}%</span>
                    <div className="w-full h-[148px] flex items-end justify-center">
                      <GrowBar
                        delay={0.15 + i * 0.048}
                        className="w-[62%] max-w-[24px] rounded-[6px_6px_3px_3px]"
                        style={{
                          height: `${Math.max(4, (z.taux / 100) * 148)}px`,
                          background: 'linear-gradient(180deg, var(--accent3), var(--accent))',
                          boxShadow: '0 0 14px var(--accent-soft)',
                        }}
                      />
                    </div>
                    <span className="text-[9.5px] mt-2 text-center leading-tight truncate max-w-full" style={{ color: 'var(--text3)' }}>{z.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
