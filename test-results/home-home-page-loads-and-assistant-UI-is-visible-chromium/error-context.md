# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.js >> home page loads and assistant UI is visible
- Location: tests\e2e\home.spec.js:10:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Davi Grah')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Davi Grah')

```

```yaml
- heading "Unexpected Application Error!" [level=2]
- 'heading "Minified React error #185; visit https://reactjs.org/docs/error-decoder.html?invariant=185 for the full message or use the non-minified dev environment for full errors and additional helpful warnings." [level=3]'
- text: "Error: Minified React error #185; visit https://reactjs.org/docs/error-decoder.html?invariant=185 for the full message or use the non-minified dev environment for full errors and additional helpful warnings. at hl (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:33655) at Ho (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:6:19735) at zo (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:6:19546) at _c (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:24138) at Ll (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:42186) at Il (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:41034) at Fl (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:40079) at Sl (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:36698) at ia (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:6:3265) at Ll (http://127.0.0.1:4177/assets/drei-CHyNi_ne.js:8:42325)"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test')
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   page.on('console', (msg) => {
  5  |     if (msg.type() === 'error') console.log('PAGE CONSOLE ERROR:', msg.text())
  6  |   })
  7  |   page.on('pageerror', (error) => console.log('PAGE ERROR:', error.message))
  8  | })
  9  | 
  10 | test('home page loads and assistant UI is visible', async ({ page }) => {
  11 |   await page.goto('http://127.0.0.1:4177/')
  12 |   await page.waitForLoadState('networkidle')
  13 |   await expect(page).toHaveTitle(/portfólio|portfolio|Davi/i)
> 14 |   await expect(page.locator('text=Davi Grah')).toBeVisible()
     |                                                ^ Error: expect(locator).toBeVisible() failed
  15 |   await expect(page.locator('button', { hasText: /Falar com o avatar|Voz/ })).toBeVisible()
  16 |   await expect(page.locator('canvas')).toHaveCount(1)
  17 |   await expect(page.locator('text=Apresentar Projeto')).toBeVisible()
  18 | })
  19 | 
  20 | test('chat panel can open and accept input', async ({ page }) => {
  21 |   await page.goto('http://127.0.0.1:4177/')
  22 |   await page.waitForLoadState('networkidle')
  23 |   const chatButton = page.locator('button', { hasText: /Abrir chat|Ocultar chat/ })
  24 |   await expect(chatButton).toBeVisible()
  25 |   await chatButton.click()
  26 |   await expect(page.locator('input[placeholder*="Pergunte"]')).toBeVisible()
  27 | })
  28 | 
```