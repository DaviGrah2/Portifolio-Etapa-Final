import React from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function GlowingBadge({ text, variant = 'primary', animated = true }) {
  const { palette } = useColorPalette()

  const colors = {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    success: '#10b981',
    warning: '#f59e0b',
  }

  const color = colors[variant] || colors.primary

  const Badge = (
    <div
      className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider border backdrop-blur-xl relative"
      style={{
        borderColor: color,
        backgroundColor: `${color}20`,
        color: color,
        boxShadow: `0 0 20px ${color}40, inset 0 0 10px ${color}20`,
      }}
    >
      {text}
    </div>
  )

  if (!animated) return Badge

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {Badge}
    </motion.div>
  )
}
