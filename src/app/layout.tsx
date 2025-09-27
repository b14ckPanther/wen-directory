import './globals.css'
import type { Metadata } from 'next'
import { Noto_Kufi_Arabic, Ruwudu, Dancing_Script } from 'next/font/google'
import Header from '@/components/Header';
import Footer from '@/components/Footer'; 

// Configure the main website font
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
  display: 'swap',
});

// Configure the special fonts for the logo
const ruwudu = Ruwudu({ 
  subsets: ['arabic'],
  variable: '--font-ruwudu',
  weight: ['400', '700'],
});

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: '700'
});

// Updated metadata to include manifest and home screen icons
export const metadata: Metadata = {
  title: 'Wen - وين',
  description: 'دليلك لأفضل الخدمات في مجتمعك',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Make all font variables available to Tailwind CSS
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} ${ruwudu.variable} ${dancingScript.variable}`}>
      {/* Set the default body font to Noto Kufi Arabic */}
      <body className={`${notoKufi.className} bg-navy text-gray`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

