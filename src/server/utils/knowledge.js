const knowledge = {
  name: 'Davi Grah',
  role: 'Arquiteto de Software & Desenvolvedor Front-end',
  tagline: 'Construindo portfólios futuristas com IA, 3D e narrativa interativa.',
  skills: ['React', 'Vite', 'JavaScript', 'Three.js', 'React Three Fiber', 'GSAP', 'Framer Motion', 'Node.js', 'Express', 'MongoDB'],
  experience: ['Criação de experiências 3D interativas', 'Animações cinematográficas', 'Integração de backend e APIs'],
  contact: {
    email: 'davigrah2010@gmail.com',
    linkedin: 'https://linkedin.com/in/DaviGrah2',
    github: 'https://github.com/DaviGrah2',
  },
}

const findAnswer = (message) => {
  const lower = message.toLowerCase()

  if (/(quem é você|quem você é|quem você)/i.test(lower)) {
    return {
      text: `Eu sou o avatar-guia do portfólio de ${knowledge.name}. Estou aqui para mostrar seus projetos, habilidades e ajudar na navegação do site.`, 
      action: 'wave',
      targetSection: 'home',
    }
  }

  if (/(quais tecnologias|tecnologias domina|react|three|node|mongo|express|gsap|framer)/i.test(lower)) {
    return {
      text: `Davi domina ${knowledge.skills.join(', ')}. Ele constrói experiências imersivas com foco em 3D, UI dinâmica e backends escaláveis.`, 
      action: 'point',
      targetSection: 'skills',
    }
  }

  if (/(melhor projeto|projeto favorito|melhor trabalho)/i.test(lower)) {
    return {
      text: 'O melhor projeto é o que apresenta um agente virtual 3D, fala natural e navegação cinematográfica. Ele mostra o poder da IA e do design em conjunto.',
      action: 'celebrate',
      targetSection: 'projects',
    }
  }

  if (/(como foi desenvolvido|como foi feito|como foi criado)/i.test(lower)) {
    return {
      text: 'Esse portfólio usa React, Three.js, GSAP e Express. A arquitetura une frontend interativo, animações e um backend com memória contextual.',
      action: 'talk',
      targetSection: 'projects',
    }
  }

  if (/(contato|entrar em contato|falar com você)/i.test(lower)) {
    return {
      text: `Você pode contatar Davi por email em ${knowledge.contact.email} ou pelo LinkedIn em ${knowledge.contact.linkedin}.`, 
      action: 'point',
      targetSection: 'contact',
    }
  }

  return null
}

module.exports = { knowledge, findAnswer }
