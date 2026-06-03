import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import LazyImage from './LazyImage'

function extractFilename(url){
  try{
    if(!url) return ''
    if(url.startsWith('data:')) return url
    const parts = url.split('/')
    return parts[parts.length - 1].split('?')[0]
  }catch(e){return ''}
}

export default function PreviewModal({ project, onClose }) {
  const backdropRef = useRef()
  const panelRef = useRef()
  const [placeholders, setPlaceholders] = useState({})

  useEffect(()=>{
    fetch('/assets/placeholders.json').then(r=> r.ok ? r.json() : {}).then(j=> setPlaceholders(j)).catch(()=>{})
  }, [])

  useEffect(() => {
    let tl = null
    let mounted = true
    import('gsap').then(m => {
      if (!mounted) return
      const gs = m.gsap
      tl = gs.timeline()
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(panelRef.current, { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, '-=0.12')
    }).catch(()=>{})

    return () => { mounted = false; if (tl) tl.kill() }
  }, [])

  function handleClose() {
    import('gsap').then(m => {
      const gs = m.gsap
      const tl = gs.timeline({ onComplete: onClose })
      tl.to(panelRef.current, { y: 18, opacity: 0, scale: 0.98, duration: 0.3, ease: 'power3.in' })
        .to(backdropRef.current, { opacity: 0, duration: 0.2 }, '-=0.18')
    }).catch(()=> onClose())
  }

  function onKeyDown(e){
    if(e.key === 'Escape') handleClose()
  }

  return (
    <div ref={backdropRef} onKeyDown={onKeyDown} tabIndex={-1} aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <motion.div ref={panelRef} className="bg-[#0b1a35] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative" aria-labelledby="preview-title">
        <div className="relative h-96 bg-[radial-gradient(circle_at_top,_rgba(102,153,204,0.18),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(255,250,250,0.08),transparent_20%),linear-gradient(180deg,#0b1a35_0%,#081421_100%)]">
          <LazyImage src={project.thumbnail} alt={project.title} className="w-full h-96 object-cover relative" placeholder={project.placeholder || placeholders[extractFilename(project.thumbnail)]} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081421]/95 via-transparent to-[#081421]/95" />
          <button onClick={handleClose} aria-label="Fechar pré-visualização" className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-2 text-brand-light cursor-interactive">Fechar</button>
        </div>
        <div className="p-6">
          <h3 id="preview-title" className="text-3xl font-title font-bold text-brand-light">{project.title}</h3>
          <p className="mt-3 text-brand-light/75">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map(t=> <span key={t} className="text-xs bg-[#0f2a4c]/80 text-brand-light/80 px-2 py-1 rounded">{t}</span>)}
          </div>
          <div className="mt-6 flex gap-3">
            {project.repo && <a href={project.repo} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-brand-accent text-brand-dark">Repo</a>}
            {project.deploy && <a href={project.deploy} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-brand-accent text-brand-light">Ver deploy</a>}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
