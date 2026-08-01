'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Languages } from 'lucide-react'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'uz' as const, name: 'O\'zbek (Lotin)', flag: '🇺🇿' },
    { code: 'uz-cyrl' as const, name: 'Ўзбек (Кирилл)', flag: '🇺🇿' },
    { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' },
  ]

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
              language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-primary-600 dark:text-primary-400">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
