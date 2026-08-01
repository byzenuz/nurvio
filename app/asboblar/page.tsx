'use client'

import { useState, useEffect } from 'react'
import { Compass, Navigation, MapPin, RefreshCw, CircleDot, Calendar, Map } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Location {
  latitude: number
  longitude: number
}

interface Masjid {
  name: string
  address: string
  lat: number
  lng: number
  distance?: number
}

interface HistoryEntry {
  count: number
  target: number
  timestamp: string
}

export default function AsboblarPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'qibla' | 'tasbeh' | 'hijri' | 'masjid'>('qibla')

  // Qibla state
  const [direction, setDirection] = useState<number | null>(null)
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [permission, setPermission] = useState<'prompt' | 'request' | 'granted'>('prompt')

  // Tasbeh state
  const [count, setCount] = useState(0)
  const [target, setTarget] = useState(33)
  const [vibration, setVibration] = useState(true)
  const [sound, setSound] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [hijriDate, setHijriDate] = useState('')
  const [islamicMonths, setIslamicMonths] = useState<Record<string, { number: number; en: string; ar: string }>>({})
  const [specialDays, setSpecialDays] = useState<Array<{ month: number; day: number; name: string }>>([])

  // Masjid state
  const [masjids, setMasjids] = useState<Masjid[]>([])
  const [masjidSearch, setMasjidSearch] = useState('')

  useEffect(() => {
    loadTasbehSettings()
    loadTasbehHistory()
    checkPermission()
    loadHijriDate()
    loadIslamicMonths()
    loadSpecialDays()
    
    // Auto-detect location on page load with high accuracy
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Detected location:', { latitude, longitude, accuracy: position.coords.accuracy })
          setLocation({
            latitude,
            longitude
          })
          calculateQiblaDirection(latitude, longitude)
          loadNearbyMasjids(latitude, longitude)
        },
        (error) => {
          console.error('Joylashuvni olishda xatolik:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  }, [])

  // Auto-start compass when permission is granted and location is available
  useEffect(() => {
    if (permission === 'granted' && location) {
      startCompass()
    }
  }, [permission, location])

  // Auto-switch to masjid tab when location is detected and masjids are loaded
  useEffect(() => {
    if (location && masjids.length > 0 && activeTab !== 'masjid') {
      setActiveTab('masjid')
    }
  }, [location, masjids])

  // Qibla functions
  const checkPermission = () => {
    if ('DeviceOrientationEvent' in window) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setPermission('request')
      } else {
        setPermission('granted')
      }
    }
  }

  const requestPermission = async () => {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission()
      if (permission === 'granted') {
        setPermission('granted')
        startCompass()
      }
    } catch (error) {
      console.error('Ruxsat so\'rashda xatolik:', error)
    }
  }

  const startCompass = () => {
    if ('DeviceOrientationEvent' in window) {
      // Remove existing listener to avoid duplicates
      window.removeEventListener('deviceorientation', handleOrientation)
      window.addEventListener('deviceorientation', handleOrientation, true)
    }
  }

  const handleOrientation = (event: DeviceOrientationEvent) => {
    console.log('Orientation event:', event)
    
    // Try to use webkitCompassHeading for iOS devices first
    if ('webkitCompassHeading' in event && (event as any).webkitCompassHeading !== null && (event as any).webkitCompassHeading !== 0) {
      const heading = (event as any).webkitCompassHeading
      console.log('iOS heading:', heading)
      setDirection(heading)
    } else if (event.alpha !== null && !isNaN(event.alpha) && event.alpha !== 0) {
      // Fallback to alpha for Android devices
      const androidHeading = 360 - event.alpha
      console.log('Android heading:', androidHeading)
      setDirection(androidHeading)
    } else {
      console.log('No orientation data available - device may not have compass sensors')
      setDirection(null)
    }
  }

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          calculateQiblaDirection(position.coords.latitude, position.coords.longitude)
          loadNearbyMasjids(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('Joylashuvni olishda xatolik:', error)
        }
      )
    }
  }

  const calculateQiblaDirection = (lat: number, lng: number) => {
    const kaabaLat = 21.4225
    const kaabaLng = 39.8262

    const latRad = (lat * Math.PI) / 180
    const lngRad = (lng * Math.PI) / 180
    const kaabaLatRad = (kaabaLat * Math.PI) / 180
    const kaabaLngRad = (kaabaLng * Math.PI) / 180

    const y = Math.sin(kaabaLngRad - lngRad)
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad)

    let qibla = (Math.atan2(y, x) * 180) / Math.PI
    qibla = (qibla + 360) % 360

    setQiblaDirection(qibla)
  }

  const getCompassRotation = () => {
    if (direction === null) return 0
    return direction
  }

  const getQiblaAngle = () => {
    if (qiblaDirection === null || direction === null) return 0
    return qiblaDirection - direction
  }

  // Tasbeh functions
  const loadTasbehSettings = () => {
    const savedCount = localStorage.getItem('tasbih-count')
    if (savedCount) {
      setCount(parseInt(savedCount))
    }

    const savedTarget = localStorage.getItem('tasbih-target')
    if (savedTarget) {
      setTarget(parseInt(savedTarget))
    }

    const savedVibration = localStorage.getItem('tasbih-vibration')
    if (savedVibration) {
      setVibration(savedVibration === 'true')
    }

    const savedSound = localStorage.getItem('tasbih-sound')
    if (savedSound) {
      setSound(savedSound === 'true')
    }
  }

  const loadTasbehHistory = () => {
    const savedHistory = localStorage.getItem('tasbih-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }

  const increment = () => {
    const newCount = count + 1
    setCount(newCount)

    if (vibration && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    if (sound) {
      playClickSound()
    }

    if (newCount === target) {
      if (vibration && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
      saveToHistory(newCount)
      setCount(0)
    }
  }

  const reset = () => {
    if (count > 0) {
      saveToHistory(count)
    }
    setCount(0)
  }

  const saveToHistory = (completedCount: number) => {
    const newEntry: HistoryEntry = {
      count: completedCount,
      target: target,
      timestamp: new Date().toISOString()
    }

    const newHistory = [newEntry, ...history].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem('tasbih-history', JSON.stringify(newHistory))
  }

  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return

      const audioContext = new AudioContextClass()
      
      // Resume audio context if suspended (required by modern browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.error('Audio ijrosida xatolik:', error)
    }
  }

  const changeTarget = (newTarget: number) => {
    setTarget(newTarget)
    localStorage.setItem('tasbih-target', newTarget.toString())
    setCount(0)
  }

  const getProgress = () => {
    if (target === 0) return 0
    return (count / target) * 100
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const loadSpecialDays = async () => {
    try {
      const response = await fetch('https://api.aladhan.com/v1/specialDays')
      const data = await response.json()
      if (data.code === 200) {
        setSpecialDays(data.data)
      }
    } catch (error) {
      console.error('Maxsus kunlarni yuklashda xatolik:', error)
    }
  }

  const loadNearbyMasjids = (userLat: number, userLng: number) => {
    // Sample masjid data with coordinates (Tashkent area)
    const allMasjids: Masjid[] = [
      { name: 'Xasti Imom masjidi', address: 'Toshkent shahri, Eski shahar', lat: 41.3172, lng: 69.2693 },
      { name: 'Tillya Sheyx masjidi', address: 'Toshkent shahri, Yunusobod tumani', lat: 41.3520, lng: 69.2840 },
      { name: 'Minor masjidi', address: 'Toshkent shahri, Mirzo Ulug\'bek tumani', lat: 41.3450, lng: 69.3100 },
      { name: 'Abu Bakr Siddiq masjidi', address: 'Toshkent shahri, Chilonzor tumani', lat: 41.2800, lng: 69.2200 },
      { name: 'Xoja Ahrori Vali masjidi', address: 'Toshkent shahri, Shayxontohur tumani', lat: 41.3300, lng: 69.2500 },
      { name: 'Imom Buxoriy masjidi', address: 'Toshkent shahri, Yakkasaroy tumani', lat: 41.3200, lng: 69.3000 },
    ]

    // Calculate distances and sort
    const masjidsWithDistance = allMasjids.map(masjid => {
      const distance = calculateDistance(userLat, userLng, masjid.lat, masjid.lng)
      return { ...masjid, distance }
    }).sort((a, b) => a.distance - b.distance)

    setMasjids(masjidsWithDistance.slice(0, 5))
  }

  const searchMasjids = (query: string) => {
    if (!location) return
    
    const allMasjids: Masjid[] = [
      { name: 'Xasti Imom masjidi', address: 'Toshkent shahri, Eski shahar', lat: 41.3172, lng: 69.2693 },
      { name: 'Tillya Sheyx masjidi', address: 'Toshkent shahri, Yunusobod tumani', lat: 41.3520, lng: 69.2840 },
      { name: 'Minor masjidi', address: 'Toshkent shahri, Mirzo Ulug\'bek tumani', lat: 41.3450, lng: 69.3100 },
      { name: 'Abu Bakr Siddiq masjidi', address: 'Toshkent shahri, Chilonzor tumani', lat: 41.2800, lng: 69.2200 },
      { name: 'Xoja Ahrori Vali masjidi', address: 'Toshkent shahri, Shayxontohur tumani', lat: 41.3300, lng: 69.2500 },
      { name: 'Imom Buxoriy masjidi', address: 'Toshkent shahri, Yakkasaroy tumani', lat: 41.3200, lng: 69.3000 },
    ]

    const filtered = allMasjids.filter(masjid => 
      masjid.name.toLowerCase().includes(query.toLowerCase()) ||
      masjid.address.toLowerCase().includes(query.toLowerCase())
    )

    const masjidsWithDistance = filtered.map(masjid => {
      const distance = calculateDistance(location.latitude, location.longitude, masjid.lat, masjid.lng)
      return { ...masjid, distance }
    }).sort((a, b) => a.distance - b.distance)

    setMasjids(masjidsWithDistance)
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

  const getDirections = (masjid: Masjid) => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${masjid.lat},${masjid.lng}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧭 {t('asboblar')}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v1.02</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'qibla', label: 'qibla', icon: Compass },
            { id: 'tasbeh', label: 'tasbeh', icon: CircleDot },
            { id: 'hijri', label: 'hijri', icon: Calendar },
            { id: 'masjid', label: 'masjid', icon: Map },
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

        {activeTab === 'qibla' && (
          <div className="card p-6">
            {permission === 'request' && (
              <button
                onClick={requestPermission}
                className="w-full mb-6 btn-primary py-3"
              >
                {t('compass_permission')}
              </button>
            )}

            {permission === 'granted' && !direction && (
              <button
                onClick={startCompass}
                className="w-full mb-6 btn-primary py-3"
              >
                {t('start_compass')}
              </button>
            )}

            {!location && (
              <button
                onClick={getLocation}
                className="w-full mb-6 btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>{t('get_location')}</span>
              </button>
            )}

            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64">
                <div
                  className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  style={{ transform: `rotate(${getCompassRotation()}deg)` }}
                >
                  <div className="absolute top-2 text-2xl">N</div>
                  <div className="absolute bottom-2 text-2xl">S</div>
                  <div className="absolute left-2 text-2xl">W</div>
                  <div className="absolute right-2 text-2xl">E</div>
                </div>

                <div className="absolute inset-4 rounded-full border-2 border-primary-500 flex items-center justify-center">
                  <Navigation
                    className="w-12 h-12 text-primary-600 dark:text-primary-400"
                    style={{ transform: `rotate(${getQiblaAngle()}deg)` }}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('north')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {direction !== null ? `${Math.round(direction)}°` : '--'}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('qibla_direction')}</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {qiblaDirection !== null ? `${Math.round(qiblaDirection)}°` : '--'}
                </p>
              </div>
            </div>

            {location && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <p className="font-medium text-gray-900 dark:text-white">{t('location')}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('latitude')}: {location.latitude.toFixed(4)}°
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('longitude')}: {location.longitude.toFixed(4)}°
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasbeh' && (
          <div className="card p-6">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[33, 99, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => changeTarget(t)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      target === t
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t === 0 ? 'Cheksiz' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={increment}
                className="w-64 h-64 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center"
              >
                <CircleDot className="w-16 h-16 mb-2" />
                <span className="text-6xl font-bold">{count}</span>
                {target > 0 && (
                  <span className="text-sm mt-2 opacity-75">/ {target}</span>
                )}
              </button>
            </div>

            {target > 0 && (
              <div className="mb-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {Math.round(getProgress())}% tugallandi
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={reset}
                className="btn-secondary px-6 py-3 flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Qayta</span>
              </button>

              <button
                onClick={() => setVibration(!vibration)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  vibration
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xl">📳</span>
              </button>

              <button
                onClick={() => setSound(!sound)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  sound
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                🎵
              </button>
            </div>

            {history.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tarix</h3>
                <div className="space-y-2">
                  {history.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.count} zikr
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Maqsad: {entry.target === 0 ? 'Cheksiz' : entry.target}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hijri' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('hijri')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('gregorian_date')}</label>
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  readOnly
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('hijri_date')}</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{hijriDate}</p>
              </div>
              
              {specialDays.length > 0 && (
                <div className="bg-gold-50 dark:bg-gold-900/20 rounded-xl p-4 border border-gold-200 dark:border-gold-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('special_days')}</p>
                  <div className="space-y-2">
                    {specialDays.slice(0, 3).map((day, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-lg">🎉</span>
                        <span className="text-gray-900 dark:text-white">{day.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">{t('islamic_months')}:</p>
                <ul className="space-y-1">
                  {Object.values(islamicMonths).length > 0 ? (
                    Object.values(islamicMonths).map((month) => (
                      <li key={month.number}>{month.number}. {month.en}</li>
                    ))
                  ) : (
                    <>
                      <li>1. Muharram - Muqaddas oy</li>
                      <li>2. Safar - Bo&apos;sh oy</li>
                      <li>3. Rabi&apos;ul-avval - Birinchi bahor</li>
                      <li>4. Rabi&apos;ul-oxir - Ikkinchi bahor</li>
                      <li>5. Jumodil-ula - Birinchi quruq</li>
                      <li>6. Jumodil-oxira - Ikkinchi quruq</li>
                      <li>7. Rajab - Sharafli oy</li>
                      <li>8. Sha&apos;bon - Ayriluvchi oy</li>
                      <li>9. Ramazon - Ro&apos;za oyi</li>
                      <li>10. Shavvol - Ko&apos;tariluvchi oy</li>
                      <li>11. Zulqa&apos;da - Tinch oyi</li>
                      <li>12. Zulhijja - Haj oyi</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'masjid' && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('find_mosque')}</h2>
            <div className="space-y-4">
              {!location ? (
                <button
                  onClick={getLocation}
                  className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t('get_location')}</span>
                </button>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-green-700 dark:text-green-300 text-sm">
                  ✓ {t('location_detected')}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('mosque_search')}
                  value={masjidSearch}
                  onChange={(e) => {
                    setMasjidSearch(e.target.value)
                    searchMasjids(e.target.value)
                  }}
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-3">
                {masjids.length > 0 ? (
                  masjids.map((masjid, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{masjid.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{masjid.address}</p>
                        </div>
                        <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                          {masjid.distance?.toFixed(1) || '--'} {t('distance')}
                        </span>
                      </div>
                      <button 
                        onClick={() => getDirections(masjid)}
                        className="w-full btn-secondary py-2 text-sm"
                      >
                        {t('directions')}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    {location ? t('loading') : t('get_location')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
