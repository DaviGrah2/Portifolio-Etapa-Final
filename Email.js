import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'davigrah2010@gmail.com',
  subject: 'Teste',
  html: '<h1>Funcionando</h1>'
})