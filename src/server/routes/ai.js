const express = require('express')
const { findAnswer } = require('../utils/knowledge')
const { saveConversation } = require('../services/mongoService')

const router = express.Router()

router.post('/', async (req, res) => {
  const { message, sessionId = 'guest' } = req.body
  if (!message) {
    return res.status(400).json({ error: 'Mensagem obrigatória.' })
  }

  const answer = findAnswer(message) || {
    text: 'Estou aprendendo sobre este portfólio. Faça perguntas como "Quem é você?", "Quais tecnologias domina?" ou "Como entrar em contato?".',
    action: 'talk',
    targetSection: 'home',
  }

  try {
    await saveConversation(sessionId, { role: 'visitor', message })
    await saveConversation(sessionId, { role: 'assistant', message: answer.text })
  } catch (error) {
    console.warn('Não foi possível salvar conversa:', error.message)
  }

  res.json({ ...answer, source: 'local' })
})

module.exports = router
