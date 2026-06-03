import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
const AvatarScene = React.lazy(() => import('../Avatar/AvatarScene'))

function Loader() {
  const { active, progress } = useProgress()
  return active ? (
    <Html center>
      <div className="rounded-3xl border border-white/20 bg-[#050816]/90 p-6 text-center text-sm text-white/80 shadow-xl shadow-[#00000066]">
        Carregando mundo 3D... {Math.round(progress)}%
      </div>
    </Html>
  ) : null
}

function FloatingOrb({ action }) {
  const orbRef = React.useRef()
  const pulse = React.useRef(0)

  useFrame((state, delta) => {
    const orb = orbRef.current
    if (!orb) return

    orb.rotation.y += delta * 0.35
    orb.rotation.x += delta * 0.12

    if (action === 'celebrate') {
      pulse.current = Math.sin(state.clock.elapsedTime * 8) * 0.08
      orb.scale.setScalar(1 + pulse.current)
    } else if (action === 'talk') {
      pulse.current = Math.sin(state.clock.elapsedTime * 6) * 0.04
      orb.scale.setScalar(1 + pulse.current)
    } else {
      orb.scale.setScalar(1)
    }
  })

  const color = action === 'point' ? '#facc15' : action === 'celebrate' ? '#38bdf8' : '#8b5cf6'
  const emissive = action === 'point' ? '#fbbf24' : action === 'celebrate' ? '#60a5fa' : '#7c3aed'

  return (
    <group position={[0, 1.4, 0]} ref={orbRef}>
      <mesh>
        <torusKnotGeometry args={[0.8, 0.2, 128, 32]} />
        <meshStandardMaterial color={color} emissive={emissive} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" roughness={0.15} metalness={0.9} />
      </mesh>
    </group>
  )
}

function GridFloor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.2} />
    </mesh>
  )
}

function NeonPillars() {
  return (
    <group>
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, -0.6, -4]}>
          <boxGeometry args={[0.25, 2.5, 0.25]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1.6} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function SectionMarker({ label, position, active, onClick }) {
  return (
    <group position={position}>
      <mesh onClick={onClick} scale={active ? 1.15 : 1}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 24]} />
        <meshStandardMaterial color={active ? '#60a5fa' : '#94a3b8'} emissive={active ? '#60a5fa' : '#0f172a'} roughness={0.2} />
      </mesh>
      <Html distanceFactor={1.6} center>
        <div className="rounded-full border border-white/20 bg-[#020617]/90 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-100 shadow-lg shadow-[#00000044]">
          {label}
        </div>
      </Html>
    </group>
  )
}

export default function WorldScene({ action, selectedSection, onSectionSelect }) {
  const sectionDefinitions = [
    { id: 'home', label: 'Home', position: [-3.5, 0.1, -1.5] },
    { id: 'about', label: 'Sobre', position: [-1.5, 0.1, -2.2] },
    { id: 'skills', label: 'Skills', position: [0, 0.1, -3.8] },
    { id: 'projects', label: 'Projetos', position: [1.5, 0.1, -2.2] },
    { id: 'contact', label: 'Contato', position: [3.5, 0.1, -1.5] },
  ]

  return (
    <div className="h-full w-full rounded-[2rem] overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5, 2, 7], fov: 35 }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <spotLight position={[-5, 8, -5]} angle={0.28} intensity={1.2} penumbra={0.5} />

        <Suspense fallback={<Loader />}>
          <Suspense fallback={<Loader />}>
            <AvatarScene action={action} withEnvironment={false} />
          </Suspense>
          <NeonPillars />
          {sectionDefinitions.map((section) => (
            <SectionMarker
              key={section.id}
              label={section.label}
              position={section.position}
              active={selectedSection === section.id}
              onClick={() => onSectionSelect?.(section.id)}
            />
          ))}
          <GridFloor />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.45} width={20} height={20} blur={2} far={3} />
          <Environment preset="warehouse" />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.3} luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0015, 0.0015]} />
          <Noise opacity={0.04} />
        </EffectComposer>

        <OrbitControls enablePan enableZoom enableRotate autoRotate autoRotateSpeed={0.1} minDistance={4} maxDistance={12} />
      </Canvas>
    </div>
  )
}
