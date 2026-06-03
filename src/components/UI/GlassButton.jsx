import React from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function GlassButton({ children, onClick, variant = 'primary', className = '' }) {
  const { palette } = useColorPalette()

  const colors = {
    primary: { bg: palette.primary, text: palette.dark },
    secondary: { bg: palette.secondary, text: palette.dark },
    accent: { bg: palette.accent, text: palette.dark },
    outline: { bg: 'transparent', text: palette.primary, border: palette.primary },
  }

  const color = colors[variant] || colors.primary

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative rounded-xl font-semibold uppercase tracking-wider px-6 py-3 backdrop-blur-xl border transition overflow-hidden group ${className}`}
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border || color.bg,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${color.bg}40, transparent)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 text-sm">{children}</span>
    </motion.button>
  )
}
