import React, { useState, useMemo } from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  Search,
  Filter,
  ArrowRight,
  Sliders,
  DollarSign,
  Clock,
  Layers,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { PlanningCandidate, ScenarioExample } from '../../types/neurax';

export const InfrastructureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'scenarios'>('candidates');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterFeasibility, setFilterFeasibility] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<PlanningCandidate | null>(null);

  const candidates = useMemo(() => neuraxEngine.getPlanningCandidates(), []);
  const scenarios = useMemo(() => neuraxEngine.getScenarioExamples(), []);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.candidate_id.toLowerCase().includes(q) ||
        c.target_segment.toLowerCase().includes(q) ||
        c.intervention_type.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (filterType !== 'ALL' && c.intervention_type !== filterType) return false;
      if (filterFeasibility !== 'ALL' && c.feasibility_band !== filterFeasibility) return false;

      return true;
    });
  }, [candidates, searchQuery, filterType, filterFeasibility]);

  return (
    <div id="infrastructure-view" className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Strategic Infrastructure Intervention Simulator & ROI Ranker</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bureau of Public Roads (BPR) counterfactual travel time modeling across 90 simulated planning candidates and 30 evaluation scenarios.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'candidates'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            90 Planning Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'scenarios'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Scenario Benchmarks ({scenarios.length})
          </button>
        </div>
      </div>

      {activeTab === 'candidates' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate ID (e.g. PLAN0376) or target segment..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
              >
                <option value="ALL">All Interventions</option>
                <option value="capacity_upgrade">Capacity Upgrades</option>
                <option value="turn_lane">Turn Lanes</option>
                <option value="signal_retiming">Signal Retiming</option>
              </select>

              <select
                value={filterFeasibility}
                onChange={(e) => setFilterFeasibility(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
              >
                <option value="ALL">All Feasibility</option>
                <option value="low">Low Cost (Quick Win)</option>
                <option value="medium">Medium Cost</option>
                <option value="high">High Cost (Major Capital)</option>
              </select>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.slice(0, 18).map((cand, idx) => {
              return (
                <div
                  key={cand.candidate_id}
                  onClick={() => setSelectedCandidate(cand)}
                  className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-4.5 shadow-xs hover:shadow-sm cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {cand.candidate_id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                        {cand.feasibility_band} Cost
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 tracking-tight capitalize">
                      {cand.intervention_type.replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target Link: <strong className="text-slate-800 font-mono">{cand.target_segment}</strong> (+{cand.capacity_delta_vph} vph)
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Delay Reduction</div>
                        <div className="text-emerald-600 font-bold text-sm">
                          -{cand.delay_reduction_pct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Veh-Hours</div>
                        <div className="text-indigo-600 font-bold text-sm">
                          {cand.daily_veh_hours_saved} hrs
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Bang-for-Buck ROI:
                    </span>
                    <span className="font-extrabold text-indigo-600 text-sm">
                      {cand.roi_score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Scenarios View */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Type & Target</th>
                <th className="px-4 py-3">Incident Profile</th>
                <th className="px-4 py-3">Baseline Delay</th>
                <th className="px-4 py-3">Mitigated Delay</th>
                <th className="px-4 py-3 text-right">Delay Reduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scenarios.map((sc) => (
                <tr key={sc.scenario_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {sc.scenario_id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{sc.scenario_type}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Segment {sc.target_segment}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 capitalize">
                    {sc.incident_type.replace('_', ' ')} (Sev {sc.severity})
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {sc.baseline_delay_min} min
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                    {sc.mitigated_delay_min} min
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-xs">
                      -{sc.reduction_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Inspector Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedCandidate.candidate_id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 capitalize">
                  {selectedCandidate.intervention_type.replace('_', ' ')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Counterfactual evaluation for segment{' '}
                <strong className="text-slate-900 font-mono">{selectedCandidate.target_segment}</strong> with a capacity expansion of{' '}
                <strong className="text-emerald-600 font-bold">+{selectedCandidate.capacity_delta_vph} vph</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Baseline Delay</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {selectedCandidate.baseline_delay_min} min
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] uppercase font-bold">Counterfactual Delay</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {selectedCandidate.counterfactual_delay_min} min
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <span className="text-indigo-700 text-[10px] uppercase font-bold">Delay Reduction</span>
                  <div className="text-base font-bold text-indigo-700 mt-0.5">
                    -{selectedCandidate.delay_reduction_pct}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-amber-700 text-[10px] uppercase font-bold">ROI Score</span>
                  <div className="text-base font-bold text-amber-700 mt-0.5">
                    {selectedCandidate.roi_score}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-700">Daily Vehicle-Hours Saved:</div>
                <div className="text-slate-600">
                  Estimated <strong className="text-slate-900">{selectedCandidate.daily_veh_hours_saved} commuter vehicle-hours</strong> reclaimed daily through recurrent congestion alleviation.
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Counterfactual Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
