'use client'

import { useAudio } from '@/contexts/AudioContext'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
import { useState } from 'react'

export default function AudioPlayer() {
  const { isPlaying, currentTitle, currentAudio, pauseAudio, stopAudio, setVolume, volume, currentTime, duration, seekTo, playAudio } = useAudio()
  const [showVolume, setShowVolume] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  if (!currentTitle) return null

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.5)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio()
    } else if (currentAudio && currentTitle) {
      playAudio(currentAudio, currentTitle)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    seekTo(newTime)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {currentTitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {showVolume && (
            <div className="flex items-center space-x-2 mr-2">
              <button
                onClick={toggleMute}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          <button
            onClick={() => setShowVolume(!showVolume)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={stopAudio}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center space-x-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #059669 ${progress}%, #e5e7eb ${progress}%)`
          }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
