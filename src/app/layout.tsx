import type { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Saúde e Nutrição',
  description: 'Compreender a nutrição para uma vida melhor.',
};

import { MobileMenuProvider } from '@/context/MobileMenuContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${ebGaramond.variable}`}>
        <ThemeProvider>
          <MobileMenuProvider>
            {children}
          </MobileMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

