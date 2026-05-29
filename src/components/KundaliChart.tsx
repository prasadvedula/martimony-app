'use client'

import {
  SIGN_GRID, PLANETS,
  getSignLabel, getPlanetAbbr, getPlanetName, getSignInfo,
  type ChartData, type PlanetPlacement, type ChartLanguage,
} from '@/lib/kundali/chart'
import { useTranslation } from '@/lib/i18n/LanguageContext'

interface Props {
  data: ChartData
  title?: string
  compact?: boolean
  highlightSigns?: number[]
}

// ── Planet badge ─────────────────────────────────────────────────
function PlanetBadge({
  p, compact, lang,
}: { p: PlanetPlacement; compact?: boolean; lang: ChartLanguage }) {
  const info    = PLANETS.find(x => x.id === p.planetId) ?? PLANETS[0]
  const abbr    = getPlanetAbbr(p.planetId, lang)
  const fullName= getPlanetName(p.planetId, lang)
  const suffix  = (p.isApprox ? '~' : '') + (p.isRetrograde ? 'ℛ' : '')

  return (
    <span
      title={`${fullName}${p.isApprox ? ' (≈)' : ''}${p.isRetrograde ? ' ℞' : ''}`}
      className={`inline-flex items-center font-bold rounded leading-none select-none
        ${compact ? 'text-[8px] px-0.5 py-0.5' : 'text-[11px] px-1 py-0.5'}`}
      style={{ background: info.bg, color: info.color }}>
      {abbr}{suffix}
    </span>
  )
}

// ── Single chart cell ─────────────────────────────────────────────
function ChartCell({
  signNum, placements, isLagna, isHighlighted, compact, lang,
}: {
  signNum: number; placements: PlanetPlacement[]
  isLagna: boolean; isHighlighted: boolean; compact?: boolean; lang: ChartLanguage
}) {
  const label     = getSignLabel(signNum, lang)
  const cellItems = placements.filter(p => p.sign === signNum && p.planetId !== 'as')

  return (
    <div className={`relative border flex flex-col transition-colors
      ${isHighlighted ? 'bg-pink-50 border-pink-300' : 'bg-white border-pink-100'}
      ${compact ? 'p-1 min-h-[68px]' : 'p-2 min-h-[90px]'}
      ${isLagna ? 'ring-2 ring-pink-400 ring-inset' : ''}`}>

      {/* Sign number (corner) */}
      <span className={`absolute top-0.5 right-1 text-pink-200 font-bold
        ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
        {signNum}
      </span>

      {/* Sign name in selected language */}
      <p className={`font-bold leading-none mb-0.5 text-pink-600
        ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
        {label}
      </p>

      {/* Lagna marker */}
      {isLagna && (
        <span className={`text-pink-600 font-bold leading-none mb-0.5
          ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
          {getPlanetAbbr('as', lang)} ▲
        </span>
      )}

      {/* Planet badges */}
      <div className="flex flex-wrap gap-0.5 mt-auto">
        {cellItems.map(p => (
          <PlanetBadge key={p.planetId} p={p} compact={compact} lang={lang} />
        ))}
      </div>
    </div>
  )
}

// ── Center info panel ─────────────────────────────────────────────
function CenterPanel({ data, lang, t, compact }: {
  data: ChartData; lang: ChartLanguage
  t: (k: string, v?: Record<string, string | number>) => string
  compact?: boolean
}) {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100
      col-span-2 row-span-2 flex flex-col items-center justify-center text-center p-2 gap-0.5">
      <div className={`text-pink-400 ${compact ? 'text-sm' : 'text-xl'}`}>💗</div>
      <p className={`font-serif font-bold text-gray-800 leading-tight
        ${compact ? 'text-[8px]' : 'text-[11px]'}`}>
        {data.name}
      </p>
      {data.dob && (
        <p className={`text-gray-400 ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
          {data.dob}
        </p>
      )}
      <div className={`flex flex-col gap-0.5 mt-1 ${compact ? 'text-[7px]' : 'text-[9px]'}`}>
        <span className="text-blue-700 font-semibold">
          {getPlanetAbbr('mo', lang)}: {getSignLabel(data.moonSign, lang)}
        </span>
        <span className="text-amber-700 font-semibold">
          {getPlanetAbbr('su', lang)}: {getSignLabel(data.sunSign, lang)}
        </span>
        {data.lagnaSign && (
          <span className="text-pink-700 font-semibold">
            {t('chart.lagna')}: {getSignLabel(data.lagnaSign, lang)}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main chart component ──────────────────────────────────────────
export function KundaliChart({ data, title, compact = false, highlightSigns = [] }: Props) {
  const { t, lang } = useTranslation()
  const chartLang   = lang as ChartLanguage
  const { placements, lagnaSign } = data

  const ROW0 = [12, 1, 2, 3]
  const ROW3 = [9, 8, 7, 6]

  const cellProps = (s: number) => ({
    signNum: s, placements, compact, lang: chartLang,
    isLagna: lagnaSign === s,
    isHighlighted: highlightSigns.includes(s),
  })

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="font-serif font-bold text-center text-gray-800 text-sm">{title}</h3>
      )}

      <div className="grid grid-cols-4 grid-rows-4 gap-px bg-pink-100 border border-pink-200 rounded-xl overflow-hidden">
        {/* Row 0 */}
        {ROW0.map(s => <ChartCell key={s} {...cellProps(s)} />)}

        {/* Row 1: Aquarius · CENTER (2×2) · Cancer */}
        <ChartCell {...cellProps(11)} />
        <CenterPanel data={data} lang={chartLang} t={t} compact={compact} />
        <ChartCell {...cellProps(4)} />

        {/* Row 2: Capricorn · [center continues] · Leo */}
        <ChartCell {...cellProps(10)} />
        {/* center occupies these two cells — no extra elements needed */}
        <ChartCell {...cellProps(5)} />

        {/* Row 3 */}
        {ROW3.map(s => <ChartCell key={s} {...cellProps(s)} />)}
      </div>

      {/* Planet legend */}
      {!compact && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
          {PLANETS
            .filter(p => placements.some(pl => pl.planetId === p.id))
            .map(p => (
              <span key={p.id} className="text-[10px] flex items-center gap-1">
                <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[8px]"
                  style={{ background: p.bg, color: p.color }}>
                  {getPlanetAbbr(p.id, chartLang)}
                </span>
                <span className="text-gray-500">
                  {getPlanetName(p.id, chartLang)}{p.isApprox ? ' ~' : ''}
                </span>
              </span>
          ))}
        </div>
      )}

      {/* Accuracy note */}
      {!compact && (
        <p className="text-[10px] text-gray-400 text-center">{t('chart.approxNote')}</p>
      )}
    </div>
  )
}

// ── Find signs shared between two charts ─────────────────────────
export function findSharedSigns(c1: ChartData, c2: ChartData): number[] {
  const s1 = new Set(c1.placements.map(p => p.sign))
  return c2.placements.map(p => p.sign).filter(s => s1.has(s))
}

// ── Planetary grid (8 main planets) ──────────────────────────────
export function PlanetaryRow({ data }: { data: ChartData }) {
  const { t, lang } = useTranslation()
  const chartLang   = lang as ChartLanguage
  const ids         = ['su','mo','ma','ju','ve','sa','ra','ke']

  return (
    <div className="grid grid-cols-4 gap-2">
      {ids.map(id => {
        const info  = PLANETS.find(p => p.id === id)!
        const p     = data.placements.find(x => x.planetId === id)
        const sign  = p ? getSignInfo(p.sign) : null
        return (
          <div key={id} className="rounded-xl border border-pink-50 p-2 text-center bg-white">
            <div className="font-bold mb-1 text-[10px]" style={{ color: info.color }}>
              {getPlanetName(id, chartLang)}
            </div>
            {sign ? (
              <>
                <div className="font-serif text-sm font-bold text-gray-800">
                  {getSignLabel(sign.num, chartLang)}
                </div>
                {p?.isApprox && (
                  <div className="text-[8px] text-gray-300">{t('chart.approxNote').split('·')[1]?.trim() ?? '≈'}</div>
                )}
              </>
            ) : (
              <div className="text-[9px] text-gray-300">{t('chart.unknown')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
