export interface DepotTreeNode {
  id: string;
  name: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: 'green' | 'red' | 'solid-red' | 'stable' | 'nominal' | 'watchlist';
  isRoot?: boolean;
  expanded?: boolean;
  children?: DepotTreeNode[];
}

export interface EssentialMedicine {
  id: string;
  name: string;
  packaging: string;
  formulation: string;
  category: 'antibiotics' | 'maternal' | 'vaccines' | 'malaria' | 'other' | 'antimalarials' | 'chronic';
  currentStock: number;
  stockUnit: string;
  dailyVelocity: number;
  velocityUnit: string;
  runoutDays: number;
  depletionDate: string;
  riskTier: 'critical' | 'action_required' | 'low_buffer' | 'optimal';
  riskLabel: string;
  syncTimeAgo: string;
  historicalData: number[]; // T-14 to T-0
  forecastData: number[];   // T+1 to T+14
  safetyBuffer: number;
  batchNumber?: string;
  minBufferDays?: number;
}

export interface CorridorVulnerability {
  corridor: string;
  days7: { value: string; variant: 'urgent' | 'alert' | 'stable' | 'light-alert' | 'light-urgent' };
  days14: { value: string; variant: 'urgent' | 'alert' | 'stable' | 'light-alert' | 'light-urgent' };
  days30: { value: string; variant: 'urgent' | 'alert' | 'stable' | 'light-alert' | 'light-urgent' };
}
