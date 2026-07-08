'use client';

import { useState, useCallback, useMemo } from 'react';
import { Home as HomeIcon, User, Swords, Gamepad2, Mail, BookOpen } from 'lucide-react';
import { Starfield } from '@/components/Starfield';
import { Hud } from '@/components/Hud';
import { StartScreen } from '@/components/StartScreen';
import { GameWorld, type ZoneNode } from '@/components/GameWorld';
import { ZoneContent } from '@/components/ZoneContent';
import { KonamiCode } from '@/components/KonamiCode';
import { useHudProgress } from '@/hooks/use-hud-progress';

// Zone anchor points as fractions (0..1) of the hub-map background image,
// matching the building positions drawn in /public/backgrounds/hub-map.jpg
const zoneAnchors: Record<string, { x: number; y: number }> = {
  sobre: { x: 0.275, y: 0.134 },
  inicio: { x: 0.51, y: 0.134 },
  skills: { x: 0.73, y: 0.134 },
  projetos: { x: 0.275, y: 0.56 },
  guestbook: { x: 0.51, y: 0.56 },
  contato: { x: 0.73, y: 0.56 },
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const { markVisited } = useHudProgress();

  const zones: ZoneNode[] = useMemo(
    () => [
      { id: 'inicio', label: 'Início', ...zoneAnchors.inicio, color: 'cyan', icon: <HomeIcon className="h-5 w-5" /> },
      { id: 'sobre', label: 'Sobre Mim', ...zoneAnchors.sobre, color: 'pink', icon: <User className="h-5 w-5" /> },
      { id: 'skills', label: 'Skills', ...zoneAnchors.skills, color: 'gold', icon: <Swords className="h-5 w-5" /> },
      { id: 'projetos', label: 'Projetos', ...zoneAnchors.projetos, color: 'green', icon: <Gamepad2 className="h-5 w-5" /> },
      { id: 'contato', label: 'Contato', ...zoneAnchors.contato, color: 'cyan', icon: <Mail className="h-5 w-5" /> },
      { id: 'guestbook', label: 'Hall da Fama', ...zoneAnchors.guestbook, color: 'gold', icon: <BookOpen className="h-5 w-5" /> },
    ],
    [],
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    markVisited('inicio');
  }, [markVisited]);

  const handleZoneEnter = useCallback(
    (zoneId: string) => {
      setActiveZone(zoneId);
      markVisited(zoneId);
    },
    [markVisited],
  );

  const handleZoneVisit = useCallback(
    (zoneId: string) => {
      markVisited(zoneId);
    },
    [markVisited],
  );

  const handleExitZone = useCallback(() => {
    setActiveZone(null);
  }, []);

  const handleZoneJump = useCallback(
    (zoneId: string) => {
      if (zoneId === 'inicio' && activeZone) {
        setActiveZone(null);
        return;
      }
      handleZoneEnter(zoneId);
    },
    [activeZone, handleZoneEnter],
  );

  return (
    <>
      <Starfield />
      <Hud activeZone={activeZone} onZoneJump={handleZoneJump} started={started} />
      <KonamiCode />

      {!started && <StartScreen onStart={handleStart} />}

      {started && (
        <GameWorld
          zones={zones}
          onZoneEnter={handleZoneEnter}
          onZoneVisit={handleZoneVisit}
          activeZone={activeZone}
          onExitZone={handleExitZone}
          started={started}
        >
          {(zone) => <ZoneContent zoneId={zone!} />}
        </GameWorld>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 py-1 px-4 text-center pointer-events-none">
        <p className="font-pixel text-[8px] text-muted-foreground/40">
          © 2024 DEVPEU — PEDRO HENRIQUE
        </p>
      </footer>
    </>
  );
}
