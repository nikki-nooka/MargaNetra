import React, { useState, useMemo } from 'react';
import {
  Layers,
  AlertOctagon,
  TrendingDown,
  Clock,
  ArrowRight,
  GitFork,
  Radio,
  Users,
  Activity,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { SpillbackResult } from '../../types/neurax';

interface SpillbackViewProps {
  initialSegmentId?: string;
  onPlanDiversion: (segmentId: string) => void;
  onForecast: (segmentId: string) => void;
}

export const SpillbackView: React.FC<SpillbackViewProps> = ({
  initialSegmentId = 'R0435',
  onPlanDiversion,
  onForecast
}) => {
  const [segmentId, setSegmentId] = useState(initialSegmentId);
  const [inputVal, setInputVal] = useState(initialSegmentId);

  const spillbackData: SpillbackResult = useMemo(() => {
    return neuraxEngine.traceSpillback(segmentId, 4);
  }, [segmentId]);

  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSegmentId(inputVal.trim().toUpperCase());
    }
  };

  const quickIncidents = ['R0435', 'R0376', 'R0067', 'R0188', 'R0137'];

  return (
    <div id="spillback-view" className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Incident Intelligence & Graph-Based Spillback Propagation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic Lighthill-Whitham-Richards (LWR) kinematic wave shockwave tracing along road topology.
          </p>
        </div>

        {/* Input & Form */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Known Chokepoints:</span>
            {quickIncidents.map((id) => (
              <button
                key={id}
                onClick={() => { setSegmentId(id); setInputVal(id); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  segmentId === id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <form onSubmit={handleTrace} className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              placeholder="R0435"
              className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Trace Cascade
            </button>
          </form>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Epicenter
          </div>
          <div className="text-xl font-mono font-extrabold text-slate-900">
            {spillbackData.incident_segment}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Origin of shockwave</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Impacted Segments
          </div>
          <div className="text-xl font-extrabold text-rose-600">
            {spillbackData.total_impacted_segments} Links
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Upstream causal chain</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Max Reach Time
          </div>
          <div className="text-xl font-extrabold text-amber-600">
            +{spillbackData.max_reach_minutes} min
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Propagation horizon</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Shockwave Velocity
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {spillbackData.shockwave_velocity_kmh} <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Backward wave speed</div>
        </div>
      </div>

      {/* Cascade Steps Flow */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Spatial-Temporal Shockwave Cascade Timeline
            </h3>
          </div>
          <button
            onClick={() => onPlanDiversion(spillbackData.incident_segment)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Plan Diversion for Affected Corridor</span>
          </button>
        </div>

        <div className="space-y-3">
          {spillbackData.cascade_steps.map((step, idx) => {
            const isEpicenter = step.hop === 0;
            return (
              <div
                key={step.segment_id}
                className={`p-4 rounded-xl border transition-all ${
                  isEpicenter
                    ? 'bg-rose-50/60 border-rose-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isEpicenter
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isEpicenter ? '0' : `H${step.hop}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {step.segment_id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isEpicenter
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {step.risk_label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Nodes {step.source_node} → {step.target_node}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ETA to Congest:{' '}
                        <strong className="text-slate-800">
                          {isEpicenter ? 'Immediate (T=0)' : `+${step.eta_minutes} min`}
                        </strong>{' '}
                        • Queue:{' '}
                        <strong className="text-rose-600">
                          {step.queue_length_veh} {step.queue_length_veh === 1 ? 'vehicle' : 'vehicles'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {step.speed_kmh} km/h
                      </div>
                      <div className="text-[11px] text-rose-600 font-medium">
                        -{step.speed_drop_pct}% speed drop
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onForecast(step.segment_id)}
                        title="Forecast this segment"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      </button>
                      <button
                        onClick={() => onPlanDiversion(step.segment_id)}
                        title="Plan diversion from here"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600"
                      >
                        <GitFork className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Affected Origin-Destination Pairs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Affected Commuter Origin-Destination (OD) Demand Flows</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {spillbackData.affected_od_pairs.map((od, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {od.origin} → {od.destination}
                </span>
                <span className="font-mono font-bold text-indigo-600">
                  {od.volume_vph} vph
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{od.purpose}</div>
              <div className="text-xs font-semibold text-rose-600 pt-1">
                +{od.delay_added_min} min delay added
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
