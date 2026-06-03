import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ColorPaletteProvider } from './context/ColorPaletteContext'
import { AIProvider } from './context/AIContext'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import CinematicIntro from './components/Scene/CinematicIntro'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Project from './pages/Project'
import Contact from './pages/Contact'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorPaletteProvider>
        <AIProvider>
          <div className="min-h-screen bg-[#050816] text-white">
            <CinematicIntro />
            <Preloader />
            <CustomCursor />
            <NavBar />
            <main className="container mx-auto px-4 py-8 lg:px-6 xl:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projetos" element={<Projects />} />
                <Route path="/projeto/:slug" element={<Project />} />
                <Route path="/projetos/:slug" element={<Project />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AIProvider>
      </ColorPaletteProvider>
    </QueryClientProvider>
  )
}
