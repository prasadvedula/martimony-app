'use client'

import { useState } from 'react'
import { KundaliChart, PlanetaryRow } from './KundaliChart'
import { buildChartData, getSignLabel, type ChartLanguage, type RealPlanets } from '@/lib/kundali/chart'
import { useTranslation } from '@/lib/i18n/LanguageContext'

interface Props {
  name: string
  dateOfBirth: string
  nakshatra: string
  rashi?: string | null
  realPlanets?: RealPlanets   // exact positions from VedAstro API
}

const SIGN_NAMES_EN = ['','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

export function ProfileBirthChart({ name, dateOfBirth, nakshatra, rashi, realPlanets }: Props) {
  const { t, lang } = useTranslation()
  const chartLang   = lang as ChartLanguage
  const [birthHour, setBirthHour] = useState('')
  const [showFull,  setShowFull]  = useState(false)

  const chartData = buildChartData({
    name,
    dateOfBirth:  new Date(dateOfBirth),
    nakshatra,
    rashi:        rashi ?? undefined,
    birthHour:    !realPlanets && birthHour ? parseInt(birthHour) : undefined,
    realPlanets,
  })

  const hasReal    = !!realPlanets
  const moonLabel  = getSignLabel(chartData.moonSign,  chartLang)
  const sunLabel   = getSignLabel(chartData.sunSign,   chartLang)
  const lagnaLabel = chartData.lagnaSign ? getSignLabel(chartData.lagnaSign, chartLang) : null

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-base">🪐</span>
          {t('chart.birthChart')}
          {hasReal && (
            <span className="text-[10px] font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">
              ✓ Vedic (Swiss Ephemeris)
            </span>
          )}
        </h2>
        <button onClick={() => setShowFull(v => !v)} className="btn btn-secondary btn-sm">
          {showFull ? t('chart.hideChart') : t('chart.showChart')}
        </button>
      </div>

      {/* Birth time for Lagna — only shown when real data is absent */}
      {!hasReal && (
        <div className="flex flex-wrap items-center gap-3 bg-pink-50 rounded-xl p-3">
          <span className="text-sm text-gray-600 flex-shrink-0">🕐 {t('chart.addBirthTime')}:</span>
          <select className="select flex-1 max-w-[200px]" value={birthHour}
            onChange={e => setBirthHour(e.target.value)}>
            <option value="">{t('chart.unknown')}</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={String(i)}>
                {String(i).padStart(2,'0')}:00 {i < 12 ? 'AM' : 'PM'}
              </option>
            ))}
          </select>
          {lagnaLabel && (
            <span className="badge badge-pink text-xs">
              {t('chart.lagna')}: {lagnaLabel}
            </span>
          )}
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            ⚠ Positions are approximate
          </span>
        </div>
      )}

      {/* Lagna chip when real data provides it */}
      {hasReal && lagnaLabel && (
        <div className="flex items-center gap-2">
          <span className="badge badge-pink text-xs">{t('chart.lagna')}: {lagnaLabel}</span>
        </div>
      )}

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-center min-w-[100px]">
          <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400 mb-0.5">{t('chart.moonSign')}</p>
          <p className="font-serif font-bold text-blue-700 text-sm">{nakshatra}</p>
          <p className="text-[10px] text-blue-500">{moonLabel}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center min-w-[100px]">
          <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">{t('chart.sunSign')}</p>
          <p className="font-serif font-bold text-amber-700 text-sm">{sunLabel}</p>
          <p className="text-[10px] text-amber-400">{SIGN_NAMES_EN[chartData.sunSign]}</p>
        </div>
        {lagnaLabel && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl px-3 py-2 text-center min-w-[100px]">
            <p className="text-[9px] font-bold uppercase tracking-wider text-pink-400 mb-0.5">{t('chart.lagna')}</p>
            <p className="font-serif font-bold text-pink-700 text-sm">{lagnaLabel}</p>
          </div>
        )}
        {hasReal && realPlanets?.mars && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center min-w-[100px]">
            <p className="text-[9px] font-bold uppercase tracking-wider text-red-400 mb-0.5">Mars (Kuja)</p>
            <p className="font-serif font-bold text-red-700 text-sm">
              {realPlanets.mars.split('(')[0].trim()}
            </p>
          </div>
        )}
      </div>

      {/* Planetary grid */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          {t('chart.planetary')}
        </p>
        <PlanetaryRow data={chartData} />
      </div>

      {/* Full chart — collapsible */}
      {showFull && (
        <div className="animate-fade-up">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t('chart.southIndian')}
          </p>
          <KundaliChart data={chartData} />
        </div>
      )}
    </div>
  )
}
