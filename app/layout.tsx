import './globals.css';
import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://devpeu.netlify.app'),
  title: 'DevPeu | Pedro Henrique — Desenvolvedor Web',
  description:
    'Desenvolvedor web com +2 anos de experiência, criando sites modernos, responsivos e focados em resultados reais para empresas, marcas e profissionais. Recife, PE — Brasil.',
  keywords: [
    'desenvolvedor web',
    'DevPeu',
    'Pedro Henrique',
    'sites profissionais',
    'landing pages',
    'e-commerce',
    'Recife',
    'portfólio',
  ],
  authors: [{ name: 'Pedro Henrique (DevPeu)' }],
  openGraph: {
    title: 'DevPeu | Pedro Henrique — Desenvolvedor Web',
    description:
      'Desenvolvedor web com +2 anos de experiência, criando sites modernos, responsivos e focados em resultados reais.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DevPeu Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPeu | Pedro Henrique — Desenvolvedor Web',
    description:
      'Desenvolvedor web com +2 anos de experiência, criando sites modernos, responsivos e focados em resultados reais.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${pressStart.variable}`}>
      <body className="font-sans scanlines">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(222 40% 10%)',
              border: '2px solid hsl(187 85% 53%)',
              color: 'hsl(210 40% 96%)',
              fontFamily: 'var(--font-inter), sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
