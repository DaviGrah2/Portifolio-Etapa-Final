const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY
  const defaultVoiceId = process.env.VITE_ELEVENLABS_VOICE_ID

  if (!apiKey || !defaultVoiceId) {
    return res.status(500).json({ error: 'ElevenLabs não está configurado. Defina VITE_ELEVENLABS_API_KEY e VITE_ELEVENLABS_VOICE_ID.' })
  }

  const { text, voiceId: requestedVoiceId, voiceSettings } = req.body || {}
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texto para síntese de voz é obrigatório.' })
  }

  const voiceId = typeof requestedVoiceId === 'string' && requestedVoiceId.trim() ? requestedVoiceId.trim() : defaultVoiceId
  const audioSettings = {
    stability: 0.55,
    similarity_boost: 0.75,
    ...(typeof voiceSettings === 'object' && voiceSettings ? voiceSettings : {}),
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: audioSettings,
      }),
    })

    if (!response.ok) {
      const payload = await response.text()
      console.error('ElevenLabs error:', payload)
      return res.status(502).json({ error: 'Falha ElevenLabs', detail: payload })
    }

    const arrayBuffer = await response.arrayBuffer()
    res.set('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(arrayBuffer))
  } catch (error) {
    console.error('Erro ElevenLabs proxy:', error)
    res.status(500).json({ error: 'Erro ao gerar áudio da assistente.' })
  }
})

router.get('/voices', async (req, res) => {
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ElevenLabs não está configurado. Defina VITE_ELEVENLABS_API_KEY.' })
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'xi-api-key': apiKey,
      },
    })

    if (!response.ok) {
      const payload = await response.text()
      console.error('ElevenLabs voices error:', payload)
      return res.status(502).json({ error: 'Falha ao buscar vozes ElevenLabs', detail: payload })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.error('Erro ElevenLabs voices proxy:', error)
    res.status(500).json({ error: 'Erro ao buscar vozes da assistente.' })
  }
})

module.exports = router
