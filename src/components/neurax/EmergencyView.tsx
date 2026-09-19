import React, { useState } from 'react';
import {
  HeartPulse,
  Radio,
  Clock,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Navigation
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { GreenWaveResult } from '../../types/neurax';

export const EmergencyView: React.FC = () => {
  const [origin, setOrigin] = useState('N001');
  const [dest, setDest] = useState('N085');
  const [result, setResult] = useState<GreenWaveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleDispatch = () => {
    setLoading(true);
    setTimeout(() => {
      const res = neuraxEngine.dispatchGreenWave(origin, dest);
      setResult(res);
      setLoading(false);
      setIsDispatched(true);
    }, 400);
  };

  const hospitals = [
    { name: 'Osmania General Trauma Hub (N085)', node: 'N085' },
    { name: 'Apollo Health City Emergency (N104)', node: 'N104' },
    { name: 'NIMS Critical Care Center (N062)', node: 'N062' },
    { name: 'Yashoda Super Specialty (N038)', node: 'N038' }
  ];

  const quickIncidents = ['N001', 'N015', 'N028', 'N045', 'N073'];

  return (
    <div id="emergency-view" className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600 animate-pulse" />
            <span>Emergency Vehicle Priority & Green Wave Corridor Dispatch</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Code-3 corridor clearance. Overrides intermediate signalized intersections to force uninterrupted green progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-ping text-rose-600" />
            Code-3 Preemption Active
          </span>
        </div>
      </div>

      {/* Main Grid: Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Emergency Route Configuration
              </h3>
            </div>

            {/* Quick Origin Select */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Incident Origin Junction:
              </label>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                {quickIncidents.map((node) => (
                  <button
                    key={node}
                    onClick={() => setOrigin(node)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-colors ${
                      origin === node
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {node}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                placeholder="e.g. N001"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Hospital Destination Select */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Hospital / Trauma Center Destination:
              </label>
              <div className="space-y-1.5 mb-2">
                {hospitals.map((h) => (
                  <div
                    key={h.node}
                    onClick={() => setDest(h.node)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      dest === h.node
                        ? 'bg-rose-50/80 border-rose-300 text-rose-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{h.name}</span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      {h.node}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleDispatch}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Radio className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>
              {loading ? 'ENGAGING SIGNAL PREEMPTION...' : 'DISPATCH EMERGENCY GREEN WAVE'}
            </span>
          </button>
        </div>

        {/* Dispatch Results (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Green Wave Preemption Active
                    </h3>
                    <p className="text-xs text-slate-500">
                      Route cleared from {result.origin_node} to {result.destination_node}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {result.priority_level}
                </span>
              </div>

              {/* Time saved metrics cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">
                    Normal Traffic ETA
                  </div>
                  <div className="text-lg font-bold text-slate-700 mt-0.5">
                    {result.normal_travel_time_min} <span className="text-xs font-normal">min</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] text-emerald-700 font-semibold uppercase">
                    Green Wave ETA
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                    {result.green_wave_eta_min} <span className="text-xs font-normal">min</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-[11px] text-rose-700 font-semibold uppercase">
                    Time Saved
                  </div>
                  <div className="text-xl font-extrabold text-rose-700 mt-0.5">
                    -{result.time_saved_min} <span className="text-xs font-normal">min</span>
                  </div>
                </div>
              </div>

              {/* Path Node Sequence */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-semibold text-slate-600 mb-2">
                  Corridor Progression ({result.total_distance_km} km):
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {result.path_nodes.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-300 font-mono text-xs font-bold shadow-2xs">
                        {node}
                      </span>
                      {i < result.path_nodes.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Preempted Signals List */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Preempted Signal Controllers ({result.signals_preempted_count} Overridden)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {result.preempted_signals.map((sig, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {sig.signal_id} (Node {sig.node_id})
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          100% Green Split • {sig.clearing_window_s}s Window
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <HeartPulse className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No Emergency Dispatch Active</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select an incident origin junction and emergency destination hospital on the left, then click Dispatch to compute the priority green wave corridor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
