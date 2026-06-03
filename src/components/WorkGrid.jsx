import React, { useState, useRef, Suspense, lazy, useEffect } from 'react'
import { motion } from 'framer-motion'
import projects from '../data/projects'
const PreviewModal = lazy(() => import('./PreviewModal'))
import LazyImage from './LazyImage'

function extractFilename(url){
  try{
    if(!url) return ''
    if(url.startsWith('data:')) return url
    const parts = url.split('/')
    return parts[parts.length - 1].split('?')[0]
  }catch(e){return ''}
}

export default function WorkGrid() {
  const [active, setActive] = useState(null)

  const imgRefs = useRef({})
  const [placeholders, setPlaceholders] = useState({})

  useEffect(()=>{
    fetch('/assets/placeholders.json').then(r=> r.ok ? r.json() : {}).then(j=> setPlaceholders(j)).catch(()=>{})
  }, [])

  const gsapRef = React.useRef(null)

  React.useEffect(()=>{
    let mounted = true
    import('gsap').then(m => { if(mounted) gsapRef.current = m.gsap }).catch(()=>{})
    return ()=> { mounted = false }
  },[])

  function handleMove(e, slug){
    const img = imgRefs.current[slug]
    if(!img) return
    const rect = img.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const gs = gsapRef.current
    if(gs) gs.to(img, { x: px * 18, y: py * 14, rotation: px * 3, scale: 1.06, duration: 0.5, ease: 'power3.out' })
  }

  function handleLeave(slug){
    const img = imgRefs.current[slug]
    if(!img) return
    const gs = gsapRef.current
    if(gs) gs.to(img, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'power3.out' })
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-accent">Work</p>
          <h2 className="mt-3 text-4xl font-title font-bold text-brand-light">Selected Projects</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <motion.article
            key={p.slug}
            className="relative rounded-3xl overflow-hidden bg-[#081225]/60 border border-brand-accent/10 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setActive(p)}
            onMouseMove={(e)=> handleMove(e, p.slug)}
            onMouseLeave={()=> handleLeave(p.slug)}
            tabIndex={0}
            role="button"
            onKeyDown={(e)=> { if(e.key === 'Enter') setActive(p) }}
          >
            <div className="w-full h-56 overflow-hidden">
              <LazyImage ref={el => (imgRefs.current[p.slug] = el)} src={p.thumbnail} alt={p.title} className="w-full h-56 object-cover block transform-gpu" placeholder={p.placeholder || placeholders[extractFilename(p.thumbnail)]} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-brand-light">{p.title}</h3>
              <p className="mt-2 text-sm text-brand-light/70">{p.short}</p>
            </div>
            <div className="absolute left-4 bottom-4 flex gap-2">
              {p.tech.slice(0,3).map(t=> (
                <span key={t} className="text-xs bg-[#0f2a4c]/80 text-brand-light/80 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      {active && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">Carregando...</div>}>
          <PreviewModal project={active} onClose={() => setActive(null)} />
        </Suspense>
      )}
    </section>
  )
}
