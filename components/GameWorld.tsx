'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ZoneNode {
  id: string;
  label: string;
  /** Position as a fraction (0..1) of the background image width/height */
  x: number;
  y: number;
  color: 'cyan' | 'pink' | 'gold' | 'green';
  icon: ReactNode;
}

interface GameWorldProps {
  zones: ZoneNode[];
  onZoneEnter: (zoneId: string) => void;
  onZoneVisit: (zoneId: string) => void;
  activeZone: string | null;
  onExitZone: () => void;
  children: (activeZone: string | null) => ReactNode;
  started: boolean;
}

// Background artwork — the fantasy village hub map (the reference art's own
// baked-in nav bar has been cropped out so it never doubles up with <Hud>)
const BG_SRC = '/backgrounds/hub-map.jpg';
const BG_ASPECT = 1672 / 821;

// Player movement/size expressed as fractions of the rendered map width,
// so gameplay feels the same on any screen size.
const PLAYER_SPEED_FRAC = 0.00034; // fraction of map width per ms
const PLAYER_SIZE_FRAC = 0.05; // player width as a fraction of map width
const INTERACT_RADIUS_FRAC = 0.09;
// Keep the player from ever walking so close to an edge that the sprite
// (which is drawn above its feet) would poke out of the map / under the HUD.
const MARGIN_X_FRAC = 0.04;
const MARGIN_TOP_FRAC = 0.09;
const MARGIN_BOTTOM_FRAC = 0.06;

const COLOR_MAP: Record<
  string,
  { border: string; glow: string; bg: string; text: string }
> = {
  cyan: {
    border: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.5)',
    bg: 'rgba(34, 211, 238, 0.1)',
    text: '#22d3ee',
  },
  pink: {
    border: '#e879f9',
    glow: 'rgba(232, 121, 249, 0.5)',
    bg: 'rgba(232, 121, 249, 0.1)',
    text: '#e879f9',
  },
  gold: {
    border: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.5)',
    bg: 'rgba(251, 191, 36, 0.1)',
    text: '#fbbf24',
  },
  green: {
    border: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.5)',
    bg: 'rgba(74, 222, 128, 0.1)',
    text: '#4ade80',
  },
};

/** "Contain" fit of the background image inside the canvas — never crops it. */
function getContentRect(canvasW: number, canvasH: number) {
  const canvasAspect = canvasW / canvasH;
  let w: number;
  let h: number;
  if (canvasAspect > BG_ASPECT) {
    h = canvasH;
    w = h * BG_ASPECT;
  } else {
    w = canvasW;
    h = w / BG_ASPECT;
  }
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  return { x, y, w, h };
}

export function GameWorld({
  zones,
  onZoneEnter,
  onZoneVisit,
  activeZone,
  onExitZone,
  children,
  started,
}: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  // Player position stored as a FRACTION (0..1) of the map content rect.
  const playerRef = useRef({ x: 0.5, y: 0.5, dir: 'down' as string, moving: false });
  const animFrameRef = useRef<number>(0);
  const playerSpriteRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [, setAssetsTick] = useState(0);
  const [nearbyZone, setNearbyZone] = useState<string | null>(null);
  const nearbyZoneRef = useRef<string | null>(null);
  const activeZoneRef = useRef<string | null>(null);
  const startedRef = useRef(started);
  const contentRectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const [contentRect, setContentRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Load the RPG character sprite once
  useEffect(() => {
    const img = new Image();
    img.src = '/sprites/viking-player.png';
    img.onload = () => {
      playerSpriteRef.current = img;
      setAssetsTick((t) => t + 1);
    };
  }, []);

  // Load the hub background artwork once
  useEffect(() => {
    const img = new Image();
    img.src = BG_SRC;
    img.onload = () => {
      bgImageRef.current = img;
      setAssetsTick((t) => t + 1);
    };
  }, []);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    activeZoneRef.current = activeZone;
  }, [activeZone]);

  useEffect(() => {
    nearbyZoneRef.current = nearbyZone;
  }, [nearbyZone]);

  // Keyboard input
  useEffect(() => {
    if (!started) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeZoneRef.current) {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          onExitZone();
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)
      ) {
        e.preventDefault();
        keysRef.current.add(key);
      }

      if ((key === 'e' || key === 'enter' || key === ' ') && nearbyZoneRef.current) {
        e.preventDefault();
        onZoneEnter(nearbyZoneRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [started, onZoneEnter, onExitZone]);

  // Game loop
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let walkFrame = 0;
    let walkTimer = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cssRect = getContentRect(rect.width, rect.height);
      contentRectRef.current = cssRect;
      setContentRect(cssRect);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    const drawZoneNode = (
      zone: ZoneNode,
      rect: { x: number; y: number; w: number; h: number },
      time: number,
    ) => {
      const screenX = rect.x + zone.x * rect.w;
      const screenY = rect.y + zone.y * rect.h;
      const baseRadius = rect.w * 0.028;

      const colors = COLOR_MAP[zone.color];
      const pulse = 0.7 + Math.sin(time * 0.003) * 0.3;
      const isNearby = nearbyZoneRef.current === zone.id;
      const isActive = activeZoneRef.current === zone.id;
      const radius = isNearby ? baseRadius * 1.25 : baseRadius;

      const flicker = 0.85 + Math.sin(time * 0.01 + zone.x * 100) * 0.15;
      ctx.save();
      ctx.shadowBlur = (isNearby ? 34 : 18) * flicker;
      ctx.shadowColor = colors.glow;

      const grad = ctx.createRadialGradient(screenX, screenY, 2, screenX, screenY, radius + 14);
      grad.addColorStop(0, colors.bg);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius + 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate((time * 0.0006) % (Math.PI * 2));
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius - 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = colors.bg;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius - 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = colors.border;
      ctx.globalAlpha = pulse;
      const gemR = isNearby ? radius * 0.4 : radius * 0.26;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 2;
        const gx = screenX + Math.cos(ang) * gemR;
        const gy = screenY + Math.sin(ang) * gemR;
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      // "Press E" hint
      if (isNearby && !isActive) {
        ctx.font = `${Math.max(7, rect.w * 0.012)}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.border;
        ctx.globalAlpha = 0.5 + Math.sin(time * 0.008) * 0.5;
        ctx.fillText('[E] ENTRAR', screenX, screenY - radius - 12);
        ctx.globalAlpha = 1;
      }
    };

    const drawPlayer = (
      fx: number,
      fy: number,
      rect: { x: number; y: number; w: number; h: number },
      time: number,
    ) => {
      const screenX = rect.x + fx * rect.w;
      const screenY = rect.y + fy * rect.h;
      const p = playerRef.current;
      const sprite = playerSpriteRef.current;
      const playerSize = rect.w * PLAYER_SIZE_FRAC;

      const bobOffset = p.moving ? Math.sin(walkFrame * 0.3) * 2 : 0;
      const groundY = screenY + playerSize / 2 + 4;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(screenX, groundY, playerSize / 1.6, playerSize * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      if (sprite) {
        const SPRITE_H = playerSize * 2.6;
        const SPRITE_W = SPRITE_H * (sprite.width / sprite.height);
        const drawX = screenX - SPRITE_W / 2;
        const drawY = groundY - SPRITE_H + 4 + bobOffset;

        ctx.save();
        const auraPulse = 0.5 + Math.sin(time * 0.004) * 0.15;
        const grad = ctx.createRadialGradient(screenX, groundY - 6, 2, screenX, groundY - 6, SPRITE_W * 0.55);
        grad.addColorStop(0, `rgba(251, 191, 36, ${auraPulse * 0.35})`);
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(screenX, groundY - 6, SPRITE_W * 0.55, SPRITE_W * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';

        if (p.dir === 'left') {
          ctx.translate(drawX + SPRITE_W, drawY);
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, 0, 0, SPRITE_W, SPRITE_H);
        } else {
          ctx.drawImage(sprite, drawX, drawY, SPRITE_W, SPRITE_H);
        }
        ctx.restore();
      } else {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(screenX, screenY, playerSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = (dt: number, rect: { x: number; y: number; w: number; h: number }) => {
      const p = playerRef.current;
      if (activeZoneRef.current) {
        p.moving = false;
        return;
      }

      let dx = 0;
      let dy = 0;
      const keys = keysRef.current;

      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;
      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      p.moving = dx !== 0 || dy !== 0;

      if (dx !== 0) p.dir = dx > 0 ? 'right' : 'left';
      else if (dy !== 0) p.dir = dy > 0 ? 'down' : 'up';

      p.x += dx * PLAYER_SPEED_FRAC * dt;
      // Vertical fraction is scaled so movement speed feels visually
      // uniform even though x/y fractions map to different pixel spans.
      const aspectCorrection = rect.h > 0 ? rect.w / rect.h : 1;
      p.y += dy * PLAYER_SPEED_FRAC * dt * (aspectCorrection / BG_ASPECT);

      p.x = Math.max(MARGIN_X_FRAC, Math.min(1 - MARGIN_X_FRAC, p.x));
      p.y = Math.max(MARGIN_TOP_FRAC, Math.min(1 - MARGIN_BOTTOM_FRAC, p.y));

      if (p.moving) {
        walkTimer += dt;
        if (walkTimer > 80) {
          walkFrame++;
          walkTimer = 0;
        }
      }

      let nearest: string | null = null;
      let nearestDist = INTERACT_RADIUS_FRAC * rect.w;
      for (const zone of zones) {
        const zx = zone.x * rect.w;
        const zy = zone.y * rect.h;
        const dist = Math.hypot(zx - p.x * rect.w, zy - p.y * rect.h);
        if (dist < nearestDist) {
          nearest = zone.id;
          nearestDist = dist;
        }
      }

      if (nearest !== nearbyZoneRef.current) {
        setNearbyZone(nearest);
        if (nearest) {
          onZoneVisit(nearest);
        }
      }
    };

    const render = (time: number) => {
      const dt = Math.min(time - lastTime, 33);
      lastTime = time;

      const rect = contentRectRef.current;
      update(dt, rect);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.width / dpr;
      const cssH = canvas.height / dpr;
      ctx.clearRect(0, 0, cssW, cssH);

      const bg = bgImageRef.current;
      if (bg) {
        ctx.drawImage(bg, rect.x, rect.y, rect.w, rect.h);
        // subtle vignette so HUD text near the edges stays readable
        const vignette = ctx.createRadialGradient(
          rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w * 0.3,
          rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w * 0.75,
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = vignette;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, cssH);
        grad.addColorStop(0, '#221a12');
        grad.addColorStop(1, '#100c08');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      if (rect.w > 0) {
        for (const zone of zones) {
          drawZoneNode(zone, rect, time);
        }
        drawPlayer(playerRef.current.x, playerRef.current.y, rect, time);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
    };
  }, [started, zones, onZoneVisit]);

  const handleZoneClick = useCallback(
    (zoneId: string) => {
      if (nearbyZone === zoneId) {
        onZoneEnter(zoneId);
      }
    },
    [nearbyZone, onZoneEnter],
  );

  return (
    <div className="fixed top-14 sm:top-16 left-0 right-0 bottom-0 overflow-hidden">
      {/* Canvas game world — background art + player + zone portals */}
      <div ref={containerRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          aria-label="Mundo do jogo — use WASD ou setas para mover, E para entrar em uma zona"
        />
      </div>

      {/* Zone click targets (invisible buttons over canvas nodes) */}
      {started && !activeZone && contentRect.w > 0 &&
        zones.map((zone) => {
          const colors = COLOR_MAP[zone.color];
          const isNearby = nearbyZone === zone.id;
          const size = isNearby ? contentRect.w * 0.075 : contentRect.w * 0.058;
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className="absolute z-20 flex items-center justify-center rounded-full transition-all"
              style={{
                left: `${contentRect.x + zone.x * contentRect.w}px`,
                top: `${contentRect.y + zone.y * contentRect.h}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)',
                border: `2px solid ${colors.border}`,
                boxShadow: isNearby ? `0 0 20px ${colors.glow}` : 'none',
                background: isNearby ? colors.bg : 'transparent',
                cursor: isNearby ? 'pointer' : 'default',
                opacity: isNearby ? 1 : 0,
              }}
              aria-label={`${zone.label}${isNearby ? ' — clique para entrar' : ''}`}
            >
              <span style={{ color: colors.text }}>{zone.icon}</span>
            </button>
          );
        })}

      {/* Mobile touch controls */}
      {started && !activeZone && (
        <MobileControls
          onMoveStart={(dir) => keysRef.current.add(dir)}
          onMoveEnd={(dir) => keysRef.current.delete(dir)}
          onInteract={() => {
            if (nearbyZone) onZoneEnter(nearbyZone);
          }}
          canInteract={!!nearbyZone}
        />
      )}

      {/* Zone panel */}
      <AnimatePresence mode="wait">
        {activeZone && (
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-0 z-30 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, hsl(230 50% 3%) 0%, hsl(222 47% 6%) 40%, hsl(250 40% 8%) 100%)',
            }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 hud-panel">
              <span className="font-pixel text-xs text-neon-cyan">
                {zones.find((z) => z.id === activeZone)?.label.toUpperCase()}
              </span>
              <button
                onClick={onExitZone}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-neon-pink/50 rounded-sm hover:border-neon-pink hover:bg-neon-pink/10 transition-all"
                aria-label="Voltar ao mapa"
              >
                <span className="font-pixel text-[10px] text-neon-pink">
                  VOLTAR [ESC]
                </span>
              </button>
            </div>
            <div className="px-4 pb-20 pt-4">
              {children(activeZone)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction prompt */}
      {started && !activeZone && nearbyZone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2 hud-panel pixel-corners">
            <kbd className="px-2 py-1 border-2 border-neon-cyan rounded-sm font-pixel text-[10px] text-neon-cyan">
              E
            </kbd>
            <span className="font-pixel text-[10px] text-foreground">
              ENTRAR
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Mobile touch controls
function MobileControls({
  onMoveStart,
  onMoveEnd,
  onInteract,
  canInteract,
}: {
  onMoveStart: (dir: string) => void;
  onMoveEnd: (dir: string) => void;
  onInteract: () => void;
  canInteract: boolean;
}) {
  const [activeDir, setActiveDir] = useState<string | null>(null);

  const handleStart = (dir: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setActiveDir(dir);
    onMoveStart(dir);
  };

  const handleEnd = () => {
    if (activeDir) {
      onMoveEnd(activeDir);
      setActiveDir(null);
    }
  };

  const btnClass =
    'flex items-center justify-center h-12 w-12 border-2 border-neon-cyan/40 rounded-sm bg-arcade-bg-deep/80 backdrop-blur active:bg-neon-cyan/20 active:border-neon-cyan touch-none select-none';

  return (
    <div className="md:hidden absolute bottom-4 left-0 right-0 z-20 flex items-end justify-between px-4 pointer-events-none">
      {/* D-pad */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 pointer-events-auto">
        <div />
        <button
          className={btnClass}
          onTouchStart={handleStart('w')}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart('w')}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          aria-label="Mover para cima"
        >
          <span className="text-neon-cyan text-lg">▲</span>
        </button>
        <div />
        <button
          className={btnClass}
          onTouchStart={handleStart('a')}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart('a')}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          aria-label="Mover para esquerda"
        >
          <span className="text-neon-cyan text-lg">◀</span>
        </button>
        <div />
        <button
          className={btnClass}
          onTouchStart={handleStart('d')}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart('d')}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          aria-label="Mover para direita"
        >
          <span className="text-neon-cyan text-lg">▶</span>
        </button>
        <div />
        <button
          className={btnClass}
          onTouchStart={handleStart('s')}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart('s')}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          aria-label="Mover para baixo"
        >
          <span className="text-neon-cyan text-lg">▼</span>
        </button>
        <div />
      </div>

      {/* Interact button */}
      <button
        onClick={onInteract}
        disabled={!canInteract}
        className={`pointer-events-auto flex items-center justify-center h-16 w-16 rounded-full border-2 font-pixel text-[10px] transition-all touch-none select-none ${
          canInteract
            ? 'border-neon-gold bg-neon-gold/20 text-neon-gold animate-pulse'
            : 'border-border bg-arcade-bg-deep/80 text-muted-foreground/30'
        }`}
        aria-label="Interagir"
      >
        E
      </button>
    </div>
  );
}
