'use client'

import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AuthProvider }     from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </AuthProvider>
  )
}
