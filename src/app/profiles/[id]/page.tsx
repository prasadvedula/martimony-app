import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { differenceInYears } from 'date-fns'
import { ProfileBirthChart } from '@/components/ProfileBirthChart'

function feetFromCm(cm: number) {
  const totalIn = Math.round(cm / 2.54)
  return `${Math.floor(totalIn / 12)}'${totalIn % 12}"`
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-pink-50 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-800 flex-1">{value}</span>
    </div>
  )
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2 className="font-serif text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-base flex-shrink-0">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default async function ProfileDetailPage({ params }: { params: { id: string } }) {
  const profile = await prisma.profile.findUnique({ where: { id: params.id } })
  if (!profile || profile.status !== 'ACTIVE') notFound()

  const age = differenceInYears(new Date(), profile.dateOfBirth)
  const isFemale = profile.gender === 'FEMALE'
  const accentGrad = isFemale
    ? 'linear-gradient(135deg, #EC4899, #F43F5E)'
    : 'linear-gradient(135deg, #3B82F6, #6366F1)'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/profiles"
        className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium mb-6 transition-colors">
        ← Back to profiles
      </Link>

      {/* Profile hero banner */}
      <div className="rounded-3xl overflow-hidden mb-6 relative"
        style={{ background: 'linear-gradient(135deg, #500724 0%, #831843 50%, #9D174D 100%)' }}>
        {/* Decorative mandala */}
        <svg viewBox="0 0 200 200" fill="none" className="absolute right-0 top-0 w-64 text-white/10 translate-x-1/4 -translate-y-1/4 pointer-events-none">
          {[0,45,90,135,180,225,270,315].map((a) => (
            <ellipse key={a} cx="100" cy="58" rx="16" ry="42" fill="currentColor" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.8"/>
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1"/>
        </svg>

        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
              {profile.photoUrl ? (
                <Image src={profile.photoUrl} alt={profile.name} fill className="object-cover" sizes="128px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl"
                  style={{ background: isFemale ? '#FCE7F3' : '#DBEAFE' }}>
                  {isFemale ? '👩' : '👨'}
                </div>
              )}
            </div>
            {/* Gender accent strip */}
            <div className="absolute -bottom-0 left-0 right-0 h-1.5 rounded-b-3xl" style={{ background: accentGrad }} />
          </div>

          {/* Info */}
          <div className="text-white text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold mb-1">{profile.name}</h1>
            <p className="text-pink-200 text-lg mb-3">
              {age} years · {isFemale ? 'Bride' : 'Groom'}
              {profile.heightCm ? ` · ${feetFromCm(profile.heightCm)}` : ''}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="badge badge-pink">{profile.caste}{profile.subCaste ? ` · ${profile.subCaste}` : ''}</span>
              {profile.nakshatra && <span className="badge badge-pink">✦ {profile.nakshatra}</span>}
              {profile.mangalDosha !== null && (
                <span className={`badge ${profile.mangalDosha ? 'badge-red' : 'badge-green'}`}>
                  {profile.mangalDosha ? '⚠ Manglik' : '✓ Non-Manglik'}
                </span>
              )}
              {(profile.currentCity || profile.currentState) && (
                <span className="badge badge-gray">
                  📍 {[profile.currentCity, profile.currentState].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kundali match CTA */}
      <Link href={`/match?${isFemale ? 'brideId' : 'groomId'}=${profile.id}`}
        className="btn btn-primary btn-lg w-full mb-6 shadow-xl justify-center">
        🪐 {profile.name.split(' ')[0]} — Kundali Match
      </Link>

      {/* Birth Chart */}
      <div className="mb-6">
        <ProfileBirthChart
          name={profile.name}
          dateOfBirth={profile.dateOfBirth.toISOString()}
          nakshatra={profile.nakshatra}
          rashi={profile.rashi}
        />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard icon="🪐" title="Astrological Details">
          <Row label="Nakshatra (Star)" value={profile.nakshatra} />
          <Row label="Rashi (Moon Sign)"  value={profile.rashi} />
          <Row label="Gotram"             value={profile.gotram} />
          <Row label="Kuldevi Temple"     value={profile.kuladeviTemple} />
          <Row label="Birth Place"        value={profile.birthPlace} />
          <Row label="Birth Time"         value={profile.birthTime} />
        </SectionCard>

        <SectionCard icon="🕉" title="Community">
          <Row label="Caste"     value={profile.caste} />
          <Row label="Sub-Caste" value={profile.subCaste} />
          <Row label="Sakha"     value={profile.sakha} />
          <Row label="Surname"   value={profile.surname} />
        </SectionCard>

        <SectionCard icon="👤" title="Personal">
          <Row label="Date of Birth" value={profile.dateOfBirth.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          <Row label="Height"        value={profile.heightCm ? `${profile.heightCm} cm (${feetFromCm(profile.heightCm)})` : null} />
          <Row label="Complexion"    value={profile.complexion} />
          <Row label="Body Type"     value={profile.bodyType} />
          <Row label="Location"      value={[profile.currentCity, profile.currentState].filter(Boolean).join(', ') || null} />
        </SectionCard>

        <SectionCard icon="🎓" title="Education & Profession">
          <Row label="Education"     value={[profile.education, profile.educationDetail].filter(Boolean).join(' — ')} />
          <Row label="Occupation"    value={[profile.occupation, profile.occupationDetail].filter(Boolean).join(' — ')} />
          <Row label="Annual Income" value={profile.annualIncomeLpa ? `${profile.annualIncomeLpa} LPA` : null} />
        </SectionCard>

        <SectionCard icon="👨‍👩‍👧" title="Family">
          <Row label="Father"       value={profile.fatherName ? `${profile.fatherName}${profile.fatherOccupation ? ` (${profile.fatherOccupation})` : ''}` : null} />
          <Row label="Mother"       value={profile.motherName ? `${profile.motherName}${profile.motherOccupation ? ` (${profile.motherOccupation})` : ''}` : null} />
          <Row label="Siblings"     value={profile.siblings} />
          <Row label="Family Type"  value={profile.familyType} />
          <Row label="Values"       value={profile.familyValues} />
        </SectionCard>

        {(profile.prefAgeMin || profile.prefAgeMax || profile.prefCastes.length > 0) && (
          <SectionCard icon="💑" title="Partner Preferences">
            {(profile.prefAgeMin || profile.prefAgeMax) && (
              <Row label="Age Range" value={`${profile.prefAgeMin ?? '—'} to ${profile.prefAgeMax ?? '—'} years`} />
            )}
            {profile.prefCastes.length > 0 && (
              <Row label="Preferred Castes" value={profile.prefCastes.join(', ')} />
            )}
            {profile.prefStates.length > 0 && (
              <Row label="Preferred States" value={profile.prefStates.join(', ')} />
            )}
          </SectionCard>
        )}
      </div>
    </div>
  )
}
