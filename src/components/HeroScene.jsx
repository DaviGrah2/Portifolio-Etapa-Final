import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import Mechanic from './Mechanic'
import * as THREE from 'three'

function RotatingGlobe() {
  const globeRef = useRef()
  const lineRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    globeRef.current.rotation.y = t * 0.18
    lineRef.current.rotation.y = t * 0.14
    globeRef.current.rotation.x = Math.sin(t / 6) * 0.08
  })

  return (
    <group>
      <mesh ref={globeRef} position={[-1.1, 0.3, 0]}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshStandardMaterial
          color="#6699CC"
          emissive="#3c5e8b"
          roughness={0.18}
          metalness={0.7}
        />
      </mesh>
      <mesh ref={lineRef} position={[-1.1, 0.3, 0]}> 
        <ringGeometry args={[1.55, 1.7, 128]} />
        <meshBasicMaterial color="#FFFAFA" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function LaptopPodium() {
  const laptopRef = useRef()

  useFrame((state) => {
    laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 3.2) * 0.16
    laptopRef.current.position.y = -0.04 + Math.sin(state.clock.elapsedTime / 2.7) * 0.02
  })

  return (
    <group ref={laptopRef} position={[1.4, -0.25, 0]} scale={[0.95, 0.95, 0.95]}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.9, 0.12, 1.2]} />
        <meshStandardMaterial color="#14213D" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.48, -0.5]}>
        <boxGeometry args={[1.75, 1.0, 0.08]} />
        <meshStandardMaterial color="#0c1731" metalness={0.2} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.48, -0.45]}>
        <planeGeometry args={[1.6, 0.82]} />
        <meshStandardMaterial color="#6699CC" roughness={0.1} metalness={0.4} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.05, -0.5]} rotation={[-0.38, 0, 0]}>
        <planeGeometry args={[1.65, 0.6]} />
        <meshStandardMaterial color="#0c1731" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function ParticleCloud({ count = 180 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12
      positions[i + 1] = (Math.random() - 0.5) * 5
      positions[i + 2] = (Math.random() - 0.5) * 8
    }
    return positions
  }, [count])
  const ref = React.useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) ref.current.rotation.y = Math.sin(t / 7) * 0.12
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FFFAFA" size={0.035} transparent opacity={0.55} />
    </points>
  )
}

function BasicEnv() {
  const { scene, gl } = useThree()

  React.useEffect(() => {
    // Simple PMREM generator to provide a subtle environment during runtime
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()

    // Use a soft color as a fallback 'environment' look
    const color = new THREE.Color('#203056')
    scene.background = color

    // Cleanup
    return () => {
      pmrem.dispose()
    }
  }, [scene, gl])

  return null
}

export default function HeroScene() {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(()=>{
    function check(){
      setIsSmall(typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches)
    }
    check()
    window.addEventListener('resize', check)
    return ()=> window.removeEventListener('resize', check)
  }, [])

  // If small screen, show a lightweight static fallback to save CPU / battery
  if (isSmall) {
    return (
      <div className="hero-scene relative">
        <div className="h-56 sm:h-64 md:h-80 w-full rounded-lg bg-gradient-to-b from-[#0b1220] to-[#081025] flex items-center justify-center overflow-hidden">
          <svg width="140" height="80" viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="6" y="18" width="128" height="44" rx="6" fill="#0c1731" />
            <rect x="18" y="26" width="102" height="28" rx="3" fill="#1b3350" />
            <circle cx="26" cy="38" r="2.6" fill="#6699CC" />
            <circle cx="32" cy="38" r="2.6" fill="#88b4e0" />
          </svg>
        </div>
      </div>
    )
  }

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1

  return (
    <div className="hero-scene relative">
      <Canvas camera={{ position: [0, 0, 7], fov: 34 }} dpr={dpr} gl={{ antialias: false, powerPreference: 'low-power' }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#6699CC" />
        <pointLight position={[-4, 2, 3]} intensity={0.7} color="#FFFAFA" />
        <RotatingGlobe />
        <LaptopPodium />
        <ParticleCloud count={100} />

        {/* Optional 3D character model - place GLB at /public/models/girl-mechanic.glb */}
        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
            <Mechanic position={[0.6, -0.4, 0]} scale={[0.9,0.9,0.9]} />
          </Float>
        </Suspense>

        {/* Fallback environment implemented in BasicEnv (no drei hooks) */}
        <BasicEnv />
      </Canvas>

      {/* DOM overlay kept as safe alternative to Html */}
      <div className="hero-overlay absolute inset-0 pointer-events-none">
        <div className="hero-hud" />
      </div>
    </div>
  )
}
