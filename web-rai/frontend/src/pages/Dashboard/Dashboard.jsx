import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipementService, maintenanceEventService, ecmeService } from '../../services/api';
import { getCurrentWeek, getTasksForWeek, getOverdueTasks } from '../../utils/maintenanceSchedule';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Package, CheckCircle2, XCircle, Wrench,
  FlaskConical, BoxIcon, ArrowRight, BarChart2,
  CalendarClock, Clock,
} from 'lucide-react';

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

// ── KPI Card ───────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, iconBg, iconColor, badge, loading }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {badge && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>{badge.text}</span>}
    </div>
    <div className={`text-3xl font-bold mb-1 ${loading ? 'text-slate-200 animate-pulse' : 'text-slate-800'}`}>
      {loading ? '—' : value}
    </div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
  </div>
);

// ── Alert section wrapper ──────────────────────────────────
const AlertSection = ({ title, icon: Icon, alertCount, loading, children }) => {
  const hasAlert = !loading && alertCount > 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${hasAlert ? 'text-amber-500' : 'text-slate-400'}`} />
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-sky-400 rounded-full animate-spin" />
        ) : hasAlert ? (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            {alertCount}
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> À jour
          </span>
        )}
      </div>
      {loading ? (
        <div className="px-4 py-3 text-xs text-slate-400 animate-pulse">Chargement…</div>
      ) : (
        <div className="divide-y divide-slate-50">{children}</div>
      )}
    </div>
  );
};

// ── Alert item row ─────────────────────────────────────────
const AlertItem = ({ severity = 'neutral', children, action, onAction }) => {
  const cfg = {
    critical: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'    },
    warning:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'  },
    info:     { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400' },
    ok:       { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    neutral:  { bg: 'bg-slate-50',   text: 'text-slate-600',   dot: 'bg-slate-400'  },
  }[severity];
  return (
    <div
      className={`flex items-start justify-between gap-3 px-4 py-2.5 text-sm ${cfg.bg} ${cfg.text} ${onAction ? 'cursor-pointer hover:brightness-95 transition-all' : ''}`}
      onClick={onAction}
    >
      <div className="flex items-center gap-2.5">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-px ${cfg.dot}`} />
        <span className="leading-snug">{children}</span>
      </div>
      {action && onAction && (
        <span className="text-xs underline whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 mt-0.5">
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
  }, [currentWeek, currentYear]);

  useEffect(() => {
    ecmeService.getAll({ alerte: 'VERIFICATION' })
      .then(({ data }) => {
        setEcmeToVerif(data);
        const today = new Date();
        setEcmeOverdue(data.filter((e) => e.date_prochaine_verification && new Date(e.date_prochaine_verification) < today));
      })
      .catch((e) => console.error('Erreur ECME verif:', e))
      .finally(() => setLoadingEcme(false));
  }, []);

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
  const maintAlertCount = overdueTasks.length + weekPending + stats.horsService;
  const allClear = !loadingMaint && !loadingEcme && !loading &&
    maintAlertCount === 0 && ecmeToVerif.length === 0 && pdrStockAlerts.length === 0;

  if (loading && loadingMaint && loadingEcme) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm font-medium">Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* ── Page title ─────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="text-sm text-slate-400 mt-0.5">Vue d'ensemble de la gestion des équipements</p>
      </div>

      {/* ── Row 1: Equipment KPIs ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total équipements" value={stats.total}
          icon={Package} iconBg="bg-slate-100" iconColor="text-slate-600"
          loading={loading} />
        <KpiCard label="En service" value={stats.enService}
          icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600"
          badge={{ text: `${servicePct}%`, cls: 'bg-emerald-50 text-emerald-700' }}
          loading={loading} />
        <KpiCard label="Hors service" value={stats.horsService}
          icon={XCircle} iconBg="bg-red-50" iconColor="text-red-500"
          loading={loading} />
        <KpiCard label="En maintenance" value={stats.enMaintenance}
          icon={Wrench} iconBg="bg-amber-50" iconColor="text-amber-500"
          loading={loading} />
      </div>

      {/* ── Row 2: Alerts (left) + Progress/Chart (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">

        {/* ── LEFT: Alert sections ──────────────────────── */}
        <div className="space-y-4">

          {/* All-clear banner */}
          {allClear && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Situation nominale</p>
                <p className="text-xs text-emerald-600 mt-0.5">Aucune alerte active — tous les systèmes sont à jour</p>
              </div>
            </div>
          )}

          {/* ── Maintenance préventive ── */}
          <AlertSection
            title="Maintenance préventive"
            icon={CalendarClock}
            alertCount={maintAlertCount}
            loading={loadingMaint || loading}
          >
            {/* Overdue tasks */}
            {overdueTasks.length > 0 ? (
              <AlertItem severity="critical">
                <strong>{overdueTasks.length}</strong> maintenance(s) préventive(s) en retard (semaines passées)
              </AlertItem>
            ) : (
              <AlertItem severity="ok">Aucun retard — maintenances passées à jour</AlertItem>
            )}

            {/* This week */}
            {weekPending > 0 ? (
              <AlertItem severity="warning">
                <strong>{weekPending}</strong> à réaliser cette semaine (KW{String(currentWeek).padStart(2, '0')})
              </AlertItem>
            ) : weekTotal > 0 && (
              <AlertItem severity="ok">
                Semaine KW{String(currentWeek).padStart(2, '0')} — toutes les maintenances réalisées
              </AlertItem>
            )}

            {/* Rescheduled */}
            {weekRescheduled > 0 && (
              <AlertItem severity="info">
                <strong>{weekRescheduled}</strong> maintenance(s) reprogrammée(s) cette semaine
              </AlertItem>
            )}

            {/* Equipment hors service */}
            {stats.horsService > 0 && (
              <AlertItem severity="critical">
                <strong>{stats.horsService}</strong> équipement(s) hors service nécessite(nt) une attention
              </AlertItem>
            )}
          </AlertSection>

          {/* ── État des ECME ── */}
          <AlertSection
            title="État des ECME"
            icon={FlaskConical}
            alertCount={ecmeToVerif.length}
            loading={loadingEcme}
          >
            {ecmeToVerif.length === 0 ? (
              <AlertItem severity="ok">Tous les ECME sont à jour — aucune vérification requise</AlertItem>
            ) : (
              <>
                {/* Overdue ECME */}
                {ecmeOverdue.length > 0 && (
                  <>
                    <AlertItem severity="critical" action="Voir tout" onAction={() => navigate('/ecme?alerte=VERIFICATION')}>
                      <strong>{ecmeOverdue.length}</strong> ECME en retard de vérification (date dépassée)
                    </AlertItem>
                    <div className="bg-red-50/40 divide-y divide-red-100/60 max-h-36 overflow-y-auto">
                      {ecmeOverdue.slice(0, 5).map((e) => (
                        <div key={e.code}
                          className="flex items-center gap-3 px-4 py-2 text-xs cursor-pointer hover:bg-red-50 transition-colors"
                          onClick={() => navigate(`/ecme/${e.code}`)}>
                          <span className="font-mono font-bold text-red-700 flex-shrink-0 w-20 truncate">{e.code}</span>
                          <span className="flex-1 truncate text-slate-500">{e.designation}</span>
                          <span className="text-red-600 font-semibold whitespace-nowrap flex-shrink-0">
                            {e.date_prochaine_verification
                              ? new Date(e.date_prochaine_verification).toLocaleDateString('fr-FR')
                              : '—'}
                          </span>
                        </div>
                      ))}
                      {ecmeOverdue.length > 5 && (
                        <div className="px-4 py-2 text-xs text-slate-400">
                          +{ecmeOverdue.length - 5} autres —{' '}
                          <button className="underline text-sky-600" onClick={() => navigate('/ecme?alerte=VERIFICATION')}>
                            voir tous
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Upcoming (not yet overdue) */}
                {(ecmeToVerif.length - ecmeOverdue.length) > 0 && (
                  <AlertItem severity="info" action="Voir" onAction={() => navigate('/ecme?alerte=VERIFICATION')}>
                    <strong>{ecmeToVerif.length - ecmeOverdue.length}</strong> ECME à vérifier prochainement
                  </AlertItem>
                )}
              </>
            )}
          </AlertSection>

          {/* ── Stock PDR ── */}
          <AlertSection
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
                <div className="divide-y divide-amber-50/80 max-h-52 overflow-y-auto">
                  {pdrStockAlerts.slice(0, 6).map((item) => (
                    <div key={item.id}
                      className="flex items-center gap-3 px-4 py-2 text-xs cursor-pointer hover:bg-amber-50 transition-colors"
                      onClick={() => navigate('/inventaire?categorie=pdr')}>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                        item.level === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.level === 'critical' ? '✗' : '!'}
                      </span>
                      <span className="font-mono font-semibold text-amber-700 flex-shrink-0">{item.codeRai}</span>
                      <span className="flex-1 truncate text-slate-500">{item.designation}</span>
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {item.lowParts.map((part) => (
                          <span key={part.key}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              part.level === 'critical'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}>
                            {part.label.split(' ')[0]}: {part.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {pdrStockAlerts.length > 6 && (
                    <div className="px-4 py-2 text-xs text-slate-400 text-center">
                      +{pdrStockAlerts.length - 6} autres —{' '}
                      <button className="underline text-sky-600" onClick={() => navigate('/inventaire?categorie=pdr')}>
                        voir tous
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </AlertSection>
        </div>

        {/* ── RIGHT: Progress + Chart ───────────────────── */}
        <div className="space-y-4">

          {/* Week maintenance progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Préventives KW{String(currentWeek).padStart(2, '0')}
              </p>
              {!loadingMaint && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  Semaine en cours
                </span>
              )}
            </div>

            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-slate-800">{weekDone}</span>
              <span className="text-base text-slate-400 mb-1">/ {weekTotal} faits</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${
                progressPct === 100 ? 'bg-emerald-500' : progressPct > 50 ? 'bg-sky-500' : 'bg-amber-400'
              }`} style={{ width: `${progressPct}%` }} />
            </div>

            <div className="flex justify-between text-xs mb-4">
              <span className="text-emerald-600 font-semibold">✓ {weekDone}</span>
              <span className="text-amber-600 font-semibold">⏳ {weekPending} restant(s)</span>
              {weekRescheduled > 0 && <span className="text-orange-500 font-semibold">→ {weekRescheduled}</span>}
            </div>

            {/* Compact task list */}
            {loadingMaint ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-sky-400 rounded-full animate-spin" />
              </div>
            ) : weekTasks.length === 0 ? (
              <div className="flex flex-col items-center py-4 text-slate-400">
                <Clock className="w-5 h-5 mb-1 opacity-50" />
                <p className="text-xs">Aucune tâche planifiée</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {weekTasks.map((t) => {
                  const state = cellStates[t.key];
                  const isDone = state?.status === 'done';
                  const isRescheduled = state?.status === 'rescheduled';
                  return (
                    <div key={t.key} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-md ${
                      isDone ? 'bg-emerald-50 text-emerald-700' :
                      isRescheduled ? 'bg-orange-50 text-orange-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      <span className="font-mono font-semibold flex-shrink-0 w-16 truncate">{t.equip.code}</span>
                      <span className="flex-1 truncate text-slate-400 text-[11px]">{t.equip.designation}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                        t.color === 'blue' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{t.intType}</span>
                      <span className="w-10 text-right font-semibold flex-shrink-0 text-[10px]">
                        {isDone ? '✓' : isRescheduled ? `→${state.newWeek}` : '⏳'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Availability chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              Disponibilité par zone
            </p>
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.parZone} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" height={55}
                    tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
                    formatter={(v) => [`${v}%`, 'Disponibilité']}
                  />
                  <Bar dataKey="taux" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
