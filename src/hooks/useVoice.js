import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchSpeechAudio, clearSpeechAudioCache } from '../services/elevenlabs'

const createAnalyser = (audio, audioCtx) => {
  if (!audio || !audioCtx) return null
  try {
    const source = audioCtx.createMediaElementSource(audio)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    source.connect(analyser)
    analyser.connect(audioCtx.destination)
    return { source, analyser }
  } catch (error) {
    console.warn('Falha ao inicializar analisador de áudio:', error)
    return null
  }
}

export default function useVoice({ defaultVolume = 0.85 } = {}) {
  const audioRef = useRef(null)
  const queueRef = useRef([])
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const mediaSourceRef = useRef(null)
  const rafRef = useRef(null)
  const abortControllerRef = useRef(null)

  const [status, setStatus] = useState('idle')
  const [volume, setVolumeState] = useState(defaultVolume)
  const [muted, setMuted] = useState(false)
  const [level, setLevel] = useState(0)
  const [queueLength, setQueueLength] = useState(0)
  const [error, setError] = useState(null)

  const updateQueueLength = useCallback(() => {
    setQueueLength(queueRef.current.length)
  }, [])

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (mediaSourceRef.current) {
      try {
        mediaSourceRef.current.disconnect()
      } catch (err) {
        // ignore
      }
      mediaSourceRef.current = null
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setLevel(0)
    setStatus('idle')
  }, [])

  const resetQueue = useCallback(() => {
    queueRef.current = []
    updateQueueLength()
  }, [updateQueueLength])

  const cancel = useCallback(() => {
    stopPlayback()
    resetQueue()
  }, [resetQueue, stopPlayback])

  const updateLevel = useCallback(() => {
    if (!analyserRef.current || status !== 'playing') {
      setLevel(0)
      return
    }

    const buffer = new Uint8Array(analyserRef.current.fftSize)
    analyserRef.current.getByteTimeDomainData(buffer)
    let sum = 0
    for (let i = 0; i < buffer.length; i += 1) {
      sum += Math.abs(buffer[i] - 128)
    }

    const nextLevel = Math.min(1, sum / (buffer.length * 128))
    setLevel((current) => (Math.abs(current - nextLevel) > 0.001 ? nextLevel : current))
    rafRef.current = requestAnimationFrame(updateLevel)
  }, [status])

  const createAudioNode = useCallback(
    (audio) => {
      if (typeof window === 'undefined' || !audio) return
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioCtxRef.current = new AudioContext()
      }
      if (mediaSourceRef.current) {
        try {
          mediaSourceRef.current.disconnect()
        } catch (err) {
          // ignore
        }
        mediaSourceRef.current = null
      }
      analyserRef.current = null
      const node = createAnalyser(audio, audioCtxRef.current)
      if (node) {
        mediaSourceRef.current = node.source
        analyserRef.current = node.analyser
      }
    },
    []
  )

  const setVolume = useCallback(
    (nextVolume) => {
      const value = Math.max(0, Math.min(1, nextVolume))
      setVolumeState(value)
      if (audioRef.current && !muted) {
        audioRef.current.volume = value
      }
    },
    [muted]
  )

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current
      if (audioRef.current) {
        audioRef.current.muted = next
      }
      return next
    })
  }, [])

  const playNext = useCallback(async () => {
    if (queueRef.current.length === 0) {
      setStatus('idle')
      setLevel(0)
      return
    }

    const currentEntry = queueRef.current.shift()
    updateQueueLength()
    abortControllerRef.current = new AbortController()
    setStatus('loading')

    try {
      const { url } = await fetchSpeechAudio(
        currentEntry.text,
        abortControllerRef.current.signal,
        currentEntry.voiceId,
        currentEntry.voiceSettings
      )
      if (abortControllerRef.current.signal.aborted) {
        setStatus('idle')
        return
      }

      const audio = new Audio(url)
      audio.crossOrigin = 'anonymous'
      audio.volume = muted ? 0 : volume
      audio.muted = muted
      audioRef.current = audio

      audio.onplay = () => {
        setStatus('playing')
        currentEntry.onStart?.()
        createAudioNode(audio)
        if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {})
        }
        rafRef.current = requestAnimationFrame(updateLevel)
      }

      audio.onended = () => {
        currentEntry.onEnd?.()
        playNext()
      }

      audio.onerror = (event) => {
        setError('Não foi possível reproduzir o áudio da assistente.')
        currentEntry.onError?.(event)
        playNext()
      }

      await audio.play()
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      console.error('Erro na fila de áudio:', err)
      setError(err.message || 'Erro ao reproduzir áudio.')
      currentEntry.onError?.(err)
      playNext()
    }
  }, [createAudioNode, muted, updateLevel, updateQueueLength, volume])

  const enqueueSpeech = useCallback(
    (text, callbacks = {}) => {
      queueRef.current.push({ text, ...callbacks })
      updateQueueLength()
      if (status === 'idle' || status === 'paused') {
        playNext()
      }
    },
    [playNext, status, updateQueueLength]
  )

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setStatus('paused')
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        console.warn('Falha ao retomar áudio:', err)
      })
      setStatus('playing')
    } else if (status === 'idle' && queueRef.current.length > 0) {
      playNext()
    }
  }, [playNext, status])

  useEffect(() => {
    return () => {
      cancel()
      clearSpeechAudioCache()
    }
  }, [cancel])

  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'

  return useMemo(
    () => ({
      enqueueSpeech,
      cancel,
      pause,
      resume,
      stop: cancel,
      volume,
      setVolume,
      muted,
      toggleMute,
      isPlaying,
      isPaused,
      status,
      level,
      queueLength,
      error,
    }),
    [cancel, enqueueSpeech, pause, resume, volume, muted, toggleMute, isPlaying, isPaused, status, level, queueLength, error, setVolume]
  )
}
