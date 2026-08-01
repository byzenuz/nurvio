'use client'

import { useState, useEffect } from 'react'
import { Clock, BookOpen, MessageSquare, Droplet, Calculator, MapPin, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface PrayerTime {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface CalendarDay {
  date: {
    gregorian: {
      date: string
    }
  }
  timings: PrayerTime
}

interface QazoCount {
  bomdod: number
  peshin: number
  asr: number
  shom: number
  hufton: number
}

export default function NamozPage() {
  const { t } = useLanguage()
  const [city, setCity] = useState('Toshkent')
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | CalendarDay[] | null>(null)
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<'today' | 'weekly' | 'monthly'>('today')
  const [activeTab, setActiveTab] = useState<'times' | 'learn' | 'tahorat' | 'duas' | 'qazo'>('times')
  const [qazoCounts, setQazoCounts] = useState<QazoCount>({
    bomdod: 0,
    peshin: 0,
    asr: 0,
    shom: 0,
    hufton: 0
  })

  const cities = [
    'Toshkent', 'Samarqand', 'Buxoro', 'Xiva', 'Qarshi', 
    'Namangan', 'Andijon', 'Fargona', 'Jizzax', 'Navoiy'
  ]

  useEffect(() => {
    loadPrayerTimes()
    loadQazoCounts()
  }, [city, date, view])

  const loadPrayerTimes = async () => {
    try {
      let url = `/api/prayer/times?city=${city}`
      
      if (view === 'weekly') {
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 6)
        url = `/api/prayer/calendar?city=${city}&month=${date.getMonth() + 1}&year=${date.getFullYear()}`
      } else if (view === 'monthly') {
        url = `/api/prayer/calendar?city=${city}&month=${date.getMonth() + 1}&year=${date.getFullYear()}`
      }

      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        if (view === 'today') {
          setPrayerTimes(data.data.timings)
        } else {
          setPrayerTimes(data.data)
        }
      }
    } catch (error) {
      console.error('Namoz vaqtlarini yuklashda xatolik:', error)
    }
  }

  const changeDate = (days: number) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    setDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('uz-UZ', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const loadQazoCounts = () => {
    const saved = localStorage.getItem('qazo-counts')
    if (saved) {
      setQazoCounts(JSON.parse(saved))
    }
  }

  const saveQazoCounts = (counts: QazoCount) => {
    setQazoCounts(counts)
    localStorage.setItem('qazo-counts', JSON.stringify(counts))
  }

  const incrementQazo = (prayer: keyof QazoCount) => {
    const newCounts = { ...qazoCounts, [prayer]: qazoCounts[prayer] + 1 }
    saveQazoCounts(newCounts)
  }

  const decrementQazo = (prayer: keyof QazoCount) => {
    if (qazoCounts[prayer] > 0) {
      const newCounts = { ...qazoCounts, [prayer]: qazoCounts[prayer] - 1 }
      saveQazoCounts(newCounts)
    }
  }

  const getTotalQazo = () => {
    return qazoCounts.bomdod + qazoCounts.peshin + qazoCounts.asr + qazoCounts.shom + qazoCounts.hufton
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🕋 {t('namoz')}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v1.02</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'times', label: 'today', icon: Clock },
            { id: 'learn', label: 'learn', icon: BookOpen },
            { id: 'tahorat', label: 'tahorat', icon: Droplet },
            { id: 'duas', label: 'duas', icon: MessageSquare },
            { id: 'qazo', label: 'qazo', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{t(tab.label)}</span>
              </button>
            )
          })}
        </div>

        {activeTab === 'times' && (
          <div className="card p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                {['today', 'weekly', 'monthly'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v as any)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === v
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {v === 'today' ? 'Bugun' : v === 'weekly' ? 'Haftalik' : 'Oylik'}
                  </button>
                ))}
              </div>

              <button
                onClick={loadPrayerTimes}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {view === 'today' && prayerTimes && (
              <>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => changeDate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(date)}</p>
                  <button
                    onClick={() => changeDate(1)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Bomdod', time: (prayerTimes as PrayerTime).Fajr },
                    { name: 'Quyosh', time: (prayerTimes as PrayerTime).Sunrise },
                    { name: 'Peshin', time: (prayerTimes as PrayerTime).Dhuhr },
                    { name: 'Asr', time: (prayerTimes as PrayerTime).Asr },
                    { name: 'Shom', time: (prayerTimes as PrayerTime).Maghrib },
                    { name: 'Hufton', time: (prayerTimes as PrayerTime).Isha },
                  ].map((prayer) => (
                    <div
                      key={prayer.name}
                      className="bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 text-center"
                    >
                      <Clock className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{prayer.name}</p>
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{prayer.time}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {view === 'weekly' && Array.isArray(prayerTimes) && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-gray-900 dark:text-white">Kun</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Bomdod</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Peshin</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Asr</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Shom</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Hufton</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prayerTimes.slice(0, 7).map((day) => (
                      <tr key={day.date.gregorian.date} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{day.date.gregorian.date}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Fajr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Dhuhr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Asr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Maghrib}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {view === 'monthly' && Array.isArray(prayerTimes) && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white dark:bg-gray-900">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-gray-900 dark:text-white">Kun</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Bomdod</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Peshin</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Asr</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Shom</th>
                      <th className="py-3 px-4 text-center text-gray-900 dark:text-white">Hufton</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prayerTimes.toReversed().map((day) => (
                      <tr key={day.date.gregorian.date} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{day.date.gregorian.date}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Fajr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Dhuhr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Asr}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Maghrib}</td>
                        <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400 font-medium">{day.timings.Isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Namoz o&apos;rganish</h2>
            <div className="space-y-4">
              {[
                { name: 'Bomdod namozi', rakats: 2, description: 'Kundalik birinchi namoz' },
                { name: 'Peshin namozi', rakats: 4, description: 'Kundalik ikkinchi namoz' },
                { name: 'Asr namozi', rakats: 4, description: 'Kundalik uchinchi namoz' },
                { name: 'Shom namozi', rakats: 3, description: 'Kundalik to\'rtinchi namoz' },
                { name: 'Hufton namozi', rakats: 4, description: 'Kundalik beshinchi namoz' },
              ].map((prayer) => (
                <div key={prayer.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{prayer.name}</h3>
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                      {prayer.rakats} rakat
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{prayer.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tahorat' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tahorat qoidalari</h2>
            <div className="space-y-4">
              {[
                { step: 1, arabic: 'بِسْمِ اللَّهِ', uzbek: 'Bismillah - Alloh nomi bilan' },
                { step: 2, arabic: 'غَسْلُ الْيَدَيْنِ', uzbek: 'Qo\'llarni yuvish' },
                { step: 3, arabic: 'الْمَضْمَضَةُ', uzbek: 'Og\'iz chayish' },
                { step: 4, arabic: 'الْإِسْتِنْشَاقُ', uzbek: 'Burun chayish' },
                { step: 5, arabic: 'غَسْلُ الْوَجْهِ', uzbek: 'Yuzni yuvish' },
                { step: 6, arabic: 'غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ', uzbek: 'Qo\'llarni tirsakgacha yuvish' },
                { step: 7, arabic: 'مَسْحُ الرَّأْسِ', uzbek: 'Boshni o\'tkazish' },
                { step: 8, arabic: 'غَسْلُ الرِّجْلَيْنِ', uzbek: 'Oyoqlarni bilakgacha yuvish' },
              ].map((step) => (
                <div key={step.step} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <p className="font-arabic text-lg text-gray-900 dark:text-white" dir="rtl">{step.arabic}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{step.uzbek}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'duas' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Namozdagi duolar</h2>
            <div className="space-y-4">
              {[
                {
                  name: 'Takbir',
                  arabic: 'اللَّهُ أَكْبَرُ',
                  transliteration: 'Allohu Akbar',
                  translation: 'Alloh ulug\'dir'
                },
                {
                  name: 'San\'a',
                  arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
                  transliteration: 'Subhaanaka Allahumma wa bihamdika wa tabaaraka ismuka wa ta\'aala jadduka wa laa ilaaha ghayruk',
                  translation: 'Sen pokdir Allohim, Sen hamdga loyiqsan, Isming barkatlidir, sharafing ulug\'dir, Sendan boshqa iloh yo\'q'
                },
                {
                  name: 'Ruku\'',
                  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
                  transliteration: 'Subhaana Rabbiyal-azim',
                  translation: 'Mening ulug\' Rabbimni tasbihlayman'
                },
                {
                  name: 'Qiyom',
                  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
                  transliteration: 'Sami\'allahu liman hamidah',
                  translation: 'Alloh o\'zini hamd qilgan kishini eshitdi'
                },
                {
                  name: 'Sujud',
                  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
                  transliteration: 'Subhaana Rabbiyal-a\'la',
                  translation: 'Mening oliy Rabbimni tasbihlayman'
                },
                {
                  name: 'Tashahhud',
                  arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
                  transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat',
                  translation: 'Tahiyyalar Allohgadir, namozlar va yaxshi ishlar Allohgadir'
                },
                {
                  name: 'Salam',
                  arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
                  transliteration: 'Assalamu alaykum wa rahmatullah',
                  translation: 'Allohimning rahmati va salomi sizga bo\'lsin'
                },
              ].map((dua) => (
                <div key={dua.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{dua.name}</h3>
                  <p className="font-arabic text-right text-lg mb-2 text-gray-900 dark:text-white" dir="rtl">{dua.arabic}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 italic">{dua.transliteration}</p>
                  <p className="text-gray-900 dark:text-white">{dua.translation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qazo' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('qazo_calculator')}</h2>
            <div className="space-y-4">
              {[
                { name: 'Bomdod', key: 'bomdod' as keyof QazoCount },
                { name: 'Peshin', key: 'peshin' as keyof QazoCount },
                { name: 'Asr', key: 'asr' as keyof QazoCount },
                { name: 'Shom', key: 'shom' as keyof QazoCount },
                { name: 'Hufton', key: 'hufton' as keyof QazoCount },
              ].map((prayer) => (
                <div key={prayer.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">{prayer.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decrementQazo(prayer.key)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xl font-bold text-primary-600 dark:text-primary-400">{qazoCounts[prayer.key]}</span>
                      <button
                        onClick={() => incrementQazo(prayer.key)}
                        className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <p className="text-center text-gray-900 dark:text-white">
                  {t('total_qazo')}: <span className="font-bold text-primary-600 dark:text-primary-400">{getTotalQazo()}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
