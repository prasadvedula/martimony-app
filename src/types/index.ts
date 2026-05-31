export interface ProfileFormData {
  name: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: string
  birthTime?: string
  birthPlace: string
  currentCity?: string
  currentState?: string
  caste: string
  subCaste?: string
  sakha?: string
  gotram?: string
  nakshatra: string
  rashi?: string
  mangalDosha?: boolean
  kuladeviTemple?: string
  surname?: string
  heightCm?: number
  complexion?: string
  bodyType?: string
  education?: string
  educationDetail?: string
  occupation?: string
  occupationDetail?: string
  annualIncomeLpa?: number
  fatherName?: string
  fatherOccupation?: string
  motherName?: string
  motherOccupation?: string
  siblings?: string
  familyType?: 'JOINT' | 'NUCLEAR' | 'EXTENDED'
  familyValues?: string
  contactEmail?: string
  contactPhone?: string
  prefAgeMin?: number
  prefAgeMax?: number
  prefCastes?: string[]
  prefStates?: string[]
}

export interface SearchFilters {
  gender?: 'MALE' | 'FEMALE'
  ageMin?: number
  ageMax?: number
  caste?: string
  subCaste?: string
  nakshatra?: string
  state?: string
  status?: string
  page?: number
  limit?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const CASTES = [
  'Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Rajput',
  'Maratha', 'Nair', 'Reddy', 'Kamma', 'Kapu',
  'Lingayat', 'Vokkaliga', 'Bunt', 'Nadar', 'Ezhava',
  'Jat', 'Gujjar', 'Yadav', 'Kurmi', 'Teli',
  'Other OBC', 'SC', 'ST', 'Other',
] as const

export const BRAHMIN_SAKHAS = [
  'Rigveda Shakha', 'Samaveda Shakha', 'Yajurveda Shakha',
  'Atharvaveda Shakha', 'Smarta', 'Madhva', 'Iyengar (Vaishnava)',
  'Niyogi', 'Vaidiki', 'Deshastha', 'Konkanastha (Chitpavan)',
  'Karhade', 'Saraswat', 'Iyer', 'Gurukkal',
  'Nambudiri', 'Audichya', 'Shrimali', 'Pushkarna',
  'Other',
] as const

export const GOTRAS = [
  'Angirasa', 'Atri', 'Bharadvaja', 'Bhrigu', 'Gautama',
  'Harita', 'Jamadagni', 'Kaashyapa', 'Kaundinya', 'Kausika',
  'Krushnatreya', 'Maudgalya', 'Parasara', 'Sandilya', 'Shandilya',
  'Shiva', 'Vashista', 'Vishvamitra', 'Vatsa', 'Other',
] as const

export const COMPLEXIONS = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark', 'Very Dark'] as const

export const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Heavy'] as const

export const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'] as const

export const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'B.A.', 'B.Sc.', 'B.Com.',
  'B.Tech./B.E.', 'BCA', 'BBA', 'M.A.', 'M.Sc.', 'M.Com.',
  'M.Tech./M.E.', 'MCA', 'MBA', 'M.Phil.', 'Ph.D.',
  'MBBS', 'MD/MS', 'BDS', 'LLB', 'CA/CS/ICWA',
  'B.Ed.', 'Other',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const
