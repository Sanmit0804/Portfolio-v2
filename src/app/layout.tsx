import type { Metadata } from 'next';
import { Inter, Outfit, Geist } from 'next/font/google';
import './globals.scss';
import './shadcn.css';
import { AppProvider } from '@/components/AppProvider';
import NavigationDock from '@/components/NavigationDock';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Sanmit Suthar | Creative Developer',
  description: 'Awwwards-level portfolio of Sanmit Suthar — crafting premium, interactive digital experiences.',
  keywords: 'Sanmit Suthar, Creative Developer, Frontend Engineer, Portfolio, Next.js, Framer Motion, GSAP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-black text-white antialiased`}>
        <AppProvider>
          {children}
          {/* Dock is rendered at layout level so it persists across route pages */}
          <NavigationDock />
        </AppProvider>
      </body>
    </html>
  );
}
