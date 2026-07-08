export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  cover_image_url: string | null;
  rating: number;
  featured: boolean;
  order_index: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  created_at: string;
  read: boolean;
}

export interface GuestbookEntry {
  id: string;
  visitor_name: string;
  message: string;
  created_at: string;
}

export interface NavSection {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'cyan' | 'pink' | 'gold' | 'green';
}

export interface CharacterAttribute {
  label: string;
  value: number;
  color: 'cyan' | 'pink' | 'gold' | 'green';
}

export interface Achievement {
  title: string;
  institution: string;
  icon: string;
}

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Agência Marketing Peu',
    description: 'Site institucional para agência de marketing digital.',
    category: 'Site Institucional',
    url: 'https://agenciamarketingpeu.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Auto Store',
    description: 'Loja virtual de autopeças com sistema de gestão de produtos.',
    category: 'E-commerce',
    url: 'https://autostoree.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Oficina (v2)',
    description: 'Site institucional para oficina mecânica.',
    category: 'Site Institucional',
    url: 'https://oficina2.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Bella Vita Studio',
    description: 'Landing page para estúdio de beleza e estética.',
    category: 'Landing Page',
    url: 'https://bellavitastudio.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Oficina São Geraldo',
    description: 'Site institucional para oficina mecânica automotiva.',
    category: 'Site Institucional',
    url: 'https://oficinasaogeraldo.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Instituto Dom Silva',
    description: 'Site institucional para instituto educacional.',
    category: 'Site Institucional',
    url: 'https://institutodomsilva.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Auto Store (A Melhor)',
    description: 'E-commerce de autopeças com catálogo completo e checkout.',
    category: 'E-commerce',
    url: 'https://autostoreamelhor.netlify.app',
    cover_image_url: null,
    rating: 5,
    featured: true,
    order_index: 7,
    created_at: new Date().toISOString(),
  },
];

export const SERVICES: Service[] = [
  {
    id: 'institutional',
    title: 'Sites Institucionais',
    description: 'Sites profissionais para empresas, com design moderno e funcionalidades essenciais.',
    icon: 'Building2',
    color: 'cyan',
  },
  {
    id: 'landing',
    title: 'Landing Pages de Alta Conversão',
    description: 'Páginas otimizadas para converter visitantes em clientes e aumentar vendas.',
    icon: 'Rocket',
    color: 'pink',
  },
  {
    id: 'ecommerce',
    title: 'E-commerces e Lojas Online',
    description: 'Lojas virtuais completas com sistema de pagamento e gestão de produtos.',
    icon: 'ShoppingCart',
    color: 'gold',
  },
  {
    id: 'responsive',
    title: 'Sites 100% Responsivos',
    description: 'Garantia de perfeita visualização em todos os dispositivos e telas.',
    icon: 'Smartphone',
    color: 'green',
  },
  {
    id: 'performance',
    title: 'Otimização de Desempenho',
    description: 'Melhoria na velocidade de carregamento e performance do site.',
    icon: 'Gauge',
    color: 'cyan',
  },
  {
    id: 'seo',
    title: 'Otimização SEO',
    description: 'Configuração para melhor posicionamento nos resultados de busca.',
    icon: 'Search',
    color: 'pink',
  },
];

export const CHARACTER_ATTRIBUTES: CharacterAttribute[] = [
  { label: 'Front-end', value: 90, color: 'cyan' },
  { label: 'Back-end', value: 75, color: 'pink' },
  { label: 'Automação', value: 70, color: 'gold' },
  { label: 'Vídeo', value: 65, color: 'green' },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'Uninassau',
    icon: 'GraduationCap',
  },
  {
    title: 'Técnico em Redes de Computadores',
    institution: 'ETEGEC',
    icon: 'Network',
  },
];

export const NAV_SECTIONS: NavSection[] = [
  { id: 'inicio', label: 'Início', href: '#inicio', icon: 'Home' },
  { id: 'sobre', label: 'Sobre Mim', href: '#sobre', icon: 'User' },
  { id: 'skills', label: 'Skills', href: '#skills', icon: 'Swords' },
  { id: 'projetos', label: 'Projetos', href: '#projetos', icon: 'Gamepad2' },
  { id: 'contato', label: 'Contato', href: '#contato', icon: 'Mail' },
];
