export async function postChat(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    return await response.json()
  } catch (error) {
    console.error('API chat error', error)
    return { error: 'Não foi possível conectar ao servidor de IA.' }
  }
}

export async function postContact(form) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    return await response.json()
  } catch (error) {
    console.error('API contact error', error)
    return { error: 'Não foi possível enviar a mensagem.' }
  }
}
