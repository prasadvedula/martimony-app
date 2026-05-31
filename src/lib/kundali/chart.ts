import { NAKSHATRAS } from './nakshatras'

// ── Supported chart languages ─────────────────────────────────────
export type ChartLanguage = 'en' | 'te' | 'ta' | 'kn' | 'ml' | 'hi'

// ── Sign names per language (index 0 unused, 1=Aries … 12=Pisces) ─
export const SIGN_NAMES: Record<ChartLanguage, string[]> = {
  en: ['','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
  te: ['','మేషం','వృషభం','మిథునం','కర్కాటకం','సింహం','కన్య','తుల','వృశ్చికం','ధనుస్సు','మకరం','కుంభం','మీనం'],
  ta: ['','மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'],
  kn: ['','ಮೇಷ','ವೃಷಭ','ಮಿಥುನ','ಕರ್ಕಾಟಕ','ಸಿಂಹ','ಕನ್ಯಾ','ತುಲಾ','ವೃಶ್ಚಿಕ','ಧನು','ಮಕರ','ಕುಂಭ','ಮೀನ'],
  ml: ['','മേടം','ഇടവം','മിഥുനം','കർക്കടകം','ചിങ്ങം','കന്നി','തുലാം','വൃശ്ചികം','ധനു','മകരം','കുംഭം','മീനം'],
  hi: ['','मेष','वृष','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन'],
}

// ── Planet abbreviations per language ─────────────────────────────
export const PLANET_ABBR: Record<ChartLanguage, Record<string, string>> = {
  en: { su:'Su', mo:'Mo', ma:'Ma', me:'Me', ju:'Ju', ve:'Ve', sa:'Sa', ra:'Ra', ke:'Ke', as:'As' },
  te: { su:'సూ',  mo:'చ',  ma:'కు',  me:'బు',  ju:'గు',  ve:'శు',  sa:'శ',   ra:'రా',  ke:'కే',  as:'ల'  },
  ta: { su:'சூ',  mo:'சந்', ma:'செ',  me:'பு',  ju:'கு',  ve:'சு',  sa:'சன்', ra:'ரா',  ke:'கே',  as:'ல'  },
  kn: { su:'ಸೂ',  mo:'ಚ',  ma:'ಕು',  me:'ಬು',  ju:'ಗು',  ve:'ಶು',  sa:'ಶ',   ra:'ರಾ',  ke:'ಕೇ',  as:'ಲ'  },
  ml: { su:'സൂ',  mo:'ച',  ma:'കു',  me:'ബ',   ju:'ഗ',   ve:'ശുക്', sa:'ശനി', ra:'രാ',  ke:'കേ',  as:'ല'  },
  hi: { su:'सू',  mo:'च',  ma:'मं',  me:'बु',  ju:'गु',  ve:'शु',  sa:'श',   ra:'रा',  ke:'के',  as:'ल'  },
}

// ── Planet full names per language ────────────────────────────────
export const PLANET_NAMES: Record<ChartLanguage, Record<string, string>> = {
  en: { su:'Sun', mo:'Moon', ma:'Mars', me:'Mercury', ju:'Jupiter', ve:'Venus', sa:'Saturn', ra:'Rahu', ke:'Ketu', as:'Lagna' },
  te: { su:'సూర్యుడు', mo:'చంద్రుడు', ma:'కుజుడు', me:'బుధుడు', ju:'గురుడు', ve:'శుక్రుడు', sa:'శని', ra:'రాహువు', ke:'కేతువు', as:'లగ్నం' },
  ta: { su:'சூரியன்', mo:'சந்திரன்', ma:'செவ்வாய்', me:'புதன்', ju:'வியாழன்', ve:'சுக்கிரன்', sa:'சனி', ra:'ராகு', ke:'கேது', as:'லக்னம்' },
  kn: { su:'ಸೂರ್ಯ', mo:'ಚಂದ್ರ', ma:'ಕುಜ', me:'ಬುಧ', ju:'ಗುರು', ve:'ಶುಕ್ರ', sa:'ಶನಿ', ra:'ರಾಹು', ke:'ಕೇತು', as:'ಲಗ್ನ' },
  ml: { su:'സൂര്യൻ', mo:'ചന്ദ്രൻ', ma:'ചൊവ്വ', me:'ബുധൻ', ju:'ഗുരു', ve:'ശുക്രൻ', sa:'ശനി', ra:'രാഹു', ke:'കേതു', as:'ലഗ്നം' },
  hi: { su:'सूर्य', mo:'चंद्र', ma:'मंगल', me:'बुध', ju:'गुरु', ve:'शुक्र', sa:'शनि', ra:'राहु', ke:'केतु', as:'लग्न' },
}

export function getSignLabel(signNum: number, lang: ChartLanguage): string {
  return SIGN_NAMES[lang]?.[signNum] ?? SIGN_NAMES['en'][signNum] ?? ''
}

export function getPlanetAbbr(id: string, lang: ChartLanguage): string {
  return PLANET_ABBR[lang]?.[id] ?? PLANET_ABBR['en'][id] ?? id
}

export function getPlanetName(id: string, lang: ChartLanguage): string {
  return PLANET_NAMES[lang]?.[id] ?? PLANET_NAMES['en'][id] ?? id
}

// ── Sign definitions ─────────────────────────────────────────────
export interface SignInfo {
  num: number        // 1=Aries … 12=Pisces
  name: string       // English
  sanskrit: string   // Sanskrit (used in nakshatras.ts rashi field)
  abbr: string       // 2-char English abbreviation
  devanagari: string // Devanagari
  symbol: string     // Unicode symbol
  lord: string       // Ruling planet
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
  nature: 'Movable' | 'Fixed' | 'Dual'
}

export const SIGNS: SignInfo[] = [
  { num:1,  name:'Aries',       sanskrit:'Mesha',      abbr:'Ar', devanagari:'मेष',    symbol:'♈', lord:'Mars',    element:'Fire',  nature:'Movable' },
  { num:2,  name:'Taurus',      sanskrit:'Vrishabha',  abbr:'Ta', devanagari:'वृष',    symbol:'♉', lord:'Venus',   element:'Earth', nature:'Fixed'   },
  { num:3,  name:'Gemini',      sanskrit:'Mithuna',    abbr:'Ge', devanagari:'मिथ',    symbol:'♊', lord:'Mercury', element:'Air',   nature:'Dual'    },
  { num:4,  name:'Cancer',      sanskrit:'Karka',      abbr:'Ca', devanagari:'कर्क',   symbol:'♋', lord:'Moon',    element:'Water', nature:'Movable' },
  { num:5,  name:'Leo',         sanskrit:'Simha',      abbr:'Le', devanagari:'सिंह',   symbol:'♌', lord:'Sun',     element:'Fire',  nature:'Fixed'   },
  { num:6,  name:'Virgo',       sanskrit:'Kanya',      abbr:'Vi', devanagari:'कन्या',  symbol:'♍', lord:'Mercury', element:'Earth', nature:'Dual'    },
  { num:7,  name:'Libra',       sanskrit:'Tula',       abbr:'Li', devanagari:'तुला',   symbol:'♎', lord:'Venus',   element:'Air',   nature:'Movable' },
  { num:8,  name:'Scorpio',     sanskrit:'Vrishchika', abbr:'Sc', devanagari:'वृश्चि', symbol:'♏', lord:'Mars',    element:'Water', nature:'Fixed'   },
  { num:9,  name:'Sagittarius', sanskrit:'Dhanu',      abbr:'Sa', devanagari:'धनु',    symbol:'♐', lord:'Jupiter', element:'Fire',  nature:'Dual'    },
  { num:10, name:'Capricorn',   sanskrit:'Makara',     abbr:'Cp', devanagari:'मकर',    symbol:'♑', lord:'Saturn',  element:'Earth', nature:'Movable' },
  { num:11, name:'Aquarius',    sanskrit:'Kumbha',     abbr:'Aq', devanagari:'कुंभ',   symbol:'♒', lord:'Saturn',  element:'Air',   nature:'Fixed'   },
  { num:12, name:'Pisces',      sanskrit:'Meena',      abbr:'Pi', devanagari:'मीन',    symbol:'♓', lord:'Jupiter', element:'Water', nature:'Dual'    },
]

// ── Planet definitions ────────────────────────────────────────────
export interface PlanetInfo {
  id: string
  name: string
  abbr: string      // 2-char label shown on chart
  devanagari: string
  color: string     // text color
  bg: string        // badge background
  isApprox: boolean // whether our calculation is approximate
}

export const PLANETS: PlanetInfo[] = [
  { id:'su', name:'Sun',     abbr:'Su', devanagari:'सू', color:'#92400E', bg:'#FEF3C7', isApprox:false },
  { id:'mo', name:'Moon',    abbr:'Mo', devanagari:'च',  color:'#1E3A8A', bg:'#DBEAFE', isApprox:false },
  { id:'ma', name:'Mars',    abbr:'Ma', devanagari:'मं', color:'#991B1B', bg:'#FEE2E2', isApprox:true  },
  { id:'me', name:'Mercury', abbr:'Me', devanagari:'बु', color:'#065F46', bg:'#D1FAE5', isApprox:true  },
  { id:'ju', name:'Jupiter', abbr:'Ju', devanagari:'गु', color:'#5B21B6', bg:'#EDE9FE', isApprox:true  },
  { id:'ve', name:'Venus',   abbr:'Ve', devanagari:'शु', color:'#9D174D', bg:'#FCE7F3', isApprox:true  },
  { id:'sa', name:'Saturn',  abbr:'Sa', devanagari:'शनि',color:'#1F2937', bg:'#F3F4F6', isApprox:true  },
  { id:'ra', name:'Rahu',    abbr:'Ra', devanagari:'रा', color:'#3730A3', bg:'#E0E7FF', isApprox:true  },
  { id:'ke', name:'Ketu',    abbr:'Ke', devanagari:'के', color:'#78350F', bg:'#FEF9C3', isApprox:true  },
  { id:'as', name:'Lagna',   abbr:'As', devanagari:'ल',  color:'#BE185D', bg:'#FCE7F3', isApprox:false },
]

// ── South Indian grid positions ───────────────────────────────────
// Each sign occupies a fixed cell in the 4×4 grid (row 0-3, col 0-3)
// Center 4 cells (rows 1-2, cols 1-2) are merged for chart info
export const SIGN_GRID: Record<number, { row: number; col: number }> = {
  12: { row:0, col:0 },  // Pisces
  1:  { row:0, col:1 },  // Aries
  2:  { row:0, col:2 },  // Taurus
  3:  { row:0, col:3 },  // Gemini
  11: { row:1, col:0 },  // Aquarius
  4:  { row:1, col:3 },  // Cancer
  10: { row:2, col:0 },  // Capricorn
  5:  { row:2, col:3 },  // Leo
  9:  { row:3, col:0 },  // Sagittarius
  8:  { row:3, col:1 },  // Scorpio
  7:  { row:3, col:2 },  // Libra
  6:  { row:3, col:3 },  // Virgo
}

// ── Rashi name → sign number ──────────────────────────────────────
const SANSKRIT_TO_NUM: Record<string, number> = {}
SIGNS.forEach(s => { SANSKRIT_TO_NUM[s.sanskrit.toLowerCase()] = s.num })
// Extra aliases seen in nakshatras.ts
SANSKRIT_TO_NUM['mesha']      = 1
SANSKRIT_TO_NUM['vrishabha']  = 2
SANSKRIT_TO_NUM['mithuna']    = 3
SANSKRIT_TO_NUM['karka']      = 4
SANSKRIT_TO_NUM['simha']      = 5
SANSKRIT_TO_NUM['kanya']      = 6
SANSKRIT_TO_NUM['tula']       = 7
SANSKRIT_TO_NUM['vrishchika'] = 8
SANSKRIT_TO_NUM['dhanu']      = 9
SANSKRIT_TO_NUM['makara']     = 10
SANSKRIT_TO_NUM['kumbha']     = 11
SANSKRIT_TO_NUM['meena']      = 12

export function rashiToSignNum(rashi: string): number {
  return SANSKRIT_TO_NUM[rashi.toLowerCase()] ?? 0
}

// ── Moon sign from nakshatra ──────────────────────────────────────
export function getMoonSign(nakshatraName: string): number {
  const n = NAKSHATRAS.find(x => x.name.toLowerCase() === nakshatraName.toLowerCase())
  if (!n) return 0
  return rashiToSignNum(n.rashi)
}

// ── Sun sign from birth date (approximate sidereal) ───────────────
export function getSunSign(date: Date): number {
  const m = date.getMonth() + 1, d = date.getDate()
  if ((m===1&&d>=14)||(m===2&&d<=12)) return 10  // Capricorn
  if ((m===2&&d>=13)||(m===3&&d<=14)) return 11  // Aquarius
  if ((m===3&&d>=15)||(m===4&&d<=13)) return 12  // Pisces
  if ((m===4&&d>=14)||(m===5&&d<=14)) return 1   // Aries
  if ((m===5&&d>=15)||(m===6&&d<=14)) return 2   // Taurus
  if ((m===6&&d>=15)||(m===7&&d<=16)) return 3   // Gemini
  if ((m===7&&d>=17)||(m===8&&d<=16)) return 4   // Cancer
  if ((m===8&&d>=17)||(m===9&&d<=16)) return 5   // Leo
  if ((m===9&&d>=17)||(m===10&&d<=16)) return 6  // Virgo
  if ((m===10&&d>=17)||(m===11&&d<=15)) return 7 // Libra
  if ((m===11&&d>=16)||(m===12&&d<=15)) return 8 // Scorpio
  return 9  // Sagittarius
}

// ── Approximate planetary positions from birth date ───────────────
// Reference: Vedic positions on Jan 1, 2024 (approximate)
const REF = new Date(2024, 0, 1)
const REF_SIGNS: Record<string, number> = {
  ma: 8,   // Mars → Scorpio
  me: 9,   // Mercury → Sagittarius
  ju: 1,   // Jupiter → Aries
  ve: 8,   // Venus → Scorpio
  sa: 11,  // Saturn → Aquarius
  ra: 12,  // Rahu → Pisces (retrograde)
}
// Full zodiac cycle in days for each planet
const CYCLE_DAYS: Record<string, number> = {
  ma: 686.97,
  me: 87.97,
  ju: 4332.59,
  ve: 224.70,
  sa: 10759.22,
  ra: 6793.5,   // retrograde
}

function daysDiff(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / 86400000
}

function getApproxSign(planet: string, date: Date): number {
  const diff = daysDiff(date, REF)
  const cycle = CYCLE_DAYS[planet]
  const ref = REF_SIGNS[planet]
  const direction = planet === 'ra' ? -1 : 1
  const delta = (direction * diff * 12) / cycle
  return ((ref - 1 + delta % 12 + 1200) % 12 | 0) + 1
}

// ── Chart data types ──────────────────────────────────────────────
export interface PlanetPlacement {
  planetId: string
  sign: number       // 1-12
  isApprox: boolean
  isRetrograde?: boolean
}

export interface ChartData {
  name: string
  dob?: string       // display string
  placements: PlanetPlacement[]
  lagnaSign?: number
  moonSign: number
  sunSign: number
  hasFullData: boolean  // true if we have enough for a complete chart
}

export interface RealPlanets {
  sun?: string; moon?: string; mars?: string; mercury?: string
  jupiter?: string; venus?: string; saturn?: string
  rahu?: string; ketu?: string; lagna?: string
}

export interface ChartInput {
  name: string
  dateOfBirth: Date | string
  nakshatra: string
  birthHour?: number   // 0-23, optional
  rashi?: string       // direct rashi override
  realPlanets?: RealPlanets  // from VedAstro API — overrides all approximations
}

// ── Rasi string → sign number ─────────────────────────────────────
// Handles both "Vrishabha (Taurus)" and plain "Taurus"
function rasiStringToNum(s: string): number {
  if (!s) return 0
  // Try Sanskrit name first
  const n1 = rashiToSignNum(s.split('(')[0].trim())
  if (n1) return n1
  // Try English name in parentheses
  const match = s.match(/\(([^)]+)\)/)
  if (match) {
    const eng = match[1].trim().toLowerCase()
    const found = SIGNS.find(sg => sg.name.toLowerCase() === eng)
    if (found) return found.num
  }
  // Try English name directly
  const found = SIGNS.find(sg => sg.name.toLowerCase() === s.toLowerCase())
  return found?.num ?? 0
}

// ── Main builder ──────────────────────────────────────────────────
export function buildChartData(input: ChartInput): ChartData {
  const dob = typeof input.dateOfBirth === 'string'
    ? new Date(input.dateOfBirth)
    : input.dateOfBirth

  const rp = input.realPlanets
  const hasRealData = !!rp

  const moonSign = rp?.moon
    ? rasiStringToNum(rp.moon)
    : input.rashi
      ? rashiToSignNum(input.rashi)
      : getMoonSign(input.nakshatra)

  const sunSign = rp?.sun ? rasiStringToNum(rp.sun) : getSunSign(dob)

  const lagnaSign: number | undefined = rp?.lagna
    ? rasiStringToNum(rp.lagna) || undefined
    : (() => {
        if (input.birthHour === undefined) return undefined
        const hoursFromDawn = ((input.birthHour - 6) + 24) % 24
        return ((Math.floor(hoursFromDawn / 2) + sunSign - 1) % 12) + 1
      })()

  const placements: PlanetPlacement[] = [
    { planetId: 'su', sign: sunSign,  isApprox: !hasRealData },
    { planetId: 'mo', sign: moonSign, isApprox: false },
    { planetId: 'ma', sign: rp?.mars    ? rasiStringToNum(rp.mars)    : getApproxSign('ma', dob), isApprox: !hasRealData },
    { planetId: 'me', sign: rp?.mercury ? rasiStringToNum(rp.mercury) : getApproxSign('me', dob), isApprox: !hasRealData },
    { planetId: 'ju', sign: rp?.jupiter ? rasiStringToNum(rp.jupiter) : getApproxSign('ju', dob), isApprox: !hasRealData },
    { planetId: 've', sign: rp?.venus   ? rasiStringToNum(rp.venus)   : getApproxSign('ve', dob), isApprox: !hasRealData },
    { planetId: 'sa', sign: rp?.saturn  ? rasiStringToNum(rp.saturn)  : getApproxSign('sa', dob), isApprox: !hasRealData },
    { planetId: 'ra', sign: rp?.rahu    ? rasiStringToNum(rp.rahu)    : getApproxSign('ra', dob), isApprox: !hasRealData, isRetrograde: true },
    { planetId: 'ke', sign: rp?.ketu    ? rasiStringToNum(rp.ketu)    : ((getApproxSign('ra', dob) + 5) % 12) + 1, isApprox: !hasRealData },
  ]

  if (lagnaSign) placements.push({ planetId: 'as', sign: lagnaSign, isApprox: false })

  const dobStr = dob.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return {
    name: input.name,
    dob: dobStr,
    placements,
    lagnaSign,
    moonSign,
    sunSign,
    hasFullData: hasRealData || !!lagnaSign,
  }
}

// ── House calculation from lagna ──────────────────────────────────
export function getHouseNumber(sign: number, lagnaSign: number): number {
  return ((sign - lagnaSign + 12) % 12) + 1
}

// ── Planet lookup helper ──────────────────────────────────────────
export function getPlanetInfo(id: string): PlanetInfo {
  return PLANETS.find(p => p.id === id) ?? PLANETS[0]
}

export function getSignInfo(num: number): SignInfo {
  return SIGNS.find(s => s.num === num) ?? SIGNS[0]
}
