const audioCache = new Map()

export async function fetchSpeechAudio(text, signal, voiceId, voiceSettings) {
  const normalizedText = String(text || '').trim()
  if (!normalizedText) {
    throw new Error('Texto para síntese não pode estar vazio.')
  }

  const cacheKey = `${voiceId || 'default'}:${normalizedText}`
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)
  }

  const payload = { text: normalizedText }
  if (voiceId) payload.voiceId = voiceId
  if (voiceSettings) payload.voiceSettings = voiceSettings

  const response = await fetch('/api/elevenlabs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || 'Falha ao gerar áudio ElevenLabs.')
  }

  const arrayBuffer = await response.arrayBuffer()
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
  const url = URL.createObjectURL(blob)
  const data = { blob, url }
  audioCache.set(cacheKey, data)
  return data
}

export function clearSpeechAudioCache() {
  audioCache.forEach((entry) => {
    if (entry?.url) URL.revokeObjectURL(entry.url)
  })
  audioCache.clear()
}

export async function fetchAvailableVoices() {
  const response = await fetch('/api/elevenlabs/voices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || 'Falha ao buscar vozes ElevenLabs.')
  }

  return response.json()
}
