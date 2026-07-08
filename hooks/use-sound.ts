'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'unlock';

export function useSound() {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('devpeu_muted');
      if (stored !== null) {
        setMuted(stored === 'true');
      }
    } catch {
      // graceful fallback
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('devpeu_muted', String(next));
      } catch {
        // graceful fallback
      }
      return next;
    });
  }, []);

  const getAudioCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (
      freq: number,
      duration: number,
      type: OscillatorType = 'square',
      volume = 0.08,
    ) => {
      if (muted) return;
      const ctx = getAudioCtx();
      if (!ctx) return;

      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration,
        );

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // silent fallback
      }
    },
    [muted, getAudioCtx],
  );

  const play = useCallback(
    (type: SoundType) => {
      switch (type) {
        case 'hover':
          playTone(880, 0.05, 'square', 0.04);
          break;
        case 'click':
          playTone(523, 0.08, 'square', 0.06);
          setTimeout(() => playTone(659, 0.08, 'square', 0.06), 50);
          break;
        case 'success':
          playTone(523, 0.1, 'square', 0.06);
          setTimeout(() => playTone(659, 0.1, 'square', 0.06), 80);
          setTimeout(() => playTone(784, 0.15, 'square', 0.06), 160);
          break;
        case 'unlock':
          playTone(440, 0.08, 'square', 0.05);
          setTimeout(() => playTone(660, 0.08, 'square', 0.05), 60);
          setTimeout(() => playTone(880, 0.12, 'square', 0.05), 120);
          break;
      }
    },
    [playTone],
  );

  return { muted, toggleMute, play };
}
