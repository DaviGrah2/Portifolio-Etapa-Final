import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FloatingNebula({ count = 80 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 9
      positions[i + 1] = (Math.random() - 0.5) * 4
      positions[i + 2] = (Math.random() - 0.5) * 6
      colors[i] = 0.48
      colors[i + 1] = 0.73
      colors[i + 2] = 1
    }
    return { positions, colors }
  }, [count])

  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.03
      group.current.position.y = Math.sin(state.clock.elapsedTime / 4) * 0.08
    }
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.positions.length / 3} array={points.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={points.colors.length / 3} array={points.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.06} transparent opacity={0.6} depthWrite={false} />
      </points>
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.8, 64]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
