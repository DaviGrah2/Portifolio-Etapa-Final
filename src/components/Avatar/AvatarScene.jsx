import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/models/girl_mechanic_draco.glb'

function AvatarModel({ action = 'idle' }) {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL_PATH)
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    if (!actions) return

    const lookup = {
      talk: ['talk', 'speak'],
      wave: ['wave'],
      point: ['point'],
      celebrate: ['celebrate', 'cheer'],
      idle: ['idle', 'stand'],
    }

    const findAction = (name) => {
      const candidates = lookup[name] || lookup.idle
      for (const key of Object.keys(actions)) {
        const lowerKey = key.toLowerCase()
        if (candidates.some((candidate) => lowerKey.includes(candidate))) {
          return actions[key]
        }
      }
      return null
    }

    Object.values(actions).forEach((clip) => clip.stop())
    const targetAction = findAction(action) || findAction('idle')
    if (targetAction) {
      targetAction.reset().fadeIn(0.25).play()
    }

    return () => {
      mixer?.stopAllAction()
    }
  }, [actions, action, mixer])

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(state.clock.elapsedTime / 4) * 0.06, 0.05)
    group.current.position.y = 0.05 * Math.sin(state.clock.elapsedTime / 2.8)
    mixer?.update(delta)
  })

  return <primitive ref={group} object={scene} dispose={null} />
}

export default function AvatarScene({ action = 'idle', withEnvironment = true }) {
  return (
    <group position={[0, -0.12, 0]} scale={[1.02, 1.02, 1.02]}>
      <AvatarModel action={action} />
      {withEnvironment && <Environment preset="city" blur={0.8} />}
    </group>
  )
}
