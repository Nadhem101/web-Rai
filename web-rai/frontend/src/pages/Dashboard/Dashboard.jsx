import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipementService, maintenanceEventService, ecmeService } from '../../services/api';
import { getCurrentWeek, getTasksForWeek, getOverdueTasks } from '../../utils/maintenanceSchedule';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PDR_LOW_STOCK_THRESHOLD = 1;

const normalizeCategory = (value = '') => String(value).toLowerCase().trim();

const parseQuantity = (value) => {
  const normalized = String(value ?? '').replace(',', '.').trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const getStockSeverityClasses = (level) => {
  if (level === 'critical') {
    return {
      badge: 'bg-red-100 text-red-700 border-red-200',
      number: 'text-red-700',
      panel: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    };
  }

  return {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    number: 'text-amber-700',
    panel: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  };
};

const buildPdrStockAlerts = (equipements = []) => {
  return equipements
    .filter((equipement) => normalizeCategory(equipement.categorie) === 'pdr' && equipement.pdr_details)
    .map((equipement) => {
      const details = equipement.pdr_details || {};
      const parts = [
        { key: 'lame_cuivre', label: 'Lame cuivre', reference: details.lame_cuivre?.reference, quantity: details.lame_cuivre?.quantity },
        { key: 'lame_isolant', label: 'Lame isolant', reference: details.lame_isolant?.reference, quantity: details.lame_isolant?.quantity },
        { key: 'enclume_cuivre', label: 'Enclume cuivre', reference: details.enclume_cuivre?.reference, quantity: details.enclume_cuivre?.quantity },
        { key: 'enclume_isolant', label: 'Enclume isolant', reference: details.enclume_isolant?.reference, quantity: details.enclume_isolant?.quantity },
        { key: 'lame_denudage_jeux', label: 'Lame de denudage', reference: null, quantity: details.lame_denudage_jeux },
      ];

      const lowParts = parts
        .map((part) => {
          const quantity = parseQuantity(part.quantity);
          if (quantity === null || quantity > PDR_LOW_STOCK_THRESHOLD) return null;

          return {
            ...part,
            quantity,
            level: quantity === 0 ? 'critical' : 'warning',
          };
        })
        .filter(Boolean);

      if (lowParts.length === 0) return null;

      return {
        id: equipement.id,
        codeRai: equipement.code_rai,
        designation: equipement.designation,
        fabricant: equipement.Fabricant?.nom || '-',
        zone: equipement.Zone?.nom_zone || '-',
        level: lowParts.some((part) => part.level === 'critical') ? 'critical' : 'warning',
        lowParts,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (left.level !== right.level) return left.level === 'critical' ? -1 : 1;
      return String(left.codeRai || '').localeCompare(String(right.codeRai || ''), 'fr', { numeric: true, sensitivity: 'base' });
    });
};

const Dashboard = () => {
  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();

  const [stats, setStats] = useState({
    total: 0,
    enService: 0,
    horsService: 0,
    enMaintenance: 0,
    parZone: [],
  });
  const [loading, setLoading] = useState(true);

  // Maintenance schedule state
  const [weekTasks, setWeekTasks]     = useState([]);   // all tasks scheduled this week
  const [cellStates, setCellStates]   = useState({});   // { key: { status, newWeek? } }
  const [loadingMaint, setLoadingMaint] = useState(true);

  // ECME verification state
  const [ecmeToVerif,   setEcmeToVerif]   = useState([]);  // ECMEs with alerte=VERIFICATION
  const [ecmeOverdue,   setEcmeOverdue]   = useState([]);  // subset: past prochaine verif date
  const [loadingEcme,   setLoadingEcme]   = useState(true);
  const [pdrStockAlerts, setPdrStockAlerts] = useState([]);

  const navigate = useNavigate();

  // ── Load equipment stats ────────────────────────────────────
  useEffect(() => {
    equipementService.getAll()
      .then(({ data: equipements }) => {
        const equipmentList = Array.isArray(equipements) ? equipements : [];
        const total        = equipmentList.length;
        const enService    = equipmentList.filter((e) => e.statut === 'En service').length;
        const horsService  = equipmentList.filter((e) => e.statut === 'Hors service').length;
        const enMaintenance = equipmentList.filter((e) => e.statut === 'En maintenance').length;

        const zonesMap = {};
        equipmentList.forEach((eq) => {
          const zoneName = eq.Zone?.nom_zone || 'Non affecte';
          if (!zonesMap[zoneName]) zonesMap[zoneName] = { name: zoneName, total: 0, enService: 0 };
          zonesMap[zoneName].total++;
          if (eq.statut === 'En service') zonesMap[zoneName].enService++;
        });
        const parZone = Object.values(zonesMap).map((z) => ({
          ...z,
          taux: Math.round((z.enService / z.total) * 100) || 0,
        }));
        setStats({ total, enService, horsService, enMaintenance, parZone });
        setPdrStockAlerts(buildPdrStockAlerts(equipmentList));
      })
      .catch((e) => console.error('Erreur stats:', e))
      .finally(() => setLoading(false));
  }, []);

  // ── Load maintenance events ─────────────────────────────────
  useEffect(() => {
    // Compute tasks scheduled for current week
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

  // ── Load ECME verification alerts ──────────────────────────
  useEffect(() => {
    ecmeService.getAll({ alerte: 'VERIFICATION' })
      .then(({ data }) => {
        setEcmeToVerif(data);
        const today = new Date();
        const overdue = data.filter(e => {
          if (!e.date_prochaine_verification) return false;
          return new Date(e.date_prochaine_verification) < today;
        });
        setEcmeOverdue(overdue);
      })
      .catch((e) => console.error('Erreur ECME verif:', e))
      .finally(() => setLoadingEcme(false));
  }, []);

  // ── Derived maintenance stats ───────────────────────────────
  const weekDone       = weekTasks.filter((t) => cellStates[t.key]?.status === 'done').length;
  const weekPending    = weekTasks.filter((t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled').length;
  const weekRescheduled = weekTasks.filter((t) => cellStates[t.key]?.status === 'rescheduled').length;
  const weekTotal      = weekTasks.length;

  // Overdue = past weeks scheduled and NOT done and NOT rescheduled
  const overdueTasks = getOverdueTasks(currentWeek).filter(
    (t) => !cellStates[t.key] || cellStates[t.key].status === 'rescheduled'
  );

  const pieData = [
    { name: 'En service',    value: stats.enService,    color: '#10b981' },
    { name: 'Hors service',  value: stats.horsService,  color: '#ef4444' },
    { name: 'En maintenance',value: stats.enMaintenance,color: '#f59e0b' },
  ].filter((item) => item.value > 0);

  const pdrCriticalCount = pdrStockAlerts.filter((item) => item.level === 'critical').length;
  const pdrWarningCount = pdrStockAlerts.filter((item) => item.level === 'warning').length;
  const pdrAlertHasCritical = pdrCriticalCount > 0;

  const progressPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  if (loading) return <div className="p-6 text-center">Chargement du dashboard...</div>;

  return (
    <div className="p-6 flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Tableau de bord WEB-RAI</h1>

      {/* ── KPIs équipements ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total equipements</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-500">En service</div>
          <div className="text-3xl font-bold text-green-600">{stats.enService}</div>
          <div className="text-xs text-gray-400">
            {stats.total ? Math.round((stats.enService / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-500">Hors service</div>
          <div className="text-3xl font-bold text-red-600">{stats.horsService}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">En maintenance</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.enMaintenance}</div>
        </div>
      </div>

      {/* ── KPIs ECME ─────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 cursor-pointer group"
        onClick={() => navigate('/ecme')}
        title="Voir l'État des ECME"
      >
        <div className={`bg-white p-5 rounded-lg shadow border-l-4 group-hover:shadow-md transition-shadow ${ecmeOverdue.length > 0 ? 'border-red-500' : 'border-green-500'}`}>
          <div className="text-sm text-gray-500">ECME en retard</div>
          <div className={`text-3xl font-bold ${ecmeOverdue.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {loadingEcme ? <span className="text-gray-300 animate-pulse">—</span> : ecmeOverdue.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Date de vérif. dépassée</div>
        </div>
        <div className={`bg-white p-5 rounded-lg shadow border-l-4 group-hover:shadow-md transition-shadow ${(ecmeToVerif.length - ecmeOverdue.length) > 0 ? 'border-orange-400' : 'border-green-500'}`}>
          <div className="text-sm text-gray-500">ECME à vérifier</div>
          <div className={`text-3xl font-bold ${(ecmeToVerif.length - ecmeOverdue.length) > 0 ? 'text-orange-500' : 'text-green-600'}`}>
            {loadingEcme ? <span className="text-gray-300 animate-pulse">—</span> : ecmeToVerif.length - ecmeOverdue.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Vérification requise (non échu)</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow group-hover:shadow-md transition-shadow col-span-2 md:col-span-1">
          <div className="text-sm text-gray-500">Total ECME à vérifier</div>
          <div className={`text-3xl font-bold ${ecmeToVerif.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {loadingEcme ? <span className="text-gray-300 animate-pulse">—</span> : ecmeToVerif.length}
          </div>
          <div className="text-xs text-blue-500 mt-1">🔬 État des ECME →</div>
        </div>
      </div>

      {/* ── Maintenance KW courante ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Progress card */}
        <div className="bg-white p-5 rounded-lg shadow col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700">
              Preventives KW{String(currentWeek).padStart(2, '0')}
            </div>
            {loadingMaint ? (
              <span className="text-xs text-gray-400 animate-pulse">chargement…</span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                Semaine courante
              </span>
            )}
          </div>

          {/* Big counter */}
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold text-slate-800">{weekDone}</span>
            <span className="text-lg text-gray-400 mb-1">/ {weekTotal} faits</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                progressPct === 100
                  ? 'bg-green-500'
                  : progressPct > 50
                  ? 'bg-blue-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span className="text-green-600 font-medium">✓ {weekDone} fait(s)</span>
            <span className="text-amber-600 font-medium">⏳ {weekPending} restant(s)</span>
            {weekRescheduled > 0 && (
              <span className="text-orange-500 font-medium">→ {weekRescheduled} reporte(s)</span>
            )}
          </div>
        </div>

        {/* This week breakdown */}
        <div className="bg-white p-5 rounded-lg shadow col-span-2">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Detail des taches — KW{String(currentWeek).padStart(2, '0')}
          </div>
          {loadingMaint ? (
            <div className="text-xs text-gray-400 animate-pulse py-4 text-center">Chargement…</div>
          ) : weekTasks.length === 0 ? (
            <div className="text-xs text-gray-400 py-4 text-center">Aucune maintenance planifiee cette semaine</div>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {weekTasks.map((t) => {
                const state = cellStates[t.key];
                const isDone       = state?.status === 'done';
                const isRescheduled = state?.status === 'rescheduled';
                return (
                  <div
                    key={t.key}
                    className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                      isDone ? 'bg-green-50 text-green-700' : isRescheduled ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-mono font-medium mr-2">{t.equip.code}</span>
                    <span className="flex-1 truncate text-gray-500">{t.equip.designation}</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                      t.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>{t.intType}</span>
                    <span className="ml-2 w-14 text-right font-semibold">
                      {isDone ? '✓ Fait' : isRescheduled ? `→ KW${state.newWeek}` : '⏳'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Charts ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Repartition par statut</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Taux de disponibilite par zone</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.parZone}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="taux" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Alertes ──────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Alertes
          {(loadingMaint || loadingEcme) && <span className="text-xs text-gray-400 font-normal animate-pulse">chargement…</span>}
        </h2>
        <div className="space-y-2">

          {/* Overdue */}
          {overdueTasks.length > 0 ? (
            <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-start gap-2">
              <span className="text-base">🔴</span>
              <span>
                <strong>{overdueTasks.length}</strong> maintenance(s) preventive(s) en retard
                (semaines precedentes non realisees)
              </span>
            </div>
          ) : !loadingMaint && (
            <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center gap-2">
              <span>🟢</span>
              <span>Aucun retard — toutes les maintenances passees sont a jour</span>
            </div>
          )}

          {/* This week pending */}
          {weekPending > 0 ? (
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 flex items-start gap-2">
              <span className="text-base">🟡</span>
              <span>
                <strong>{weekPending}</strong> maintenance(s) preventive(s) a realiser cette semaine
                (KW{String(currentWeek).padStart(2, '0')})
              </span>
            </div>
          ) : weekTotal > 0 && !loadingMaint && (
            <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center gap-2">
              <span>🟢</span>
              <span>Toutes les maintenances de la semaine sont realisees !</span>
            </div>
          )}

          {/* Rescheduled */}
          {weekRescheduled > 0 && (
            <div className="p-3 bg-orange-50 text-orange-700 rounded border border-orange-200 flex items-start gap-2">
              <span className="text-base">🟠</span>
              <span>
                <strong>{weekRescheduled}</strong> maintenance(s) ont ete reprogrammees cette semaine
              </span>
            </div>
          )}

          {/* Equipment out of service */}
          {stats.horsService > 0 && (
            <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-start gap-2">
              <span className="text-base">🔴</span>
              <span>
                <strong>{stats.horsService}</strong> equipement(s) hors service necessitent une attention
              </span>
            </div>
          )}

          {/* PDR low stock alerts */}
          {!loading && pdrStockAlerts.length > 0 && (
            <div className="border border-amber-200 rounded overflow-hidden">
              <div
                className={`p-3 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  pdrAlertHasCritical
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
                onClick={() => navigate('/inventaire?categorie=pdr')}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">🧰</span>
                  <span>
                    <strong className="text-red-700">{pdrCriticalCount}</strong> PDR en rupture
                    {pdrWarningCount > 0 && (
                      <>
                        {' '}
                        et <strong className="text-amber-700">{pdrWarningCount}</strong> à surveiller
                      </>
                    )}
                  </span>
                </div>
                <span className="text-xs underline whitespace-nowrap">Voir le stock →</span>
              </div>
              <div className="bg-white divide-y divide-amber-50 max-h-44 overflow-y-auto">
                {pdrStockAlerts.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 flex flex-col gap-1 text-xs hover:bg-amber-50 cursor-pointer"
                    onClick={() => navigate('/inventaire?categorie=pdr')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono font-semibold text-amber-700">{item.codeRai}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          item.level === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.level === 'critical' ? 'Rupture' : 'Faible'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex-1 truncate text-gray-600">{item.designation}</span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {item.lowParts.map((part) => {
                          const severity = getStockSeverityClasses(part.level);
                          return (
                            <span
                              key={`${item.id}-${part.key}`}
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severity.badge}`}
                            >
                              <span className="text-slate-600">{part.label}</span>
                              <span className={`font-bold ${severity.number}`}>{part.quantity}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {pdrStockAlerts.length > 6 && (
                  <div className="px-4 py-2 text-xs text-gray-400 text-center">
                    +{pdrStockAlerts.length - 6} autres — <button className="underline text-blue-600" onClick={() => navigate('/inventaire?categorie=pdr')}>voir tous</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ECME overdue verifications */}
          {!loadingEcme && ecmeOverdue.length > 0 && (
            <div className="border border-red-200 rounded overflow-hidden">
              <div
                className="p-3 bg-red-50 text-red-700 flex items-center justify-between gap-2 cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => navigate('/ecme?alerte=VERIFICATION')}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">🔴</span>
                  <span>
                    <strong>{ecmeOverdue.length}</strong> ECME en retard de vérification (date dépassée)
                  </span>
                </div>
                <span className="text-xs underline whitespace-nowrap">Voir tout →</span>
              </div>
              <div className="bg-white divide-y divide-red-50 max-h-36 overflow-y-auto">
                {ecmeOverdue.slice(0, 8).map(e => (
                  <div
                    key={e.code}
                    className="px-4 py-2 flex items-center justify-between gap-3 text-xs hover:bg-red-50 cursor-pointer"
                    onClick={() => navigate(`/ecme/${e.code}`)}
                  >
                    <span className="font-mono font-semibold text-red-700">{e.code}</span>
                    <span className="flex-1 truncate text-gray-600">{e.designation}</span>
                    <span className="text-gray-400 whitespace-nowrap">{e.affectation}</span>
                    <span className="text-red-600 font-medium whitespace-nowrap">
                      {e.date_prochaine_verification
                        ? new Date(e.date_prochaine_verification).toLocaleDateString('fr-FR')
                        : '—'}
                    </span>
                  </div>
                ))}
                {ecmeOverdue.length > 8 && (
                  <div className="px-4 py-2 text-xs text-gray-400 text-center">
                    +{ecmeOverdue.length - 8} autres — <button className="underline text-blue-600" onClick={() => navigate('/ecme?alerte=VERIFICATION')}>voir tous</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ECME upcoming verifications (not yet overdue) */}
          {!loadingEcme && ecmeToVerif.length > ecmeOverdue.length && (
            <div
              className="p-3 bg-orange-50 text-orange-700 rounded border border-orange-200 flex items-center justify-between gap-2 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => navigate('/ecme?alerte=VERIFICATION')}
            >
              <div className="flex items-start gap-2">
                <span className="text-base">🟠</span>
                <span>
                  <strong>{ecmeToVerif.length - ecmeOverdue.length}</strong> ECME supplémentaire(s) à
                  vérifier prochainement
                </span>
              </div>
              <span className="text-xs underline whitespace-nowrap">Voir →</span>
            </div>
          )}

          {/* ECME all clear */}
          {!loadingEcme && ecmeToVerif.length === 0 && (
            <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center gap-2">
              <span>🟢</span>
              <span>Tous les ECME sont à jour — aucune vérification requise</span>
            </div>
          )}

          {/* No alerts at all */}
          {!loadingMaint && !loadingEcme && overdueTasks.length === 0 && weekPending === 0 && weekRescheduled === 0 && stats.horsService === 0 && ecmeToVerif.length === 0 && pdrStockAlerts.length === 0 && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded border border-blue-200 flex items-center gap-2">
              <span>🔵</span>
              <span>Aucune alerte — situation nominale</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
