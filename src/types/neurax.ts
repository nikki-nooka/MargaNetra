export type CongestionLevel = 'FREE_FLOW' | 'MODERATE' | 'HEAVY' | 'GRIDLOCK';
export type AIRiskLevel = 'CRITICAL' | 'ELEVATED' | 'MONITORED' | 'OPTIMAL';

export interface RoadSegment {
  segment_id: string;
  source_node: string;
  target_node: string;
  road_class: string;
  lanes: number;
  free_flow_speed_kmh: number;
  capacity_vph: number;
  length_km: number;
  grade_pct: number;
  signal_id: string;
  structural_bottleneck: number;
  importance: number;
  // Live Telemetry
  speed_kmh: number;
  flow_vph: number;
  congestion_index: number;
  congestion_level: CongestionLevel;
  queue_length_veh: number;
  delay_min: number;
  speed_ratio: number;
  is_anomaly: boolean;
  ai_risk_level: AIRiskLevel;
  ai_status: string;
  ai_trend: string;
  ai_action: string;
}

export interface JunctionNode {
  node_id: string;
  x: number;
  y: number;
  lat: number;
  lon: number;
  is_signalized: boolean;
  signal_id?: string;
  label?: string;
}

export interface CityKPIs {
  timestamp: string;
  total_segments: number;
  avg_speed_kmh: number;
  total_flow_vph: number;
  free_flow_pct: number;
  moderate_pct: number;
  heavy_pct: number;
  gridlock_pct: number;
  active_incidents_count: number;
  active_bottlenecks_count: number;
  network_health_score: number;
  co2_saved_kg: number;
}

export interface HorizonForecast {
  horizon_min: 15 | 30 | 45 | 60;
  label: string;
  predicted_speed_kmh: number;
  predicted_flow_vph: number;
  predicted_congestion_index: number;
  speed_lower_kmh: number;
  speed_upper_kmh: number;
  confidence_pct: number;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface ForecastResult {
  segment_id: string;
  road_class: string;
  source_node: string;
  target_node: string;
  current_observation: {
    speed_kmh: number;
    flow_vph: number;
    congestion_index: number;
    queue_length_veh: number;
    delay_min: number;
    timestamp: string;
  };
  horizons: HorizonForecast[];
  model_info: {
    architecture: string;
    speed_mae: number;
    flow_mae: number;
    congestion_mae: number;
    feature_count: number;
  };
}

export interface SpillbackStep {
  segment_id: string;
  hop: number;
  eta_minutes: number;
  source_node: string;
  target_node: string;
  road_class: string;
  speed_kmh: number;
  flow_vph: number;
  capacity_vph: number;
  queue_length_veh: number;
  congestion_index: number;
  speed_drop_pct: number;
  risk_label: string;
}

export interface SpillbackResult {
  incident_segment: string;
  total_impacted_segments: number;
  max_reach_minutes: number;
  cascade_steps: SpillbackStep[];
  affected_od_pairs: Array<{
    origin: string;
    destination: string;
    volume_vph: number;
    purpose: string;
    delay_added_min: number;
  }>;
  shockwave_velocity_kmh: number;
  total_delayed_vehicles: number;
}

export interface DiversionRoute {
  path_id: string;
  route_name: string;
  via_segments: string[];
  via_nodes: string[];
  total_distance_km: number;
  estimated_travel_time_min: number;
  spare_capacity_vph: number;
  capacity_utilization_pct: number;
  delay_saved_min: number;
  turn_restriction_clean: boolean;
  recommendation_level: 'PRIMARY_RECOMMENDED' | 'SECONDARY_ALTERNATE' | 'CONTINGENCY';
}

export interface DiversionPlanResult {
  incident_segment: string;
  source_node: string;
  target_node: string;
  blocked_capacity_vph: number;
  spillback_segments: string[];
  diversion_routes: DiversionRoute[];
  recommended_signal_tunes: Array<{
    node_id: string;
    signal_id: string;
    current_green_ratio: number;
    recommended_green_ratio: number;
    action: string;
    reason: string;
  }>;
}

export interface GreenWaveResult {
  status: string;
  priority_level: string;
  origin_node: string;
  destination_node: string;
  path_nodes: string[];
  corridor_segments: string[];
  total_distance_km: number;
  normal_travel_time_min: number;
  green_wave_eta_min: number;
  time_saved_min: number;
  signals_preempted_count: number;
  preempted_signals: Array<{
    node_id: string;
    signal_id: string;
    action: string;
    green_split: number;
    clearing_window_s: number;
    status: string;
  }>;
}

export interface PlanningCandidate {
  candidate_id: string;
  target_segment: string;
  intervention_type: 'capacity_upgrade' | 'turn_lane' | 'signal_retiming' | 'flyover_extension';
  capacity_delta_vph: number;
  cost_index: number;
  feasibility_band: 'low' | 'medium' | 'high';
  // Computed counterfactuals
  baseline_delay_min: number;
  counterfactual_delay_min: number;
  delay_reduction_pct: number;
  daily_veh_hours_saved: number;
  roi_score: number;
  source_node?: string;
  target_node?: string;
  road_class?: string;
}

export interface ScenarioExample {
  scenario_id: string;
  scenario_type: string;
  start_time: string;
  end_time: string;
  target_segment: string;
  incident_type: string;
  severity: number;
  candidate_interventions: string;
  baseline_delay_min?: number;
  mitigated_delay_min?: number;
  reduction_pct?: number;
}

export interface ResilienceSimulationResult {
  segment_id: string;
  duration_min: number;
  network_delay_increase_pct: number;
  stranded_vehicles: number;
  spillback_radius_km: number;
  resilience_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  critical_spillback_corridors: string[];
  diversion_saturation_pct: number;
  single_point_of_failure: boolean;
  mitigation_protocol: string[];
}

export interface TopCriticalSegment {
  rank: number;
  segment_id: string;
  road_class: string;
  source_node: string;
  target_node: string;
  criticality_score: number;
  flow_vph: number;
  importance: number;
  failure_impact: string;
}

export interface BriefingResult {
  incident_id?: string;
  segment_id: string;
  language: 'EN' | 'HI' | 'TE';
  provider: string;
  briefing: string;
  simple_speech_text: string;
  phonetic_transliteration?: string;
  bullet_points?: string[];
  timestamp: string;
}

export interface WeeklyMacroDay {
  day_name: string;
  peak_hours: string;
  avg_congestion: number;
  avg_speed: number;
  total_trips_k: number;
  weather_sensitivity: number;
}

export interface WeeklyMacroProfile {
  days: WeeklyMacroDay[];
  weekly_avg_speed: number;
  total_vkt_millions: number;
  lost_hours_k: number;
}
