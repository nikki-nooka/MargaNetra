import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  Award,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { ResilienceSimulationResult, TopCriticalSegment } from '../../types/neurax';

export const ResilienceView: React.FC = () => {
  const [targetSegment, setTargetSegment] = useState('R0435');
  const [duration, setDuration] = useState<number>(30);
  const [simResult, setSimResult] = useState<ResilienceSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const topCritical: TopCriticalSegment[] = useMemo(() => {
    return neuraxEngine.getTopCriticalSegments(10);
  }, []);

  const handleRunSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const res = neuraxEngine.simulateClosure(targetSegment, duration);
      setSimResult(res);
      setLoading(false);
    }, 350);
  };

  return (
    <div id="resilience-view" className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Network Resilience & Single-Point-of-Failure Stress Testing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulate partial or complete corridor closures and quantify macroscopic cascading delays across the metropolitan topology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Network Stress Model: Dynamic Equilibrium
          </span>
        </div>
      </div>

      {/* Simulator Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Controls Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Segment Closure Stress Parameters
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Target Road Segment to Drop/Block:
              </label>
              <input
                type="text"
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value.toUpperCase())}
                placeholder="R0435"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Disruption Closure Duration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      duration === mins
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Simulated Failure Vectors:</div>
              <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px]">
                <li>Upstream traffic shockwave formation</li>
                <li>Adjacent corridor diversion capacity saturation</li>
                <li>Emergency vehicle hospital access degradation</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{loading ? 'SIMULATING NETWORK SHOCKWAVE...' : 'RUN CLOSURE SIMULATION'}</span>
          </button>
        </div>

        {/* Output Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          {simResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                    {simResult.segment_id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Disruption Simulation Results
                    </h3>
                    <p className="text-xs text-slate-500">
                      Duration: {simResult.duration_min} minutes complete closure
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {simResult.single_point_of_failure && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      Single-Point of Failure
                    </span>
                  )}
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-lg border ${
                      simResult.resilience_grade === 'F' || simResult.resilience_grade === 'D'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : simResult.resilience_grade === 'C'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    Grade {simResult.resilience_grade}
                  </span>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Delay Surge</div>
                  <div className="text-xl font-extrabold text-rose-600 mt-0.5">
                    +{simResult.network_delay_increase_pct}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Stranded Vehicles</div>
                  <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                    {simResult.stranded_vehicles} veh
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Spillback Radius</div>
                  <div className="text-xl font-extrabold text-amber-600 mt-0.5">
                    {simResult.spillback_radius_km} km
                  </div>
                </div>
              </div>

              {/* Mitigation Protocol */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700">
                  Automated Disruption Mitigation Protocol:
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {simResult.mitigation_protocol.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Activity className="w-10 h-10 text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">Simulator Standby</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Configure a target road segment and disruption window duration on the left, then run the simulation to quantify cascading spillback delays.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top 10 Critical Segments */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Top 10 Most Critical Road Segments (Vulnerability Ranking)</span>
          </h3>
          <span className="text-xs text-slate-400">Based on Graph Betweenness & Volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-3 py-2.5">Rank</th>
                <th className="px-3 py-2.5">Segment</th>
                <th className="px-3 py-2.5">Nodes</th>
                <th className="px-3 py-2.5">Class</th>
                <th className="px-3 py-2.5">Criticality Index</th>
                <th className="px-3 py-2.5">Flow Volume</th>
                <th className="px-3 py-2.5">Failure Impact</th>
                <th className="px-3 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCritical.map((item) => (
                <tr key={item.segment_id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2 font-bold text-slate-400">#{item.rank}</td>
                  <td className="px-3 py-2 font-mono font-bold text-slate-900">{item.segment_id}</td>
                  <td className="px-3 py-2 font-mono text-slate-600">
                    {item.source_node} → {item.target_node}
                  </td>
                  <td className="px-3 py-2 capitalize text-slate-700">{item.road_class}</td>
                  <td className="px-3 py-2">
                    <span className="font-extrabold text-indigo-600">{item.criticality_score}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{item.flow_vph} vph</td>
                  <td className="px-3 py-2 text-slate-700 font-medium">{item.failure_impact}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => { setTargetSegment(item.segment_id); }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-[11px] transition-colors"
                    >
                      Stress Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
