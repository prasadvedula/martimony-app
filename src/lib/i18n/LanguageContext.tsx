'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import translations, { Language, LANGUAGE_NAMES } from './translations'

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  languageNames: typeof LANGUAGE_NAMES
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('martmony_lang') as Language | null
    if (saved && saved in LANGUAGE_NAMES) setLangState(saved)
  }, [])

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem('martmony_lang', l)
  }

  function t(key: string, vars?: Record<string, string | number>): string {
    const dict = translations[lang] ?? translations['en']
    let str = dict[key] ?? translations['en'][key] ?? key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v))
      })
    }
    return str
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languageNames: LANGUAGE_NAMES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
