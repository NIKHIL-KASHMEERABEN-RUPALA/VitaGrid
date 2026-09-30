import React, { createContext, useContext, useState } from 'react';
import { UserRole, RoleConfig, ROLE_CONFIGS } from '../types/rbac';

interface RbacContextType {
  currentRole: UserRole;
  currentRoleConfig: RoleConfig;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: keyof RoleConfig['permissions']) => boolean;
  verifyPermissionOrPrompt: (
    permission: keyof RoleConfig['permissions'],
    actionDescription: string
  ) => boolean;
  permissionModalState: {
    isOpen: boolean;
    actionName: string;
    requiredRole: string;
  } | null;
  closePermissionModal: () => void;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export const RbacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('national_director');
  const [permissionModalState, setPermissionModalState] = useState<{
    isOpen: boolean;
    actionName: string;
    requiredRole: string;
  } | null>(null);

  const currentRoleConfig = ROLE_CONFIGS[currentRole];

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const hasPermission = (permission: keyof RoleConfig['permissions']) => {
    return currentRoleConfig.permissions[permission] ?? false;
  };

  const verifyPermissionOrPrompt = (
    permission: keyof RoleConfig['permissions'],
    actionDescription: string
  ) => {
    if (hasPermission(permission)) {
      return true;
    }

    let requiredRole = 'National Health Director';
    if (permission === 'canExecuteTransfer' || permission === 'canGenerateManifest') {
      requiredRole = 'National Director, Regional Commander, or Logistics Officer';
    } else if (permission === 'canRunWhatIf') {
      requiredRole = 'National Director, Regional Commander, or Chief Epidemiologist';
    }

    setPermissionModalState({
      isOpen: true,
      actionName: actionDescription,
      requiredRole,
    });
    return false;
  };

  const closePermissionModal = () => {
    setPermissionModalState(null);
  };

  return (
    <RbacContext.Provider
      value={{
        currentRole,
        currentRoleConfig,
        switchRole,
        hasPermission,
        verifyPermissionOrPrompt,
        permissionModalState,
        closePermissionModal,
      }}
    >
      {children}
    </RbacContext.Provider>
  );
};

export const useRbac = () => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
};
