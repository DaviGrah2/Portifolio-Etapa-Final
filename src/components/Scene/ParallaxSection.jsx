import React, { useEffect, useRef } from 'react'
import { useColorPalette } from '../../context/ColorPaletteContext'

export default function ParallaxSection({ children, depth = 0.5, className = '' }) {
  const { palette } = useColorPalette()
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!contentRef.current) return

      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) * depth * 0.02
      const y = (e.clientY - centerY) * depth * 0.02

      contentRef.current.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [depth])

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 0%, ${palette.glow}20, transparent 60%)`,
      }}
    >
      <div
        ref={contentRef}
        className="transition-transform duration-300"
      >
        {children}
      </div>
    </section>
  )
}
