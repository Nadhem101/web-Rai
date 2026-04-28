import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { curativeMaintenanceService } from '../../services/api';
import { formatMinutes } from '../../utils/curativeMaintenance';

const buildChartData = (summary = {}) => {
  return (summary.months || []).map((month) => ({
    ...month,
    averageMinutesValue: month.averageMinutes ?? 0,
  }));
};

const IndicateurCuratif = () => {
  const [summary, setSummary] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async (year = null) => {
    setLoading(true);
    setError('');

    try {
      const response = await curativeMaintenanceService.getMonthlySummary(year ? { year } : {});

      setSummary(response);
      setAvailableYears(Array.isArray(response?.availableYears) ? response.availableYears : []);
      setSelectedYear(response?.selectedYear ?? '');
    } catch (loadError) {
      console.error('Erreur chargement indicateur curatif:', loadError);
      setSummary(null);
      setAvailableYears([]);
      setError('Impossible de charger l\'indicateur curatif.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const chartData = useMemo(() => buildChartData(summary || {}), [summary]);

  const hasData = useMemo(() => {
    return chartData.some((month) => month.count > 0);
  }, [chartData]);

  const handleYearChange = (event) => {
    const nextYear = Number(event.target.value);
    if (!Number.isFinite(nextYear)) return;
    loadSummary(nextYear);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Indicateur curatif</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Temps d\'arrêt moyen mensuel {summary ? `• ${summary.selectedYear}` : ''}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Cet écran calcule la moyenne mensuelle à partir des incidents curatifs enregistrés en base pour l\'année civile choisie.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Année</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="mt-2 min-w-48 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
              disabled={loading}
            >
              {(availableYears.length > 0 ? availableYears : [new Date().getFullYear(), new Date().getFullYear() + 1]).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Incidents dans la période</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{loading ? '—' : summary?.totalCount ?? 0}</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="text-sm text-amber-700">Temps d\'arrêt moyen</div>
            <div className="mt-2 text-3xl font-bold text-amber-900">
              {loading ? '—' : summary?.averageMinutes === null || summary?.averageMinutes === undefined ? '-' : formatMinutes(summary.averageMinutes)}
            </div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <div className="text-sm text-orange-700">Temps d\'arrêt total</div>
            <div className="mt-2 text-3xl font-bold text-orange-900">
              {loading ? '—' : formatMinutes(summary?.totalMinutes)}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Moyenne mensuelle</h2>
            <p className="mt-1 text-sm text-slate-500">Les mois sans incident restent à zéro dans le graphique et vides dans le tableau.</p>

            <div className="mt-6 h-[360px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400 animate-pulse">Chargement du graphique…</div>
              ) : hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals />
                    <Tooltip
                      formatter={(value, name, props) => {
                        if (name === 'averageMinutesValue') {
                          return [formatMinutes(value), 'Moyenne'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Mois: ${label}`}
                    />
                    <Bar dataKey="averageMinutesValue" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">
                  Aucune donnée disponible pour cette période.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Détail par mois</h2>
            <p className="mt-1 text-sm text-slate-500">Agrégation des incidents curatifs issus de la base de données.</p>

            <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Mois</th>
                    <th className="px-4 py-3 text-left">Incidents</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Moyenne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">Chargement…</td>
                    </tr>
                  ) : (
                    chartData.map((month) => (
                      <tr key={month.month} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{month.label}</td>
                        <td className="px-4 py-3">{month.count}</td>
                        <td className="px-4 py-3">{formatMinutes(month.totalMinutes)}</td>
                        <td className="px-4 py-3 font-semibold text-orange-700">
                          {month.averageMinutes === null || month.averageMinutes === undefined ? '-' : formatMinutes(month.averageMinutes)}
                        </td>
                      </tr>
                    ))
                  )}
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