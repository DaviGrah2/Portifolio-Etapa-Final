import React from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function SkillOrb({ name, level, icon }) {
  const { palette } = useColorPalette()

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative aspect-square group"
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border"
        style={{
          borderColor: palette.primary,
          background: `radial-gradient(circle, ${palette.primary}20, transparent)`,
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${palette.primary}40, inset 0 0 20px ${palette.primary}20`,
            `0 0 40px ${palette.primary}60, inset 0 0 30px ${palette.primary}40`,
            `0 0 20px ${palette.primary}40, inset 0 0 20px ${palette.primary}20`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-2 rounded-full border"
        style={{
          borderColor: palette.accent,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center content */}
      <div
        className="absolute inset-4 rounded-full flex flex-col items-center justify-center border backdrop-blur-xl"
        style={{
          borderColor: palette.border,
          background: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
        }}
      >
        <motion.div
          className="text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>

        {/* Progress ring */}
        <svg
          className="absolute w-full h-full"
          style={{
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke={palette.border}
            strokeWidth="1"
            opacity="0.3"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke={palette.primary}
            strokeWidth="2"
            strokeDasharray={`${level * 2.51} 251`}
            animate={{
              strokeDasharray: [`0 251`, `${level * 2.51} 251`],
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        <p className="text-xs font-bold mt-2" style={{ color: palette.primary }}>
          {level}%
        </p>
      </div>

      {/* Label */}
      <motion.div
        className="absolute top-full mt-4 w-full text-center"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold" style={{ color: palette.textMuted }}>
          {name}
        </p>
      </motion.div>
    </motion.div>
  )
}
