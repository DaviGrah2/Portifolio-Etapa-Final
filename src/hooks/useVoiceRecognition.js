import { useEffect, useState, useCallback, useRef } from 'react'

const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function useVoiceRecognition(onResult) {
  const [active, setActive] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(Boolean(SpeechRecognition))
  const recognitionRef = useRef(null)

  useEffect(() => {
    setSupported(Boolean(SpeechRecognition))
    return () => {
      try { recognitionRef.current?.stop() } catch (e) {}
      recognitionRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!SpeechRecognition) return
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'pt-BR'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const text = event.results[0][0]?.transcript || ''
        setTranscript(text)
        onResult?.(text)
      }

      recognition.onend = () => setActive(false)
      recognition.onerror = () => setActive(false)

      recognition.start()
      recognitionRef.current = recognition
      setActive(true)
    } catch (err) {
      console.warn('SpeechRecognition start failed', err)
      setActive(false)
    }
  }, [onResult])

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch (e) {}
    recognitionRef.current = null
    setActive(false)
  }, [])

  return { supported, active, transcript, start, stop }
}
