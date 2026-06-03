import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-brand-accent/20 bg-[#091225]/90 py-8 text-brand-light/70">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Davi Grah. Todos os direitos reservados.</p>
        <p className="mt-2">Navegue pelo portfólio e confira projetos com detalhes 3D e animações suaves.</p>
      </div>
    </footer>
  )
}
