const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('PAGE CONSOLE ERROR:', msg.text())
  })
  page.on('pageerror', (error) => console.log('PAGE ERROR:', error.message))
})

test('home page loads and assistant UI is visible', async ({ page }) => {
  await page.goto('http://127.0.0.1:4177/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveTitle(/portfólio|portfolio|Davi/i)
  await expect(page.locator('text=Davi Grah')).toBeVisible()
  await expect(page.locator('button', { hasText: /Falar com o avatar|Voz/ })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(1)
  await expect(page.locator('text=Apresentar Projeto')).toBeVisible()
})

test('chat panel can open and accept input', async ({ page }) => {
  await page.goto('http://127.0.0.1:4177/')
  await page.waitForLoadState('networkidle')
  const chatButton = page.locator('button', { hasText: /Abrir chat|Ocultar chat/ })
  await expect(chatButton).toBeVisible()
  await chatButton.click()
  await expect(page.locator('input[placeholder*="Pergunte"]')).toBeVisible()
})
