import React, { useState, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Sparkles,
  GitFork,
  Radio,
  MapPin,
  Eye,
  Info
} from 'lucide-react';
import { neuraxEngine } from '../../services/neuraxService';
import type { RoadSegment, JunctionNode } from '../../types/neurax';

interface NetworkTopologyMapProps {
  onSelectRoad?: (segment: RoadSegment) => void;
  onTraceSpillback?: (segmentId: string) => void;
  onForecast?: (segmentId: string) => void;
  onPlanDiversion?: (segmentId: string) => void;
}

export const NetworkTopologyMap: React.FC<NetworkTopologyMapProps> = ({
  onSelectRoad,
  onTraceSpillback,
  onForecast,
  onPlanDiversion
}) => {
  const { nodes, segments } = useMemo(() => {
    return neuraxEngine.getTopologyGraph();
  }, []);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredSegment, setHoveredSegment] = useState<RoadSegment | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);

  // Compute node coordinate bounds
  const nodeMap = useMemo(() => {
    const map = new Map<string, JunctionNode>();
    nodes.forEach((n: JunctionNode) => map.set(n.node_id, n));
    return map;
  }, [nodes]);

  // Coordinate scaling to fit 1000x700 SVG canvas
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach((n: JunctionNode) => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });
    return { minX, maxX, minY, maxY };
  }, [nodes]);

  const scaleX = (x: number) => {
    const pad = 40;
    const w = 920;
    return pad + ((x - bounds.minX) / (bounds.maxX - bounds.minX || 1)) * w;
  };

  const scaleY = (y: number) => {
    const pad = 40;
    const h = 580;
    return pad + ((y - bounds.minY) / (bounds.maxY - bounds.minY || 1)) * h;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta: number) => {
    setZoom((z) => Math.max(0.6, Math.min(3.0, z + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div id="network-topology-map" className="space-y-3">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Metropolitan Highway Network Graph ({nodes.length} Junctions, {segments.length} Links)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Topology
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Pan and zoom to inspect live road statuses, flow directions, and junction signal controllers.
          </p>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-slate-700">
            <button
              onClick={() => handleZoom(0.2)}
              title="Zoom In"
              className="p-1 rounded-lg hover:bg-white hover:shadow-xs transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              title="Zoom Out"
              className="p-1 rounded-lg hover:bg-white hover:shadow-xs transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1 rounded-lg hover:bg-white hover:shadow-xs transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden h-[540px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <svg
          className="w-full h-full"
          viewBox="0 0 1000 660"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Road Segments (Links) */}
            {segments.map((seg: RoadSegment) => {
              const u = nodeMap.get(seg.source_node);
              const v = nodeMap.get(seg.target_node);
              if (!u || !v) return null;

              const x1 = scaleX(u.x);
              const y1 = scaleY(u.y);
              const x2 = scaleX(v.x);
              const y2 = scaleY(v.y);

              // Color based on risk level
              const isSelected = selectedSegment?.segment_id === seg.segment_id;
              const isHovered = hoveredSegment?.segment_id === seg.segment_id;

              let stroke = '#334155'; // default optimal slate
              let strokeWidth = 1.6;

              if (seg.ai_risk_level === 'CRITICAL') {
                stroke = '#f43f5e'; // rose-500
                strokeWidth = 3.2;
              } else if (seg.ai_risk_level === 'ELEVATED') {
                stroke = '#f59e0b'; // amber-500
                strokeWidth = 2.4;
              } else if (seg.speed_ratio > 0.8) {
                stroke = '#10b981'; // emerald-500
                strokeWidth = 1.8;
              }

              if (isSelected || isHovered) {
                stroke = '#60a5fa'; // blue-400
                strokeWidth = 4.0;
              }

              return (
                <g key={seg.segment_id}>
                  {/* Wider hit zone */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="transparent"
                    strokeWidth="10"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(seg)}
                    onClick={() => {
                      setSelectedSegment(seg);
                      onSelectRoad?.(seg);
                    }}
                  />
                  {/* Visible Link */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="transition-all pointer-events-none"
                  />
                </g>
              );
            })}

            {/* 2. Junction Nodes */}
            {nodes.map((n: JunctionNode) => {
              const cx = scaleX(n.x);
              const cy = scaleY(n.y);
              const isSignal = n.is_signalized;

              return (
                <g key={n.node_id} className="pointer-events-none">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSignal ? 3.5 : 2}
                    fill={isSignal ? '#38bdf8' : '#64748b'}
                    stroke="#020617"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 p-2.5 rounded-xl flex items-center gap-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical / Gridlock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Elevated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Signalized Junction</span>
          </div>
        </div>

        {/* Hover / Selected Segment Inspector Floating Card */}
        {(hoveredSegment || selectedSegment) && (
          <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white p-3.5 rounded-xl shadow-xl w-72 pointer-events-auto space-y-2">
            {(() => {
              const seg = hoveredSegment || selectedSegment!;
              return (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white border border-slate-700">
                      {seg.segment_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        seg.ai_risk_level === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : seg.ai_risk_level === 'ELEVATED'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {seg.ai_risk_level}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    Nodes <strong className="text-slate-200">{seg.source_node}</strong> →{' '}
                    <strong className="text-slate-200">{seg.target_node}</strong> ({seg.road_class})
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Speed:</span>
                      <div className="font-bold text-white">
                        {seg.speed_kmh} / {seg.free_flow_speed_kmh} km/h
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Queue:</span>
                      <div className="font-bold text-rose-400">{seg.queue_length_veh} veh</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onForecast?.(seg.segment_id)}
                      className="py-1 px-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Forecast</span>
                    </button>
                    <button
                      onClick={() => onTraceSpillback?.(seg.segment_id)}
                      className="py-1 px-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Spillback</span>
                    </button>
                    <button
                      onClick={() => onPlanDiversion?.(seg.segment_id)}
                      className="py-1 px-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <GitFork className="w-3 h-3" />
                      <span>Reroute</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
