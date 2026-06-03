import React, { createContext, useContext, useEffect, useState } from 'react'

const ColorPaletteContext = createContext()

const DEFAULT_PALETTE = {
  primary: '#7c3aed',
  secondary: '#60a5fa',
  accent: '#a78bfa',
  dark: '#050816',
  darker: '#0a0f1e',
  light: '#f0f4ff',
  border: 'rgba(124, 58, 237, 0.25)',
  glow: 'rgba(167, 139, 250, 0.5)',
  text: '#e8eef5',
  textMuted: '#a8b4c4',
}

export function ColorPaletteProvider({ children }) {
  const [palette, setPalette] = useState(DEFAULT_PALETTE)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function initializePalette() {
      try {
        setIsLoading(true)
        
        // Try to load color palette from localStorage
        const cached = localStorage.getItem('avatar-color-palette')
        if (cached) {
          setPalette(JSON.parse(cached))
          setIsLoading(false)
          return
        }

        // TODO: Analyze GLB model when available
        // For now, use default palette
        localStorage.setItem('avatar-color-palette', JSON.stringify(DEFAULT_PALETTE))
        setPalette(DEFAULT_PALETTE)
      } catch (error) {
        console.warn('Failed to initialize color palette:', error)
        setPalette(DEFAULT_PALETTE)
      } finally {
        setIsLoading(false)
      }
    }

    initializePalette()
  }, [])

  return (
    <ColorPaletteContext.Provider value={{ palette, isLoading }}>
      {children}
    </ColorPaletteContext.Provider>
  )
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext)
  if (!context) {
    throw new Error('useColorPalette must be used within ColorPaletteProvider')
  }
  return context
}

export function applyPaletteToCSS(palette) {
  const root = document.documentElement
  Object.entries(palette).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
}
