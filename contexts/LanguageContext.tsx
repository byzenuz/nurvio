'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'uz' | 'uz-cyrl' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    // Common
    'home': 'Bosh sahifa',
    'namoz': 'Namoz',
    'quran': 'Qur\'on',
    'duolar': 'Duolar',
    'asboblar': 'Vositalar',
    'loading': 'Yuklanmoqda...',
    'search': 'Qidirish',
    'back': 'Orqaga',
    
    // Home page
    'next_prayer': 'Keyingi namoz',
    'prayer_times': 'Namoz vaqtlari',
    'daily_verse': 'Bugungi oyat',
    'daily_hadith': 'Bugungi hadis',
    'daily_dhikr': 'Bugungi zikr',
    'next_holiday': 'Keyingi bayram',
    
    // Prayer times
    'fajr': 'Bomdod',
    'sunrise': 'Quyosh',
    'dhuhr': 'Peshin',
    'asr': 'Asr',
    'maghrib': 'Shom',
    'isha': 'Hufton',
    
    // Namoz page
    'today': 'Bugun',
    'weekly': 'Haftalik',
    'monthly': 'Oylik',
    'learn': 'Rakat',
    'tahorat': 'Tahorat',
    'duas': 'Duolar',
    'qazo': 'Qazo',
    'qazo_calculator': 'Qazo namoz hisoblagichi',
    'total_qazo': 'Jami qazo namozlar',
    'times': 'Vaqtlar',
    
    // Quran page
    'surahs': 'Suralar',
    'search_surah': 'Sura qidiring...',
    'ayahs': 'Oyatlar',
    'bookmarks': 'Bookmarklar',
    'favorites': 'Sevimlilar',
    'audio': 'Audio',
    'copy': 'Nusxa olish',
    'copied': 'Nusxa olindi',
    
    // Duolar page
    'categories': 'Kategoriyalar',
    'search_dua': 'Dua qidiring...',
    'arabic': 'Arabcha',
    'transliteration': 'O\'qilishi',
    'translation': 'Ma\'nosi',
    'reference': 'Manba',
    
    // Asboblar page
    'qibla': 'Qibla',
    'tasbeh': 'Tasbeh',
    'hijri': 'Hijriy',
    'masjid': 'Masjid',
    'compass_permission': 'Kompas ruxsatini so\'rang',
    'start_compass': 'Kompasni boshlang',
    'get_location': 'Joylashuvni olish',
    'location_detected': 'Joylashuv aniqlandi',
    'north': 'Shimol',
    'qibla_direction': 'Qibla',
    'location': 'Joylashuv',
    'latitude': 'Kenglik',
    'longitude': 'Uzunlik',
    'count': 'Hisob',
    'target': 'Maqsad',
    'reset': 'Qayta',
    'history': 'Tarix',
    'gregorian_date': 'Gregorian sana',
    'hijri_date': 'Hijriy sana',
    'special_days': 'Maxsus kunlar',
    'islamic_months': 'Hijriy oy nomlari',
    'find_mosque': 'Masjid topish',
    'mosque_search': 'Masjid qidiring...',
    'directions': 'Yo\'nalish',
    'distance': 'km',
  },
  'uz-cyrl': {
    // Common
    'home': 'Бош саҳифа',
    'namoz': 'Намоз',
    'quran': 'Қуръон',
    'duolar': 'Дуолар',
    'asboblar': 'Воситалар',
    'loading': 'Юкланмоқда...',
    'search': 'Қидириш',
    'back': 'Орқага',
    
    // Home page
    'next_prayer': 'Кейинги намоз',
    'prayer_times': 'Намоз вақтлари',
    'daily_verse': 'Бугунги оят',
    'daily_hadith': 'Бугунги ҳадис',
    'daily_dhikr': 'Бугунги зикр',
    'next_holiday': 'Кейинги байрам',
    
    // Prayer times
    'fajr': 'Бомдод',
    'sunrise': 'Қуёш',
    'dhuhr': 'Пешин',
    'asr': 'Аср',
    'maghrib': 'Шом',
    'isha': 'Ҳуфтон',
    
    // Namoz page
    'today': 'Бугун',
    'weekly': 'Ҳафталик',
    'monthly': 'Ойлик',
    'learn': 'Ракат',
    'tahorat': 'Таҳорат',
    'duas': 'Дуолар',
    'qazo': 'Қазо',
    'qazo_calculator': 'Қазо намоз ҳисоблагичи',
    'total_qazo': 'Жами қазо намозлар',
    'times': 'Вақтлар',
    
    // Quran page
    'surahs': 'Суралар',
    'search_surah': 'Сура қидиринг...',
    'ayahs': 'Оятлар',
    'bookmarks': 'Букмарклар',
    'favorites': 'Севимлилар',
    'audio': 'Аудио',
    'copy': 'Нусха олиш',
    'copied': 'Нусха олинди',
    
    // Duolar page
    'categories': 'Категориялар',
    'search_dua': 'Дуа қидиринг...',
    'arabic': 'Арабча',
    'transliteration': 'Ўқилиши',
    'translation': 'Маъноси',
    'reference': 'Манба',
    
    // Asboblar page
    'qibla': 'Қибла',
    'tasbeh': 'Тасбеҳ',
    'hijri': 'Ҳижрий',
    'masjid': 'Масжид',
    'compass_permission': 'Компас рухсатини сўранг',
    'start_compass': 'Компасни бошланг',
    'get_location': 'Жойлашувни олиш',
    'location_detected': 'Жойлашув аниқланди',
    'north': 'Шимол',
    'qibla_direction': 'Қибла',
    'location': 'Жойлашув',
    'latitude': 'Кенглик',
    'longitude': 'Узунлик',
    'count': 'Ҳисоб',
    'target': 'Мақсад',
    'reset': 'Қайта',
    'history': 'Тарих',
    'gregorian_date': 'Грегориан санаси',
    'hijri_date': 'Ҳижрий санаси',
    'special_days': 'Махсус кунлар',
    'islamic_months': 'Ҳижрий ой номлари',
    'find_mosque': 'Масжид топиш',
    'mosque_search': 'Масжид қидиринг...',
    'directions': 'Йўналиш',
    'distance': 'км',
  },
  ru: {
    // Common
    'home': 'Главная',
    'namoz': 'Намаз',
    'quran': 'Коран',
    'duolar': 'Молитвы',
    'asboblar': 'Инструменты',
    'loading': 'Загрузка...',
    'search': 'Поиск',
    'back': 'Назад',
    
    // Home page
    'next_prayer': 'Следующий намаз',
    'prayer_times': 'Время намаза',
    'daily_verse': 'Аят дня',
    'daily_hadith': 'Хадис дня',
    'daily_dhikr': 'Зикр дня',
    'next_holiday': 'Следующий праздник',
    
    // Prayer times
    'fajr': 'Фаджр',
    'sunrise': 'Восход',
    'dhuhr': 'Зухр',
    'asr': 'Аср',
    'maghrib': 'Магриб',
    'isha': 'Иша',
    
    // Namoz page
    'today': 'Сегодня',
    'weekly': 'Недельный',
    'monthly': 'Месячный',
    'learn': 'Ракат',
    'tahorat': 'Омовение',
    'duas': 'Молитвы',
    'qazo': 'Каза',
    'qazo_calculator': 'Калькулятор каза-намаза',
    'total_qazo': 'Всего каза-намазов',
    'times': 'Время',
    
    // Quran page
    'surahs': 'Суры',
    'search_surah': 'Поиск суры...',
    'ayahs': 'Аяты',
    'bookmarks': 'Закладки',
    'favorites': 'Избранное',
    'audio': 'Аудио',
    'copy': 'Копировать',
    'copied': 'Скопировано',
    
    // Duolar page
    'categories': 'Категории',
    'search_dua': 'Поиск молитвы...',
    'arabic': 'Арабский',
    'transliteration': 'Транслитерация',
    'translation': 'Перевод',
    'reference': 'Источник',
    
    // Asboblar page
    'qibla': 'Кибла',
    'tasbeh': 'Тасбих',
    'hijri': 'Хиджра',
    'masjid': 'Мечеть',
    'compass_permission': 'Запросить разрешение компаса',
    'start_compass': 'Запустить компас',
    'get_location': 'Получить местоположение',
    'location_detected': 'Местоположение определено',
    'north': 'Север',
    'qibla_direction': 'Кибла',
    'location': 'Местоположение',
    'latitude': 'Широта',
    'longitude': 'Долгота',
    'count': 'Счёт',
    'target': 'Цель',
    'reset': 'Сброс',
    'history': 'История',
    'gregorian_date': 'Григорианская дата',
    'hijri_date': 'Дата хиджры',
    'special_days': 'Особые дни',
    'islamic_months': 'Исламские месяцы',
    'find_mosque': 'Найти мечеть',
    'mosque_search': 'Поиск мечети...',
    'directions': 'Направление',
    'distance': 'км',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.uz] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
