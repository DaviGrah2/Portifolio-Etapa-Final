module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss'
  ],
  rules: {
    // permite diretivas do Tailwind como @tailwind e @apply (a regra é tratada pela config tailwind)
  }
}
