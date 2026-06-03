import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function CinematicIntro() {
  const { palette } = useColorPalette()
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const played = sessionStorage.getItem('intro-played')
    if (played) {
      setHasPlayed(true)
    } else {
      const timer = setTimeout(() => {
        setHasPlayed(true)
        sessionStorage.setItem('intro-played', 'true')
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (hasPlayed) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 5.5, duration: 0.5 }}
      onAnimationComplete={() => setHasPlayed(true)}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
      style={{ backgroundColor: palette.darker }}
    >
      {/* Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: palette.accent }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [Math.random() * window.innerHeight, -100],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Logo/Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-4"
          style={{
            backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          DAVI GRAH
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl mb-8"
          style={{ color: palette.secondary }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Desenvolvedor Full Stack
        </motion.p>

        {/* Status Line */}
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: palette.accent }}
            animate={{ boxShadow: [`0 0 0 0 ${palette.accent}`, `0 0 0 10px ${palette.accent}00`] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ color: palette.text }}>INICIALIZANDO ASSISTENTE VIRTUAL...</span>
        </motion.div>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        className="absolute bottom-20 w-64 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: `${palette.primary}40` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: palette.primary }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'easeInOut' }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>
    </motion.div>
  )
}
