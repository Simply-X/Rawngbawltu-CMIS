'use client'
import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'mz'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string, defaultText?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('mz') // Default to Mizo

    const t = (key: string, defaultText?: string) => {
        // In a real app, looking up dictionaries here.
        // For now, return defaultText or key.
        return defaultText || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
    return context
}
