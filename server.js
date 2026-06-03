const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const { Resend } = require('resend')
const { connectMongo, saveContact } = require('./src/server/services/mongoService')
const aiRouter = require('./src/server/routes/ai')
const openaiRouter = require('./src/server/routes/openai')
const elevenlabsRouter = require('./src/server/routes/elevenlabs')

dotenv.config()

const resendApiKey = process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const emailTo = process.env.EMAIL_TO || 'davigrah2010@gmail.com'
const mongoUri = process.env.MONGODB_URI

async function createResendClient() {
  if (!resendApiKey) {
    throw new Error('Missing API key. Defina RESEND_API_KEY no arquivo .env.')
  }
  return new Resend(resendApiKey)
}

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

if (mongoUri) {
  connectMongo(mongoUri).then(() => {
    console.log('Conectado ao MongoDB')
  }).catch((error) => {
    console.warn('Falha ao conectar MongoDB:', error.message)
  })
} else {
  console.warn('MONGODB_URI não definido. Memória persistente de IA ficará desabilitada.')
}

app.use('/api/chat', aiRouter)
app.use('/api/openai', openaiRouter)
app.use('/api/elevenlabs', elevenlabsRouter)

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' })
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: 'Servidor de email não configurado. Defina RESEND_API_KEY no arquivo .env.' })
  }

  try {
    const resend = await createResendClient()
    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: subject || 'Novo contato pelo portfólio',
      html: `
        <h2>Novo contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject || 'Sem assunto'}</p>
        <p><strong>Mensagem:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    if (mongoUri) {
      await saveContact({ name, email, subject, message })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Não foi possível enviar o email agora. Tente novamente mais tarde.'
      : error.message || 'Erro desconhecido ao enviar email.'

    res.status(500).json({ error: errorMessage })
  }
})

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint não encontrado.' })
  }
  next()
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' })
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
