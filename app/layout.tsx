import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Providers } from '@/components/shared/Providers';
import { getSiteUrl } from '@/lib/utils/siteUrl';

const bebasNeue = localFont({
  src: './fonts/BebasNeue-Regular.ttf',
  variable: '--font-display',
});

const dmSans = localFont({
  src: [
    { path: './fonts/DMSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/DMSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/DMSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'Decided',
    template: '%s | Decided',
  },
  description: 'Decided helps you move from overthinking to action with structured decision flows across web and mobile.',
  applicationName: 'Decided',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Decided',
    description: 'Decided helps you move from overthinking to action with structured decision flows across web and mobile.',
    url: '/',
    siteName: 'Decided',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Decided decision support interface',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Decided',
    description: 'Decided helps you move from overthinking to action with structured decision flows across web and mobile.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable}`}
    >
      <body className="grain bg-bg font-body text-text-primary antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#F0EFE8',
                border: '1px solid #222220',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
