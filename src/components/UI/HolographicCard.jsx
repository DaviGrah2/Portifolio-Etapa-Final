import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function HolographicCard({ title, description, icon, isSelected = false, onClick }) {
  const { palette } = useColorPalette()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl blur"
        style={{
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
          opacity: isSelected || isHovered ? 0.6 : 0.2,
        }}
        animate={{
          opacity: isSelected || isHovered ? 0.6 : 0.2,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl p-6 backdrop-blur-xl border overflow-hidden"
        style={{
          borderColor: isSelected || isHovered ? palette.primary : palette.border,
          backgroundColor: `${palette.dark}E6`,
        }}
      >
        {/* Animated background gradient */}
        {isSelected && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Scanlines effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0px, rgba(255,255,255,.03) 1px, transparent 1px, transparent 2px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            className="text-4xl mb-3"
            animate={{
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>

          <h3 className="text-lg font-bold mb-2" style={{ color: palette.primary }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: palette.textMuted }}>
            {description}
          </p>

          {isSelected && (
            <motion.div
              className="mt-4 h-1 rounded-full"
              style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </div>

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle, ${palette.accent}40, transparent)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  )
}
