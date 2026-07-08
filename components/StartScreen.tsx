'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Gamepad2, Keyboard } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [visible, setVisible] = useState(true);
  const { play } = useSound();

  const handleStart = useCallback(() => {
    play('click');
    setVisible(false);
    setTimeout(onStart, 600);
  }, [onStart, play]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        handleStart();
      }
    };
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleStart);
  }, [handleStart]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-arcade-bg-deep"
          role="dialog"
          aria-label="Tela inicial"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-neon-cyan text-glow-cyan mb-4 leading-tight">
              DEVPEU
            </h1>
            <p className="font-pixel text-[10px] sm:text-xs text-neon-pink text-glow-pink">
              PORTFOLIO ARCADE
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground max-w-md text-center mb-8 px-4"
          >
            Explore o mundo do DevPeu. Caminhe até cada zona e descubra
            projetos, skills e formas de contato.
          </motion.p>

          {/* Controls hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-3 px-4 py-2 border-2 border-neon-cyan/30 rounded-sm bg-neon-cyan/5">
              <Keyboard className="h-4 w-4 text-neon-cyan" />
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 border border-neon-cyan/50 rounded-sm font-pixel text-[8px] text-neon-cyan">W</kbd>
                <kbd className="px-1.5 py-0.5 border border-neon-cyan/50 rounded-sm font-pixel text-[8px] text-neon-cyan">A</kbd>
                <kbd className="px-1.5 py-0.5 border border-neon-cyan/50 rounded-sm font-pixel text-[8px] text-neon-cyan">S</kbd>
                <kbd className="px-1.5 py-0.5 border border-neon-cyan/50 rounded-sm font-pixel text-[8px] text-neon-cyan">D</kbd>
                <span className="font-pixel text-[8px] text-muted-foreground ml-1">MOVER</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border-2 border-neon-gold/30 rounded-sm bg-neon-gold/5">
              <Gamepad2 className="h-4 w-4 text-neon-gold" />
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 border border-neon-gold/50 rounded-sm font-pixel text-[8px] text-neon-gold">E</kbd>
                <span className="font-pixel text-[8px] text-muted-foreground">ENTRAR</span>
              </div>
            </div>
          </motion.div>

          {/* Blinking "Press Start" */}
          <motion.button
            onClick={handleStart}
            onMouseEnter={() => play('hover')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="group flex flex-col items-center gap-4 cursor-pointer"
            aria-label="Iniciar o jogo"
          >
            <motion.div
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', times: [0, 0.49, 0.5, 0.99, 1] }}
              className="font-pixel text-xs sm:text-sm text-neon-gold text-glow-gold"
            >
              PRESS START
            </motion.div>

            <div className="flex items-center gap-2 px-6 py-3 border-2 border-neon-cyan pixel-border-cyan group-hover:animate-pixel-bounce transition-all">
              <Play className="h-4 w-4 text-neon-cyan" fill="currentColor" />
              <span className="font-pixel text-xs text-neon-cyan">INICIAR</span>
            </div>
          </motion.button>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="font-pixel text-[8px] sm:text-[10px]">
              OU ROLE PARA COMEÇAR
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <div className="absolute bottom-2 right-3">
            <span className="font-pixel text-[8px] text-muted-foreground/60">
              © 2024 DEVPEU
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
