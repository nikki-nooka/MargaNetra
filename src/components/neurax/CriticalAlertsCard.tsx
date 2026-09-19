import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  GitFork,
  Radio
} from 'lucide-react';
import type { RoadSegment } from '../../types/neurax';

interface CriticalAlertsCardProps {
  criticalSegments: RoadSegment[];
  onSelectSegment: (segmentId: string) => void;
  onTraceSpillback: (segmentId: string) => void;
  onPlanDiversion: (segmentId: string) => void;
  onForecast: (segmentId: string) => void;
}

export const CriticalAlertsCard: React.FC<CriticalAlertsCardProps> = ({
  criticalSegments,
  onSelectSegment,
  onTraceSpillback,
  onPlanDiversion,
  onForecast
}) => {
  return (
    <div
      id="critical-alerts-card"
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Active Critical Incidents & Bottlenecks</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {criticalSegments.length} Active
              </span>
            </h3>
            <p className="text-xs text-slate-500">Real-time kinematic wave queue detection</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 my-2 max-h-[340px] overflow-y-auto pr-1">
        {criticalSegments.map((seg) => {
          const isCritical = seg.ai_risk_level === 'CRITICAL';
          return (
            <div
              key={seg.segment_id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {seg.segment_id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {seg.ai_risk_level}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {seg.ai_status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span>
                    Nodes: <strong className="text-slate-700">{seg.source_node}</strong> →{' '}
                    <strong className="text-slate-700">{seg.target_node}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Queue: <strong className="text-rose-600">{seg.queue_length_veh} veh</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Speed:{' '}
                    <strong className="text-slate-800">
                      {seg.speed_kmh} km/h
                    </strong>{' '}
                    ({Math.round((1 - seg.speed_ratio) * 100)}% drop)
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id={`btn-spillback-${seg.segment_id}`}
                  onClick={() => onTraceSpillback(seg.segment_id)}
                  title="Trace Causal Shockwave Spillback"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Spillback</span>
                </button>

                <button
                  id={`btn-diversion-${seg.segment_id}`}
                  onClick={() => onPlanDiversion(seg.segment_id)}
                  title="Compute K-Shortest Path Diversions"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reroute</span>
                </button>

                <button
                  id={`btn-forecast-${seg.segment_id}`}
                  onClick={() => onForecast(seg.segment_id)}
                  title="Multi-horizon Predictive Forecast"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Forecast</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Automatic telemetry polling every 5s</span>
        <button
          onClick={() => onSelectSegment('R0435')}
          className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <span>View all active alerts</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
