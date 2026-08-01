'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Search, Volume2, Copy, Check, Play, Pause } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Dua {
  arabic: string
  transliteration: string
  translation: string
  reference: string
}

interface DuaCategory {
  id: string
  category: string
  icon: string
  duas: Dua[]
}

export default function DuolarPage() {
  const { t } = useLanguage()
  const [duasData, setDuasData] = useState<DuaCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadDuasCategories()
  }, [])

  const loadDuasCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/duas/categories')
      if (response.ok) {
        const data = await response.json()
        if (data && data.data) {
          // Transform API data to match our interface
          const categories: DuaCategory[] = data.data.map((cat: any) => ({
            id: cat.id || cat.category,
            category: cat.category || cat.name,
            icon: '🤲', // Default icon, can be customized
            duas: [] // Will be loaded when category is selected
          }))
          setDuasData(categories)
        }
      } else {
        // API returned error, use fallback
        console.log('API returned error, using fallback data')
        setDuasData(getFallbackDuas())
      }
    } catch (error) {
      console.error('Error loading dua categories:', error)
      // Fallback to static data if API fails
      setDuasData(getFallbackDuas())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackDuas = (): DuaCategory[] => {
    return [
      {
        id: 'uyqu',
        category: 'Uyqu',
        icon: '🌙',
        duas: [
          {
            arabic: 'بِسْمِكَ اللّهُمَّ أَحْيَا وَأَمُوتُ',
            transliteration: 'Bismika Allahumma ahyaa wa amuut',
            translation: 'Alloh, Sening isming bilan tirikman va o\'laman',
            reference: 'Buxoriy, Muslim'
          }
        ]
      },
      {
        id: 'safar',
        category: 'Safar',
        icon: '✈️',
        duas: [
          {
            arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
            transliteration: 'Subhaanal-lazii sakhkhara lanaa hazaa wa maa kunna lahu muqriniin, wa innaa ilaa Rabbinaa lamunqalibuun',
            translation: 'Buni bizga bo\'ysundirgan Zot pokdir. Biz unga qodir emas edik va albatta Rabbimizga qaytguçilardanmiz',
            reference: 'Zukhruf surasi, 13-14-oyatlar'
          }
        ]
      },
      {
        id: 'ovqat',
        category: 'Ovqat',
        icon: '🍽️',
        duas: [
          {
            arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
            transliteration: 'Bismillahi wa \'ala barkatillah',
            translation: 'Alloh nomi bilan va Allohning barkati bilan',
            reference: 'Ibn Majja'
          }
        ]
      },
      {
        id: 'tahorat',
        category: 'Tahorat',
        icon: '💧',
        duas: [
          {
            arabic: 'اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
            transliteration: 'Allahumma-ghsilnii min khatayaaya bil-maa\'i wa th-thalji wa barad',
            translation: 'Allohim, meni gunohlarimdan suv, qor va muz bilan yuv',
            reference: 'Buxoriy, Muslim'
          }
        ]
      },
      {
        id: 'namoz',
        category: 'Namoz',
        icon: '🕌',
        duas: [
          {
            arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
            transliteration: 'Subhaanaka Allahumma wa bihamdika wa tabaaraka ismuka wa ta\'aala jadduka wa laa ilaaha ghayruk',
            translation: 'Sen pokdir Allohim, Sen hamdga loyiqsan, Isming barkatlidir, sharafing ulug\'dir, Sendan boshqa iloh yo\'q',
            reference: 'Muslim'
          }
        ]
      },
      {
        id: 'tong',
        category: 'Tong',
        icon: '🌅',
        duas: [
          {
            arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
            transliteration: 'Allahumma bika asbahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaykan-nushuur',
            translation: 'Allohim, Sen bilan tong otdik, Sen bilan kech qildik, Sen bilan tirikmiz, Sen bilan o\'lamiz va Sena qaytamiz',
            reference: 'Tirmizi'
          }
        ]
      },
      {
        id: 'kechqurun',
        category: 'Kechqurun',
        icon: '🌙',
        duas: [
          {
            arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
            transliteration: 'Allahumma bika amsaynaa wa bika asbahnaa wa bika nahyaa wa bika namuutu wa ilaykal-masiir',
            translation: 'Allohim, Sen bilan kech qildik, Sen bilan tong otdik, Sen bilan tirikmiz, Sen bilan o\'lamiz va Sena qaytamiz',
            reference: 'Tirmizi'
          }
        ]
      }
    ]
  }

  const loadCategoryDuas = async (category: DuaCategory) => {
    try {
      const response = await fetch(`/api/duas/category/${category.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.data) {
          const duas: Dua[] = data.data.map((dua: any) => ({
            arabic: dua.arabic,
            transliteration: dua.transliteration || '',
            translation: dua.translation || dua.english || '',
            reference: dua.reference || dua.source || ''
          }))
          setSelectedCategory({ ...category, duas })
        }
      }
    } catch (error) {
      console.error('Error loading category duas:', error)
      // Fallback to static duas if API fails
      setSelectedCategory(category)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const playAudio = (arabicText: string, id: string) => {
    if (playingAudio === id && audioRef.current) {
      window.speechSynthesis.cancel()
      setPlayingAudio(null)
      return
    }

    window.speechSynthesis.cancel()

    try {
      const utterance = new SpeechSynthesisUtterance(arabicText)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onend = () => {
        setPlayingAudio(null)
      }

      window.speechSynthesis.speak(utterance)
      setPlayingAudio(id)
    } catch (error) {
      console.error('Audio ijrosida xatolik:', error)
    }
  }

  const filteredCategories = duasData.filter((category) =>
    category.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤲 {t('duolar')}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v1.02</span>
        </div>

        <div className="card p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_dua')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white"
            />
          </div>

          {!selectedCategory ? (
            loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => loadCategoryDuas(category)}
                    className="p-6 bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:from-primary-100 hover:to-emerald-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all text-center"
                  >
                    <span className="text-4xl mb-3 block">{category.icon}</span>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{category.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.duas.length} dua</p>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedCategory(null)
                }}
                className="mb-6 text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                ← {t('back')}
              </button>

              <div className="mb-6">
                <span className="text-4xl mr-3">{selectedCategory.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white inline">{selectedCategory.category}</h2>
              </div>

              <div className="space-y-6">
                {selectedCategory.duas.map((dua, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(dua.arabic, `${selectedCategory.id}-${index}`)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {copied === `${selectedCategory.id}-${index}` ? (
                          <Check className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <p className="text-3xl font-arabic text-right mb-4 text-gray-900 dark:text-white leading-loose" dir="rtl">
                      {dua.arabic}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 mb-2 italic">
                      {dua.transliteration}
                    </p>

                    <p className="text-gray-900 dark:text-white text-lg mb-3">
                      {dua.translation}
                    </p>

                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {dua.reference}
                    </p>

                    <button 
                      onClick={() => playAudio(dua.arabic, `${selectedCategory.id}-${index}`)}
                      className="mt-4 flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {playingAudio === `${selectedCategory.id}-${index}` ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">{t('audio')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
