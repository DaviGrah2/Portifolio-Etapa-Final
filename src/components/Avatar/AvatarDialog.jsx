import React from 'react'

export default function AvatarDialog({ text, visible }) {
  if (!visible) return null

  return (
    <div className="avatar-dialog absolute left-6 bottom-6 z-20 max-w-xs rounded-[2rem] border border-brand-accent/20 bg-[#0f172a]/95 p-4 shadow-2xl shadow-brand-accent/20 backdrop-blur-md text-brand-light">
      <p className="text-sm uppercase tracking-[0.35em] text-brand-accent/80">Assistente</p>
      <p className="mt-3 text-sm leading-6 text-brand-light/90">{text}</p>
    </div>
  )
}
