'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/LanguageContext'

function AuthPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 text-white overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #500724 0%, #831843 40%, #9D174D 100%)' }}>
      {/* Mandala rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full border border-white/[0.06] animate-spin-slow" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-white/[0.07] animate-spin-rev" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-white/[0.09]" />
        <svg viewBox="0 0 200 200" fill="none" className="absolute w-64 text-pink-300 opacity-25 animate-spin-slow">
          {[0,45,90,135,180,225,270,315].map((a) => (
            <ellipse key={a} cx="100" cy="58" rx="16" ry="42" fill="currentColor" opacity="0.15" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
          <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="text-2xl">🪔</span>
        <span className="font-serif text-xl font-bold">Matrimony</span>
      </div>

      {/* Quote */}
      <div className="relative z-10 space-y-4">
        <div className="text-6xl opacity-20 font-serif leading-none">&ldquo;</div>
        <blockquote className="font-serif text-xl italic leading-relaxed text-pink-100">
          Marriage is not just a union of two souls, but the sacred joining of two families, blessed by the stars.
        </blockquote>
        <p className="text-sm text-pink-300">— Ancient Vedic Wisdom</p>
      </div>

      {/* Community badges */}
      <div className="relative z-10 flex flex-wrap gap-2">
        {['Brahmin','Kshatriya','Vaishya','Shudra','All Communities'].map((c) => (
          <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-pink-200 border border-white/15">{c}</span>
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError(t('login.error'))
    } else {
      router.push('/profiles'); router.refresh()
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <AuthPanel />

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--cream)]">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🪔</span>
          </div>

          <div className="mb-8">
            <h1 className="display-title text-4xl text-gray-900 mb-2">{t('login.title')}</h1>
            <p className="text-gray-500 text-sm">{t('login.subtitle')}</p>
          </div>

          <div className="card shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">{t('login.email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">{t('login.password')}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input" placeholder="••••••••" required />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('login.loading')}</>
                  : t('login.submit')
                }
              </button>
            </form>

            <div className="divider" />
            <p className="text-center text-sm text-gray-500">
              {t('login.noAccount')}{' '}
              <Link href="/register" className="text-pink-600 hover:text-pink-700 font-semibold hover:underline">
                {t('login.registerLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
