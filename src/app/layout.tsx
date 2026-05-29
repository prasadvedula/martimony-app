import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Matrimony — Hindu Matrimonial',
  description: 'A trusted matrimonial platform for Indian Hindu communities, with Kundali matching, caste-based search, and star compatibility.',
  keywords: 'Hindu matrimonial, Kundali matching, nakshatra match, Indian wedding, Brahmin matrimony',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>

          {/* Footer */}
          <footer className="relative overflow-hidden text-pink-100 mt-16"
            style={{ background: 'linear-gradient(135deg, #500724 0%, #831843 45%, #9D174D 100%)' }}>
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-pink-600/15 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-pink-600/10 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl animate-heartbeat">💗</span>
                    <span className="font-serif text-xl font-bold text-white">Matrimony</span>
                  </div>
                  <p className="text-sm text-pink-200 leading-relaxed">
                    A sacred space for Indian Hindu families to find life partners with dignity, tradition, and Vedic wisdom.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-3">Quick Links</p>
                  <ul className="space-y-1.5 text-sm text-pink-200">
                    <li><a href="/profiles" className="hover:text-white transition-colors">Browse Profiles</a></li>
                    <li><a href="/match"    className="hover:text-white transition-colors">Kundali Match</a></li>
                    <li><a href="/profiles/new" className="hover:text-white transition-colors">Register Profile</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-3">Vedic Astrology</p>
                  <p className="text-sm text-pink-200 leading-relaxed">
                    Ashtakoot (36-point) matching · Nakshatra · Rashi · Mangal Dosha · Gana · Nadi Koota
                  </p>
                </div>
              </div>
              <div className="border-t border-pink-700/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-pink-400">
                <p>© {new Date().getFullYear()} Matrimony. All profiles verified with family consent.</p>
                <p>Star compatibility based on Vedic Ashtakoot system. 💗</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
