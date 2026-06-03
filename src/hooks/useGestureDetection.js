import { useEffect, useRef, useState, useCallback } from 'react'

const GESTURE_TIMEOUT = 1500

export default function useGestureDetection() {
  const [gesture, setGesture] = useState(null)
  const [handDetected, setHandDetected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const gestureTimeoutRef = useRef(null)
  const handsRef = useRef(null)
  const videoRef = useRef(null)
  const cameraRef = useRef(null)

  const loadMediaPipe = useCallback(async () => {
    try {
      setLoading(true)
      
      if (!window.Hands) {
        console.warn('MediaPipe não carregado. Gestos desabilitados.')
        setError('MediaPipe não disponível')
        setLoading(false)
        return false
      }

      const { Hands } = window

      handsRef.current = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/dist/${file}`,
      })

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      })

      handsRef.current.onResults(detectGestures)
      setLoading(false)
      return true
    } catch (err) {
      console.warn('Erro ao carregar MediaPipe:', err.message)
      setError('MediaPipe indisponível')
      setLoading(false)
      return false
    }
  }, [])

  const detectGestures = useCallback((results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setHandDetected(false)
      return
    }

    setHandDetected(true)
    const hand = results.multiHandLandmarks[0]

    if (!hand || hand.length < 21) return

    const thumbTip = hand[4]
    const indexTip = hand[8]
    const middleTip = hand[12]
    const ringTip = hand[16]
    const pinkyTip = hand[20]
    const wrist = hand[0]

    const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

    const thumbIndexDist = distance(thumbTip, indexTip)
    const isThumbIndexPinched = thumbIndexDist < 0.05

    const allFingersUp =
      indexTip.y < hand[5].y &&
      middleTip.y < hand[9].y &&
      ringTip.y < hand[13].y &&
      pinkyTip.y < hand[17].y

    const onlyIndexUp = indexTip.y < hand[5].y && middleTip.y > hand[9].y

    const onlyIndexMiddleUp =
      indexTip.y < hand[5].y && middleTip.y < hand[9].y && ringTip.y > hand[13].y

    let detectedGesture = null

    if (isThumbIndexPinched) {
      detectedGesture = 'pinch'
    } else if (allFingersUp && indexTip.x > wrist.x + 0.15) {
      detectedGesture = 'openPalmRight'
    } else if (allFingersUp && indexTip.x < wrist.x - 0.15) {
      detectedGesture = 'openPalmLeft'
    } else if (onlyIndexUp) {
      detectedGesture = 'point'
    } else if (onlyIndexMiddleUp) {
      detectedGesture = 'peace'
    }

    if (detectedGesture) {
      setGesture(detectedGesture)
      window.clearTimeout(gestureTimeoutRef.current)
      gestureTimeoutRef.current = window.setTimeout(() => {
        setGesture(null)
      }, GESTURE_TIMEOUT)
    }
  }, [])

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })
      videoRef.current.srcObject = stream

      const loaded = await loadMediaPipe()
      if (!loaded) return false

      if (handsRef.current && window.Camera) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            await handsRef.current.send({ image: videoRef.current })
          },
          width: 640,
          height: 480,
        })
        cameraRef.current = camera
        camera.start()
      }

      return true
    } catch (err) {
      console.warn('Webcam não disponível:', err.message)
      setError('Webcam não autorizada')
      return false
    }
  }, [loadMediaPipe])

  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop?.()
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }, [])

  const toggleCamera = useCallback(async () => {
    if (videoRef.current?.srcObject) {
      stopCamera()
      setHandDetected(false)
      setGesture(null)
    } else {
      await startCamera()
    }
  }, [startCamera, stopCamera])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.mediaPipeScriptsLoaded) {
      window.mediaPipeScriptsLoaded = true
      
      const scripts = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
      ]

      scripts.forEach((src) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        document.head.appendChild(script)
      })
    }

    return () => {
      stopCamera()
      window.clearTimeout(gestureTimeoutRef.current)
    }
  }, [stopCamera])

  return {
    gesture,
    handDetected,
    loading,
    error,
    videoRef,
    toggleCamera,
    enabled: handsRef.current !== null,
  }
}
