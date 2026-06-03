import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export async function analyzeGLBModel(modelPath) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    
    loader.load(
      modelPath,
      (gltf) => {
        const colors = extractColorsFromModel(gltf.scene)
        const palette = generatePaletteFromColors(colors)
        const style = analyzeModelStyle(gltf.scene)
        
        resolve({
          colors,
          palette,
          style,
          materials: extractMaterials(gltf.scene),
          animations: gltf.animations.map((a) => a.name),
        })
      },
      undefined,
      reject
    )
  })
}

function extractColorsFromModel(scene) {
  const colorMap = {}
  const materials = new Set()

  scene.traverse((mesh) => {
    if (mesh.isMesh && mesh.material) {
      const mat = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      
      mat.forEach((m) => {
        if (m.color) {
          const hex = m.color.getHexString()
          colorMap[hex] = (colorMap[hex] || 0) + 1
        }
        materials.add(m)
      })
    }
  })

  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => `#${color}`)

  return sortedColors
}

function generatePaletteFromColors(colors) {
  const primaryColor = colors[0] || '#7c3aed'
  const secondaryColor = colors[1] || '#60a5fa'
  const accentColor = colors[2] || '#a78bfa'

  return {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    dark: '#050816',
    darker: '#0a0f1e',
    light: '#f0f4ff',
    border: `${primaryColor}40`,
    glow: `${accentColor}80`,
    text: '#e8eef5',
    textMuted: '#a8b4c4',
  }
}

function extractMaterials(scene) {
  const materials = {}
  
  scene.traverse((mesh) => {
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m, i) => {
        materials[`${mesh.name}_${i}`] = {
          type: m.type,
          color: m.color?.getHexString(),
          metalness: m.metalness,
          roughness: m.roughness,
          emissive: m.emissive?.getHexString(),
        }
      })
    }
  })

  return materials
}

function analyzeModelStyle(scene) {
  let totalVertices = 0
  let meshCount = 0
  const hasAnimations = scene.animations?.length > 0

  scene.traverse((mesh) => {
    if (mesh.isMesh) {
      meshCount++
      if (mesh.geometry) {
        totalVertices += mesh.geometry.attributes?.position?.count || 0
      }
    }
  })

  return {
    meshCount,
    totalVertices,
    hasAnimations,
    complexity: totalVertices > 50000 ? 'high' : totalVertices > 10000 ? 'medium' : 'low',
    aesthetic: 'cyberpunk_futuristic',
  }
}
