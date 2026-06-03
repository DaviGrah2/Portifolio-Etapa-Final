import React from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Mechanic from './Mechanic'

export default function FloatingMechanic(){
  const location = useLocation()

  // Map routes to screen positions (left/top)
  const positions = {
    '/': { left: '6%', top: '35%' },
    '/projetos': { left: '74%', top: '18%' },
    '/contato': { left: '74%', top: '72%' },
  }

  const routePos = positions[location.pathname] || { left: '80%', top: '70%' }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
      dragElastic={0.15}
      initial={false}
      animate={{ left: routePos.left, top: routePos.top }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{
        position: 'fixed',
        left: routePos.left,
        top: routePos.top,
        width: 160,
        height: 160,
        zIndex: 9999,
        pointerEvents: 'auto',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(2,6,23,0.6)' }}>
        <Canvas camera={{ position: [0, 0, 3.6], fov: 50 }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 2, 2]} intensity={0.8} />
          <Mechanic position={[0, -0.6, 0]} scale={[0.6,0.6,0.6]} />
        </Canvas>
      </div>
    </motion.div>
  )
}
