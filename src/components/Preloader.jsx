import React, { useEffect, useState } from 'react'

export default function Preloader(){
  const [done, setDone] = useState(false)

  useEffect(()=>{
    let fallback = setTimeout(()=> {
      // Fallback: ensure preloader can't get stuck if 'load' doesn't fire
      setDone(true)
    }, 4000)

    function onLoad(){
      // longer delay so the loading message stays visible briefly
      clearTimeout(fallback)
      setTimeout(()=> setDone(true), 1500)
    }

    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad)

    return ()=>{
      window.removeEventListener('load', onLoad)
      clearTimeout(fallback)
    }
  },[])

  if (done) return null

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#081225]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-brand-accent animate-spin" />
        <div className="text-brand-light/70">Carregando...</div>
      </div>
    </div>
  )
}
