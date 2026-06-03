import React from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function HolographicText({ text, className = '' }) {
  const { palette } = useColorPalette()

  const letters = text.split('')

  return (
    <motion.div className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          style={{
            backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
