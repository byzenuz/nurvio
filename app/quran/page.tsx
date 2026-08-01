'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, Bookmark, Play, Pause, Volume2, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAudio } from '@/contexts/AudioContext'

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
}

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation?: string
}

interface SurahDetail {
  name: string
  englishName: string
  englishNameTranslation: string
  ayahs: Ayah[]
}

export default function QuranPage() {
  const { t } = useLanguage()
  const { playAudio: playGlobalAudio, pauseAudio, currentAudio } = useAudio()
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)

  useEffect(() => {
    loadSurahs()
    loadBookmarks()
    loadFavorites()
  }, [])

  const loadSurahs = async () => {
    try {
      const response = await fetch('/api/quran/surahs')
      const data = await response.json()
      if (data.success) {
        setSurahs(data.data)
      }
    } catch (error) {
      console.error('Suralarni yuklashda xatolik:', error)
    }
  }

  const loadSurahDetail = async (surahNumber: number) => {
    try {
      const response = await fetch(`/api/quran/surah/${surahNumber}`)
      const data = await response.json()
      if (data.success) {
        setSelectedSurah(data.data[0])
        setAyahs(data.data[0].ayahs)
      }
    } catch (error) {
      console.error('Sura tafsilotlarini yuklashda xatolik:', error)
    }
  }

  const loadBookmarks = () => {
    const saved = localStorage.getItem('quran-bookmarks')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('quran-favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleBookmark = (surahNumber: number, ayahNumber: number) => {
    const bookmarkId = `${surahNumber}-${ayahNumber}`
    const newBookmarks = bookmarks.includes(bookmarkId)
      ? bookmarks.filter((b) => b !== bookmarkId)
      : [...bookmarks, bookmarkId]
    
    setBookmarks(newBookmarks)
    localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks))
  }

  const toggleFavorite = (surahNumber: number) => {
    const newFavorites = favorites.includes(surahNumber)
      ? favorites.filter((f) => f !== surahNumber)
      : [...favorites, surahNumber]
    
    setFavorites(newFavorites)
    localStorage.setItem('quran-favorites', JSON.stringify(newFavorites))
  }

  const playAyahAudio = async (ayahNumber: number) => {
    try {
      const surahNumber = ayahs[0]?.number || 1
      const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`
      const title = `Surah ${selectedSurah?.englishName || surahNumber} - Ayah ${ayahNumber}`
      
      playGlobalAudio(audioUrl, title)
      setPlayingAudio(ayahNumber)
    } catch (error) {
      console.error('Audio yuklashda xatolik:', error)
    }
  }

  const filteredSurahs = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📖 {t('quran')}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v1.02</span>
        </div>

        <div className="card p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_surah')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white"
            />
          </div>

          {!selectedSurah ? (
            <div className="space-y-3">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => loadSurahDetail(surah.number)}
                  className="w-full text-left p-4 bg-gradient-to-r from-primary-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:from-primary-100 hover:to-emerald-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {surah.number}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{surah.englishName}</p>
                        <p className="text-gray-600 dark:text-gray-400">{surah.englishNameTranslation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-arabic text-gray-900 dark:text-white" dir="rtl">{surah.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{surah.numberOfAyahs} oyat</p>
                    </div>
                    {favorites.includes(surah.number) && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </button>
              ))}
              <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                {t('quran')}: <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Al Quran Cloud API</a>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedSurah(null)
                  setAyahs([])
                }}
                className="mb-6 text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                ← Suralarga qaytish
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-arabic text-gray-900 dark:text-white mb-2" dir="rtl">{selectedSurah.name}</h2>
                <p className="text-xl text-gray-900 dark:text-white">{selectedSurah.englishName}</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedSurah.englishNameTranslation}</p>
                <button
                  onClick={() => toggleFavorite(ayahs[0]?.number || 0)}
                  className="mt-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Star className={`w-5 h-5 ${favorites.includes(ayahs[0]?.number || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="space-y-6">
                {ayahs.map((ayah, index) => (
                  <div
                    key={ayah.number}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {ayah.numberInSurah}
                      </span>
                      <button
                        onClick={() => toggleBookmark(ayahs[0].number, ayah.numberInSurah)}
                        className={`p-2 rounded-lg ${
                          bookmarks.includes(`${ayahs[0].number}-${ayah.numberInSurah}`)
                            ? 'text-yellow-500'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-3xl font-arabic text-right mb-4 text-gray-900 dark:text-white leading-loose" dir="rtl">
                      {ayah.text} ۝
                    </p>

                    {ayah.translation && (
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        {ayah.translation}
                      </p>
                    )}

                    <button
                      onClick={() => playAyahAudio(ayah.number)}
                      className="mt-4 flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {playingAudio === ayah.number && currentAudio ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">Audio</span>
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
