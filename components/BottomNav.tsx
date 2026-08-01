'use client'

import { Home, BookOpen, MessageSquare, Compass, Clock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/', icon: Home, label: 'home' },
    { href: '/namoz', icon: Clock, label: 'namoz' },
    { href: '/quran', icon: BookOpen, label: 'quran' },
    { href: '/duolar', icon: MessageSquare, label: 'duolar' },
    { href: '/asboblar', icon: Compass, label: 'asboblar' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{t(item.label)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
