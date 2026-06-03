import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../context/AIContext'

export default function Chat() {
  const { messages, chatOpen, sendMessage, startListening, isListening, status, voiceRecognitionSupported } = useAI()
  const [draft, setDraft] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    setDraft('')
    await sendMessage(trimmed)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: chatOpen ? 1 : 0, y: chatOpen ? 0 : 20 }}
      transition={{ duration: 0.25 }}
      className={`w-full rounded-[2rem] border border-[#7c3aed]/20 bg-[#091225]/95 p-4 shadow-2xl shadow-[#7c3aed]/20 backdrop-blur-xl ${chatOpen ? 'block' : 'hidden'}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#60a5fa]/80">Chat da Assistente</p>
          <p className="text-sm text-brand-light/70">Converse com a assistente em Português Brasileiro.</p>
        </div>
        <span className="rounded-full bg-[#111827]/90 px-3 py-2 text-xs uppercase tracking-[0.25em] text-[#7c3aed]">
          {status === 'thinking' ? 'Pensando' : isListening ? 'Ouvindo' : 'Aguardando'}
        </span>
      </div>

      <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-2 text-sm">
        {messages.map((message, index) => (
          <div
            key={`${message.speaker}-${index}`}
            className={`rounded-3xl px-4 py-3 ${message.speaker === 'assistant' ? 'bg-[#102741]/90 text-brand-light' : 'bg-[#1c2f4e]/90 text-white'} ${message.speaker === 'assistant' ? 'self-start' : 'self-end'}`}
          >
            <p className="font-medium text-xs uppercase tracking-[0.25em] text-[#60a5fa]/70">
              {message.speaker === 'assistant' ? 'Assistente' : 'Você'}
            </p>
            <p className="mt-2 leading-6">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Pergunte algo sobre o portfólio..."
          className="w-full rounded-full border border-[#7c3aed]/20 bg-[#081225]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#60a5fa]"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="rounded-full bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-[#050816] transition hover:bg-[#8b5cf6]">
            Enviar
          </button>
          <button
            type="button"
            onClick={startListening}
            disabled={!voiceRecognitionSupported}
            className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/90 px-4 py-3 text-sm text-[#7c3aed] transition hover:border-[#60a5fa] disabled:opacity-40"
          >
            {isListening ? 'Ouvindo...' : 'Falar'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
