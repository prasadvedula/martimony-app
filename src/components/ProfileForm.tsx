'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  CASTES, BRAHMIN_SAKHAS, GOTRAS, COMPLEXIONS, BODY_TYPES,
  FAMILY_VALUES, EDUCATION_LEVELS, INDIAN_STATES,
} from '@/types'
import { NAKSHATRA_NAMES } from '@/lib/kundali'
import { profilesApi } from '@/lib/api'

const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
]

const INCOME_RANGES = [
  'Below 2 LPA', '2–5 LPA', '5–10 LPA', '10–15 LPA',
  '15–25 LPA', '25–50 LPA', '50 LPA+',
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-pink-800 mb-4 pb-2 border-b border-pink-100">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children, full }: { label: string; required?: boolean; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  )
}

export function ProfileForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isBrahmin, setIsBrahmin] = useState(false)
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE')

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(formRef.current!)

    try {
      const data = await profilesApi.create(fd)
      if (!data.success) {
        setError(data.error ?? 'Failed to create profile.')
        setLoading(false)
        return
      }
      router.push(`/profiles/${data.data!.id}?registered=1`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Photo */}
      <div className="card flex items-center gap-6">
        <div
          className="w-24 h-24 rounded-full bg-pink-100 border-2 border-pink-200 overflow-hidden cursor-pointer flex items-center justify-center text-4xl flex-shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <Image src={preview} alt="Photo preview" width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            gender === 'FEMALE' ? '👩' : '👨'
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">Profile Photo</p>
          <p className="text-sm text-gray-500 mb-2">JPG or PNG, max 5 MB</p>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary btn-sm">
            Upload Photo
          </button>
          <input ref={fileRef} type="file" name="photo" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>

      {/* Personal */}
      <Section title="Personal Information">
        <Field label="Full Name" required>
          <input name="name" className="input" placeholder="Full name" required />
        </Field>

        <Field label="Gender" required>
          <select name="gender" className="select" value={gender}
            onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')} required>
            <option value="MALE">Male (Groom)</option>
            <option value="FEMALE">Female (Bride)</option>
          </select>
        </Field>

        <Field label="Surname / Family Name">
          <input name="surname" className="input" placeholder="e.g. Sharma, Iyer, Reddy" />
        </Field>

        <Field label="Date of Birth" required>
          <input name="dateOfBirth" type="date" className="input" required />
        </Field>

        <Field label="Birth Time">
          <input name="birthTime" type="time" className="input" placeholder="e.g. 06:45" />
        </Field>

        <Field label="Place of Birth" required>
          <input name="birthPlace" className="input" placeholder="City, State" required />
        </Field>

        <Field label="Current City">
          <input name="currentCity" className="input" placeholder="Current city" />
        </Field>

        <Field label="Current State">
          <select name="currentState" className="select">
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </Section>

      {/* Hindu/Astrological */}
      <Section title="Community & Astrological Details">
        <Field label="Caste" required>
          <select name="caste" className="select" required
            onChange={(e) => setIsBrahmin(e.target.value === 'Brahmin')}>
            <option value="">Select caste</option>
            {CASTES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Sub-Caste / Jati">
          <input name="subCaste" className="input" placeholder="e.g. Deshastha, Namboodiri, Kamma Naidu" />
        </Field>

        {isBrahmin && (
          <Field label="Brahmin Sakha (Vedic Branch)" full>
            <select name="sakha" className="select">
              <option value="">Select Sakha</option>
              {BRAHMIN_SAKHAS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        )}

        <Field label="Gotram">
          <select name="gotram" className="select">
            <option value="">Select gotram</option>
            {GOTRAS.map((g) => <option key={g} value={g}>{g}</option>)}
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Nakshatra (Birth Star)" required>
          <select name="nakshatra" className="select" required>
            <option value="">Select birth star</option>
            {NAKSHATRA_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>

        <Field label="Rashi (Moon Sign)">
          <select name="rashi" className="select">
            <option value="">Select rashi</option>
            {RASHIS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Mangal Dosha (Manglik)?">
          <select name="mangalDosha" className="select">
            <option value="false">No (Non-Manglik)</option>
            <option value="true">Yes (Manglik)</option>
          </select>
        </Field>

        <Field label="Kuldevi / Kuladeva Temple">
          <input name="kuladeviTemple" className="input" placeholder="e.g. Yellamma Devi, Bhavani Mata" />
        </Field>
      </Section>

      {/* Physical */}
      <Section title="Physical Attributes">
        <Field label="Height">
          <input name="heightCm" type="number" className="input" placeholder="Height in cm (e.g. 165)" min={130} max={220} />
        </Field>

        <Field label="Complexion">
          <select name="complexion" className="select">
            <option value="">Select complexion</option>
            {COMPLEXIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Body Type">
          <select name="bodyType" className="select">
            <option value="">Select body type</option>
            {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      </Section>

      {/* Education & Profession */}
      <Section title="Education & Profession">
        <Field label="Highest Education">
          <select name="education" className="select">
            <option value="">Select education</option>
            {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </Field>

        <Field label="Education Details">
          <input name="educationDetail" className="input" placeholder="e.g. B.Tech Computer Science, IIT Bombay" />
        </Field>

        <Field label="Occupation">
          <input name="occupation" className="input" placeholder="e.g. Software Engineer, Doctor, Teacher" />
        </Field>

        <Field label="Occupation Details">
          <input name="occupationDetail" className="input" placeholder="e.g. Senior Engineer at TCS" />
        </Field>

        <Field label="Annual Income (LPA)">
          <select name="annualIncomeLpa" className="select">
            <option value="">Select income range</option>
            {INCOME_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </Section>

      {/* Family */}
      <Section title="Family Background">
        <Field label="Father's Name">
          <input name="fatherName" className="input" placeholder="Father's full name" />
        </Field>

        <Field label="Father's Occupation">
          <input name="fatherOccupation" className="input" placeholder="Father's occupation" />
        </Field>

        <Field label="Mother's Name">
          <input name="motherName" className="input" placeholder="Mother's full name" />
        </Field>

        <Field label="Mother's Occupation">
          <input name="motherOccupation" className="input" placeholder="Mother's occupation or homemaker" />
        </Field>

        <Field label="Siblings">
          <input name="siblings" className="input" placeholder="e.g. 1 brother (married), 1 sister" />
        </Field>

        <Field label="Family Type">
          <select name="familyType" className="select">
            <option value="">Select family type</option>
            <option value="JOINT">Joint Family</option>
            <option value="NUCLEAR">Nuclear Family</option>
            <option value="EXTENDED">Extended Family</option>
          </select>
        </Field>

        <Field label="Family Values">
          <select name="familyValues" className="select">
            <option value="">Select values</option>
            {FAMILY_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </Section>

      {/* Contact */}
      <Section title="Contact Details">
        <Field label="Contact Email">
          <input name="contactEmail" type="email" className="input" placeholder="Family contact email" />
        </Field>

        <Field label="Contact Phone">
          <input name="contactPhone" type="tel" className="input" placeholder="+91 XXXXX XXXXX" />
        </Field>
      </Section>

      {/* Partner Preferences */}
      <Section title="Partner Preferences">
        <Field label="Preferred Age — Minimum">
          <input name="prefAgeMin" type="number" className="input" placeholder={gender === 'FEMALE' ? 'e.g. 24' : 'e.g. 26'} min={18} max={70} />
        </Field>

        <Field label="Preferred Age — Maximum">
          <input name="prefAgeMax" type="number" className="input" placeholder={gender === 'FEMALE' ? 'e.g. 35' : 'e.g. 32'} min={18} max={70} />
        </Field>

        <Field label="Preferred Castes (comma separated)" full>
          <input name="prefCastes" className="input" placeholder="e.g. Brahmin, Kshatriya (leave blank for any)" />
        </Field>

        <Field label="Preferred States (comma separated)" full>
          <input name="prefStates" className="input" placeholder="e.g. Karnataka, Tamil Nadu (leave blank for any)" />
        </Field>
      </Section>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-base flex-1 md:flex-none">
          {loading ? 'Submitting…' : 'Submit Profile'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-3">
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500">
        * After submission, you will receive a consent link. Your profile will be visible only after you confirm consent.
      </p>
    </form>
  )
}
