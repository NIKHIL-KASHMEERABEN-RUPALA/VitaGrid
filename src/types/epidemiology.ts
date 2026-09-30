export interface PathogenOverview {
  id: string;
  name: string;
  category: string;
  colorDot: 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'cyan';
  r0: number;
  velocity7d: string;
  affectedClusters: string;
  baselineCases: number;
  projectedPeakCases: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'nominal';
}

export interface MetricCardData {
  sentinelNodes: {
    active: number;
    total: number;
    fidelityPercent: number;
    cycleMinutes: number;
  };
  priorityFlag: {
    flagId: string;
    title: string;
    location: string;
    velocity7d: string;
    transmissionR0: number;
  };
  bioClimatic: {
    precipitationAnomalyMm: number;
    correlationMultiplier: number;
    presentationDays: string;
    feedSource: string;
    confidencePercent: number;
  };
}

export interface RadarAxisPoint {
  axis: string;
  value: number; // 0 to 1
  label: string;
}
