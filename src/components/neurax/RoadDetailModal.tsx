import React from 'react';
import {
  X,
  Gauge,
  Car,
  Activity,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Layers,
  GitFork,
  ShieldAlert,
  Zap,
  ArrowRight
} from 'lucide-react';
import type { RoadSegment } from '../../types/neurax';

interface RoadDetailModalProps {
  segment: RoadSegment | null;
  onClose: () => void;
  onForecast: (segmentId: string) => void;
  onTraceSpillback: (segmentId: string) => void;
  onPlanDiversion: (segmentId: string) => void;
}

export const RoadDetailModal: React.FC<RoadDetailModalProps> = ({
  segment,
  onClose,
  onForecast,
  onTraceSpillback,
  onPlanDiversion
}) => {
  if (!segment) return null;

  const isCritical = segment.ai_risk_level === 'CRITICAL';
  const isElevated = segment.ai_risk_level === 'ELEVATED';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              {segment.segment_id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Corridor Diagnostic Inspector
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCritical
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : isElevated
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {segment.ai_risk_level}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nodes {segment.source_node} → {segment.target_node} ({segment.road_class})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Speed</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {segment.speed_kmh}{' '}
              <span className="text-xs font-normal text-slate-400">/ {segment.free_flow_speed_kmh} km/h</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ratio: {Math.round(segment.speed_ratio * 100)}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Flow Volume</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {segment.flow_vph}{' '}
              <span className="text-xs font-normal text-slate-400">vph</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Cap: {segment.capacity_vph} vph
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Queue Length</span>
            <div className="text-lg font-bold text-rose-600 mt-0.5">
              {segment.queue_length_veh}{' '}
              <span className="text-xs font-normal text-slate-400">veh</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Congestion: {Math.round(segment.congestion_index * 100)}%
            </div>
          </div>
        </div>

        {/* Geometric & Operational Characteristics */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-slate-800">Physical Characteristics:</div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>• Road Class: <strong className="text-slate-800 capitalize">{segment.road_class}</strong></div>
            <div>• Lanes: <strong className="text-slate-800">{segment.lanes} lanes</strong></div>
            <div>• Length: <strong className="text-slate-800">{segment.length_km} km</strong></div>
            <div>• Free-Flow Travel Time: <strong className="text-slate-800">{Math.round((segment.length_km / (segment.free_flow_speed_kmh || 50)) * 60 * 10) / 10} min</strong></div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            {segment.structural_bottleneck === 1 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                Structural Bottleneck
              </span>
            )}
            {segment.is_anomaly && (
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold">
                Sensor Anomaly Detected
              </span>
            )}
          </div>
        </div>

        {/* AI Action Advisory */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1 text-xs">
          <div className="font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>NeuraX Action Advisory:</span>
          </div>
          <p className="text-blue-800 font-medium">{segment.ai_action}</p>
          <p className="text-blue-600 text-[11px]">{segment.ai_trend}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onForecast(segment.segment_id);
            }}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forecast</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onTraceSpillback(segment.segment_id);
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Spillback</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onPlanDiversion(segment.segment_id);
            }}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Reroute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
