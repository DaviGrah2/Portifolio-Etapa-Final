import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ sent: false, sending: false, message: '', error: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ sent: false, sending: true, message: '', error: '' })

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const text = await response.text()
      let data = {}

      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = {}
      }

      if (!response.ok) {
        throw new Error(data.error || response.statusText || 'Erro ao enviar mensagem')
      }

      setForm({ name: '', email: '', subject: '', message: '' })
      setStatus({ sent: true, sending: false, message: '', error: '' })
    } catch (error) {
      console.error('Email send error:', error)
      setStatus({ sent: false, sending: false, message: '', error: error.message || 'Não foi possível enviar. Tente novamente mais tarde.' })
    }
  }

  return (
    <motion.section id="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
      <div className="rounded-[2rem] border border-brand-accent/30 bg-[#12243f]/95 p-8 shadow-2xl shadow-brand-accent/15">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-accent">Contato</p>
        <h1 className="mt-3 text-4xl font-title font-bold text-brand-light">Vamos conversar?</h1>
        <p className="mt-4 max-w-2xl text-brand-light/70">Preencha o formulário ou use um dos canais diretos para me enviar uma mensagem sobre oportunidades, projetos ou parcerias.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-brand-accent/30 bg-[#12243f]/95 p-8 shadow-2xl shadow-brand-accent/15">
          {status.sent ? (
            <div className="rounded-3xl bg-brand-accent/15 p-6 text-brand-light ring-1 ring-brand-accent/30">
              <h2 className="text-2xl font-title font-semibold">Mensagem recebida</h2>
              <p className="mt-3 text-brand-light/80">Obrigado! Sua mensagem foi enviada com sucesso. Em breve retornarei o contato.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status.error && (
                <div className="rounded-3xl bg-[#7d4d5d]/15 p-4 text-brand-light ring-1 ring-[#7d4d5d]/25">
                  {status.error}
                </div>
              )}
              {status.message && (
                <div className="rounded-3xl bg-brand-accent/15 p-4 text-brand-light ring-1 ring-brand-accent/30">
                  {status.message}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="w-full rounded-3xl border border-brand-accent/30 bg-[#0f2a4c]/80 px-4 py-3 text-brand-light outline-none transition focus:border-brand-accent" required />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="w-full rounded-3xl border border-brand-accent/30 bg-[#0f2a4c]/80 px-4 py-3 text-brand-light outline-none transition focus:border-brand-accent" required />
              </div>
              <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Assunto" className="w-full rounded-3xl border border-brand-accent/30 bg-[#0f2a4c]/80 px-4 py-3 text-brand-light outline-none transition focus:border-brand-accent" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Mensagem" rows="6" className="w-full rounded-3xl border border-brand-accent/30 bg-[#0f2a4c]/80 px-4 py-3 text-brand-light outline-none transition focus:border-brand-accent" required />
              <button type="submit" disabled={status.sending} className="inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-[#0e2a4d]">
                {status.sending ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>

        <aside className="relative rounded-[2rem] border border-brand-accent/30 bg-[#12243f]/95 p-8 shadow-2xl shadow-brand-accent/15 overflow-hidden">
          <div className="floating-icons pointer-events-none">
            <span className="floating-dot dot-1" />
            <span className="floating-dot dot-2" />
            <span className="floating-dot dot-3" />
            <span className="floating-ring ring-1" />
          </div>
          <div className="space-y-6 relative">
            <div>
              <h2 className="text-2xl font-title font-semibold text-brand-light">Canais Diretos</h2>
              <p className="mt-3 text-brand-light/75">Use qualquer um dos links para conversar diretamente comigo.</p>
            </div>
            <div className="space-y-4 rounded-3xl bg-[#112a44]/90 p-6 ring-1 ring-brand-accent/20">
              <p className="text-brand-light/75"><strong>Email:</strong> <a href="mailto:davigrah2010@gmail.com" className="text-brand-accent hover:text-brand-light">davigrah2010@gmail.com</a></p>
              <p className="text-brand-light/75"><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/DaviGrah2" target="_blank" rel="noreferrer" className="text-brand-accent hover:text-brand-light">linkedin.com/in/DaviGrah2</a></p>
              <p className="text-brand-light/75"><strong>GitHub:</strong> <a href={profile.contact.github} target="_blank" rel="noreferrer" className="text-brand-accent hover:text-brand-light">{profile.contact.github.replace('https://', '')}</a></p>
              <p className="text-brand-light/75"><strong>Instagram:</strong> <a href="https://instagram.com/grah_hz" target="_blank" rel="noreferrer" className="text-brand-accent hover:text-brand-light">@grah_hz</a></p>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  )
}
