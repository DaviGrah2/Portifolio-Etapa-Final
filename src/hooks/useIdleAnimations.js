import { useEffect } from 'react'
import * as THREE from 'three'

export function useIdleAnimations(modelRef, mixer) {
  useEffect(() => {
    if (!modelRef.current || !mixer) return

    const animateIdle = () => {
      if (modelRef.current) {
        // Breathing animation
        modelRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.0005

        // Head tilt
        const head = modelRef.current.getObjectByName('Head') || modelRef.current.getObjectByName('Armature.001')
        if (head) {
          head.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1
          head.rotation.x = Math.sin(Date.now() * 0.0007) * 0.05
        }

        // Hair flow
        const hair = modelRef.current.getObjectByName('Hair')
        if (hair) {
          hair.rotation.z = Math.sin(Date.now() * 0.0003) * 0.05
        }

        // Subtle body sway
        modelRef.current.rotation.z = Math.sin(Date.now() * 0.0004) * 0.02
      }
    }

    const interval = setInterval(animateIdle, 16)
    return () => clearInterval(interval)
  }, [modelRef, mixer])
}

export function useBlinkAnimation(modelRef) {
  useEffect(() => {
    if (!modelRef.current) return

    const blink = () => {
      const leftEye = modelRef.current?.getObjectByName('LeftEye')
      const rightEye = modelRef.current?.getObjectByName('RightEye')

      if (leftEye && rightEye) {
        // Random blink
        if (Math.random() > 0.98) {
          const blinkDuration = 100

          for (let i = 0; i <= blinkDuration; i += 20) {
            setTimeout(() => {
              const scale = Math.cos((i / blinkDuration) * Math.PI)
              if (leftEye.scale) leftEye.scale.y = scale
              if (rightEye.scale) rightEye.scale.y = scale
            }, i)
          }
        }
      }
    }

    const interval = setInterval(blink, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [modelRef])
}

export function useLookAround(modelRef) {
  useEffect(() => {
    if (!modelRef.current) return

    const lookAround = () => {
      const head = modelRef.current?.getObjectByName('Head')
      if (head && Math.random() > 0.95) {
        const targetX = (Math.random() - 0.5) * 0.3
        const targetY = (Math.random() - 0.5) * 0.2

        const steps = 30
        for (let i = 0; i < steps; i++) {
          setTimeout(() => {
            const t = i / steps
            if (head.rotation) {
              head.rotation.y = targetX * t
              head.rotation.x = targetY * t
            }
          }, i * 10)
        }
      }
    }

    const interval = setInterval(lookAround, 5000 + Math.random() * 5000)
    return () => clearInterval(interval)
  }, [modelRef])
}
