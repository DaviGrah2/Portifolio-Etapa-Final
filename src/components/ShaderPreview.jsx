import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function ShaderPreview({ intensity = 1 }){
  const mountRef = useRef()
  const [disabled, setDisabled] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(()=>{
    if (typeof window !== 'undefined') {
      // Disable shader rendering on small screens to avoid extra GPU pressure.
      if (window.matchMedia('(max-width: 640px)').matches) {
        setDisabled(true)
      }
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setSupported(false)
    }
  }, [])

  useEffect(()=>{
    if (disabled || !supported) return
    const mount = mountRef.current
    if (!mount) return
    const width = mount.clientWidth
    const height = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 1000)
    camera.position.z = 1

    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_intensity: { value: intensity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_intensity;
        varying vec2 vUv;

        void main(){
          vec2 uv = vUv;
          float t = u_time * 0.2;
          float wave = sin((uv.x + t) * 6.0) * 0.03;
          vec3 col = mix(vec3(0.08,0.12,0.25), vec3(0.4,0.6,0.8), uv.y + wave * u_intensity);
          gl_FragColor = vec4(col, 0.85);
        }
      `,
      transparent: true
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const handleContextLost = (event) => {
      event.preventDefault()
      console.warn('WebGL context lost for ShaderPreview, falling back to static gradient.')
    }
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost)

    let req = null
    const clock = new THREE.Clock()
    function animate(){
      material.uniforms.u_time.value = clock.getElapsedTime()
      renderer.render(scene, camera)
      req = requestAnimationFrame(animate)
    }
    animate()

    function handleResize(){
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      camera.left = -w / 2
      camera.right = w / 2
      camera.top = h / 2
      camera.bottom = -h / 2
      camera.updateProjectionMatrix()
      material.uniforms.u_resolution.value.set(w,h)
    }
    window.addEventListener('resize', handleResize)

    return ()=>{
      cancelAnimationFrame(req)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement && mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  },[disabled, supported, intensity])

  if (disabled || !supported) return <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#071223] to-transparent" />

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
}
