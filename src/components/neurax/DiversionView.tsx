import React, { useState, useMemo } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  Gauge,
  Sliders,
  Send,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { DiversionPlanResult } from '../../types/neurax';

interface DiversionViewProps {
  initialSegmentId?: string;
  onTraceSpillback: (segmentId: string) => void;
}

export const DiversionView: React.FC<DiversionViewProps> = ({
  initialSegmentId = 'R0435',
  onTraceSpillback
}) => {
  const [segmentId, setSegmentId] = useState(initialSegmentId);
  const [inputVal, setInputVal] = useState(initialSegmentId);
  const [deployed, setDeployed] = useState(false);

  const planData: DiversionPlanResult = useMemo(() => {
    return neuraxEngine.planDiversions(segmentId, 3);
  }, [segmentId]);

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSegmentId(inputVal.trim().toUpperCase());
      setDeployed(false);
    }
  };

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => setDeployed(false), 4000);
  };

  const quickSegments = ['R0435', 'R0376', 'R0067', 'R0188', 'R0137'];

  return (
    <div id="diversion-view" className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitFork className="w-5 h-5 text-emerald-600" />
            <span>Dynamic Diversion Planning & Capacity Optimization</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            K-shortest alternative path computation enforcing turn restrictions and spare capacity limits.
          </p>
        </div>

        {/* Input & Quick Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Chokepoint:</span>
            {quickSegments.map((id) => (
              <button
                key={id}
                onClick={() => { setSegmentId(id); setInputVal(id); setDeployed(false); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  segmentId === id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <form onSubmit={handleCompute} className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              placeholder="R0435"
              className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Reroute
            </button>
          </form>
        </div>
      </div>

      {/* Deployment Alert if deployed */}
      {deployed && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Diversion advisories transmitted to 6 Variable Message Signs (VMS) & downstream signal timing offsets synchronized.
            </span>
          </div>
          <span className="text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
            Active in Field
          </span>
        </div>
      )}

      {/* Ranked Diversion Routes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ranked Alternative Bypass Corridors (Origin: {planData.source_node} → Dest: {planData.target_node})
          </h3>
          <button
            onClick={handleDeploy}
            disabled={deployed}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{deployed ? 'Advisories Active' : 'Broadcast Diversions to Signage & GPS'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {planData.diversion_routes.map((route, i) => {
            const isPrimary = route.recommendation_level === 'PRIMARY_RECOMMENDED';
            return (
              <div
                key={route.path_id}
                className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  isPrimary
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isPrimary
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {route.recommendation_level}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      {route.path_id}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    {route.route_name}
                  </h4>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Detour Distance:</span>
                      <strong className="text-slate-800">{route.total_distance_km} km</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Estimated Travel Time:</span>
                      <strong className="text-slate-800">{route.estimated_travel_time_min} min</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Delay Saved:</span>
                      <strong className="text-emerald-600 font-bold">-{route.delay_saved_min} min</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Spare Capacity:</span>
                      <strong className="text-indigo-600 font-bold">{route.spare_capacity_vph} vph</strong>
                    </div>
                  </div>

                  {/* Via Segments List */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                      Corridor Path Links:
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {route.via_segments.map((seg, sIdx) => (
                        <span
                          key={sIdx}
                          className="font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
                        >
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Turn restrictions verified
                  </span>
                  <span>Cap: {route.capacity_utilization_pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Signal Timing Adjustments */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Automated Upstream Signal Timing Tuning Advisory</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {planData.recommended_signal_tunes.map((sig, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200">
                    {sig.signal_id}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    Junction {sig.node_id}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {sig.action}
                </span>
              </div>

              <div className="text-xs text-slate-600">
                Green Split Ratio:{' '}
                <strong className="text-slate-400">{Math.round(sig.current_green_ratio * 100)}%</strong>{' '}
                → <strong className="text-emerald-600 font-bold">{Math.round(sig.recommended_green_ratio * 100)}%</strong>
              </div>

              <p className="text-[11px] text-slate-500">{sig.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
