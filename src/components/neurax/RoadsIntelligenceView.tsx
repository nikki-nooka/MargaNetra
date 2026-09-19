import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers,
  Sparkles,
  GitFork,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { RoadSegment, AIRiskLevel } from '../../types/neurax';

interface RoadsIntelligenceViewProps {
  onSelectRoad: (segment: RoadSegment) => void;
  onTraceSpillback: (segmentId: string) => void;
  onPlanDiversion: (segmentId: string) => void;
  onForecast: (segmentId: string) => void;
}

export const RoadsIntelligenceView: React.FC<RoadsIntelligenceViewProps> = ({
  onSelectRoad,
  onTraceSpillback,
  onPlanDiversion,
  onForecast
}) => {
  const { roads, summary } = useMemo(() => neuraxEngine.getAllRoadsIntelligence(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'congestion' | 'speed_low' | 'queue' | 'flow' | 'id'>('congestion');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  // Filter
  const filteredRoads = useMemo(() => {
    return roads.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.segment_id.toLowerCase().includes(q) ||
        r.road_class.toLowerCase().includes(q) ||
        r.source_node.toLowerCase().includes(q) ||
        r.target_node.toLowerCase().includes(q) ||
        r.ai_status.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterRisk === 'CRITICAL') return r.ai_risk_level === 'CRITICAL';
      if (filterRisk === 'ELEVATED') return r.ai_risk_level === 'ELEVATED';
      if (filterRisk === 'ANOMALY') return r.is_anomaly;
      if (filterRisk === 'OPTIMAL') return r.ai_risk_level === 'OPTIMAL';
      return true;
    });
  }, [roads, searchQuery, filterRisk]);

  // Sort
  const sortedRoads = useMemo(() => {
    const list = [...filteredRoads];
    if (sortBy === 'congestion') {
      list.sort((a, b) => b.congestion_index - a.congestion_index);
    } else if (sortBy === 'speed_low') {
      list.sort((a, b) => a.speed_kmh - b.speed_kmh);
    } else if (sortBy === 'queue') {
      list.sort((a, b) => b.queue_length_veh - a.queue_length_veh);
    } else if (sortBy === 'flow') {
      list.sort((a, b) => b.flow_vph - a.flow_vph);
    } else if (sortBy === 'id') {
      list.sort((a, b) => a.segment_id.localeCompare(b.segment_id));
    }
    return list;
  }, [filteredRoads, sortBy]);

  const totalPages = Math.ceil(sortedRoads.length / PAGE_SIZE) || 1;
  const paginatedRoads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedRoads.slice(start, start + PAGE_SIZE);
  }, [sortedRoads, page]);

  return (
    <div id="roads-intelligence-view" className="space-y-4 pb-12">
      {/* Top Header & Metrics Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>436 Road Segments Intelligence & Diagnostics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Complete Network Graph
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-sensor telemetry, capacity utilization, and AI operational recommendations across all corridors.
          </p>
        </div>

        {/* Quick summary pill counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            onClick={() => { setFilterRisk('CRITICAL'); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              filterRisk === 'CRITICAL'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {summary.critical_roads} Critical
          </div>

          <div
            onClick={() => { setFilterRisk('ELEVATED'); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              filterRisk === 'ELEVATED'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {summary.elevated_roads} Elevated
          </div>

          <div
            onClick={() => { setFilterRisk('ANOMALY'); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              filterRisk === 'ANOMALY'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            {summary.anomalies_detected} Anomalies
          </div>

          <div
            onClick={() => { setFilterRisk('OPTIMAL'); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              filterRisk === 'OPTIMAL'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {summary.optimal_roads} Optimal
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by segment ID (e.g. R0435), nodes (e.g. N001), or road class..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Risk filter selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => { setFilterRisk(e.target.value); setPage(1); }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Levels ({roads.length})</option>
              <option value="CRITICAL">Critical Only ({summary.critical_roads})</option>
              <option value="ELEVATED">Elevated ({summary.elevated_roads})</option>
              <option value="ANOMALY">Anomalies Detected ({summary.anomalies_detected})</option>
              <option value="OPTIMAL">Optimal ({summary.optimal_roads})</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="congestion">Congestion Index (Highest)</option>
              <option value="speed_low">Speed (Lowest First)</option>
              <option value="queue">Queue Length (Longest)</option>
              <option value="flow">Flow Volume (Highest)</option>
              <option value="id">Segment ID (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Directory */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Topology Link</th>
                <th className="px-4 py-3">Class & Lanes</th>
                <th className="px-4 py-3">Speed / Free-Flow</th>
                <th className="px-4 py-3">Flow & Queue</th>
                <th className="px-4 py-3">Risk Status</th>
                <th className="px-4 py-3">AI Recommendation</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRoads.map((seg) => {
                const isCrit = seg.ai_risk_level === 'CRITICAL';
                const isElev = seg.ai_risk_level === 'ELEVATED';

                return (
                  <tr
                    key={seg.segment_id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectRoad(seg)}
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                          {seg.segment_id}
                        </span>
                        {seg.structural_bottleneck === 1 && (
                          <span title="Structural Geometric Bottleneck" className="w-2 h-2 rounded-full bg-rose-500" />
                        )}
                        {seg.is_anomaly && (
                          <span title="Telemetry Anomaly Detected" className="text-purple-600">
                            <Zap className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="font-semibold text-slate-800">{seg.source_node}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span className="font-semibold text-slate-800">{seg.target_node}</span>
                      <div className="text-[11px] text-slate-400">{seg.length_km} km</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="font-medium capitalize text-slate-800">{seg.road_class}</div>
                      <div className="text-[11px] text-slate-400">{seg.lanes} lanes • Cap {seg.capacity_vph}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900">{seg.speed_kmh}</span>
                        <span className="text-slate-400 text-[11px]">/ {seg.free_flow_speed_kmh} km/h</span>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            seg.speed_ratio < 0.4
                              ? 'bg-rose-500'
                              : seg.speed_ratio < 0.7
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, seg.speed_ratio * 100)}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{seg.flow_vph} vph</div>
                      <div className="text-[11px] text-slate-500">Queue: {seg.queue_length_veh} veh</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isCrit
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isElev
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isCrit ? <AlertOctagon className="w-3 h-3" /> : isElev ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{seg.ai_risk_level}</span>
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{seg.ai_status}</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 max-w-[200px]">
                      <div className="truncate text-xs font-medium text-slate-700" title={seg.ai_action}>
                        {seg.ai_action}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate" title={seg.ai_trend}>
                        {seg.ai_trend}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onForecast(seg.segment_id)}
                          title="Forecast multi-horizon"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-700"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onTraceSpillback(seg.segment_id)}
                          title="Trace Spillback"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-amber-50 text-slate-600 hover:text-amber-700"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onPlanDiversion(seg.segment_id)}
                          title="Plan Diversion"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
                        >
                          <GitFork className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{(page - 1) * PAGE_SIZE + 1}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(page * PAGE_SIZE, sortedRoads.length)}</strong> of{' '}
            <strong className="text-slate-900">{sortedRoads.length}</strong> filtered corridors
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
