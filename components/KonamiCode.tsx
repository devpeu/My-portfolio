'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const CONFETTI_COLORS = [
  'hsl(187 85% 53%)',
  'hsl(320 85% 60%)',
  'hsl(45 95% 55%)',
  'hsl(142 70% 50%)',
  'hsl(280 70% 60%)',
];

export function KonamiCode() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerEasterEgg = useCallback(() => {
    setShowConfetti(true);
    toast('Conquista secreta desbloqueada!', {
      description: 'Você encontrou o Konami Code!',
      icon: <Trophy className="h-4 w-4 text-neon-gold" />,
      duration: 4000,
    });
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      setSequence((prev) => {
        const next = [...prev, key];
        if (next.length > KONAMI_CODE.length) {
          next.shift();
        }

        if (
          next.length === KONAMI_CODE.length &&
          next.every((k, i) => k === KONAMI_CODE[i])
        ) {
          triggerEasterEgg();
          return [];
        }

        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEasterEgg]);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => i);

  return (
    <AnimatePresence>
      {showConfetti && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {confettiPieces.map((i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const color =
              CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            const size = Math.random() * 8 + 4;

            return (
              <motion.div
                key={i}
                initial={{ y: -50, opacity: 1, rotate: 0 }}
                animate={{ y: '110vh', opacity: 0, rotate: 720 }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
