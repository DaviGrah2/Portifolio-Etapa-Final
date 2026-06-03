import React, { useEffect, useRef } from 'react'

export default function CustomCursor(){
  const dot = useRef()
  const ring = useRef()

  useEffect(()=>{
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      if(dot.current){
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      if(ring.current){
        ring.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    const onEnterInteractive = () => {
      if(ring.current) ring.current.style.transform += ' scale(1.25)'
      if(dot.current) dot.current.style.opacity = '0.9'
    }

    const onLeaveInteractive = () => {
      if(ring.current) ring.current.style.transform = ring.current.style.transform.replace(' scale(1.25)', '')
      if(dot.current) dot.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove)

    // delegate hover for interactive elements
    const interactive = 'a, button, .cursor-interactive'
    const onPointerOver = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactive)) onEnterInteractive()
    }
    const onPointerOut = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactive)) onLeaveInteractive()
    }

    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('pointerout', onPointerOut)

    return ()=>{
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
    }
  },[])

  return (
    <>
      <div ref={ring} className="cursor-ring pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-brand-accent/40 transition-transform duration-150" />
      <div ref={dot} className="cursor-dot pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-accent transition-opacity duration-150" />
    </>
  )
}
