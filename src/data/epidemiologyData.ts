import { PathogenOverview, MetricCardData, RadarAxisPoint } from '../types/epidemiology';

export const PATHOGENS_DATA: PathogenOverview[] = [
  {
    id: 'malaria',
    name: 'Plasmodium Falciparum (Malaria)',
    category: 'Vector-borne',
    colorDot: 'red',
    r0: 1.48,
    velocity7d: '+41.2%',
    affectedClusters: 'Lake Basin Drainage Basin (18 PHCs)',
    baselineCases: 42000,
    projectedPeakCases: 64500,
    riskLevel: 'critical',
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus (Pediatric Diarrhea)',
    category: 'Enteric',
    colorDot: 'green',
    r0: 1.15,
    velocity7d: '+18.4%',
    affectedClusters: 'Western & Rift Valley Periphery (24 PHCs)',
    baselineCases: 21500,
    projectedPeakCases: 27800,
    riskLevel: 'high',
  },
  {
    id: 'rsv',
    name: 'RSV & Bronchiolitis',
    category: 'Respiratory',
    colorDot: 'blue',
    r0: 0.94,
    velocity7d: '+6.2%',
    affectedClusters: 'Highland Agricultural Zones',
    baselineCases: 16000,
    projectedPeakCases: 18100,
    riskLevel: 'moderate',
  },
  {
    id: 'typhoid',
    name: 'Typhoid & Water-borne',
    category: 'Bacterial',
    colorDot: 'amber',
    r0: 1.08,
    velocity7d: '+14.1%',
    affectedClusters: 'Urban Informal Settlements & Floodplains',
    baselineCases: 9500,
    projectedPeakCases: 12200,
    riskLevel: 'moderate',
  },
  {
    id: 'dengue',
    name: 'Dengue Vector',
    category: 'Arboviral',
    colorDot: 'purple',
    r0: 0.82,
    velocity7d: '+3.5%',
    affectedClusters: 'Coastal Maritime Belt',
    baselineCases: 4800,
    projectedPeakCases: 5400,
    riskLevel: 'nominal',
  },
];

export const METRIC_CARDS_DATA: MetricCardData = {
  sentinelNodes: {
    active: 2840,
    total: 2840,
    fidelityPercent: 100,
    cycleMinutes: 12,
  },
  priorityFlag: {
    flagId: '#ALRT-092',
    title: 'Malaria Vector Spike',
    location: 'Lake Basin Drainage Basin (18 PHCs)',
    velocity7d: '+41.2% 7-day velocity',
    transmissionR0: 1.48,
  },
  bioClimatic: {
    precipitationAnomalyMm: 34,
    correlationMultiplier: 2.4,
    presentationDays: '9–11 days',
    feedSource: 'Copernicus & GPM Fed',
    confidencePercent: 91.8,
  },
};

export const RADAR_AXIS_DATA: RadarAxisPoint[] = [
  { axis: 'MALARIA (0.88)', value: 0.88, label: 'Malaria R₀ 1.48' },
  { axis: 'ROTAVIRUS (0.64)', value: 0.64, label: 'Rotavirus R₀ 1.15' },
  { axis: 'RSV / BRONCH (0.42)', value: 0.42, label: 'RSV R₀ 0.94' },
  { axis: 'DENGUE (0.35)', value: 0.35, label: 'Dengue R₀ 0.82' },
  { axis: 'TYPHOID (0.58)', value: 0.58, label: 'Typhoid R₀ 1.08' },
];

export const TIME_SERIES_CHART = {
  baselineValue: 42,
  labels: ['T-14', 'T-10', 'T-7', 'T-4', 'T-1', 'TODAY', 'T+3', 'T+7', 'T+10', 'T+14'],
  baselineData: [42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
  historicalData: [38.5, 39.2, 41.0, 44.5, 48.2, 53.6],
  projectedData: [53.6, 58.4, 63.8, 67.2, 64.5],
  ciUpper: [53.6, 61.2, 68.5, 74.0, 72.5],
  ciLower: [53.6, 55.6, 59.1, 60.4, 56.5],
};
