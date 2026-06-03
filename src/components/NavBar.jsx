import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar(){
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#091225]/95 border-b border-brand-accent/20 backdrop-blur-md sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-2xl font-title tracking-tight text-brand-light hover:text-brand-accent">Davi Grah</NavLink>

        <button aria-label="Abrir menu" className="md:hidden text-brand-light/80" onClick={()=> setOpen(v=>!v)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm text-brand-light/70">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-brand-accent font-semibold' : 'hover:text-brand-light'}>Home</NavLink>
          <NavLink to="/projetos" className={({isActive}) => isActive ? 'text-brand-accent font-semibold' : 'hover:text-brand-light'}>Projetos</NavLink>
          <NavLink to="/contato" className={({isActive}) => isActive ? 'text-brand-accent font-semibold' : 'hover:text-brand-light'}>Contato</NavLink>
        </nav>
      </div>

      {open && (
        <div className="md:hidden bg-[#081225]/95 border-t border-brand-accent/10">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <NavLink onClick={()=>setOpen(false)} to="/" className="text-brand-light/90">Home</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/projetos" className="text-brand-light/90">Projetos</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/contato" className="text-brand-light/90">Contato</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
