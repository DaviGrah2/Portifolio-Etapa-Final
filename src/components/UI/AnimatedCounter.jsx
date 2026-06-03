import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function AnimatedCounter({ value, label, icon, duration = 2 }) {
  const { palette } = useColorPalette()
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const interval = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(interval)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [value, duration])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative rounded-2xl p-6 border backdrop-blur-xl overflow-hidden group"
      style={{
        borderColor: palette.border,
        backgroundColor: `${palette.dark}E6`,
      }}
    >
      {/* Glow animation */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle, ${palette.primary}40, transparent)`,
        }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          {icon}
        </motion.div>

        <div>
          <motion.div
            className="text-3xl font-bold"
            style={{ color: palette.primary }}
          >
            {count}+
          </motion.div>
          <p className="text-sm mt-1" style={{ color: palette.textMuted }}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
