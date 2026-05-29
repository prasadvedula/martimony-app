'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { Language } from '@/lib/i18n/translations'

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const { t, lang, setLang, languageNames } = useTranslation()
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, rgba(80,7,36,0.97) 0%, rgba(131,24,67,0.97) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(80,7,36,0.25)',
      }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-pink-300/20 flex items-center justify-center
            group-hover:bg-pink-300/30 transition-colors">
            <span className="text-lg group-hover:animate-heartbeat">💗</span>
          </div>
          <span className="font-serif text-xl font-bold text-white tracking-tight">Matrimony</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <NavLink href="/profiles">{t('nav.browse')}</NavLink>
          <NavLink href="/match">{t('nav.match')}</NavLink>
          {isAdmin && <NavLink href="/admin">{t('nav.admin')}</NavLink>}

          {session ? (
            <>
              <NavLink href="/profiles/new">{t('nav.addProfile')}</NavLink>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="ml-1 px-3 py-1.5 rounded-lg text-sm font-medium text-pink-200
                  hover:text-white hover:bg-white/10 transition-all duration-200">
                {t('nav.signOut')}
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">{t('nav.signIn')}</NavLink>
              <Link href="/register"
                className="ml-2 px-4 py-1.5 rounded-xl text-sm font-semibold text-pink-900
                  bg-pink-200 hover:bg-pink-100 transition-all duration-200 shadow-md shadow-pink-900/20">
                {t('nav.register')}
              </Link>
            </>
          )}

          {/* Language selector */}
          <select value={lang} onChange={(e) => setLang(e.target.value as Language)}
            className="ml-2 bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 cursor-pointer
              border border-white/20 hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-pink-300"
            aria-label="Language">
            {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
              <option key={code} value={code} className="bg-pink-900 text-white">{name}</option>
            ))}
          </select>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <div className="w-5 space-y-1.5">
            <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-0.5 text-sm border-t border-white/10"
          style={{ background: 'rgba(80,7,36,0.98)' }}>
          <MobileLink href="/profiles"     onClick={() => setOpen(false)}>{t('nav.browse')}</MobileLink>
          <MobileLink href="/match"        onClick={() => setOpen(false)}>{t('nav.match')}</MobileLink>
          <MobileLink href="/profiles/new" onClick={() => setOpen(false)}>{t('nav.addProfile')}</MobileLink>
          {isAdmin && <MobileLink href="/admin" onClick={() => setOpen(false)}>{t('nav.admin')}</MobileLink>}
          {session ? (
            <button onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left py-2.5 px-2 text-pink-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              {t('nav.signOut')}
            </button>
          ) : (
            <>
              <MobileLink href="/login"    onClick={() => setOpen(false)}>{t('nav.signIn')}</MobileLink>
              <MobileLink href="/register" onClick={() => setOpen(false)}>{t('nav.register')}</MobileLink>
            </>
          )}
          <div className="pt-3 pb-1 border-t border-white/10 mt-2">
            <select value={lang} onChange={(e) => { setLang(e.target.value as Language); setOpen(false) }}
              className="w-full bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/20 focus:outline-none">
              {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
                <option key={code} value={code} className="bg-pink-900">{name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-medium text-pink-100
        hover:text-white hover:bg-white/10 transition-all duration-200">
      {children}
    </Link>
  )
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick}
      className="block py-2.5 px-2 text-pink-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
      {children}
    </Link>
  )
}
