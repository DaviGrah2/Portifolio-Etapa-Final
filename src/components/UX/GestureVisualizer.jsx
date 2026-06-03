import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GestureVisualizer({ gesture, handDetected }) {
  return (
    <AnimatePresence>
      {handDetected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-4 left-4 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 px-4 py-2 backdrop-blur-md"
        >
          <p className="text-xs uppercase tracking-wider text-[#60a5fa]">
            {gesture ? `Gesto: ${gesture}` : 'Mão detectada'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
