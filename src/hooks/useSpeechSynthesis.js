import { useEffect, useState, useCallback } from 'react'
import { useAssistantControl } from '../store/assistantControl'

const PREFERRED_VOICE_NAMES = [
  'Google Português do Brasil',
  'Microsoft Helena Desktop',
  'Microsoft Isabela',
  'Microsoft Maria',
  'Google português do Brasil',
  'Luciana',
  'Isabela',
  'Fernanda',
  'Vitoria',
  'Daniel',
]

function findBestVoice(voices, language) {
  if (!voices || voices.length === 0) return null

  const normalizedLanguage = language.toLowerCase()

  const exactMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(normalizedLanguage))
  if (!exactMatch) {
    const closeMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith('pt'))
    if (closeMatch) return closeMatch
  }

  for (const preferred of PREFERRED_VOICE_NAMES) {
    const found = voices.find(
      (voice) => voice.name?.toLowerCase().includes(preferred.toLowerCase()) || voice.voiceURI?.toLowerCase().includes(preferred.toLowerCase())
    )
    if (found) return found
  }

  return exactMatch || voices[0]
}

export default function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window)
  const [voices, setVoices] = useState([])
  const { volume, speechRate, language } = useAssistantControl((state) => ({
    volume: state.volume,
    speechRate: state.speechRate,
    language: state.language,
  }))

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  useEffect(() => {
    if (!supported || typeof window === 'undefined') return

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices() || []
      setVoices(availableVoices)
    }

    updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices)
    }
  }, [supported])

  const speak = useCallback(
    (text) => {
      if (!supported || typeof window === 'undefined') return

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language || 'pt-BR'
      utterance.rate = Math.min(Math.max(speechRate, 0.8), 1.2)
      utterance.pitch = 1.05
      utterance.volume = Math.min(Math.max(volume, 0.3), 1)

      const preferredVoice = findBestVoice(voices, utterance.lang)
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    },
    [supported, language, speechRate, volume, voices]
  )

  const cancel = useCallback(() => {
    if (!supported || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { speak, supported, speaking, cancel }
}
