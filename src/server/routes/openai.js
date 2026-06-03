const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server.' })
  }

  const { message, history = [] } = req.body || {}
  if (!message) return res.status(400).json({ error: 'Missing message.' })

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...history, { role: 'user', content: message }],
        temperature: 0.8,
        max_tokens: 400,
      }),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return res.status(502).json({ error: 'OpenAI proxy error', detail: txt })
    }

    const data = await resp.json()
    const text = data?.choices?.[0]?.message?.content?.trim() || ''
    return res.json({ text })
  } catch (err) {
    console.error('OpenAI proxy error', err)
    return res.status(500).json({ error: 'Server error contacting OpenAI' })
  }
})

module.exports = router
