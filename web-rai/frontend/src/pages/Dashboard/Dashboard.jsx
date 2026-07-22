import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  equipementService, maintenanceEventService, ecmeService,
  curativeMaintenanceService, articleTestService, chiffrageService,
  outillageService, flowchartService,
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentWeek, getTasksForWeek, getOverdueTasks, resolveEquipement } from '../../utils/maintenanceSchedule';
import {
  Package, CheckCircle2, XCircle, Wrench,
  FlaskConical, BoxIcon, ArrowRight, BarChart2,
  CalendarClock, Clock, Activity, Timer, TrendingUp,
  Factory, Cable, FileSpreadsheet, Hammer, Workflow,
} from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import HudCorner from '../../components/ui/HudCorner.jsx';
import SplitBar from '../../components/ui/SplitBar.jsx';
import CountUp from '../../components/motion/CountUp.jsx';
import GrowRing from '../../components/motion/GrowRing.jsx';
import GrowBar from '../../components/motion/GrowBar.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

// ── Helpers ────────────────────────────────────────────────
const PDR_LOW_STOCK_THRESHOLD = 1;

const normalizeCategory = (v = '') => String(v).toLowerCase().trim();
const isMainCalendarEquipement = (e) => ['', 'equipement'].includes(normalizeCategory(e?.categorie));

const normalizeProgramme = (v = '') =>
  String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const CHIFFRAGE_STATUS_CONFIG = {
  brouillon: { label: 'Brouillon', variant: 'info' },
  en_cours:  { label: 'En cours',  variant: 'warn' },
  valide:    { label: 'Validé',    variant: 'ok' },
  archive:   { label: 'Archivé',   variant: 'info' },
};

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

// Outillages are a stock too (same low-stock logic/threshold as PDR)
const OUTILLAGE_LOW_STOCK_THRESHOLD = 1;

const buildOutillageStockAlerts = (outillages = []) =>
  outillages
    .map((o) => {
      const qty = Number.isFinite(Number(o.quantity)) ? Number(o.quantity) : null;
      if (qty === null || qty > OUTILLAGE_LOW_STOCK_THRESHOLD) return null;
      return { id: o.id, designation: o.designation, quantity: qty, level: qty === 0 ? 'critical' : 'warning' };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.level !== b.level) return a.level === 'critical' ? -1 : 1;
      return String(a.designation || '').localeCompare(String(b.designation || ''), 'fr', { sensitivity: 'base' });
    });

// ── Section header ─────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <motion.div variants={staggerItemVariants} className="flex items-center gap-2.5">
    <Icon className="w-[18px] h-[18px]" style={{ color: 'var(--text2)' }} strokeWidth={1.8} />
    <h2 className="font-display font-semibold text-[17px]" style={{ color: 'var(--text)' }}>{title}</h2>
    {subtitle && <span className="text-xs" style={{ color: 'var(--text3)' }}>· {subtitle}</span>}
  </motion.div>
);

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

// ── Small "go to module" link ──────────────────────────────
const SectionLink = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline"
    style={{ color: 'var(--accent)' }}
  >
    {children} <ArrowRight className="w-3 h-3" />
  </button>
);

// ── Card wrapper (plain panel, reused by the new sections) ──
const Card = ({ children, className = '' }) => (
  <motion.div
    variants={staggerItemVariants}
    className={`rounded-[14px] p-[18px] ${className}`}
    style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
  >
    {children}
  </motion.div>
);

// ── Dashboard ──────────────────────────────────────────────
const Dashboard = () => {
  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const navigate = useNavigate();
  const { can } = useAuth();
  const canMaintenance = can('maintenance');
  const canEcme        = can('ecme');
  const canIndus       = can('indus');

  const [stats, setStats] = useState({ total: 0, enService: 0, horsService: 0, enMaintenance: 0, parZone: [] });
  const [loading, setLoading] = useState(true);
  const [equipements, setEquipements] = useState([]);
  const [cellStates, setCellStates] = useState({});
  const [loadingMaint, setLoadingMaint] = useState(true);
  const [ecmeToVerif, setEcmeToVerif] = useState([]);
  const [ecmeOverdue, setEcmeOverdue] = useState([]);
  const [loadingEcme, setLoadingEcme] = useState(true);
  const [pdrStockAlerts, setPdrStockAlerts] = useState([]);

  const [outillages, setOutillages] = useState([]);
  const [loadingOutillages, setLoadingOutillages] = useState(true);

  const [curatifSummary, setCuratifSummary] = useState(null);
  const [loadingCuratif, setLoadingCuratif] = useState(true);

  const [articleTests, setArticleTests] = useState([]);
  const [chiffrages, setChiffrages] = useState([]);
  const [flowcharts, setFlowcharts] = useState([]);
  const [loadingIndus, setLoadingIndus] = useState(true);

  useEffect(() => {
    equipementService.getAll()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        setEquipements(list);
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

  // Real per-equipement schedule (DB `maintenance_intervals` — no hardcoded fallback)
  const resolvedEquipements = useMemo(
    () => equipements.filter(isMainCalendarEquipement).map(resolveEquipement),
    [equipements]
  );
  const weekTasks = useMemo(
    () => canMaintenance ? getTasksForWeek(resolvedEquipements, currentWeek) : [],
    [resolvedEquipements, currentWeek, canMaintenance]
  );

  useEffect(() => {
    if (!canMaintenance) { setLoadingMaint(false); return; }
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
  }, [currentYear, canMaintenance]);

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

  useEffect(() => {
    if (!canMaintenance) { setLoadingCuratif(false); return; }
    curativeMaintenanceService.getMonthlySummary()
      .then((data) => setCuratifSummary(data))
      .catch((e) => console.error('Erreur resume curatif:', e))
      .finally(() => setLoadingCuratif(false));
  }, [canMaintenance]);

  // Outillages are a stock like PDR — visible to everyone (same as /inventaire/outillages)
  useEffect(() => {
    outillageService.getAll()
      .then((data) => setOutillages(Array.isArray(data) ? data : []))
      .catch((e) => console.error('Erreur outillages:', e))
      .finally(() => setLoadingOutillages(false));
  }, []);

  useEffect(() => {
    if (!canIndus) { setLoadingIndus(false); return; }
    Promise.all([
      articleTestService.getAll().catch(() => []),
      chiffrageService.getAll().catch(() => []),
      flowchartService.getAll().catch(() => []),
    ])
      .then(([articles, chiffs, flows]) => {
        setArticleTests(Array.isArray(articles) ? articles : []);
        setChiffrages(Array.isArray(chiffs) ? chiffs : []);
        setFlowcharts(Array.isArray(flows) ? flows : []);
      })
      .finally(() => setLoadingIndus(false));
  }, [canIndus]);

  // ── Derived — préventif ─────────────────────────────────────
  const weekDone        = weekTasks.filter((t) => cellStates[t.key]?.status === 'done').length;
  const weekPending     = weekTasks.filter((t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled').length;
  const weekRescheduled = weekTasks.filter((t) => cellStates[t.key]?.status === 'rescheduled').length;
  const weekTotal       = weekTasks.length;
  const overdueTasks    = useMemo(
    () => canMaintenance ? getOverdueTasks(resolvedEquipements, currentWeek).filter(
      (t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled'
    ) : [],
    [resolvedEquipements, currentWeek, cellStates, canMaintenance]
  );
  const progressPct     = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
  const servicePct      = stats.total ? Math.round((stats.enService / stats.total) * 100) : 0;
  const pdrCriticalCount = pdrStockAlerts.filter((i) => i.level === 'critical').length;
  const pdrWarningCount  = pdrStockAlerts.filter((i) => i.level === 'warning').length;

  const outillageStockAlerts = useMemo(() => buildOutillageStockAlerts(outillages), [outillages]);
  const outillageCriticalCount = outillageStockAlerts.filter((i) => i.level === 'critical').length;
  const outillageWarningCount  = outillageStockAlerts.filter((i) => i.level === 'warning').length;

  const maintAlertCount = canMaintenance ? overdueTasks.length + weekPending + stats.horsService : 0;
  const allClear = !loadingMaint && !loadingEcme && !loading && !loadingOutillages &&
    (!canMaintenance || (maintAlertCount === 0 && pdrStockAlerts.length === 0)) &&
    outillageStockAlerts.length === 0 &&
    (!canEcme || ecmeToVerif.length === 0);

  // ── Derived — curatif ────────────────────────────────────────
  const MTTR_SEUIL = curatifSummary?.mttrSeuil ?? 15;
  const mttrExceedsSeuil = (curatifSummary?.averageMinutes ?? 0) > MTTR_SEUIL;
  const currentMonthBucket = curatifSummary?.months?.find((m) => m.month === currentMonth);

  // ── Derived — indus ──────────────────────────────────────────
  const programmeSegments = useMemo(() => {
    let programme = 0, autoApprentissage = 0, nonRenseigne = 0;
    articleTests.forEach((a) => {
      const n = normalizeProgramme(a.programme_test);
      if (n.startsWith('programm')) programme++;
      else if (n) autoApprentissage++;
      else nonRenseigne++;
    });
    const segs = [
      { label: 'Programmé', value: programme, color: 'var(--accent)' },
      { label: 'Auto-apprentissage', value: autoApprentissage, color: 'var(--info)' },
    ];
    if (nonRenseigne > 0) segs.push({ label: 'Non renseigné', value: nonRenseigne, color: 'var(--text3)' });
    return segs;
  }, [articleTests]);

  const chiffrageStatusCounts = useMemo(() => {
    const counts = {};
    chiffrages.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({ status, count, ...(CHIFFRAGE_STATUS_CONFIG[status] || CHIFFRAGE_STATUS_CONFIG.brouillon) }));
  }, [chiffrages]);

  const flowchartsPublies = flowcharts.filter((f) => f.status === 'published').length;

  if (loading && loadingMaint && loadingEcme) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text3)' }}>Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[26px]">

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

      {/* ══════════════════ INVENTAIRE ══════════════════ */}
      <section className="space-y-3.5">
        <SectionHeader icon={Package} title="Inventaire" subtitle="État général du parc d'équipements" />

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

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">
          {/* Availability chart */}
          <Card>
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
          </Card>

          {/* Stock PDR */}
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

          {/* Stock Outillages — same stock-tracking treatment as PDR */}
          <AlertSection
            title="Stock Outillages"
            icon={Hammer}
            alertCount={outillageStockAlerts.length}
            loading={loadingOutillages}
          >
            {outillageStockAlerts.length === 0 ? (
              <AlertItem severity="ok">Tous les outillages sont à niveau</AlertItem>
            ) : (
              <>
                <AlertItem
                  severity={outillageCriticalCount > 0 ? 'critical' : 'warning'}
                  action="Voir le stock"
                  onAction={() => navigate('/inventaire/outillages')}
                >
                  {outillageCriticalCount > 0 && <><strong>{outillageCriticalCount}</strong> outillage(s) en rupture</>}
                  {outillageCriticalCount > 0 && outillageWarningCount > 0 && ' et '}
                  {outillageWarningCount > 0 && <><strong>{outillageWarningCount}</strong> à surveiller</>}
                </AlertItem>
                <div className="max-h-52 overflow-y-auto">
                  {outillageStockAlerts.slice(0, 6).map((item) => (
                    <div key={item.id}
                      className="flex items-center gap-3 px-4 py-2 text-xs cursor-pointer transition-colors hover:bg-[var(--panel3)]"
                      style={{ borderTop: '1px solid var(--border2)' }}
                      onClick={() => navigate('/inventaire/outillages')}>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: item.level === 'critical' ? 'var(--crit-soft)' : 'var(--warn-soft)',
                          color: item.level === 'critical' ? 'var(--crit)' : 'var(--warn)',
                        }}
                      >
                        {item.level === 'critical' ? '✗' : '!'}
                      </span>
                      <span className="flex-1 truncate" style={{ color: 'var(--text2)' }}>{item.designation}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: item.level === 'critical' ? 'var(--crit-soft)' : 'var(--warn-soft)',
                          color: item.level === 'critical' ? 'var(--crit)' : 'var(--warn)',
                        }}
                      >
                        Qté : {item.quantity}
                      </span>
                    </div>
                  ))}
                  {outillageStockAlerts.length > 6 && (
                    <div className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text3)' }}>
                      +{outillageStockAlerts.length - 6} autres —{' '}
                      <button className="underline" style={{ color: 'var(--accent)' }} onClick={() => navigate('/inventaire/outillages')}>
                        voir tous
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </AlertSection>
        </div>
      </section>

      {/* ══════════════════ MAINTENANCE PRÉVENTIVE ══════════════════ */}
      {canMaintenance && (
        <section className="space-y-3.5">
          <SectionHeader icon={CalendarClock} title="Maintenance préventive" />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">

            <AlertSection
              title="Alertes préventif"
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
            </AlertSection>

            {/* Week maintenance ring gauge */}
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
          </div>
        </section>
      )}

      {/* ══════════════════ MAINTENANCE CURATIVE ══════════════════ */}
      {canMaintenance && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <SectionHeader icon={Activity} title="Maintenance curative" />
            <SectionLink onClick={() => navigate('/curatif/indicateur')}>Voir l'indicateur curatif</SectionLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <KpiCard
              label="Incidents ce mois" value={currentMonthBucket?.count ?? 0} icon={TrendingUp}
              accentVariant="accent" loading={loadingCuratif}
            />
            <KpiCard
              label={`MTTR · seuil ${MTTR_SEUIL} min`} value={curatifSummary?.averageMinutes ?? 0} suffix=" min" icon={Clock}
              accentVariant={mttrExceedsSeuil ? 'crit' : 'ok'}
              loading={loadingCuratif || curatifSummary?.averageMinutes == null}
            />
            <KpiCard
              label="MTBF · bon fonctionnement" value={curatifSummary?.mtbf ?? 0} suffix=" min" icon={Activity}
              accentVariant="accent" loading={loadingCuratif || curatifSummary?.mtbf == null}
            />
            <KpiCard
              label="Arrêt ce mois" value={currentMonthBucket?.totalMinutes ?? 0} suffix=" min" icon={Timer}
              accentVariant="crit" loading={loadingCuratif}
            />
          </div>
        </section>
      )}

      {/* ══════════════════ QUALITÉ — ECME ══════════════════ */}
      {canEcme && (
        <section className="space-y-3.5">
          <SectionHeader icon={FlaskConical} title="Qualité — ECME" />
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
          </AlertSection>
        </section>
      )}

      {/* ══════════════════ INDUSTRIALISATION ══════════════════ */}
      {canIndus && (
        <section className="space-y-3.5">
          <SectionHeader icon={Factory} title="Industrialisation" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Câblage — Programme test */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Cable className="w-[15px] h-[15px]" style={{ color: 'var(--text3)' }} strokeWidth={1.8} />
                  <span className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>Câblage — Programme test</span>
                </div>
                <SectionLink onClick={() => navigate('/industrialization/test-cables')}>Voir les articles</SectionLink>
              </div>
              {loadingIndus ? (
                <div className="h-3 rounded-full animate-pulse" style={{ background: 'var(--panel3)' }} />
              ) : articleTests.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text3)' }}>Aucun article de test enregistré</p>
              ) : (
                <SplitBar segments={programmeSegments} loading={loadingIndus} />
              )}
              <p className="text-xs mt-3.5" style={{ color: 'var(--text3)' }}>
                {loadingIndus ? 'Chargement…' : `${articleTests.length} article(s) de test au total`}
              </p>
            </Card>

            {/* Chiffrages */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-[15px] h-[15px]" style={{ color: 'var(--text3)' }} strokeWidth={1.8} />
                  <span className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>Chiffrages</span>
                </div>
                <SectionLink onClick={() => navigate('/industrialization')}>Voir tout</SectionLink>
              </div>
              {loadingIndus ? (
                <div className="h-6 rounded animate-pulse" style={{ background: 'var(--panel3)' }} />
              ) : chiffrageStatusCounts.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text3)' }}>Aucun chiffrage enregistré</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {chiffrageStatusCounts.map(({ status, count, label, variant }) => (
                    <span key={status} className="inline-flex items-center gap-1.5">
                      <StatusBadge variant={variant}>{label}</StatusBadge>
                      <span className="font-display font-bold text-[15px]" style={{ color: 'var(--text)' }}>{count}</span>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs mt-3.5" style={{ color: 'var(--text3)' }}>
                {loadingIndus ? 'Chargement…' : `${chiffrages.length} chiffrage(s) au total`}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <KpiCard
              label="Flowcharts publiés" value={flowchartsPublies} icon={Workflow}
              accentVariant="accent" loading={loadingIndus}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
