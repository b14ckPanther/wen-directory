import './globals.css'
import type { Metadata } from 'next'
import { Noto_Kufi_Arabic, Ruwudu, Dancing_Script } from 'next/font/google'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

// fonts setup...
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-noto-kufi', display: 'swap' });
const ruwudu = Ruwudu({ subsets: ['arabic'], variable: '--font-ruwudu', weight: ['400','700'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script', weight: '700' });

export const metadata: Metadata = {
  title: 'Wen - وين',
  description: 'دليلك لأفضل الخدمات في مجتمعك',
  manifest: '/manifest.json',
  icons: { apple: '/apple-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} ${ruwudu.variable} ${dancingScript.variable}`}>
      <body className={`${notoKufi.className} bg-navy text-gray`}>
        <main>{children}</main>
               <ChatWidget /> 
        <Footer />
      </body>
    </html>
  )
}
