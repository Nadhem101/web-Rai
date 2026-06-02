import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { curativeMaintenanceService } from '../../services/api';
import { formatMinutes } from '../../utils/curativeMaintenance';
import { BarChart2, Clock, Timer, TrendingUp, AlertCircle, CalendarDays } from 'lucide-react';

const buildChartData = (summary = {}) =>
  (summary.months || []).map((m) => ({ ...m, averageMinutesValue: m.averageMinutes ?? 0 }));

// ── KPI card ───────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, iconBg, iconColor, sub, loading }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    <div className={`text-3xl font-bold mb-1 ${loading ? 'text-slate-200 animate-pulse' : 'text-slate-800'}`}>
      {loading ? '—' : value}
    </div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

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

  const handleYearChange = (e) => {
    const y = Number(e.target.value);
    if (Number.isFinite(y)) loadSummary(y);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <BarChart2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Indicateur curatif {summary ? `— ${summary.selectedYear}` : ''}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Moyenne mensuelle des temps d'arrêt par incident</p>
            </div>
          </div>

          {/* Year selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Année</p>
              <select
                value={selectedYear} onChange={handleYearChange} disabled={loading}
                className="min-w-[6rem] rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white transition-colors"
              >
                {(availableYears.length > 0
                  ? availableYears
                  : [new Date().getFullYear(), new Date().getFullYear() + 1]
                ).map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Incidents dans la période" value={summary?.totalCount ?? 0}
            icon={TrendingUp} iconBg="bg-slate-100" iconColor="text-slate-500"
            loading={loading} />
          <KpiCard
            label="Temps d'arrêt moyen"
            value={summary?.averageMinutes === null || summary?.averageMinutes === undefined
              ? '—' : formatMinutes(summary.averageMinutes)}
            icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-500"
            sub="Par incident" loading={loading} />
          <KpiCard label="Temps d'arrêt total" value={formatMinutes(summary?.totalMinutes)}
            icon={Timer} iconBg="bg-red-50" iconColor="text-red-400"
            sub="Tous incidents cumulés" loading={loading} />
        </div>

        {/* ── Chart + Table ── */}
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              Moyenne mensuelle
            </p>
            <p className="text-xs text-slate-400 mb-5">Les mois sans incident restent à zéro dans le graphique.</p>

            <div className="h-[320px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
                </div>
              ) : hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis allowDecimals tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                      formatter={(v, name) => name === 'averageMinutesValue' ? [formatMinutes(v), 'Moyenne'] : [v, name]}
                      labelFormatter={(l) => `Mois : ${l}`}
                    />
                    <Bar dataKey="averageMinutesValue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">Aucune donnée disponible pour cette période</p>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-800">Détail par mois</p>
              <p className="text-xs text-slate-400 mt-0.5">Agrégation des incidents curatifs</p>
            </div>
            <div className="overflow-auto flex-1">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Mois','Incidents','Total','Moyenne'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="py-8 text-center text-xs text-slate-400">Chargement…</td></tr>
                  ) : chartData.map((month) => (
                    <tr key={month.month} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{month.label}</td>
                      <td className="px-4 py-3 text-slate-600">{month.count}</td>
                      <td className="px-4 py-3 text-slate-600">{formatMinutes(month.totalMinutes)}</td>
                      <td className="px-4 py-3">
                        {month.averageMinutes === null || month.averageMinutes === undefined ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {formatMinutes(month.averageMinutes)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicateurCuratif;
