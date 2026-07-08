'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Swords,
  Gamepad2,
  Mail,
  Volume2,
  VolumeX,
  Trophy,
  MapPin,
} from 'lucide-react';
import { NAV_SECTIONS } from '@/types';
import { useHudProgress } from '@/hooks/use-hud-progress';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, typeof Home> = {
  Home,
  User,
  Swords,
  Gamepad2,
  Mail,
};

interface HudProps {
  activeZone: string | null;
  onZoneJump?: (zoneId: string) => void;
  started: boolean;
}

export function Hud({ activeZone, onZoneJump, started }: HudProps) {
  const { isVisited, visitedCount, mounted } = useHudProgress();
  const { muted, toggleMute, play } = useSound();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    play('click');
    setMobileOpen(false);
    if (onZoneJump) {
      onZoneJump(sectionId);
    }
  };

  const handleHover = () => play('hover');

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 hud-panel"
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
            {/* Logo / Player Tag */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                play('click');
                if (onZoneJump) onZoneJump('inicio');
              }}
              onMouseEnter={handleHover}
              className="flex items-center gap-2 shrink-0"
              aria-label="DevPeu — Início"
            >
              <span className="font-pixel text-xs sm:text-sm text-neon-cyan text-glow-cyan">
                DEVPEU
              </span>
            </a>

            {/* Desktop Nav — zone quick-jump */}
            {started && (
              <nav
                className="hidden md:flex items-center gap-1"
                aria-label="Zonas do mundo"
              >
                {NAV_SECTIONS.map((section) => {
                  const Icon = ICON_MAP[section.icon] || Home;
                  const visited = mounted && isVisited(section.id);
                  const isActive = activeZone === section.id;

                  return (
                    <a
                      key={section.id}
                      href={section.href}
                      onClick={(e) => handleNavClick(e, section.id)}
                      onMouseEnter={handleHover}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel transition-all duration-150',
                        'border-2 rounded-sm',
                        isActive
                          ? 'border-neon-cyan text-neon-cyan text-glow-cyan bg-neon-cyan/10'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{section.label}</span>
                      {visited && (
                        <Trophy
                          className="h-3 w-3 text-neon-gold"
                          aria-label="Zona visitada"
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
            )}

            {/* Right side: progress + mute + mobile toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Current zone indicator */}
              {started && activeZone && (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 border-2 border-neon-pink/50 rounded-sm">
                  <MapPin className="h-3.5 w-3.5 text-neon-pink" />
                  <span className="font-pixel text-[10px] text-neon-pink">
                    {NAV_SECTIONS.find((s) => s.id === activeZone)?.label.toUpperCase() || 'MAPA'}
                  </span>
                </div>
              )}

              {/* Progress indicator */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 border-2 border-neon-gold/50 rounded-sm"
                title={`${visitedCount}/${NAV_SECTIONS.length} zonas visitadas`}
              >
                <Trophy className="h-3.5 w-3.5 text-neon-gold" />
                <span className="font-pixel text-[10px] text-neon-gold">
                  {mounted ? visitedCount : 0}/{NAV_SECTIONS.length}
                </span>
              </div>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                onMouseEnter={handleHover}
                className="flex items-center justify-center h-8 w-8 border-2 border-border rounded-sm text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors"
                aria-label={muted ? 'Ativar som' : 'Silenciar som'}
                aria-pressed={!muted}
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              {/* Mobile menu toggle */}
              {started && (
                <button
                  onClick={() => {
                    play('click');
                    setMobileOpen((prev) => !prev);
                  }}
                  onMouseEnter={handleHover}
                  className="md:hidden flex items-center justify-center h-8 w-8 border-2 border-border rounded-sm text-foreground hover:text-neon-cyan hover:border-neon-cyan transition-colors"
                  aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? '✕' : '☰'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && started && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t-2 border-border"
              aria-label="Navegação mobile"
            >
              <div className="flex flex-col gap-1 p-3">
                {NAV_SECTIONS.map((section) => {
                  const Icon = ICON_MAP[section.icon] || Home;
                  const visited = mounted && isVisited(section.id);
                  const isActive = activeZone === section.id;

                  return (
                    <a
                      key={section.id}
                      href={section.href}
                      onClick={(e) => handleNavClick(e, section.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 text-xs font-pixel transition-colors rounded-sm',
                        isActive
                          ? 'text-neon-cyan bg-neon-cyan/10 border-2 border-neon-cyan'
                          : 'text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-border',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{section.label}</span>
                      {visited && (
                        <Trophy className="h-3.5 w-3.5 text-neon-gold ml-auto" />
                      )}
                    </a>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
