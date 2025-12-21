import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-cursive',
  weight: ['400', '500', '600', '700'],
});
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminPanelWrapper } from '@/components/admin/AdminPanelWrapper';
import { SearchShortcutHint } from '@/components/features/SearchShortcutHint';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DPC Recommends',
  description: 'Discover handpicked resources curated by DPC — your go-to collection for learning, building, and growing. Tools, articles, and inspiration all in one place.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'DPC Recommends',
    description: 'Discover handpicked resources — your go-to collection for learning, building, and growing. Tools, articles, and inspiration all in one place.',
    url: 'https://dpc-recommends.vercel.app',
    siteName: 'DPC Recommends',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DPC Recommends - Curated Resources',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPC Recommends',
    description: 'Discover handpicked resources — your go-to collection for learning, building, and growing.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} ${dancingScript.variable}`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
                {children}
              </div>
            </main>
            <Footer />
            <AdminPanelWrapper />
            <SearchShortcutHint />
          </div>
        </Providers>
      </body>
    </html>
  );
}

