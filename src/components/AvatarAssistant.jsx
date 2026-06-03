import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../context/AIContext'
import VoiceCommandButton from './UX/VoiceCommandButton'
import Chat from './Chat'

export default function AvatarAssistant() {
  const {
    assistantText,
    status,
    avatarAction,
    isSpeaking,
    isListening,
    voiceRecognitionSupported,
    startListening,
    toggleChat,
    chatOpen,
    voiceQueueLength,
    voiceControls,
    error,
  } = useAI()

  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative rounded-[2rem] border border-white/10 bg-[#050816]/95 p-6 shadow-2xl shadow-slate-900/40">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#94a3b8]">Assistente Virtual</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Avatar IA</h3>
            <p className="mt-1 text-sm text-white/75">Voz realista em Português Brasileiro com ElevenLabs.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDetails((current) => !current)}
            className="rounded-full border border-[#7c3aed]/30 bg-[#0f172a]/95 px-4 py-3 text-sm text-[#7c3aed] transition hover:border-[#60a5fa]"
          >
            {showDetails ? 'Ocultar detalhes' : 'Ver controles'}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#7c3aed]/20 bg-[#07111f]/90 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#60a5fa]/80">Status</p>
            <p className="mt-3 text-base font-semibold text-white">{status === 'speaking' ? 'Falando' : status === 'thinking' ? 'Pensando' : status === 'listening' ? 'Ouvindo' : 'Pronto'}</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{assistantText}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#7c3aed]/20 bg-[#07111f]/90 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#60a5fa]/80">Ação</p>
            <p className="mt-3 text-base font-semibold text-white">{avatarAction}</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{isListening ? 'O avatar está atento ao áudio.' : isSpeaking ? `Fala em fila: ${voiceQueueLength}` : 'Pronto para novas perguntas.'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <VoiceCommandButton onStart={startListening} active={isListening} supported={voiceRecognitionSupported} />
          <button
            type="button"
            onClick={toggleChat}
            className="rounded-full bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-[#050816] transition hover:bg-[#8b5cf6]"
          >
            {chatOpen ? 'Fechar chat' : 'Abrir chat'}
          </button>
        </div>

        {showDetails && (
          <div className="rounded-[1.75rem] border border-[#7c3aed]/20 bg-[#07111f]/90 p-5">
            <p className="text-sm font-medium text-white">Controles de áudio</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={voiceControls.pause}
                className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/95 px-4 py-3 text-sm text-white transition hover:border-[#60a5fa]"
              >Pausar</button>
              <button
                type="button"
                onClick={voiceControls.resume}
                className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/95 px-4 py-3 text-sm text-white transition hover:border-[#60a5fa]"
              >Retomar</button>
              <button
                type="button"
                onClick={voiceControls.stop}
                className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/95 px-4 py-3 text-sm text-white transition hover:border-[#60a5fa]"
              >Parar</button>
              <button
                type="button"
                onClick={voiceControls.toggleMute}
                className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/95 px-4 py-3 text-sm text-white transition hover:border-[#60a5fa]"
              >{voiceControls.mute ? 'Desmutar' : 'Mutar'}</button>
            </div>
          </div>
        )}

        {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      </div>

      <div className="mt-6">
        <Chat />
      </div>
    </div>
  )
}
