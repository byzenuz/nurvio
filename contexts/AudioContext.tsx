'use client'

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react'

interface AudioContextType {
  isPlaying: boolean
  currentAudio: string | null
  currentTitle: string | null
  currentTime: number
  duration: number
  playAudio: (url: string, title: string) => void
  pauseAudio: () => void
  stopAudio: () => void
  setVolume: (volume: number) => void
  volume: number
  seekTo: (time: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState<string | null>(null)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentAudio(null)
      setCurrentTitle(null)
      setCurrentTime(0)
      setDuration(0)
    })

    audio.addEventListener('error', () => {
      setIsPlaying(false)
      console.error('Audio error')
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    return () => {
      audio.removeEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentAudio(null)
        setCurrentTitle(null)
        setCurrentTime(0)
        setDuration(0)
      })
      audio.removeEventListener('error', () => {
        console.error('Audio error')
      })
      audio.removeEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })
      audio.removeEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
    }
  }, [])

  const playAudio = (url: string, title: string) => {
    if (audioRef.current) {
      if (currentAudio === url && isPlaying) {
        pauseAudio()
        return
      }
      
      audioRef.current.src = url
      audioRef.current.volume = volume
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setCurrentAudio(url)
          setCurrentTitle(title)
        })
        .catch((error) => {
          console.error('Error playing audio:', error)
        })
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentAudio(null)
      setCurrentTitle(null)
      setCurrentTime(0)
      setDuration(0)
    }
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentAudio,
      currentTitle,
      currentTime,
      duration,
      playAudio,
      pauseAudio,
      stopAudio,
      setVolume: handleSetVolume,
      volume,
      seekTo
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
