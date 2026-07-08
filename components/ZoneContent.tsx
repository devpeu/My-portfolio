'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  Network,
  Target,
  Award,
  Zap,
  Building2,
  Rocket,
  ShoppingCart,
  Smartphone,
  Gauge,
  Search,
  Sparkles,
  Play,
  Star,
  Gamepad2,
  ExternalLink,
  Mail,
  MessageCircle,
  Instagram,
  Send,
  Save,
  Trophy,
  Loader2,
  BookOpen,
  MapPin,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  CHARACTER_ATTRIBUTES,
  ACHIEVEMENTS,
  SERVICES,
  type Project,
  FALLBACK_PROJECTS,
  type GuestbookEntry,
} from '@/types';
import { getSupabase } from '@/lib/supabase';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';

const COLOR_MAP: Record<
  string,
  { bar: string; text: string; border: string; glow: string }
> = {
  cyan: { bar: 'bg-neon-cyan', text: 'text-neon-cyan', border: 'border-neon-cyan', glow: 'text-glow-cyan' },
  pink: { bar: 'bg-neon-pink', text: 'text-neon-pink', border: 'border-neon-pink', glow: 'text-glow-pink' },
  gold: { bar: 'bg-neon-gold', text: 'text-neon-gold', border: 'border-neon-gold', glow: 'text-glow-gold' },
  green: { bar: 'bg-neon-green', text: 'text-neon-green', border: 'border-neon-green', glow: 'text-glow-green' },
};

const ACHIEVEMENT_ICONS: Record<string, typeof GraduationCap> = { GraduationCap, Network };
const SERVICE_ICONS: Record<string, typeof Building2> = { Building2, Rocket, ShoppingCart, Smartphone, Gauge, Search };

// TODO: conferir se o número de WhatsApp tem 8 ou 9 dígitos antes de publicar
const WHATSAPP_LINK = 'https://wa.me/5581956965550';
const EMAIL = 'devpeuoficial@hotmail.com';
const INSTAGRAM_LINK = 'https://instagram.com/sc_peu';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});
type ContactFormData = z.infer<typeof contactSchema>;

const MAX_GUESTBOOK_LENGTH = 200;

export function ZoneContent({ zoneId }: { zoneId: string }) {
  switch (zoneId) {
    case 'inicio':
      return <HeroZone />;
    case 'sobre':
      return <AboutZone />;
    case 'skills':
      return <SkillsZone />;
    case 'projetos':
      return <ProjectsZone />;
    case 'contato':
      return <ContactZone />;
    case 'guestbook':
      return <GuestbookZone />;
    default:
      return null;
  }
}

function HeroZone() {
  const { play } = useSound();
  const STATS = [
    { icon: Briefcase, label: '2+ Anos de Experiência', color: 'text-neon-cyan' },
    { icon: Rocket, label: '50+ Projetos Entregues', color: 'text-neon-pink' },
    { icon: CheckCircle2, label: '100% Clientes Satisfeitos', color: 'text-neon-gold' },
  ];

  return (
    <div className="max-w-4xl mx-auto text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border-2 border-neon-pink/50 rounded-sm bg-neon-pink/5"
      >
        <span className="font-pixel text-[10px] text-neon-pink">★ PLAYER 1 ★</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-pixel text-xl sm:text-3xl md:text-4xl text-foreground mb-4 leading-tight"
      >
        Olá, eu sou o <span className="text-neon-cyan text-glow-cyan">Pedro Henrique</span>
        <br />
        <span className="text-neon-pink text-glow-pink">(DevPeu)</span> <span className="inline-block">🚀</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
      >
        Desenvolvedor web com +2 anos de experiência, criando sites modernos, responsivos e focados em resultados reais para empresas, marcas e profissionais.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
      >
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              onMouseEnter={() => play('hover')}
              className="flex flex-col items-center gap-2 p-4 arcade-card pixel-corners"
            >
              <Icon className={`h-6 w-6 ${stat.color}`} />
              <span className="font-pixel text-[10px] sm:text-xs text-center text-foreground leading-tight">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-neon-green/50 rounded-sm bg-neon-green/5"
      >
        <MapPin className="h-4 w-4 text-neon-green" />
        <span className="text-sm text-neon-green">Recife, PE — Brasil</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground mb-2">
          Caminhe até as outras zonas para explorar mais!
        </p>
        <div className="flex items-center justify-center gap-2 text-neon-cyan">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Gamepad2 className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function AboutZone() {
  const { play } = useSound();

  return (
    <div className="max-w-5xl mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border-2 border-neon-cyan/50 rounded-sm">
          <span className="font-pixel text-[10px] text-neon-cyan">FICHA DE PERSONAGEM</span>
        </div>
        <h2 className="font-pixel text-lg sm:text-2xl text-foreground">SOBRE MIM</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="arcade-card pixel-corners p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="flex items-center justify-center h-28 w-28 sm:h-32 sm:w-32 pixel-border-cyan bg-arcade-bg-deep pixel-corners" role="img" aria-label="Avatar de DevPeu">
              <span className="font-pixel text-3xl text-neon-cyan text-glow-cyan">P</span>
            </div>
            <div className="mt-3 text-center">
              <span className="font-pixel text-[10px] text-neon-gold">DevPeu</span>
            </div>
            <div className="mt-1 text-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-neon-gold/50 rounded-sm">
                <Award className="h-3 w-3 text-neon-gold" />
                <span className="font-pixel text-[8px] text-neon-gold">2+ ANOS</span>
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              Formado em <span className="text-neon-cyan font-semibold">Análise e Desenvolvimento de Sistemas</span> pela Uninassau, e Técnico em Redes de Computadores pela ETEGEC.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Alio design e performance para entregar sites de alta qualidade, focados em resultados reais para empresas, marcas e profissionais.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t-2 border-border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-neon-gold" />
            <span className="font-pixel text-[10px] text-neon-gold">ATRIBUTOS</span>
          </div>
          {CHARACTER_ATTRIBUTES.map((attr, i) => {
            const colors = COLOR_MAP[attr.color];
            return (
              <div key={i} className="flex items-center gap-3">
                <span className={cn('font-pixel text-[10px] w-20 sm:w-24 shrink-0', colors.text)}>
                  {attr.label}
                </span>
                <div className="flex-1 h-5 bg-arcade-bg-deep border-2 border-border overflow-hidden relative" role="progressbar" aria-valuenow={attr.value} aria-valuemin={0} aria-valuemax={100} aria-label={attr.label}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${attr.value}%` }}
                    transition={{ duration: 1, delay: 0.1 * i, ease: 'easeOut' }}
                    className={cn('h-full relative', colors.bar)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.div>
                </div>
                <span className={cn('font-pixel text-[10px] w-8 text-right', colors.text)}>{attr.value}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => play('hover')}
          className="arcade-card pixel-corners p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-neon-cyan" />
            <h3 className="font-pixel text-xs text-neon-cyan">FORMAÇÃO ACADÊMICA</h3>
          </div>
          <div className="space-y-3">
            {ACHIEVEMENTS.map((ach, i) => {
              const Icon = ACHIEVEMENT_ICONS[ach.icon] || GraduationCap;
              return (
                <div key={i} className="flex items-start gap-3 p-3 border-2 border-border rounded-sm hover:border-neon-cyan/50 transition-colors">
                  <Icon className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium leading-tight">{ach.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ach.institution}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -2 }}
          onMouseEnter={() => play('hover')}
          className="arcade-card pixel-corners p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-neon-gold" />
            <h3 className="font-pixel text-xs text-neon-gold">FOCO EM RESULTADOS</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sites que convertem visitantes em clientes, com design moderno e performance otimizada.
          </p>
          <div className="mt-4 flex items-center gap-2 p-3 border-2 border-neon-gold/50 rounded-sm bg-neon-gold/5">
            <Award className="h-4 w-4 text-neon-gold" />
            <span className="font-pixel text-[10px] text-neon-gold">2+ Anos de experiência</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SkillsZone() {
  const { play } = useSound();
  const SKILL_COLORS: Record<string, { text: string; border: string; glow: string }> = {
    cyan: { text: 'text-neon-cyan', border: 'hover:border-neon-cyan', glow: 'group-hover:text-glow-cyan' },
    pink: { text: 'text-neon-pink', border: 'hover:border-neon-pink', glow: 'group-hover:text-glow-pink' },
    gold: { text: 'text-neon-gold', border: 'hover:border-neon-gold', glow: 'group-hover:text-glow-gold' },
    green: { text: 'text-neon-green', border: 'hover:border-neon-green', glow: 'group-hover:text-glow-green' },
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border-2 border-neon-pink/50 rounded-sm">
          <Sparkles className="h-3 w-3 text-neon-pink" />
          <span className="font-pixel text-[10px] text-neon-pink">ÁRVORE DE HABILIDADES</span>
        </div>
        <h2 className="font-pixel text-lg sm:text-2xl text-foreground">O QUE EU FAÇO</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">Power-ups disponíveis para o seu projeto</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((service, i) => {
          const Icon = SERVICE_ICONS[service.icon] || Building2;
          const colors = SKILL_COLORS[service.color];
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              onMouseEnter={() => play('hover')}
              className={cn('group arcade-card pixel-corners p-5 cursor-default border-2 transition-all duration-200', colors.border)}
            >
              <div className={cn('flex items-center justify-center h-12 w-12 mb-4 border-2 rounded-sm transition-all border-border group-hover:animate-pixel-bounce', colors.text)}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className={cn('font-pixel text-[11px] sm:text-xs mb-3 leading-tight transition-all', colors.text, colors.glow)}>
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              <div className="mt-4 flex items-center gap-1.5">
                <div className={cn('h-1.5 w-1.5 rounded-full', colors.text.replace('text-', 'bg-'))} />
                <span className="font-pixel text-[8px] text-muted-foreground">POWER-UP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// TODO: confirmar nome/descrição com o Peu para revisar depois
function ProjectsZone() {
  const { play } = useSound();
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const supabase = getSupabase();
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('featured', true).order('order_index', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) setProjects(data as Project[]);
      } catch { /* fallback */ } finally { setLoading(false); }
    }
    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border-2 border-neon-gold/50 rounded-sm">
          <Gamepad2 className="h-3 w-3 text-neon-gold" />
          <span className="font-pixel text-[10px] text-neon-gold">SELEÇÃO DE FASE</span>
        </div>
        <h2 className="font-pixel text-lg sm:text-2xl text-foreground">PROJETOS RECENTES</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
          {loading ? 'Carregando fases...' : 'Escolha uma fase para jogar'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onMouseEnter={() => play('hover')}
            className="group arcade-card pixel-corners overflow-hidden flex flex-col"
          >
            <div className="relative px-4 py-3 border-b-2 border-border bg-arcade-bg-deep">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] text-neon-cyan">FASE {String(i + 1).padStart(2, '0')}</span>
                <span className="px-2 py-0.5 border border-neon-pink/50 rounded-sm font-pixel text-[8px] text-neon-pink">{project.category}</span>
              </div>
            </div>
            <div className="flex-1 p-5 flex flex-col">
              <h3 className="font-pixel text-xs text-foreground mb-3 leading-tight group-hover:text-neon-cyan group-hover:text-glow-cyan transition-all">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
              <div className="flex items-center gap-0.5 mb-4" aria-label={`Avaliação: ${project.rating} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, starI) => (
                  <Star key={starI} className={cn('h-4 w-4', starI < project.rating ? 'text-neon-gold fill-current' : 'text-muted-foreground/30')} />
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => play('click')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-neon-cyan group-hover:bg-neon-cyan/10 transition-all pixel-border-cyan"
                aria-label={`Abrir ${project.title} em nova aba`}
              >
                <Play className="h-3.5 w-3.5 text-neon-cyan" fill="currentColor" />
                <span className="font-pixel text-[10px] text-neon-cyan">JOGAR</span>
                <ExternalLink className="h-3 w-3 text-neon-cyan/60" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContactZone() {
  const { play } = useSound();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    play('click');
    const supabase = getSupabase();
    if (!supabase) { toast.error('Não foi possível enviar. Tente pelo WhatsApp!'); setSubmitting(false); return; }
    try {
      const { error } = await supabase.from('contact_messages').insert({ name: data.name, email: data.email, whatsapp: data.whatsapp || null, message: data.message });
      if (error) throw error;
      play('success');
      toast.success('Missão enviada com sucesso!', { description: 'Entrarei em contato em breve.', icon: <Trophy className="h-4 w-4 text-neon-gold" /> });
      reset();
    } catch { toast.error('Erro ao enviar mensagem. Tente novamente!'); } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border-2 border-neon-green/50 rounded-sm">
          <Save className="h-3 w-3 text-neon-green" />
          <span className="font-pixel text-[10px] text-neon-green">PONTO DE SAVE</span>
        </div>
        <h2 className="font-pixel text-lg sm:text-2xl text-foreground mb-3">CONTATO</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">Vamos tirar seu projeto do papel?</p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2">Entre em contato e vamos conversar sobre como posso criar um site profissional para você ou sua empresa.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="arcade-card pixel-corners p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulário de contato">
            <div>
              <label htmlFor="name" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">NOME</label>
              <input id="name" type="text" {...register('name')} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors" placeholder="Seu nome" aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">EMAIL</label>
              <input id="email" type="email" {...register('email')} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors" placeholder="seu@email.com" aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="whatsapp" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">WHATSAPP (opcional)</label>
              <input id="whatsapp" type="text" {...register('whatsapp')} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors" placeholder="(81) 99999-9999" />
            </div>
            <div>
              <label htmlFor="message" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">MENSAGEM</label>
              <textarea id="message" rows={4} {...register('message')} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors resize-none" placeholder="Conte sobre seu projeto..." aria-invalid={!!errors.message} />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={submitting} onMouseEnter={() => play('hover')} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-neon-green pixel-border-green hover:bg-neon-green/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <><Loader2 className="h-4 w-4 text-neon-green animate-spin" /><span className="font-pixel text-[10px] text-neon-green">ENVIANDO...</span></>
              ) : (
                <><Send className="h-4 w-4 text-neon-green" /><span className="font-pixel text-[10px] text-neon-green">ENVIAR MISSÃO</span></>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          <a href={`mailto:${EMAIL}`} onMouseEnter={() => play('hover')} className="group flex items-center gap-4 p-4 arcade-card pixel-corners hover:border-neon-cyan transition-all">
            <div className="flex items-center justify-center h-11 w-11 border-2 border-neon-cyan/50 rounded-sm group-hover:animate-pixel-bounce"><Mail className="h-5 w-5 text-neon-cyan" /></div>
            <div><p className="font-pixel text-[10px] text-neon-cyan mb-1">EMAIL</p><p className="text-sm text-foreground break-all">{EMAIL}</p></div>
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onMouseEnter={() => play('hover')} className="group flex items-center gap-4 p-4 arcade-card pixel-corners hover:border-neon-green transition-all">
            <div className="flex items-center justify-center h-11 w-11 border-2 border-neon-green/50 rounded-sm group-hover:animate-pixel-bounce"><MessageCircle className="h-5 w-5 text-neon-green" /></div>
            <div><p className="font-pixel text-[10px] text-neon-green mb-1">WHATSAPP</p><p className="text-sm text-foreground">+55 81 9569-6550</p></div>
          </a>
          <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" onMouseEnter={() => play('hover')} className="group flex items-center gap-4 p-4 arcade-card pixel-corners hover:border-neon-pink transition-all">
            <div className="flex items-center justify-center h-11 w-11 border-2 border-neon-pink/50 rounded-sm group-hover:animate-pixel-bounce"><Instagram className="h-5 w-5 text-neon-pink" /></div>
            <div><p className="font-pixel text-[10px] text-neon-pink mb-1">INSTAGRAM</p><p className="text-sm text-foreground">@sc_peu</p></div>
          </a>
          <div className="mt-2 p-5 border-2 border-neon-gold/50 rounded-sm bg-neon-gold/5 text-center">
            <p className="font-pixel text-xs text-neon-gold text-glow-gold mb-3">PRONTO PARA COMEÇAR?</p>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onClick={() => play('click')} onMouseEnter={() => play('hover')} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-neon-gold pixel-border-gold hover:bg-neon-gold/10 transition-all">
              <MessageCircle className="h-4 w-4 text-neon-gold" /><span className="font-pixel text-[10px] text-neon-gold">FALAR NO WHATSAPP</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GuestbookZone() {
  const { play } = useSound();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchEntries() {
      const supabase = getSupabase();
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false }).limit(20);
        if (error) throw error;
        if (data) setEntries(data as GuestbookEntry[]);
      } catch { /* silent */ } finally { setLoading(false); }
    }
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length > MAX_GUESTBOOK_LENGTH) { toast.error(`Mensagem muito longa (máx ${MAX_GUESTBOOK_LENGTH} caracteres)`); return; }
    if (name.trim().length < 2 || message.trim().length < 2) { toast.error('Preencha nome e mensagem'); return; }
    setSubmitting(true); play('click');
    const supabase = getSupabase();
    if (!supabase) { toast.error('Não foi possível enviar agora.'); setSubmitting(false); return; }
    try {
      const { data, error } = await supabase.from('guestbook').insert({ visitor_name: name.trim(), message: message.trim() }).select().single();
      if (error) throw error;
      if (data) { setEntries((prev) => [data as GuestbookEntry, ...prev]); play('success'); toast.success('Recado adicionado ao Hall da Fama!'); setName(''); setMessage(''); }
    } catch { toast.error('Erro ao enviar recado. Tente novamente!'); } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border-2 border-neon-gold/50 rounded-sm">
          <BookOpen className="h-3 w-3 text-neon-gold" />
          <span className="font-pixel text-[10px] text-neon-gold">HALL DA FAMA</span>
        </div>
        <h2 className="font-pixel text-lg sm:text-2xl text-foreground">DEIXE SEU RECADO</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">Como nos fliperamas antigos — assine o livro de visitas!</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="arcade-card pixel-corners p-5 mb-8">
        <div className="space-y-3">
          <div>
            <label htmlFor="gb-name" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">SEU NOME</label>
            <input id="gb-name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors" placeholder="Jogador anônimo" />
          </div>
          <div>
            <label htmlFor="gb-message" className="block font-pixel text-[10px] text-neon-cyan mb-1.5">RECADO (máx. {MAX_GUESTBOOK_LENGTH} caracteres)</label>
            <textarea id="gb-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={MAX_GUESTBOOK_LENGTH} className="w-full px-3 py-2.5 bg-arcade-bg-deep border-2 border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none transition-colors resize-none" placeholder="Que jogo incrível!" />
            <div className="text-right mt-1"><span className="font-pixel text-[8px] text-muted-foreground">{message.length}/{MAX_GUESTBOOK_LENGTH}</span></div>
          </div>
          <button type="submit" disabled={submitting} onMouseEnter={() => play('hover')} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-neon-gold pixel-border-gold hover:bg-neon-gold/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? (
              <><Loader2 className="h-4 w-4 text-neon-gold animate-spin" /><span className="font-pixel text-[10px] text-neon-gold">ENVIANDO...</span></>
            ) : (
              <><Send className="h-4 w-4 text-neon-gold" /><span className="font-pixel text-[10px] text-neon-gold">ASSINAR</span></>
            )}
          </button>
        </div>
      </motion.form>

      {loading ? (
        <div className="text-center py-8"><p className="font-pixel text-[10px] text-muted-foreground">CARREGANDO...</p></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 arcade-card pixel-corners p-6">
          <Star className="h-8 w-8 text-neon-gold/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum recado ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="arcade-card pixel-corners p-4 flex items-start gap-3">
              <div className="flex items-center justify-center h-9 w-9 shrink-0 border-2 border-neon-gold/50 rounded-sm"><Star className="h-4 w-4 text-neon-gold" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-pixel text-[10px] text-neon-cyan">{entry.visitor_name}</span>
                  <span className="text-[10px] text-muted-foreground/60">{new Date(entry.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-foreground break-words">{entry.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
