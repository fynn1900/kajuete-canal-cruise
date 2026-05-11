import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LangToggle from '@/components/LangToggle'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kajüte Daily Canal Cruise · Friedrichstadt',
  description:
    'Die etwas andere Grachten Rundfahrt. Mit Skipper Fynn täglich um 19 Uhr – 60 Minuten durch das holländische Städtchen Friedrichstadt vom Wasser aus.',
  openGraph: {
    title: 'Kajüte Daily Canal Cruise · Friedrichstadt',
    description: 'bis 30. September · Täglich 19:00 Uhr · Max. 6 Personen',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          <LangToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
