'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type WorkspaceMode = 'investor' | 'owner';

const storageKey = 'cpf-workspace-preferences';

type WorkspacePreferences = {
  activeMode?: WorkspaceMode;
  investorPath?: string;
  ownerPath?: string;
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readPreferences(): WorkspacePreferences {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as WorkspacePreferences) : {};
  } catch {
    return {};
  }
}

function writePreferences(next: WorkspacePreferences) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export function resolveModeFromPathname(pathname: string): WorkspaceMode | null {
  if (pathname.startsWith('/app/owner')) {
    return 'owner';
  }

  if (pathname.startsWith('/app/investor')) {
    return 'investor';
  }

  return null;
}

export function getWorkspaceRoot(mode: WorkspaceMode) {
  return mode === 'owner' ? '/app/owner' : '/app/investor';
}

export function useWorkspaceMode(roles: string[], hasOwnerAccount: boolean) {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameMode = resolveModeFromPathname(pathname);
  const canUseOwnerMode = roles.includes('project_owner') || hasOwnerAccount;

  const availableModes = useMemo<WorkspaceMode[]>(
    () => (canUseOwnerMode ? ['investor', 'owner'] : ['investor']),
    [canUseOwnerMode],
  );

  useEffect(() => {
    const stored = readPreferences();
    const nextMode = pathnameMode ?? stored.activeMode ?? availableModes[0];
    const nextPreferences: WorkspacePreferences = {
      ...stored,
      activeMode: nextMode,
    };

    if (pathnameMode === 'investor') {
      nextPreferences.investorPath = pathname;
    }

    if (pathnameMode === 'owner') {
      nextPreferences.ownerPath = pathname;
    }

    writePreferences(nextPreferences);
  }, [availableModes, pathname, pathnameMode]);

  const currentMode = useMemo<WorkspaceMode>(() => {
    if (pathnameMode) {
      return pathnameMode;
    }

    const stored = readPreferences();
    if (stored.activeMode && availableModes.includes(stored.activeMode)) {
      return stored.activeMode;
    }

    return availableModes[0];
  }, [availableModes, pathnameMode]);

  function switchMode(nextMode: WorkspaceMode) {
    const stored = readPreferences();
    const fallbackPath = getWorkspaceRoot(nextMode);
    const targetPath = nextMode === 'owner'
      ? stored.ownerPath ?? fallbackPath
      : stored.investorPath ?? fallbackPath;

    writePreferences({
      ...stored,
      activeMode: nextMode,
    });

    router.push(targetPath);
  }

  return {
    availableModes,
    currentMode,
    canUseOwnerMode,
    switchMode,
  };
}
