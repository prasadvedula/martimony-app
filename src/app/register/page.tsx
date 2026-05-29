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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[480px] h-[480px] rounded-full border border-white/[0.06] animate-spin-slow" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-white/[0.08] animate-spin-rev" />
        <svg viewBox="0 0 200 200" fill="none" className="absolute w-72 text-pink-300 opacity-20 animate-spin-rev">
          {[0,60,120,180,240,300].map((a) => (
            <ellipse key={a} cx="100" cy="65" rx="14" ry="35" fill="currentColor" opacity="0.2" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.6" opacity="0.25"/>
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <circle cx="100" cy="100" r="6" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <span className="text-2xl">🪔</span>
        <span className="font-serif text-xl font-bold">Matrimony</span>
      </div>

      <div className="relative z-10 space-y-6">
        <h2 className="font-serif text-3xl font-bold text-white leading-tight">
          Begin Your<br />Sacred Journey
        </h2>
        <div className="space-y-3">
          {[
            { icon: '🌟', text: 'Vedic Kundali matching with 36-point Ashtakoot system' },
            { icon: '🔒', text: 'Privacy-first — profiles activate only with family consent' },
            { icon: '🎯', text: 'Smart filters by nakshatra, gotram, and caste' },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-sm">
                {item.icon}
              </div>
              <p className="text-sm text-pink-200 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs text-pink-300">
          <span>✓</span>
          <span>Join 50+ communities · 1,200+ profiles matched · 340+ weddings</span>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError(t('register.passwordMismatch')); return }
    setLoading(true); setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.error ?? t('register.failed')); setLoading(false); return
    }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/profiles/new')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <AuthPanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--cream)]">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden text-center mb-8"><span className="text-5xl">🪔</span></div>

          <div className="mb-8">
            <h1 className="display-title text-4xl text-gray-900 mb-2">{t('register.title')}</h1>
            <p className="text-gray-500 text-sm">{t('register.subtitle')}</p>
          </div>

          <div className="card shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">{t('register.fullName')}</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  className="input" placeholder="Your full name" required />
              </div>
              <div>
                <label className="label">{t('register.email')}</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  className="input" placeholder="you@example.com" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('register.password')}</label>
                  <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
                    className="input" placeholder="Min 8 chars" minLength={8} required />
                </div>
                <div>
                  <label className="label">{t('register.confirmPassword')}</label>
                  <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)}
                    className="input" placeholder="Repeat" required />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('register.loading')}</>
                  : `✨ ${t('register.submit')}`
                }
              </button>
            </form>

            <div className="divider" />
            <p className="text-center text-sm text-gray-500">
              {t('register.hasAccount')}{' '}
              <Link href="/login" className="text-pink-600 hover:text-pink-700 font-semibold hover:underline">
                {t('register.signInLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
