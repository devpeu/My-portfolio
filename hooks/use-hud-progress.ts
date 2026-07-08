'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devpeu_hud_progress';

export type HudProgress = Record<string, boolean>;

function readProgress(): HudProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(progress: HudProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // graceful fallback — storage may be unavailable
  }
}

export function useHudProgress() {
  const [progress, setProgress] = useState<HudProgress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setMounted(true);
  }, []);

  const markVisited = useCallback((sectionId: string) => {
    setProgress((prev) => {
      if (prev[sectionId]) return prev;
      const next = { ...prev, [sectionId]: true };
      writeProgress(next);
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (sectionId: string) => progress[sectionId] === true,
    [progress],
  );

  const visitedCount = Object.values(progress).filter(Boolean).length;

  return { progress, markVisited, isVisited, visitedCount, mounted };
}
