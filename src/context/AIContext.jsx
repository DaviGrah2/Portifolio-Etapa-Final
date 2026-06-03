import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useConversationMemory from '../hooks/useConversationMemory'
import useVoiceRecognition from '../hooks/useVoiceRecognition'
import useVoice from '../hooks/useVoice'
import { useAssistantControl } from '../store/assistantControl'
import { queryAssistant } from '../services/aiService'

const AIContext = createContext(null)

const welcomeText = 'Olá, seja bem-vindo ao meu portfólio. Vou apresentar meu trabalho.'

export function AIProvider({ children }) {
  const [assistantText, setAssistantText] = useState(welcomeText)
  const [messages, setMessages] = useState([{ speaker: 'assistant', text: welcomeText }])
  const [chatOpen, setChatOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [avatarAction, setAvatarAction] = useState('idle')
  const [error, setError] = useState(null)

  const conversation = useConversationMemory()
  const isVoiceEnabled = useAssistantControl((state) => state.isVoiceEnabled)
  const volume = useAssistantControl((state) => state.volume)
  const preferredVoiceId = useAssistantControl((state) => state.voiceId)

  const voice = useVoice({ defaultVolume: volume })

  const appendMessage = useCallback(
    (message) => {
      setMessages((prev) => [...prev.slice(-12), message])
      if (message.speaker === 'assistant' || message.speaker === 'user') {
        conversation.push({ role: message.speaker, content: message.text })
      }
    },
    [conversation]
  )

  const speakAssistant = useCallback(
    (text) => {
      if (!isVoiceEnabled) {
        return
      }
      voice.enqueueSpeech(text, {
        voiceId: preferredVoiceId,
        voiceSettings: {
          stability: 0.6,
          similarity_boost: 0.75,
        },
        onStart: () => {
          setStatus('speaking')
          setAvatarAction('talk')
        },
        onEnd: () => {
          setStatus('idle')
          setAvatarAction('idle')
        },
        onError: (err) => {
          console.error('Erro ElevenLabs:', err)
          setError('Não foi possível reproduzir a voz da assistente. Tente novamente.')
          setStatus('idle')
          setAvatarAction('idle')
        },
      })
    },
    [isVoiceEnabled, preferredVoiceId, voice]
  )

  const sendMessage = useCallback(
    async (text) => {
      const cleaned = String(text || '').trim()
      if (!cleaned) return

      appendMessage({ speaker: 'user', text: cleaned })
      setStatus('thinking')
      setAvatarAction('thinking')
      setError(null)

      try {
        const response = await queryAssistant(cleaned, conversation.getHistory())
        const answer = response?.text?.trim() || 'Desculpe, não entendi. Pode repetir de outra forma?'

        appendMessage({ speaker: 'assistant', text: answer })
        setAssistantText(answer)
        setChatOpen(true)

        if (response?.action) {
          setAvatarAction(response.action)
        }

        if (response?.targetSection) {
          const target = document.getElementById(response.targetSection)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }

        if (isVoiceEnabled) {
          speakAssistant(answer)
        }
      } catch (err) {
        console.error('Erro ao consultar a assistente:', err)
        setError('Ocorreu uma falha ao processar a resposta. Tente novamente em alguns instantes.')
        setStatus('error')
      }
    },
    [appendMessage, conversation, isVoiceEnabled, speakAssistant]
  )

  const handleVoiceQuery = useCallback(
    async (text) => {
      if (!text) return
      setStatus('thinking')
      setAvatarAction('listening')
      await sendMessage(text)
    },
    [sendMessage]
  )

  const { supported: voiceRecognitionSupported, active: listening, start: startListening, stop: stopListening } = useVoiceRecognition(handleVoiceQuery)

  const hasSpokenRef = useRef(false)

  useEffect(() => {
    conversation.push({ role: 'assistant', content: welcomeText })
    if (isVoiceEnabled && !hasSpokenRef.current) {
      hasSpokenRef.current = true
      speakAssistant(welcomeText)
    }
  }, [conversation, isVoiceEnabled, speakAssistant])

  useEffect(() => {
    if (voice.isPlaying) {
      setAvatarAction('talk')
      setStatus('speaking')
    } else if (listening) {
      setAvatarAction('listening')
      setStatus('listening')
    } else if (status === 'thinking') {
      setAvatarAction('thinking')
    } else if (status !== 'error') {
      setAvatarAction('idle')
      setStatus('idle')
    }
  }, [listening, status, voice.isPlaying])

  useEffect(() => {
    const aboveVolume = Math.max(0, Math.min(1, volume))
    if (voice.volume !== aboveVolume) {
      voice.setVolume(aboveVolume)
    }
  }, [volume, voice.volume, voice.setVolume])

  const value = useMemo(
    () => ({
      assistantText,
      messages,
      chatOpen,
      status,
      avatarAction,
      voiceQueueLength: voice.queueLength,
      speechLevel: voice.level,
      isSpeaking: voice.isPlaying,
      isPaused: voice.isPaused,
      isListening: listening,
      voiceRecognitionSupported,
      sendMessage,
      startListening,
      stopListening,
      toggleChat: () => setChatOpen((current) => !current),
      setChatOpen,
      error,
      voiceControls: {
        pause: voice.pause,
        resume: voice.resume,
        stop: voice.stop,
        mute: voice.muted,
        toggleMute: voice.toggleMute,
        volume: voice.volume,
        setVolume: voice.setVolume,
      },
    }),
    [assistantText, chatOpen, error, listening, messages, sendMessage, setChatOpen, status, avatarAction, voice, voice.isPlaying, voice.isPaused, voice.level, voice.muted, voice.queueLength, voice.pause, voice.resume, voice.stop, voice.toggleMute, voice.volume, voice.setVolume, voiceRecognitionSupported]
  )

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}

export function useAI() {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI deve ser usado dentro de AIProvider')
  }
  return context
}
