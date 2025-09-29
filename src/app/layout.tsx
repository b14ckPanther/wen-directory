// NO 'use client' directive here
import './globals.css'
import type { Metadata } from 'next'
import { Noto_Kufi_Arabic, Ruwudu, Dancing_Script } from 'next/font/google'
import MainLayout from '@/components/MainLayout'; // Import the new client layout component

// fonts setup...
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-noto-kufi', display: 'swap' });
const ruwudu = Ruwudu({ subsets: ['arabic'], variable: '--font-ruwudu', weight: ['400','700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script', weight: '700' });

// Exporting metadata is now valid because this is a Server Component
export const metadata: Metadata = {
  title: 'Wen - وين',
  description: 'دليلك لأفضل الخدمات في مجتمعك',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon-167.png', sizes: '167x167', type: 'image/png' },
      { url: '/apple-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-76.png', sizes: '76x76', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} ${ruwudu.variable} ${dancingScript.variable}`}>
      <body className={`${notoKufi.className} bg-navy text-gray`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}