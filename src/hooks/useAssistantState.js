import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useIntersectionObserver from './useIntersectionObserver'
import useSpeechSynthesis from './useSpeechSynthesis'
import useVoiceRecognition from './useVoiceRecognition'
import useGestureDetection from './useGestureDetection'
import useConversationMemory from './useConversationMemory'
import { useAssistantControl } from '../store/assistantControl'
import { queryAssistant } from '../services/aiService'

const welcomeText = 'Olá, seja bem-vindo ao meu portfólio. Vou apresentar meu trabalho.'

const gestureResponses = {
  pinch: {
    text: 'Que interessante! Você gostaria de saber mais sobre um projeto específico?',
    action: 'celebrate',
  },
  point: {
    text: 'Ótimo! Estou mostrando um ponto importante do meu trabalho.',
    action: 'point',
  },
  peace: {
    text: 'Que legal! Vamos explorar os projetos juntos?',
    action: 'wave',
  },
  openPalmRight: {
    text: 'Tudo bem! Vamos avançar para o próximo tópico.',
    action: 'wave',
  },
  openPalmLeft: {
    text: 'Entendi! Vamos voltar para revisar.',
    action: 'talk',
  },
}

export default function useAssistantState() {
  const [assistantText, setAssistantText] = useState(welcomeText)
  const [avatarAction, setAvatarAction] = useState('wave')
  const [messages, setMessages] = useState([{ speaker: 'assistant', text: welcomeText }])
  const [chatOpen, setChatOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const idleTimerRef = useRef(null)
  const [lastSection, setLastSection] = useState(null)
  const [lastGestureProcessed, setLastGestureProcessed] = useState(null)

  const currentSection = useIntersectionObserver(['home', 'about', 'skills', 'projects', 'contact'])
  const { speak, supported: speechSupported } = useSpeechSynthesis()
  const { gesture, handDetected, toggleCamera: toggleGestureCamera, videoRef, canvasRef } = useGestureDetection()
  const conversation = useConversationMemory()
  const { enterPresentationMode, exitPresentationMode } = useAssistantControl()

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev.slice(-10), message])
    if (message.speaker === 'assistant' || message.speaker === 'user') {
      conversation.push({ role: message.speaker, content: message.text })
    }
  }, [conversation])

  const setAssistantState = useCallback(
    (text, action = 'talk') => {
      setAssistantText(text)
      setAvatarAction(action)
      appendMessage({ speaker: 'assistant', text })
      if (speechSupported) {
        speak(text)
      }
      setStatus('speaking')
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => setStatus('idle'), 2200)
    },
    [appendMessage, speak, speechSupported]
  )

  const handleAssistantResponse = useCallback(
    (response) => {
      if (!response) return

      if (response.targetSection) {
        const target = document.getElementById(response.targetSection)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (response.action === 'presentation') {
        enterPresentationMode()
      }

      if (response.action === 'endPresentation') {
        exitPresentationMode()
      }
    },
    [enterPresentationMode, exitPresentationMode]
  )

  const sectionComment = useCallback(
    (section) => {
      const labels = {
        home: 'Início',
        about: 'Sobre',
        skills: 'Skills',
        projects: 'Projetos',
        contact: 'Contato',
      }
      const label = labels[section] || 'essa seção'
      const text = `Agora você está na seção ${label}. Aqui eu explico o conteúdo e mostro o que há de mais importante.`
      setAssistantState(text, 'point')
    },
    [setAssistantState]
  )

  const askAssistant = useCallback(
    async (text) => {
      if (!text) return
      appendMessage({ speaker: 'user', text })
      setStatus('thinking')
      setAvatarAction('talk')

      const response = await queryAssistant(text, conversation.getHistory())
      const answer = response?.text || 'Desculpe, não entendi. Pode repetir de outra forma?'
      setAssistantState(answer, response?.action || 'talk')
      handleAssistantResponse(response)
      setChatOpen(true)
    },
    [appendMessage, conversation, handleAssistantResponse, setAssistantState]
  )

  const handleVoiceQuery = useCallback(
    async (text) => {
      if (!text) return
      await askAssistant(text)
    },
    [askAssistant]
  )

  const { supported: voiceSupported, active, start } = useVoiceRecognition(handleVoiceQuery)

  useEffect(() => {
    conversation.push({ role: 'assistant', content: welcomeText })
  }, [conversation])

  useEffect(() => {
    return () => {
      window.clearTimeout(idleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!gesture || gesture === lastGestureProcessed) return
    setLastGestureProcessed(gesture)

    const response = gestureResponses[gesture]
    if (response) {
      setAssistantState(response.text, response.action)
    }
  }, [gesture, lastGestureProcessed, setAssistantState])

  useEffect(() => {
    if (!currentSection || currentSection === lastSection) return
    setLastSection(currentSection)
    sectionComment(currentSection)
  }, [currentSection, lastSection, sectionComment])

  const toggleChat = useCallback(() => {
    setChatOpen((state) => !state)
  }, [])

  return useMemo(
    () => ({
      assistantText,
      avatarAction,
      messages,
      chatOpen,
      status,
      voiceSupported,
      speechSupported,
      active,
      start,
      askAssistant,
      toggleChat,
      setChatOpen,
      assistantVisible: true,
      gesture,
      handDetected,
      toggleGestureCamera,
      videoRef,
      canvasRef,
    }),
    [assistantText, avatarAction, messages, chatOpen, status, voiceSupported, speechSupported, active, start, askAssistant, toggleChat, gesture, handDetected, toggleGestureCamera]
  )
}
