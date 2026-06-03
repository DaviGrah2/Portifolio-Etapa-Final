import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function AssistantChatPanel({ messages, onSend, onVoiceStart, voiceSupported, chatOpen, onClose }) {
  const [draft, setDraft] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
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
          <p className="text-sm text-brand-light/70">Converse com a assistente a qualquer momento.</p>
        </div>
        <button type="button" onClick={onClose} className="text-sm text-[#7c3aed] hover:text-[#60a5fa]">Fechar</button>
      </div>

      <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-2 text-sm">
        {messages.map((message, index) => (
          <div key={`${message.speaker}-${index}`} className={`rounded-3xl px-4 py-3 ${message.speaker === 'assistant' ? 'bg-[#102741]/90 text-brand-light' : 'bg-[#1c2f4e]/90 text-white'} ${message.speaker === 'assistant' ? 'self-start' : 'self-end'}`}>
            <p className="font-medium text-xs uppercase tracking-[0.25em] text-[#60a5fa]/70">{message.speaker === 'assistant' ? 'Assistente' : 'Você'}</p>
            <p className="mt-2 leading-6">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Pergunte algo..."
          className="flex-1 rounded-full border border-[#7c3aed]/20 bg-[#081225]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#60a5fa]"
        />
        <button type="submit" className="rounded-full bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-[#050816] transition hover:bg-[#8b5cf6]">Enviar</button>
        <button type="button" onClick={onVoiceStart} disabled={!voiceSupported} className="rounded-full border border-[#7c3aed]/20 bg-[#081225]/90 px-4 py-3 text-sm text-[#7c3aed] transition hover:border-[#60a5fa] disabled:opacity-40">
          Voz
        </button>
      </form>
    </motion.div>
  )
}
