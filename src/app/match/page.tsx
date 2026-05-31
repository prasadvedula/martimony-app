'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MatchResult } from '@/components/MatchResult'
import { KundaliChart, PlanetaryRow, findSharedSigns } from '@/components/KundaliChart'
import { NAKSHATRA_NAMES } from '@/lib/kundali'
import { buildChartData, getSignInfo, type ChartData } from '@/lib/kundali/chart'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { AshtakootResult } from '@/lib/kundali'
import { matchApi, profilesApi } from '@/lib/api'

type MatchMode = 'BY_NAKSHATRA' | 'BY_PROFILE'

interface ProfileOption { id: string; name: string; nakshatra: string; dateOfBirth?: string; rashi?: string }

/* ── Small section heading ─────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-pink-100" />
      <h2 className="font-serif text-lg font-bold text-gray-700 whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px bg-pink-100" />
    </div>
  )
}

export default function MatchPage() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [mode, setMode]       = useState<MatchMode>('BY_NAKSHATRA')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<AshtakootResult | null>(null)
  const [error, setError]     = useState('')

  // By-nakshatra inputs
  const [groomStar,    setGroomStar]    = useState('')
  const [brideStar,    setBrideStar]    = useState('')
  const [groomMangal,  setGroomMangal]  = useState<string>('')
  const [brideMangal,  setBrideMangal]  = useState<string>('')
  const [groomDob,     setGroomDob]     = useState('')
  const [brideDob,     setBrideDob]     = useState('')
  const [groomHour,    setGroomHour]    = useState('')
  const [brideHour,    setBrideHour]    = useState('')
  const [groomName,    setGroomName]    = useState('Groom')
  const [brideName,    setBrideName]    = useState('Bride')

  // By-profile inputs
  const [groomId,      setGroomId]      = useState(searchParams.get('groomId') ?? '')
  const [brideId,      setBrideId]      = useState(searchParams.get('brideId') ?? '')
  const [groomSearch,  setGroomSearch]  = useState('')
  const [brideSearch,  setBrideSearch]  = useState('')
  const [groomOptions, setGroomOptions] = useState<ProfileOption[]>([])
  const [brideOptions, setBrideOptions] = useState<ProfileOption[]>([])
  const [groomProfile, setGroomProfile] = useState<ProfileOption | null>(null)
  const [brideProfile, setBrideProfile] = useState<ProfileOption | null>(null)

  // Chart data
  const [groomChart,   setGroomChart]   = useState<ChartData | null>(null)
  const [brideChart,   setBrideChart]   = useState<ChartData | null>(null)
  const [showCharts,   setShowCharts]   = useState(false)

  useEffect(() => {
    if (searchParams.get('groomId') || searchParams.get('brideId')) setMode('BY_PROFILE')
  }, [searchParams])

  // ── Build charts when inputs are ready ─────────────────────────
  useEffect(() => {
    if (mode === 'BY_NAKSHATRA' && groomStar && groomDob) {
      setGroomChart(buildChartData({
        name: groomName || 'Groom', dateOfBirth: new Date(groomDob),
        nakshatra: groomStar, birthHour: groomHour ? parseInt(groomHour) : undefined,
      }))
    }
    if (mode === 'BY_NAKSHATRA' && brideStar && brideDob) {
      setBrideChart(buildChartData({
        name: brideName || 'Bride', dateOfBirth: new Date(brideDob),
        nakshatra: brideStar, birthHour: brideHour ? parseInt(brideHour) : undefined,
      }))
    }
  }, [groomStar, brideStar, groomDob, brideDob, groomHour, brideHour, groomName, brideName, mode])

  useEffect(() => {
    if (groomProfile?.dateOfBirth && groomProfile.nakshatra) {
      setGroomChart(buildChartData({
        name: groomProfile.name, dateOfBirth: groomProfile.dateOfBirth,
        nakshatra: groomProfile.nakshatra, rashi: groomProfile.rashi,
      }))
    }
    if (brideProfile?.dateOfBirth && brideProfile.nakshatra) {
      setBrideChart(buildChartData({
        name: brideProfile.name, dateOfBirth: brideProfile.dateOfBirth,
        nakshatra: brideProfile.nakshatra, rashi: brideProfile.rashi,
      }))
    }
  }, [groomProfile, brideProfile])

  // ── Profile search ──────────────────────────────────────────────
  async function searchProfiles(gender: string, query: string, setter: typeof setGroomOptions) {
    if (query.length < 2) { setter([]); return }
    const data = await profilesApi.list({ gender, limit: 20 })
    if (data.success) {
      setter(data.data.filter((p: ProfileOption) =>
        p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5))
    }
  }

  // ── Ashtakoot calculation ───────────────────────────────────────
  async function calculate() {
    setLoading(true); setError(''); setResult(null)
    const body = mode === 'BY_NAKSHATRA'
      ? { groomNakshatra: groomStar, brideNakshatra: brideStar,
          groomMangal: groomMangal === '' ? null : groomMangal === 'true',
          brideMangal: brideMangal === '' ? null : brideMangal === 'true' }
      : { groomProfileId: groomId, brideProfileId: brideId }
    try {
      const data = await matchApi.calculate(body)
      if (!data.success) setError(data.error ?? t('common.error'))
      else { setResult(data.data as AshtakootResult); setShowCharts(true) }
    } catch { setError(t('match.networkError')) }
    setLoading(false)
  }

  const canCalculate = mode === 'BY_NAKSHATRA'
    ? Boolean(groomStar && brideStar)
    : Boolean(groomId && brideId)

  const sharedSigns = groomChart && brideChart ? findSharedSigns(groomChart, brideChart) : []

  // ── Person input panel ──────────────────────────────────────────
  function PersonPanel({ side }: { side: 'groom' | 'bride' }) {
    const isBride   = side === 'bride'
    const grad      = isBride ? 'from-rose-500 to-pink-600' : 'from-blue-500 to-indigo-600'
    const label     = isBride ? t('match.bride') : t('match.groom')
    const name      = isBride ? brideName     : groomName
    const setName   = isBride ? setBrideName  : setGroomName
    const star      = isBride ? brideStar     : groomStar
    const setStar   = isBride ? setBrideStar  : setGroomStar
    const mangal    = isBride ? brideMangal   : groomMangal
    const setM      = isBride ? setBrideMangal: setGroomMangal
    const dob       = isBride ? brideDob      : groomDob
    const setDob    = isBride ? setBrideDob   : setGroomDob
    const hour      = isBride ? brideHour     : groomHour
    const setHour   = isBride ? setBrideHour  : setGroomHour

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-base shadow`}>
            {isBride ? '👩' : '👨'}
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">{label}</h3>
        </div>
        <div>
          <label className="label">Name</label>
          <input type="text" className="input" placeholder={label}
            value={name} onChange={e => isBride ? setBrideName(e.target.value) : setGroomName(e.target.value)} />
        </div>
        <div>
          <label className="label">{t('match.nakshatra')}</label>
          <select className="select" value={star} onChange={e => setStar(e.target.value)}>
            <option value="">{t('match.selectNakshatra')}</option>
            {NAKSHATRA_NAMES.map(n => <option key={n} value={n}>✦ {n}</option>)}
          </select>
        </div>
        <div>
          <label className="label">{t('match.mangalDosha')}</label>
          <select className="select" value={mangal} onChange={e => setM(e.target.value)}>
            <option value="">{t('match.unknown')}</option>
            <option value="false">✓ {t('match.nonManglik')}</option>
            <option value="true">⚠ {t('match.manglik')}</option>
          </select>
        </div>
        <div>
          <label className="label">Date of Birth <span className="text-pink-400">(for Kundali chart)</span></label>
          <input type="date" className="input" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <div>
          <label className="label">Birth Time (hour) <span className="text-pink-400">optional</span></label>
          <select className="select" value={hour} onChange={e => setHour(e.target.value)}>
            <option value="">Unknown</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={String(i)}>
                {String(i).padStart(2,'0')}:00 — {i < 12 ? 'AM' : 'PM'} {i === 0 ? '(Midnight)' : i === 12 ? '(Noon)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-pink-500 mb-1">Vedic Astrology</p>
        <h1 className="section-title text-4xl md:text-5xl">{t('match.title')} 💗</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">{t('match.subtitle')}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-0 mb-6 p-1 bg-gray-100 rounded-2xl max-w-md mx-auto">
        {(['BY_NAKSHATRA', 'BY_PROFILE'] as MatchMode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === m ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={mode === m ? { background: 'linear-gradient(135deg,#DB2777,#BE185D)' } : {}}>
            {m === 'BY_NAKSHATRA' ? `⭐ ${t('match.byNakshatra')}` : `👤 ${t('match.byProfile')}`}
          </button>
        ))}
      </div>

      <div className="card mb-6 shadow-lg">
        {mode === 'BY_NAKSHATRA' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonPanel side="groom" />
            <div className="hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-20 bg-pink-100" />
                <span className="text-pink-300 text-xl">💗</span>
                <div className="w-px h-20 bg-pink-100" />
              </div>
            </div>
            <PersonPanel side="bride" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { side:'groom', id:groomId, setId:setGroomId, search:groomSearch, setSearch:setGroomSearch,
                options:groomOptions, setOptions:setGroomOptions, profile:groomProfile, setProfile:setGroomProfile },
              { side:'bride', id:brideId, setId:setBrideId, search:brideSearch, setSearch:setBrideSearch,
                options:brideOptions, setOptions:setBrideOptions, profile:brideProfile, setProfile:setBrideProfile },
            ].map(({ side, id, setId, search, setSearch, options, setOptions, profile, setProfile }) => {
              const isBride = side === 'bride'
              const grad = isBride ? 'from-rose-500 to-pink-600' : 'from-blue-500 to-indigo-600'
              const gender = isBride ? 'FEMALE' : 'MALE'
              const label = isBride ? t('match.brideProfile') : t('match.groomProfile')
              return (
                <div key={side} className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow`}>
                      {isBride ? '👩' : '👨'}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">{label}</h3>
                  </div>
                  <input className="input" placeholder={isBride ? t('match.searchBride') : t('match.searchGroom')}
                    value={search}
                    onChange={e => { setSearch(e.target.value); searchProfiles(gender, e.target.value, setOptions) }} />
                  {options.length > 0 && (
                    <div className="border border-pink-100 rounded-xl overflow-hidden shadow-lg bg-white">
                      {options.map(p => (
                        <button key={p.id} type="button"
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0"
                          onClick={() => { setId(p.id); setSearch(p.name); setOptions([]); setProfile(p) }}>
                          <span className="font-medium text-gray-900">{p.name}</span>
                          <span className="text-xs text-pink-600 font-medium">♥ {p.nakshatra}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {id && search && <p className="text-xs text-emerald-600 font-medium">{t('match.selected', { name: search })}</p>}
                  {profile && (
                    <div className="bg-pink-50 rounded-xl p-3 text-xs text-gray-600 space-y-0.5">
                      <p><span className="font-semibold text-pink-600">✦ Nakshatra:</span> {profile.nakshatra}</p>
                      {profile.dateOfBirth && <p><span className="font-semibold">📅 DOB:</span> {new Date(profile.dateOfBirth).toLocaleDateString('en-IN')}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-pink-50">
          <button onClick={calculate} disabled={!canCalculate || loading}
            className="btn btn-primary w-full py-3.5 text-base shadow-xl">
            {loading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('match.calculating')}</>
              : `💗 ${t('match.calculate')}`
            }
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Kundali Charts ─────────────────────────────────────── */}
      {(groomChart || brideChart) && showCharts && (
        <div className="space-y-6 mb-8 animate-fade-up">
          <SectionHeading>💗 {t('chart.chartsSection')}</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groomChart && (
              <div className="card shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow">👨</div>
                  <h3 className="font-serif font-bold text-gray-800">{groomChart.name} — {t('chart.birthChart')}</h3>
                </div>
                <KundaliChart data={groomChart} highlightSigns={sharedSigns} />
              </div>
            )}
            {brideChart && (
              <div className="card shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs shadow">👩</div>
                  <h3 className="font-serif font-bold text-gray-800">{brideChart.name} — {t('chart.birthChart')}</h3>
                </div>
                <KundaliChart data={brideChart} highlightSigns={sharedSigns} />
              </div>
            )}
          </div>

          {/* Shared sign note */}
          {sharedSigns.length > 0 && (
            <div className="glass-card text-center">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-pink-600">💗 {t('chart.sharedSigns', { n: sharedSigns.length })}</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from(new Set(sharedSigns)).map(s => {
                  const sign = getSignInfo(s)
                  return (
                    <span key={s} className="badge badge-pink text-xs">
                      {sign.symbol} {sign.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Side-by-side planetary comparison */}
          {groomChart && brideChart && (
            <div className="card">
              <SectionHeading>🪐 {t('chart.comparison')}</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">👨 {groomChart.name}</p>
                  <PlanetaryRow data={groomChart} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">👩 {brideChart.name}</p>
                  <PlanetaryRow data={brideChart} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Ashtakoot Result ───────────────────────────────────── */}
      {result && (
        <div className="space-y-2">
          <SectionHeading>🌙 {t('chart.ashtakoot')}</SectionHeading>
          <MatchResult result={result} />
        </div>
      )}
    </div>
  )
}
