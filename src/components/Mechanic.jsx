import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Mechanic(props){
  const [gltfScene, setGltfScene] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(()=>{
    let mounted = true
    const loader = new GLTFLoader()
    loader.load(
      '/models/girl-mechanic.glb',
      (g) => { if(!mounted) return; setGltfScene(g.scene) },
      undefined,
      () => { if(!mounted) return; setFailed(true) }
    )
    return ()=> { mounted = false }
  }, [])

  if (gltfScene) return <primitive object={gltfScene} {...props} />

  if (failed) {
    // Simple placeholder: a neon-ish torus and a base platform
    return (
      <group {...props}>
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI/2,0,0]}>
          <cylinderGeometry args={[0.9,0.9,0.06,64]} />
          <meshStandardMaterial color="#0c1731" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0,0.1,0]}>
          <torusGeometry args={[0.45,0.08,16,64]} />
          <meshStandardMaterial emissive="#3fb0ff" emissiveIntensity={0.9} color="#0b2540" metalness={0.5} roughness={0.1} transparent opacity={0.95} />
        </mesh>
      </group>
    )
  }

  return null
}
