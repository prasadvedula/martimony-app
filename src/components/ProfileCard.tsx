'use client'

import Link from 'next/link'
import Image from 'next/image'
import { differenceInYears, parseISO } from 'date-fns'
import { useTranslation } from '@/lib/i18n/LanguageContext'

interface ProfileCardProps {
  profile: {
    id: string; name: string; gender: string; dateOfBirth: string | Date
    caste: string; subCaste?: string | null; nakshatra: string; rashi?: string | null
    currentCity?: string | null; currentState?: string | null; photoUrl?: string | null
    education?: string | null; occupation?: string | null; heightCm?: number | null
    mangalDosha?: boolean | null; gotram?: string | null
  }
  showMatchButton?: boolean
  onMatchClick?: (id: string) => void
}

function feetFromCm(cm: number) {
  const totalIn = Math.round(cm / 2.54)
  return `${Math.floor(totalIn / 12)}'${totalIn % 12}"`
}

/* Small constellation of 5 dots representing a nakshatra */
function StarConstellation() {
  const positions = [[3,0],[8,2],[5,5],[1,4],[6,8]]
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="inline-block opacity-75">
      {positions.map(([x, y], i) => (
        <circle key={i} cx={x * 2.4 + 2} cy={y * 1.5 + 1} r="1.5"
          fill="#DB2777"
          style={{ animation: `twinkle 2.5s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </svg>
  )
}

export function ProfileCard({ profile, showMatchButton, onMatchClick }: ProfileCardProps) {
  const { t } = useTranslation()
  const isFemale = profile.gender === 'FEMALE'
  const age = differenceInYears(
    new Date(),
    typeof profile.dateOfBirth === 'string' ? parseISO(profile.dateOfBirth) : profile.dateOfBirth
  )

  const accentGrad = isFemale
    ? 'linear-gradient(180deg, #EC4899, #F43F5E)'
    : 'linear-gradient(180deg, #3B82F6, #6366F1)'

  return (
    <div className="profile-card group">
      {/* Top accent strip */}
      <div className="h-1.5 w-full" style={{ background: accentGrad }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Photo + basics */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl overflow-hidden"
              style={{ boxShadow: `0 0 0 3px rgba(255,255,255,1), 0 0 0 5px ${isFemale ? '#F9A8D4' : '#93C5FD'}` }}>
              {profile.photoUrl ? (
                <Image src={profile.photoUrl} alt={profile.name} fill className="object-cover" sizes="72px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl"
                  style={{ background: isFemale ? 'linear-gradient(135deg,#FCE7F3,#FDF2F8)' : 'linear-gradient(135deg,#DBEAFE,#EFF6FF)' }}>
                  {isFemale ? '👩' : '👨'}
                </div>
              )}
            </div>
            {/* Online/active indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-bold text-gray-900 truncate leading-tight mb-0.5">
              {profile.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500">
                {t('card.age', { n: age })} · {isFemale ? t('match.bride') : t('match.groom')}
                {profile.heightCm ? ` · ${feetFromCm(profile.heightCm)}` : ''}
              </span>
            </div>
            {/* Caste chip */}
            <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: isFemale ? '#FDF2F8' : '#EFF6FF', color: isFemale ? '#9D174D' : '#1E3A8A' }}>
              {profile.caste}{profile.subCaste ? ` · ${profile.subCaste}` : ''}
            </span>
          </div>
        </div>

        {/* Astro row */}
        <div className="bg-pink-50 rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs border border-pink-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500 mb-0.5">Nakshatra</p>
            <p className="font-semibold text-gray-800 flex items-center gap-1">
              <StarConstellation /> {profile.nakshatra}
            </p>
          </div>
          {profile.rashi && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500 mb-0.5">Rashi</p>
              <p className="font-semibold text-gray-800">🌙 {profile.rashi}</p>
            </div>
          )}
          {profile.gotram && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500 mb-0.5">Gotram</p>
              <p className="font-semibold text-gray-800 truncate">🕉 {profile.gotram}</p>
            </div>
          )}
          {profile.mangalDosha !== null && profile.mangalDosha !== undefined && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500 mb-0.5">Mangal</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                profile.mangalDosha ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {profile.mangalDosha ? '⚠' : '✓'} {profile.mangalDosha ? t('match.manglik') : t('match.nonManglik')}
              </span>
            </div>
          )}
        </div>

        {/* Education/Occupation */}
        {(profile.education || profile.occupation) && (
          <div className="space-y-1">
            {profile.education  && <p className="text-xs text-gray-500 truncate">🎓 {profile.education}</p>}
            {profile.occupation && <p className="text-xs text-gray-500 truncate">💼 {profile.occupation}</p>}
          </div>
        )}

        {/* Location */}
        {(profile.currentCity || profile.currentState) && (
          <p className="text-xs text-gray-400 truncate">
            📍 {[profile.currentCity, profile.currentState].filter(Boolean).join(', ')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link href={`/profiles/${profile.id}`}
            className="btn btn-secondary btn-sm flex-1 text-center justify-center">
            {t('card.viewProfile')}
          </Link>
          {showMatchButton && onMatchClick && (
            <button onClick={() => onMatchClick(profile.id)}
              className="btn btn-primary btn-sm flex-1">
              🪐 {t('card.kundaliMatch')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
