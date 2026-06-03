import { assistantPrompts } from '../data/prompts'

const knowledge = assistantPrompts.knowledge

const sectionMatchers = [
  { regex: /\b(home|início|inicio|inicial|entrada)\b/i, section: 'home' },
  { regex: /\b(sobre|about|biografia|história|historia)\b/i, section: 'about' },
  { regex: /\b(skills|habilidades|tecnologias|tech|tecnologia)\b/i, section: 'skills' },
  { regex: /\b(projetos|portfólio|portfolio|trabalhos|work)\b/i, section: 'projects' },
  { regex: /\b(contato|fale|email|linkedin|mensagem|falar)\b/i, section: 'contact' },
]

const presentationMatcher = /\b(apresentar|apresentação|apresente|modo de apresentação|modo apresentação|mostrar meu portfólio|mostrar o portfólio|faça a apresentação|iniciar apresentação)\b/i
const helpMatcher = /\b(ajuda|como usar|o que você pode|o que faz|preciso de|o que eu faço)\b/i

const localAnswers = [
  {
    test: presentationMatcher,
    answer:
      'Claro, vou iniciar a apresentação guiada do portfólio. Primeiro, vamos mostrar a seção inicial e depois falar sobre habilidades e projetos.',
    action: 'presentation',
    targetSection: 'home',
  },
  {
    test: helpMatcher,
    answer:
      'Posso responder perguntas sobre projetos, tecnologias e experiência. Também posso levar você a seções como Home, Sobre, Skills, Projetos e Contato. Diga algo como "Mostre a seção de projetos" ou "Apresente seu portfólio".',
    action: 'help',
  },
]

function detectSection(message) {
  return sectionMatchers.find((matcher) => matcher.regex.test(message))
}

function findLocalAnswer(message) {
  const section = detectSection(message)
  if (section) {
    return {
      text: `Certo, levando você para a seção ${section.section}.`, 
      action: 'navigate',
      targetSection: section.section,
      source: 'local',
    }
  }

  const localMatch = localAnswers.find((item) => item.test.test(message))
  if (localMatch) {
    return {
      text: localMatch.answer,
      action: localMatch.action,
      targetSection: localMatch.targetSection,
      source: 'local',
    }
  }

  const generic = [
    { regex: /(quem é você|quem você é|quem você)/i, text: 'Eu sou o avatar-guia do portfólio de Davi Grah. Estou aqui para mostrar suas habilidades, projetos e ajudar a navegar pelo site de forma interativa.', action: 'wave', targetSection: 'home' },
    { regex: /(tecnolog|react|three|node|mongo|express|gsap|framer|javascript|vite)/i, text: 'Davi domina React, Vite, JavaScript, Three.js, React Three Fiber, GSAP, Framer Motion, Node.js, Express e MongoDB. Ele constrói experiências front-end com animação e backends escaláveis.', action: 'point', targetSection: 'skills' },
    { regex: /(melhor projeto|projeto favorito|melhor trabalho)/i, text: 'Meu melhor projeto combina um agente virtual interativo com navegação cinematográfica e apresentação 3D. É uma experiência que une IA e interface futurista.', action: 'celebrate', targetSection: 'projects' },
    { regex: /(como foi desenvolvido|como foi feito|como foi criado)/i, text: 'Esse projeto foi desenvolvido usando React, Three.js, GSAP e um backend em Node.js com Express. A experiência inclui animações, voz e navegação guiada.', action: 'talk', targetSection: 'projects' },
    { regex: /(contato|falar com você|entrar em contato)/i, text: 'Você pode entrar em contato por email em davigrah2010@gmail.com ou pelo LinkedIn em linkedin.com/in/DaviGrah2.', action: 'point', targetSection: 'contact' },
  ]

  return generic.find((item) => item.regex.test(message)) || null
}

function buildOpenAIPrompt(message, history) {
  const systemMessage = {
    role: 'system',
    content: `${assistantPrompts.instructions}\n${knowledge}`,
  }

  const messages = [systemMessage, ...history, { role: 'user', content: message }]
  return messages
}

export async function queryAssistant(message, history = []) {
  const cleanedMessage = message.trim()
  const localResponse = findLocalAnswer(cleanedMessage)
  if (localResponse) {
    return localResponse
  }

  if (typeof window !== 'undefined' && window.fetch && import.meta.env.VITE_DISABLE_OPENAI !== 'true') {
    try {
      const resp = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanedMessage, history }),
      })

      if (resp.ok) {
        const data = await resp.json()
        const text = data?.text?.trim()
        if (text) return { text, action: 'talk', source: 'openai' }
      } else {
        console.warn('OpenAI proxy returned non-ok status')
      }
    } catch (error) {
      console.warn('OpenAI proxy error', error)
    }
  }

  return {
    text: 'Estou pronto para mostrar seus projetos, explicar suas habilidades e responder perguntas sobre o portfólio. Pergunte-me algo específico sobre a experiência ou as tecnologias.',
    action: 'talk',
    source: 'fallback',
  }
}
