'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/LanguageContext'

/* Heart-petal mandala decorator */
function HeartMandala({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      {[0,45,90,135,180,225,270,315].map((a) => (
        <ellipse key={a} cx="100" cy="58" rx="14" ry="40"
          fill="currentColor" opacity="0.1"
          transform={`rotate(${a} 100 100)`} />
      ))}
      {[0,60,120,180,240,300].map((a) => (
        <ellipse key={a} cx="100" cy="72" rx="9" ry="26"
          fill="currentColor" opacity="0.16"
          transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.8" opacity="0.18"/>
      <circle cx="100" cy="100" r="32" stroke="currentColor" strokeWidth="1"   opacity="0.22"/>
      <text x="100" y="107" textAnchor="middle" fontSize="16" fill="currentColor" opacity="0.45">♥</text>
    </svg>
  )
}

const FEATURES = [
  { icon: '🪐', grad: 'from-violet-400 to-purple-600',  titleKey: 'home.feature.kundali.title', descKey: 'home.feature.kundali.desc' },
  { icon: '🔍', grad: 'from-sky-400 to-blue-600',       titleKey: 'home.feature.search.title',  descKey: 'home.feature.search.desc'  },
  { icon: '💗', grad: 'from-pink-400 to-rose-600',      titleKey: 'home.feature.star.title',    descKey: 'home.feature.star.desc'    },
  { icon: '📄', grad: 'from-emerald-400 to-teal-600',   titleKey: 'home.feature.pdf.title',     descKey: 'home.feature.pdf.desc'     },
  { icon: '🔒', grad: 'from-pink-500 to-fuchsia-600',   titleKey: 'home.feature.consent.title', descKey: 'home.feature.consent.desc' },
  { icon: '📸', grad: 'from-rose-400 to-pink-600',      titleKey: 'home.feature.photo.title',   descKey: 'home.feature.photo.desc'   },
]

const STATS = [
  { labelKey: 'home.stats.communities', value: '50+',    icon: '🏡' },
  { labelKey: 'home.stats.matched',     value: '1,200+', icon: '💕' },
  { labelKey: 'home.stats.weddings',    value: '340+',   icon: '💗' },
]

const HOW_STEPS = [
  { step: '1', titleKey: 'home.how.step1.title', descKey: 'home.how.step1.desc', icon: '📝' },
  { step: '2', titleKey: 'home.how.step2.title', descKey: 'home.how.step2.desc', icon: '✅' },
  { step: '3', titleKey: 'home.how.step3.title', descKey: 'home.how.step3.desc', icon: '💑' },
]

/* Floating hearts & particles for hero */
const PARTICLES = [
  { top:'14%', left:'7%',   content:'♥', size:16, color:'text-pink-300',   dur:'5s',   delay:'0s'   },
  { top:'22%', left:'87%',  content:'♥', size:12, color:'text-rose-300',   dur:'7s',   delay:'1s'   },
  { top:'68%', left:'5%',   content:'♥', size:10, color:'text-pink-200',   dur:'6s',   delay:'2s'   },
  { top:'78%', left:'84%',  content:'♥', size:14, color:'text-rose-200',   dur:'8s',   delay:'0.5s' },
  { top:'42%', left:'3%',   content:'💗', size:18, color:'',               dur:'5.5s', delay:'1.5s' },
  { top:'55%', left:'91%',  content:'💗', size:16, color:'',               dur:'7s',   delay:'2.5s' },
  { top:'10%', left:'50%',  content:'♥', size:11, color:'text-pink-300',   dur:'6s',   delay:'0.8s' },
  { top:'86%', left:'42%',  content:'♥', size:10, color:'text-rose-300',   dur:'9s',   delay:'1.2s' },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden text-white"
        style={{ background: 'linear-gradient(145deg, #500724 0%, #831843 30%, #9D174D 60%, #BE185D 100%)' }}>

        {/* Spinning rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="absolute w-[700px] h-[700px] rounded-full border border-white/[0.06] animate-spin-slow" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-white/[0.05] animate-spin-rev" />
          <div className="absolute w-[320px] h-[320px] rounded-full border border-white/[0.07]" />
          <HeartMandala className="absolute w-[460px] h-[460px] text-pink-300 animate-spin-slow opacity-30" />
          <HeartMandala className="absolute w-[260px] h-[260px] text-rose-200 animate-spin-rev opacity-20" />
        </div>

        {/* Floating heart particles */}
        {PARTICLES.map((p, i) => (
          <span key={i} className={`particle ${p.color} select-none`}
            style={{
              top: p.top, left: p.left, fontSize: p.size,
              '--dur': p.dur, '--delay': p.delay,
              lineHeight: 1, opacity: 0.6,
            } as React.CSSProperties}>
            {p.content}
          </span>
        ))}

        {/* Soft glow orb */}
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F9A8D4, transparent)' }} />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-fade-up">
          {/* Brand icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto animate-float"
            style={{ background: 'rgba(249,168,212,0.2)', boxShadow: '0 0 40px rgba(249,168,212,0.35), 0 0 80px rgba(249,168,212,0.15)' }}>
            <span className="text-4xl animate-heartbeat">💗</span>
          </div>

          <h1 className="display-title text-5xl md:text-7xl text-white mb-5 drop-shadow-lg">
            {t('home.hero.title')}
          </h1>
          <p className="text-base md:text-lg text-pink-100 mb-3 max-w-2xl mx-auto leading-relaxed opacity-90">
            {t('home.hero.subtitle')}
          </p>
          <p className="text-sm font-medium text-pink-300 mb-10 tracking-wide">
            {t('home.hero.communities')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/profiles/new"
              className="btn btn-rose btn-lg shadow-2xl">
              💗 {t('home.hero.registerProfile')}
            </Link>
            <Link href="/profiles"
              className="btn btn-lg text-white border-2 border-white/30 hover:bg-white/10 focus:ring-white/40 transition-all">
              {t('home.hero.browseProfiles')}
            </Link>
            <Link href="/match"
              className="btn btn-lg focus:ring-pink-300 text-pink-900 font-bold"
              style={{ background: 'linear-gradient(135deg, #FBCFE8, #F9A8D4)' }}>
              🪐 {t('home.hero.kundaliMatch')}
            </Link>
          </div>

          {/* Floating mini profile previews */}
          <div className="mt-14 flex justify-center gap-4 flex-wrap">
            {[
              { name: 'Priya S.',    age: 26, star: 'Rohini',    emoji: '👩', grad: 'from-rose-400 to-pink-500' },
              { name: 'Arjun R.',   age: 28, star: 'Punarvasu', emoji: '👨', grad: 'from-blue-400 to-indigo-500' },
              { name: 'Kavitha I.', age: 25, star: 'Ashwini',   emoji: '👩', grad: 'from-purple-400 to-violet-500' },
            ].map((p) => (
              <div key={p.name} className="glass-card py-3 px-4 flex items-center gap-3 animate-float-delay"
                style={{ minWidth: 160 }}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.grad} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                  {p.emoji}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 font-serif">{p.name}, {p.age}</p>
                  <p className="text-xs text-pink-600">♥ {p.star}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20Z" fill="#FDF2F8"/>
          </svg>
        </div>
      </section>

      {/* ─── STATS BAND ─────────────────────────────────── */}
      <section className="py-12 px-4"
        style={{ background: 'linear-gradient(135deg, #500724, #831843)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {STATS.map((s) => (
            <div key={s.labelKey} className="group">
              <p className="text-lg mb-1 group-hover:animate-heartbeat">{s.icon}</p>
              <p className="text-3xl md:text-5xl font-bold font-serif text-pink-200 group-hover:scale-110 transition-transform duration-200">
                {s.value}
              </p>
              <p className="text-xs md:text-sm text-pink-300 mt-1 font-medium">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-500 mb-2">♥ Platform Highlights ♥</p>
          <h2 className="section-title text-4xl md:text-5xl">{t('home.features.title')}</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('home.features.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.titleKey} className="card-hover group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Decorative divider */}
      <div className="text-center py-2 text-pink-300 text-lg tracking-[0.5em] select-none">
        ♥ ♥ ♥
      </div>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FDF2F8 0%, #FFF5F8 100%)' }}>
        <HeartMandala className="absolute right-0 top-0 w-96 text-pink-300 opacity-25 translate-x-1/3 -translate-y-1/4 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-500 mb-2">Simple Process</p>
            <h2 className="section-title text-4xl md:text-5xl">{t('home.how.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-0.5"
              style={{ background: 'linear-gradient(to right, #FBCFE8, #F9A8D4, #FBCFE8)' }} />

            {HOW_STEPS.map((item, idx) => (
              <div key={item.step} className="text-center group animate-fade-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-200"
                    style={{ background: 'linear-gradient(135deg, #DB2777, #BE185D)' }}>
                    {item.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-800 shadow">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #9D174D 0%, #BE185D 50%, #831843 100%)' }}>
        <HeartMandala className="absolute left-0 top-1/2 -translate-y-1/2 w-80 text-pink-300 opacity-20 -translate-x-1/3 pointer-events-none" />
        <HeartMandala className="absolute right-0 top-1/2 -translate-y-1/2 w-80 text-rose-200 opacity-15 translate-x-1/3 pointer-events-none animate-spin-slow" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-4xl mb-4 animate-heartbeat">💗</div>
          <h2 className="display-title text-4xl md:text-5xl text-white mb-4">{t('home.cta.title')}</h2>
          <p className="text-pink-200 mb-10 text-base">{t('home.cta.subtitle')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/profiles/new" className="btn btn-rose btn-lg shadow-2xl">
              💗 {t('home.cta.register')}
            </Link>
            <Link href="/match"
              className="btn btn-lg text-pink-900 font-bold focus:ring-pink-300"
              style={{ background: 'linear-gradient(135deg, #FBCFE8, #F9A8D4)' }}>
              🪐 {t('home.cta.tryKundali')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
