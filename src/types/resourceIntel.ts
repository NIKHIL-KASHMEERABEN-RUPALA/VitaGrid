export interface FacilityLoad {
  id: string;
  name: string;
  district: string;
  level: string;
  totalBeds: number;
  icuInUse: number;
  icuTotal: number;
  icuPercent: number;
  clinicianToPatient: string;
  clinicianRatioValue: number;
  targetRatio: string;
  oxygenBufferDays: number;
  status: 'Critical Deficit' | 'Strained' | 'Nominal';
  dispatchAction: 'Rebalance Staff' | 'Deploy Float';
}

export interface RebalanceDirective {
  id: string;
  confidence: string;
  title: string;
  description: string;
  sourceNode: string;
  transferResource: string;
  transitCorridor: string;
  eta: string;
  status: 'pending' | 'simulated' | 'executed';
}

export interface ResourceKpis {
  acuteBeds: {
    used: number;
    total: number;
    percent: number;
    reserves: number;
    trend: string;
  };
  clinicians: {
    headcount: number;
    attendancePercent: number;
    unexcusedPercent: number;
    activeDutyMds: number;
    registeredNurses: number;
  };
  bioMedical: {
    operationalPercent: number;
    ventilators: number;
    pods: number;
    underCalibration: number;
    coldChainLockPercent: number;
  };
  stressIndex: {
    criticalSites: number;
    strainedTier: number;
    immediateStaffDeficit: number;
    deltaFrom0400: number;
  };
}
