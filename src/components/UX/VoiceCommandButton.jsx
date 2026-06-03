import React from 'react'

export default function VoiceCommandButton({ onStart, active, supported }) {
  return (
    <button
      type="button"
      onClick={onStart}
      disabled={!supported}
      className="inline-flex items-center gap-3 rounded-full border border-brand-accent/30 bg-[#0f172a]/95 px-4 py-3 text-sm font-semibold text-brand-light transition hover:border-brand-light disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className={`h-3 w-3 rounded-full ${active ? 'bg-emerald-400' : 'bg-brand-accent'}`} />
      {active ? 'Ouvindo...' : supported ? 'Falar com o avatar' : 'Microfone indisponível'}
    </button>
  )
}
