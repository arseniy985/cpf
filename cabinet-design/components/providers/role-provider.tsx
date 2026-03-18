'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'investor' | 'owner';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Derive role directly from pathname instead of using effect
  const derivedRole: Role = pathname?.startsWith('/app/owner') ? 'owner' : 'investor';
  const [roleState, setRoleState] = useState<Role | null>(null);

  // The actual role is either the explicitly set state, or derived from URL
  const role = roleState || derivedRole;

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    // Redirect to the respective overview when switching roles
    if (newRole === 'investor' && !pathname?.startsWith('/app/investor')) {
      router.push('/app/investor');
    } else if (newRole === 'owner' && !pathname?.startsWith('/app/owner')) {
      router.push('/app/owner');
    }
  };

  const toggleRole = () => {
    setRole(role === 'investor' ? 'owner' : 'investor');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
