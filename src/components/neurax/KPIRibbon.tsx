import React from 'react';
import {
  Gauge,
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  CheckCircle2,
  Car,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import type { CityKPIs } from '../../types/neurax';

interface KPIRibbonProps {
  kpis: CityKPIs;
  onSelectBottlenecks?: () => void;
  onSelectIncidents?: () => void;
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({
  kpis,
  onSelectBottlenecks,
  onSelectIncidents,
}) => {
  return (
    <div id="kpi-ribbon-container" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Avg Speed */}
      <div id="kpi-avg-speed" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Avg Speed</span>
          <Gauge className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
            {kpis.avg_speed_kmh}
            <span className="text-xs font-medium text-slate-500">km/h</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2.4% vs 1h ago</span>
          </div>
        </div>
      </div>

      {/* 2. Total Flow */}
      <div id="kpi-total-flow" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Network Flow</span>
          <Car className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
            {(kpis.total_flow_vph / 1000).toFixed(1)}k
            <span className="text-xs font-medium text-slate-500">vph</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.total_segments} active monitored links
          </div>
        </div>
      </div>

      {/* 3. Free Flow % */}
      <div id="kpi-free-flow" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Free Flow</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-xl font-bold text-emerald-600 tracking-tight flex items-baseline gap-1">
            {kpis.free_flow_pct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Speed ratio &gt; 80%
          </div>
        </div>
      </div>

      {/* 4. Moderate % */}
      <div id="kpi-moderate" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Moderate</span>
          <Activity className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="text-xl font-bold text-amber-600 tracking-tight flex items-baseline gap-1">
            {kpis.moderate_pct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Speed ratio 50-80%
          </div>
        </div>
      </div>

      {/* 5. Heavy % */}
      <div id="kpi-heavy" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-orange-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Heavy</span>
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <div className="text-xl font-bold text-orange-600 tracking-tight flex items-baseline gap-1">
            {kpis.heavy_pct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Speed ratio 30-50%
          </div>
        </div>
      </div>

      {/* 6. Gridlock % */}
      <div id="kpi-gridlock" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-red-400 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Gridlock</span>
          <Zap className="w-4 h-4 text-red-500" />
        </div>
        <div>
          <div className="text-xl font-bold text-red-600 tracking-tight flex items-baseline gap-1">
            {kpis.gridlock_pct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Speed ratio &lt; 30%
          </div>
        </div>
      </div>

      {/* 7. Active Incidents */}
      <div
        id="kpi-active-incidents"
        onClick={onSelectIncidents}
        className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-rose-400 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="flex items-center justify-between text-rose-600 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Incidents</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </div>
        <div>
          <div className="text-xl font-bold text-rose-700 tracking-tight">
            {kpis.active_incidents_count}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            R0435, R0376, R0067
          </div>
        </div>
      </div>

      {/* 8. Network Health Score */}
      <div
        id="kpi-health-score"
        onClick={onSelectBottlenecks}
        className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-3.5 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between text-blue-200 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Health Index</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
            {kpis.network_health_score}
            <span className="text-xs font-medium text-emerald-400">/ 100</span>
          </div>
          <div className="text-[11px] text-blue-200 mt-1 flex items-center gap-1">
            <span>{kpis.active_bottlenecks_count} bottlenecks tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
