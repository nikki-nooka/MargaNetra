import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Gauge,
  Car,
  Activity,
  Award,
  Layers,
  GitFork,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { neuraxEngine } from '../../services/neuraxService';
import type { ForecastResult } from '../../types/neurax';

interface ForecastViewProps {
  initialSegmentId?: string;
  onTraceSpillback: (segmentId: string) => void;
  onPlanDiversion: (segmentId: string) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  initialSegmentId = 'R0435',
  onTraceSpillback,
  onPlanDiversion
}) => {
  const [segmentId, setSegmentId] = useState(initialSegmentId);
  const [metricTab, setMetricTab] = useState<'speed' | 'flow' | 'congestion'>('speed');

  const forecastData: ForecastResult = useMemo(() => {
    return neuraxEngine.getSegmentForecast(segmentId);
  }, [segmentId]);

  const quickCorridors = ['R0435', 'R0376', 'R0067', 'R0188', 'R0137', 'R0001'];

  // Build chart dataset
  const chartData = useMemo(() => {
    const obs = forecastData.current_observation;
    return [
      {
        step: 'NOW (T=0)',
        speed: obs.speed_kmh,
        flow: obs.flow_vph,
        congestion: Math.round(obs.congestion_index * 100),
        lower: obs.speed_kmh,
        upper: obs.speed_kmh
      },
      ...forecastData.horizons.map((h) => ({
        step: h.label,
        speed: h.predicted_speed_kmh,
        flow: h.predicted_flow_vph,
        congestion: Math.round(h.predicted_congestion_index * 100),
        lower: h.speed_lower_kmh,
        upper: h.speed_upper_kmh
      }))
    ];
  }, [forecastData]);

  return (
    <div id="forecast-view" className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Multi-Horizon Traffic Predictor (T+15m to T+60m)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Spatial-Temporal Graph Neural Network (STGNN) + LightGBM Residual Model forecasting macroscopic flow transitions.
          </p>
        </div>

        {/* Corridor Quick Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">Quick Test:</span>
          {quickCorridors.map((cid) => (
            <button
              key={cid}
              onClick={() => setSegmentId(cid)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                segmentId === cid
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cid}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart & Horizons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                  {forecastData.segment_id}
                </span>
                <span className="text-xs text-slate-500">
                  Nodes {forecastData.source_node} → {forecastData.target_node} ({forecastData.road_class})
                </span>
              </div>
            </div>

            {/* Metric Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setMetricTab('speed')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  metricTab === 'speed' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Speed (km/h)
              </button>
              <button
                onClick={() => setMetricTab('flow')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  metricTab === 'flow' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Flow (vph)
              </button>
              <button
                onClick={() => setMetricTab('congestion')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  metricTab === 'congestion' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Congestion (%)
              </button>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCong" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="step" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  domain={metricTab === 'congestion' ? [0, 100] : ['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                {metricTab === 'speed' && (
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSpeed)"
                    name="Speed (km/h)"
                  />
                )}
                {metricTab === 'flow' && (
                  <Area
                    type="monotone"
                    dataKey="flow"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFlow)"
                    name="Volume (Veh/h)"
                  />
                )}
                {metricTab === 'congestion' && (
                  <Area
                    type="monotone"
                    dataKey="congestion"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCong)"
                    name="Congestion Index (%)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTraceSpillback(forecastData.segment_id)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Trace Upstream Spillback</span>
              </button>
              <button
                onClick={() => onPlanDiversion(forecastData.segment_id)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-emerald-600" />
                <span>Calculate Bypass Diversions</span>
              </button>
            </div>
            <span className="text-slate-400 text-[11px]">Model Confidence: 94.2%</span>
          </div>
        </div>

        {/* Right Column: Horizons Breakdown & Model Card */}
        <div className="space-y-4">
          {/* Horizon cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Horizon Telemetry Steps
            </h3>
            {forecastData.horizons.map((h) => {
              const isDet = h.trend === 'deteriorating';
              return (
                <div
                  key={h.horizon_min}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{h.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Flow: <strong className="text-slate-700">{h.predicted_flow_vph}</strong> vph • CI: {Math.round(h.predicted_congestion_index * 100)}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-slate-900 flex items-center gap-1">
                      {h.predicted_speed_kmh} <span className="text-[10px] font-sans text-slate-500">km/h</span>
                      {isDet ? (
                        <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Bounds: [{h.speed_lower_kmh} - {h.speed_upper_kmh}]
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Scorecard */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-indigo-300 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Benchmark Scorecard
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-400 text-[10px] uppercase">Speed MAE</div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {forecastData.model_info.speed_mae} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-400 text-[10px] uppercase">Congestion MAE</div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {forecastData.model_info.congestion_mae}
                </div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-400 text-[10px] uppercase">Flow MAE</div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {forecastData.model_info.flow_mae} <span className="text-xs font-normal text-slate-400">vph</span>
                </div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <div className="text-slate-400 text-[10px] uppercase">Features</div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {forecastData.model_info.feature_count} Inputs
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-tight">
              {forecastData.model_info.architecture} trained over historical telemetry snapshots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
