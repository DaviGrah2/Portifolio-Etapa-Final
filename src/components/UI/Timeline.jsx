import React from 'react'
import { motion } from 'framer-motion'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function Timeline({ events }) {
  const { palette } = useColorPalette()

  return (
    <div className="relative space-y-8">
      {/* Vertical line */}
      <div
        className="absolute left-6 top-0 bottom-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${palette.primary}, ${palette.accent})`,
        }}
      />

      {/* Events */}
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="relative pl-24"
        >
          {/* Timeline dot */}
          <motion.div
            className="absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-xl"
            style={{
              borderColor: palette.primary,
              backgroundColor: `${palette.primary}20`,
            }}
            whileHover={{ scale: 1.2 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: palette.primary }}
            />
          </motion.div>

          {/* Content */}
          <div
            className="rounded-2xl p-6 border backdrop-blur-xl"
            style={{
              borderColor: palette.border,
              backgroundColor: `${palette.dark}80`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: palette.primary }}>
                  {event.title}
                </h3>
                <p className="text-sm mt-1" style={{ color: palette.secondary }}>
                  {event.subtitle}
                </p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: `${palette.accent}20`,
                  color: palette.accent,
                }}
              >
                {event.date}
              </span>
            </div>
            <p className="mt-3 leading-relaxed" style={{ color: palette.textMuted }}>
              {event.description}
            </p>
            {event.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${palette.primary}15`,
                      color: palette.primary,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
