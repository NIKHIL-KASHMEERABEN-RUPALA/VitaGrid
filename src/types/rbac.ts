export type UserRole =
  | 'national_director'
  | 'regional_commander'
  | 'logistics_officer'
  | 'epidemiologist'
  | 'viewer';

export interface RoleConfig {
  id: UserRole;
  name: string;
  title: string;
  department: string;
  email: string;
  clearanceLevel: number;
  clearanceBadge: string;
  permissions: {
    canChangeDefcon: boolean;
    canSignEcdsa: boolean;
    canExecuteTransfer: boolean;
    canGenerateManifest: boolean;
    canRunWhatIf: boolean;
    canModifyInventory: boolean;
    canConfigureThresholds: boolean;
  };
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  national_director: {
    id: 'national_director',
    name: 'Dr. V. Rao',
    title: 'National Health Director',
    department: 'Ministry of Health & Sovereign Directorate',
    email: 'dr.rao@vitagrid.gov',
    clearanceLevel: 5,
    clearanceBadge: 'CLEARANCE LEVEL 5 • STATUTORY EXECUTIVE',
    permissions: {
      canChangeDefcon: true,
      canSignEcdsa: true,
      canExecuteTransfer: true,
      canGenerateManifest: true,
      canRunWhatIf: true,
      canModifyInventory: true,
      canConfigureThresholds: true,
    },
  },
  regional_commander: {
    id: 'regional_commander',
    name: 'Col. A. Ndwiga',
    title: 'Regional Logistics Commander',
    department: 'Northern & Coast Corridor Command',
    email: 'a.ndwiga@vitagrid.gov',
    clearanceLevel: 4,
    clearanceBadge: 'CLEARANCE LEVEL 4 • REGIONAL COMMAND',
    permissions: {
      canChangeDefcon: false,
      canSignEcdsa: false,
      canExecuteTransfer: true,
      canGenerateManifest: true,
      canRunWhatIf: true,
      canModifyInventory: false,
      canConfigureThresholds: true,
    },
  },
  logistics_officer: {
    id: 'logistics_officer',
    name: 'M. Koech',
    title: 'Chief Logistics Officer',
    department: 'Central Medical Stores & Distribution',
    email: 'm.koech@vitagrid.gov',
    clearanceLevel: 3,
    clearanceBadge: 'CLEARANCE LEVEL 3 • SUPPLY & DEPOT',
    permissions: {
      canChangeDefcon: false,
      canSignEcdsa: false,
      canExecuteTransfer: true,
      canGenerateManifest: true,
      canRunWhatIf: false,
      canModifyInventory: true,
      canConfigureThresholds: false,
    },
  },
  epidemiologist: {
    id: 'epidemiologist',
    name: 'Dr. S. Chen',
    title: 'Chief Epidemiological Analyst',
    department: 'Division of Disease Surveillance & Biostatistics',
    email: 's.chen@vitagrid.gov',
    clearanceLevel: 3,
    clearanceBadge: 'CLEARANCE LEVEL 3 • SURVEILLANCE & AI',
    permissions: {
      canChangeDefcon: false,
      canSignEcdsa: false,
      canExecuteTransfer: false,
      canGenerateManifest: false,
      canRunWhatIf: true,
      canModifyInventory: false,
      canConfigureThresholds: true,
    },
  },
  viewer: {
    id: 'viewer',
    name: 'A. Ochieng',
    title: 'National Audit Observer',
    department: 'Independent Governance & Oversight Commission',
    email: 'a.ochieng@vitagrid.gov',
    clearanceLevel: 1,
    clearanceBadge: 'CLEARANCE LEVEL 1 • AUDIT OBSERVER (READ-ONLY)',
    permissions: {
      canChangeDefcon: false,
      canSignEcdsa: false,
      canExecuteTransfer: false,
      canGenerateManifest: false,
      canRunWhatIf: false,
      canModifyInventory: false,
      canConfigureThresholds: false,
    },
  },
};
