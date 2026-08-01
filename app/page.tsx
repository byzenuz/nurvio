'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, BookOpen, MessageSquare, CircleDot, Compass, RefreshCw, ChevronDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'

interface PrayerTime {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface NextPrayer {
  name: string
  time: string
}

interface DailyVerse {
  arabic: string
  translation: string
  reference: string
}

interface DailyHadith {
  arabic: string
  translation: string
  reference: string
}

interface DailyDhikr {
  arabic: string
  transliteration: string
  translation: string
  count: number
}

interface IslamicHoliday {
  date: string
  name: string
  description?: string
}

const cities = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Xiva', 'Qarshi', 
  'Namangan', 'Andijon', 'Fargona', 'Jizzax', 'Navoiy'
]

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Toshkent': { lat: 41.2995, lng: 69.2401 },
  'Samarqand': { lat: 39.6542, lng: 66.9597 },
  'Buxoro': { lat: 39.7747, lng: 64.4286 },
  'Xiva': { lat: 41.3781, lng: 60.3638 },
  'Qarshi': { lat: 38.8584, lng: 65.7912 },
  'Namangan': { lat: 40.9984, lng: 71.6726 },
  'Andijon': { lat: 40.7821, lng: 72.3442 },
  'Fargona': { lat: 40.3852, lng: 71.7847 },
  'Jizzax': { lat: 40.1167, lng: 67.8425 },
  'Navoiy': { lat: 40.0844, lng: 65.3792 }
}

const findNearestCity = (userLat: number, userLng: number): string => {
  let nearestCity = 'Toshkent'
  let minDistance = Infinity

  for (const city of cities) {
    const coords = cityCoordinates[city]
    if (coords) {
      const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng)
      if (distance < minDistance) {
        minDistance = distance
        nearestCity = city
      }
    }
  }

  return nearestCity
}

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const dailyVerses: DailyVerse[] = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Albatta, qiyinchilik bilan birga yengillik bor',
    reference: 'Sharh surasi, 6-oyat'
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'Kim Allohdan qorqqan bo\'lsa, U unga chiqish yo\'lini yaratadi',
    reference: 'Talaq surasi, 2-oyat'
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنفُسِهِمْ',
    translation: 'Alloh bir qavmning holatini o\'zgartirmaydi, ular o\'z holatlarini o\'zgartirmaguncha',
    reference: 'Rad surasi, 11-oyat'
  },
  {
    arabic: 'وَأَنِ اسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ',
    translation: 'Va Rabbingizdan magfirat so\'rang, keyin Unga tavba qiling',
    reference: 'Hud surasi, 3-oyat'
  },
  {
    arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
    translation: 'Rabbimiz, biz unutgan yoki xato qilganimiz uchun bizni jazo bermagin',
    reference: 'Baqara surasi, 286-oyat'
  }
]

const dailyHadiths: DailyHadith[] = [
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Amallar niyatga qarab baholanadi',
    reference: 'Buxoriy, Muslim'
  },
  {
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'Musulmon shundurki, boshqa musulmonlar uning tili va qo\'li bilan xavfsiz bo\'ladi',
    reference: 'Buxoriy, Muslim'
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'Sizning eng yaxshingiz Quroni karimni o\'rganib, boshqalarga o\'rgatgan kishidir',
    reference: 'Buxoriy'
  },
  {
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    translation: 'Duoda ibodat bor',
    reference: 'Tirmizi'
  },
  {
    arabic: 'الصَّبْرُ مِفْتَاحُ الْفَرَجِ',
    translation: 'Sabr - ochilish kaliti',
    reference: 'Tabaroniy'
  }
]

const dailyDhikrs: DailyDhikr[] = [
  {
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'Subhanalloh',
    translation: 'Alloh pokdir',
    count: 33
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Hamd Allohgadir',
    count: 33
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allohu Akbar',
    translation: 'Alloh ulug\'dir',
    count: 34
  },
  {
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'Allohdan o\'zga iloh yo\'q',
    count: 100
  },
  {
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'Allohdan magfirat so\'rayman',
    count: 100
  }
]

export default function Home() {
  const { t } = useLanguage()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null)
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [city, setCity] = useState('Toshkent')
  const [hijriDate, setHijriDate] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null)
  const [dailyHadith, setDailyHadith] = useState<DailyHadith | null>(null)
  const [dailyDhikr, setDailyDhikr] = useState<DailyDhikr>(dailyDhikrs[0])
  const [nextHoliday, setNextHoliday] = useState<IslamicHoliday | null>(null)
  const [islamicMonths, setIslamicMonths] = useState<Record<string, { number: number; en: string; ar: string }>>({})

  useEffect(() => {
    // Auto-detect location on page load with high accuracy
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Detected location:', { latitude, longitude, accuracy: position.coords.accuracy })
          // Find nearest city from our list
          const nearestCity = findNearestCity(latitude, longitude)
          if (nearestCity) {
            setCity(nearestCity)
          }
        },
        (error) => {
          console.error('Joylashuvni olishda xatolik:', error)
          // Fallback to default city if geolocation fails
          loadPrayerTimes()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      loadPrayerTimes()
    }

    loadHijriDate()
    loadDailyContent()
    loadIslamicMonths()
    loadNextHoliday()
    setCurrentDate(new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }))
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadPrayerTimes()
  }, [city])

  const loadPrayerTimes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uzbekistan&method=2`)
      const data = await response.json()
      if (data.code === 200) {
        setPrayerTimes(data.data.timings)
        calculateNextPrayer(data.data.timings)
      }
    } catch (error) {
      console.error('Namoz vaqtlarini yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateNextPrayer = (timings: PrayerTime) => {
    const now = new Date()
    const prayers = [
      { name: 'Bomdod', time: timings.Fajr },
      { name: 'Quyosh', time: timings.Sunrise },
      { name: 'Peshin', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Shom', time: timings.Maghrib },
      { name: 'Hufton', time: timings.Isha },
    ]

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':')
      const prayerTime = new Date()
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0)
      
      if (prayerTime > now) {
        setNextPrayer(prayer)
        return
      }
    }
    
    setNextPrayer(prayers[0])
  }

  const updateTimeRemaining = () => {
    if (!nextPrayer) return

    const now = new Date()
    const [hours, minutes] = nextPrayer.time.split(':')
    const prayerTime = new Date()
    prayerTime.setHours(parseInt(hours), parseInt(minutes), 0)

    if (prayerTime <= now) {
      prayerTime.setDate(prayerTime.getDate() + 1)
    }

    const diff = prayerTime.getTime() - now.getTime()
    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const s = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
  }

  const loadHijriDate = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/gToH')
      const data = await response.json()
      if (data.code === 200) {
        const hijri = data.data.hijri
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`)
      }
    } catch (error) {
      console.error('Hijriy sanani yuklashda xatolik:', error)
    }
  }

  const loadDailyContent = async () => {
    try {
      // Fetch random Quran verse from UmmahAPI
      const verseResponse = await fetch('/api/quran/random')
      if (verseResponse.ok) {
        const verseData = await verseResponse.json()
        if (verseData && verseData.ayah) {
          setDailyVerse({
            arabic: verseData.ayah.arabic,
            translation: verseData.ayah.translation || 'Qur\'on oyati',
            reference: `${verseData.surah.name} - ${verseData.ayah.number}`
          })
        }
      }

      // Fetch random hadith from UmmahAPI
      const hadithResponse = await fetch('/api/hadith/random')
      if (hadithResponse.ok) {
        const hadithData = await hadithResponse.json()
        if (hadithData && hadithData.hadith) {
          setDailyHadith({
            arabic: hadithData.hadith.arabic,
            translation: hadithData.hadith.translation || 'Hadis',
            reference: hadithData.hadith.collection || 'Hadis'
          })
        }
      }

      // Use static dhikr for now (UmmahAPI doesn't have dhikr endpoint)
      const today = new Date().getDay()
      setDailyDhikr(dailyDhikrs[today % dailyDhikrs.length])
    } catch (error) {
      console.error('Error loading daily content:', error)
      // Fallback to static data if API fails
      const today = new Date().getDay()
      setDailyVerse(dailyVerses[today % dailyVerses.length])
      setDailyHadith(dailyHadiths[today % dailyHadiths.length])
      setDailyDhikr(dailyDhikrs[today % dailyDhikrs.length])
    }
  }

  const loadIslamicMonths = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/islamicMonths')
      const data = await response.json()
      if (data.code === 200) {
        setIslamicMonths(data.data)
      }
    } catch (error) {
      console.error('Islomiy oylarni yuklashda xatolik:', error)
    }
  }

  const loadNextHoliday = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/nextHijriHoliday')
      const data = await response.json()
      if (data.code === 200) {
        setNextHoliday({
          date: data.data.hijri.date,
          name: data.data.hijri.holidays[0] || 'Bayram',
          description: data.data.gregorian.date
        })
      }
    } catch (error) {
      console.error('Keyingi bayramni yuklashda xatolik:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nurvia</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v1.02</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center space-x-1 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <span>{city}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCityDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 w-48 max-h-64 overflow-y-auto">
                    {cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCity(c)
                          setShowCityDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-gray-400">•</span>
              <span>{currentDate}</span>
              <span className="text-gray-400">•</span>
              <span className="text-primary-600 dark:text-primary-400">{hijriDate}</span>
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Next Prayer Card */}
        {loading ? (
          <div className="card p-6 mb-6 bg-gradient-to-br from-primary-500 to-emerald-600 border-0 text-white flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : nextPrayer ? (
          <div className="card p-6 mb-6 bg-gradient-to-br from-primary-500 to-emerald-600 border-0 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-100 text-sm mb-1">{t('next_prayer')}</p>
                <p className="text-3xl font-bold">{nextPrayer.name}</p>
              </div>
              <button
                onClick={loadPrayerTimes}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <p className="text-5xl font-bold mb-2">{timeRemaining}</p>
            <p className="text-primary-100">{nextPrayer.time}</p>
          </div>
        ) : null}

        {/* Prayer Times */}
        {prayerTimes && (
          <div className="card p-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Bomdod', time: prayerTimes.Fajr },
                { name: 'Quyosh', time: prayerTimes.Sunrise },
                { name: 'Peshin', time: prayerTimes.Dhuhr },
                { name: 'Asr', time: prayerTimes.Asr },
                { name: 'Shom', time: prayerTimes.Maghrib },
                { name: 'Hufton', time: prayerTimes.Isha },
              ].map((prayer) => (
                <div
                  key={prayer.name}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{prayer.name}</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{prayer.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              {t('prayer_times')}: <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Aladhan API</a>
            </div>
          </div>
        )}

        {/* Daily Content */}
        <div className="space-y-4 mb-6">
          {nextHoliday && (
            <div className="card p-5 bg-gradient-to-r from-gold-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-gold-200 dark:border-yellow-700">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🎉</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('next_holiday')}</h3>
              </div>
              <p className="text-xl font-bold text-gold-700 dark:text-gold-400 mb-1">{nextHoliday.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{nextHoliday.date}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">{nextHoliday.description}</p>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('daily_verse')}</h3>
            </div>
            {dailyVerse ? (
              <>
                <p className="font-arabic text-right text-xl mb-2 text-gray-900 dark:text-white leading-loose" dir="rtl">
                  {dailyVerse.arabic}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{dailyVerse.translation}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">{dailyVerse.reference}</p>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('daily_hadith')}</h3>
            </div>
            {dailyHadith ? (
              <>
                <p className="font-arabic text-right text-xl mb-2 text-gray-900 dark:text-white leading-loose" dir="rtl">
                  {dailyHadith.arabic}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{dailyHadith.translation}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">{dailyHadith.reference}</p>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center space-x-2 mb-3">
              <CircleDot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('daily_dhikr')}</h3>
            </div>
            <p className="font-arabic text-right text-2xl mb-2 text-gray-900 dark:text-white leading-loose" dir="rtl">
              {dailyDhikr.arabic}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{dailyDhikr.transliteration} - {dailyDhikr.translation}</p>
            <p className="text-xs text-primary-600 dark:text-primary-400">{dailyDhikr.count} marta</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/quran" className="btn-primary p-6 flex flex-col items-center">
            <BookOpen className="w-8 h-8 mb-2" />
            <span className="font-semibold">Qur&apos;on</span>
          </Link>
          <Link href="/duolar" className="btn-primary p-6 flex flex-col items-center">
            <MessageSquare className="w-8 h-8 mb-2" />
            <span className="font-semibold">Duolar</span>
          </Link>
          <Link href="/asboblar" className="btn-primary p-6 flex flex-col items-center">
            <Compass className="w-8 h-8 mb-2" />
            <span className="font-semibold">Qibla</span>
          </Link>
          <Link href="/asboblar" className="btn-primary p-6 flex flex-col items-center">
            <CircleDot className="w-8 h-8 mb-2" />
            <span className="font-semibold">Tasbeh</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
