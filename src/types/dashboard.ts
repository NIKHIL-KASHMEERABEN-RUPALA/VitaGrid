export interface KpiMetric {
  id: string;
  title: string;
  statusBadge: string;
  statusType: 'optimal' | 'nominal' | 'stable' | 'critical';
  value: string;
  subValue: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  footerText: string;
  sparklineData: number[];
  sparklineColor: string;
}

export interface MapRegion {
  id: string;
  name: string;
  label: string;
  code: string;
  status: 'optimal' | 'watch' | 'critical';
  points: string; // SVG polygon points
  centroid: { x: number; y: number };
  facilityCount: number;
  stabilityIndex: number;
  coldChainTemp: string;
  droneDeliveries?: number;
  stockoutRisk: string;
  bedsIcu: string;
  cliniciansLive: number;
}

export interface TransitPath {
  id: string;
  from: string;
  to: string;
  path: string; // SVG path d
  type: 'drone' | 'road';
  status: 'active' | 'scheduled';
  etaMinutes: number;
  progressPercent: number;
  payload: string;
}

export type AlertCategory = 'all' | 'critical' | 'logistics' | 'clinical';

export interface NationalAlert {
  id: string;
  type: 'critical' | 'surge' | 'transit' | 'telemetry';
  category: 'critical' | 'logistics' | 'clinical';
  badgeText: string;
  timestamp: string;
  title: string;
  description: string;
  metaLeft: string;
  actionText?: string;
  actionType?: 'review-transfer' | 'view-protocol' | 'view-telemetry';
  transferProposalId?: string;
  protocolId?: string;
  urgencyLevel: 'high' | 'medium' | 'low';
}

export interface TransferProposal {
  id: string;
  title: string;
  facility: string;
  item: string;
  runoutDays: number;
  currentStock: number;
  requiredStock: number;
  transferAmount: number;
  donorFacility: string;
  donorDistanceKm: number;
  donorAvailable: number;
  routeTransitMode: string;
  coldChainRequirement: string;
  hashSignature: string;
  status: 'pending' | 'authorized' | 'rejected';
}

export interface VectorProtocol {
  id: string;
  cluster: string;
  pathogens: string[];
  surgeRateWeek: string;
  predictedPeakDays: number;
  recommendedIVAllocation: number;
  bufferStatus: string;
  approvedBy: string;
  status: 'ready' | 'executed';
}

export interface CopilotRecommendation {
  id: string;
  priority: 'Immediate' | 'High' | 'Strategic';
  title: string;
  description: string;
  projectedImpact: string;
  actionLabel: string;
  status: 'pending' | 'applied';
}
