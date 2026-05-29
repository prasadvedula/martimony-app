'use client'

import type { AshtakootResult } from '@/lib/kundali'

interface MatchResultProps { result: AshtakootResult }

const SCORE_CONFIG = {
  EXCELLENT:     { label: 'Excellent',      emoji: '✨', ring: '#10B981', bg: 'from-emerald-50 to-teal-50',    border: 'border-emerald-200', text: 'text-emerald-700' },
  GOOD:          { label: 'Good',           emoji: '👍', ring: '#3B82F6', bg: 'from-blue-50 to-sky-50',        border: 'border-blue-200',    text: 'text-blue-700'    },
  AVERAGE:       { label: 'Average',        emoji: '🌟', ring: '#F59E0B', bg: 'from-amber-50 to-yellow-50',    border: 'border-pink-200',   text: 'text-amber-700'   },
  BELOW_AVERAGE: { label: 'Below Average',  emoji: '⚠️', ring: '#F97316', bg: 'from-orange-50 to-amber-50',   border: 'border-pink-200',  text: 'text-pink-700'  },
  POOR:          { label: 'Poor',           emoji: '❌', ring: '#EF4444', bg: 'from-red-50 to-rose-50',        border: 'border-red-200',     text: 'text-red-700'     },
}

const KOOT_ICONS: Record<string, string> = {
  Varna: '🏵', Vasya: '🌀', Tara: '⭐', Yoni: '🌺',
  'Graha Maitri': '🪐', Gana: '👥', Bhakoot: '💫', Nadi: '🌊',
}

/* Circular SVG score gauge */
function ScoreRing({ score, max, color }: { score: number; max: number; color: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / max)
  const pct = Math.round((score / max) * 100)

  return (
    <div className="relative inline-flex items-center justify-center w-44 h-44">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
        {/* Track */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        {/* Progress */}
        <circle cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          className="score-arc"
        />
      </svg>
      {/* Center content */}
      <div className="text-center z-10">
        <p className="font-serif text-4xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs text-gray-400 font-medium">of {max} pts</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color }}>{pct}%</p>
      </div>
    </div>
  )
}

/* Animated score bar */
function KootBar({ scored, max }: { scored: number; max: number }) {
  const pct = Math.min(100, (scored / max) * 100)
  const color = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3 mt-1.5">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-2 rounded-full score-bar-fill"
          style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>
        {scored}/{max}
      </span>
    </div>
  )
}

export function MatchResult({ result }: MatchResultProps) {
  const cfg = SCORE_CONFIG[result.recommendation]

  return (
    <div className="space-y-5 animate-scale-in">
      {/* Hero score card */}
      <div className={`rounded-3xl p-8 bg-gradient-to-br ${cfg.bg} border ${cfg.border} relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: cfg.ring }} />

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular gauge */}
          <div className="flex-shrink-0">
            <ScoreRing score={result.totalScore} max={result.maxScore} color={cfg.ring} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 text-2xl font-serif font-bold mb-2 ${cfg.text}`}>
              <span>{cfg.emoji}</span>
              <span>{cfg.label} Match</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{result.recommendationText}</p>

            {/* Nakshatra pair */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="bg-white/70 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Groom ✦</p>
                <p className="font-serif font-semibold text-pink-700">{result.groomNakshatra}</p>
              </div>
              <div className="flex items-center text-gray-400 text-xl font-light">↔</div>
              <div className="bg-white/70 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bride ✦</p>
                <p className="font-serif font-semibold text-pink-700">{result.brideNakshatra}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ashtakoot breakdown */}
      <div className="card">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🌙 Ashtakoot Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.scores.map((koot) => {
            const pct = Math.round((koot.scored / koot.maxPoints) * 100)
            const dotColor = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444'
            return (
              <div key={koot.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{KOOT_ICONS[koot.name] ?? '🔮'}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{koot.name}</p>
                      <p className="text-[10px] text-gray-400">{koot.nameHindi}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
                </div>
                <KootBar scored={koot.scored} max={koot.maxPoints} />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{koot.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mangal Dosha */}
      <div className={`rounded-2xl p-5 border ${
        result.mangalDosha.doshaPresent
          ? 'bg-red-50 border-red-200'
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{result.mangalDosha.doshaPresent ? '⚠️' : '✅'}</span>
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 mb-1">
              {result.mangalDosha.doshaPresent ? 'Mangal Dosha Present' : 'Mangal Status: Clear'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{result.mangalDosha.doshaText}</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center px-4">
        Results based on the Vedic Ashtakoot matching system. Consult a qualified Jyotishi for a complete analysis.
      </p>
    </div>
  )
}
