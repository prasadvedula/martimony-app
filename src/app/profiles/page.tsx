'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProfileCard } from '@/components/ProfileCard'
import { CASTES, INDIAN_STATES } from '@/types'
import { NAKSHATRA_NAMES } from '@/lib/kundali'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/LanguageContext'

interface Profile {
  id: string; name: string; gender: string; dateOfBirth: string
  caste: string; subCaste?: string; nakshatra: string; rashi?: string
  currentCity?: string; currentState?: string; photoUrl?: string
  education?: string; occupation?: string; heightCm?: number
  mangalDosha?: boolean; gotram?: string; birthPlace: string
}
interface Pagination { page: number; pages: number; total: number }

const EMPTY_FILTERS = { gender: '', ageMin: '', ageMax: '', caste: '', nakshatra: '', state: '', page: 1 }

export default function ProfilesPage() {
  const { t } = useTranslation()
  const [profiles, setProfiles]     = useState<Profile[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading]       = useState(true)
  const [filters, setFilters]       = useState(EMPTY_FILTERS)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)) })
    const res  = await fetch(`/api/profiles?${params}`)
    const data = await res.json()
    if (data.success) { setProfiles(data.data); setPagination(data.pagination) }
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  function setFilter(key: string, value: string | number) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }))
  }

  const hasActiveFilters = Object.entries(filters)
    .filter(([k]) => k !== 'page')
    .some(([, v]) => Boolean(v))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-pink-600 mb-1">Matrimonial Listings</p>
          <h1 className="section-title text-4xl">{t('profiles.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? '…' : t('profiles.count', { n: pagination.total })}
          </p>
        </div>
        <Link href="/profiles/new" className="btn btn-primary btn-lg self-start md:self-auto shadow-lg">
          ✨ {t('profiles.registerBtn')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-20 space-y-4"
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF2F8 100%)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-gray-900">
                🔍 {t('profiles.filters')}
              </h2>
              {hasActiveFilters && (
                <button onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-xs text-pink-600 hover:text-pink-700 font-semibold">
                  Reset
                </button>
              )}
            </div>

            <FilterField label={t('profiles.lookingFor')}>
              <select className="select" value={filters.gender} onChange={(e) => setFilter('gender', e.target.value)}>
                <option value="">{t('profiles.allGenders')}</option>
                <option value="MALE">👨 {t('profiles.grooms')}</option>
                <option value="FEMALE">👩 {t('profiles.brides')}</option>
              </select>
            </FilterField>

            <div className="grid grid-cols-2 gap-2">
              <FilterField label={t('profiles.ageMin')}>
                <input type="number" className="input" placeholder="18" min={18}
                  value={filters.ageMin} onChange={(e) => setFilter('ageMin', e.target.value)} />
              </FilterField>
              <FilterField label={t('profiles.ageMax')}>
                <input type="number" className="input" placeholder="50" max={70}
                  value={filters.ageMax} onChange={(e) => setFilter('ageMax', e.target.value)} />
              </FilterField>
            </div>

            <FilterField label={t('profiles.caste')}>
              <select className="select" value={filters.caste} onChange={(e) => setFilter('caste', e.target.value)}>
                <option value="">{t('profiles.allCastes')}</option>
                {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterField>

            <FilterField label={t('profiles.birthStar')}>
              <select className="select" value={filters.nakshatra} onChange={(e) => setFilter('nakshatra', e.target.value)}>
                <option value="">{t('profiles.allStars')}</option>
                {NAKSHATRA_NAMES.map((n) => <option key={n} value={n}>✦ {n}</option>)}
              </select>
            </FilterField>

            <FilterField label={t('profiles.state')}>
              <select className="select" value={filters.state} onChange={(e) => setFilter('state', e.target.value)}>
                <option value="">{t('profiles.allStates')}</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FilterField>

            <button className="btn btn-secondary w-full" onClick={() => setFilters(EMPTY_FILTERS)}>
              {t('profiles.clearFilters')}
            </button>
          </div>
        </aside>

        {/* Profile grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-pink-50">
                  <div className="h-1 skeleton" />
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-[72px] h-[72px] rounded-2xl skeleton flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 skeleton rounded-lg w-3/4" />
                        <div className="h-3 skeleton rounded w-1/2" />
                        <div className="h-4 skeleton rounded-full w-1/3" />
                      </div>
                    </div>
                    <div className="h-20 skeleton rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-24 card">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-xl text-gray-700 mb-2">{t('profiles.noResults')}</h3>
              <button className="btn btn-secondary mt-4" onClick={() => setFilters(EMPTY_FILTERS)}>
                {t('profiles.clearAll')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((p) => <ProfileCard key={p.id} profile={p} showMatchButton />)}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button disabled={filters.page <= 1}
                    className="btn btn-secondary btn-sm disabled:opacity-40"
                    onClick={() => setFilter('page', filters.page - 1)}>
                    {t('profiles.prevPage')}
                  </button>
                  <span className="text-sm text-gray-500 font-medium">
                    {t('profiles.page', { page: pagination.page, pages: pagination.pages })}
                  </span>
                  <button disabled={filters.page >= pagination.pages}
                    className="btn btn-secondary btn-sm disabled:opacity-40"
                    onClick={() => setFilter('page', filters.page + 1)}>
                    {t('profiles.nextPage')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
