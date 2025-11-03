import { test, expect } from '@playwright/test';

// ---------  READ THIS  ---------
// Prefer to set your key via environment variable:
//
//   (PowerShell)  $env:OPENAI_API_KEY="sk-..."
//   (Git Bash)    export OPENAI_API_KEY="sk-..."
//   (Cmd)         setx OPENAI_API_KEY "sk-..."
//
// If you reall want to hardcode, replace the placeholder below,
// but remember to delete it afterward.
const FALLBACK_KEY = 'PUT_YOUR_KEY_HERE_IF_YOU_ABSOLUTELY_MUST';

const REAL_KEY =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()
    ? process.env.OPENAI_API_KEY.trim()
    : (FALLBACK_KEY !== 'PUT_YOUR_KEY_HERE_IF_YOU_ABSOLUTELY_MUST' ? FALLBACK_KEY : '');

test.describe('OpenAI live E2E', () => {
  test.beforeEach(async ({ page }) => {
    
    test.skip(!REAL_KEY, 'OPENAI_API_KEY not set (or test fallback not provided).');

  
    await page.addInitScript((key) => {
      localStorage.setItem('openai_user_key', key);
    }, REAL_KEY);
  });

  test('sends a real OpenAI request end-to-end and renders the reply', async ({ page }) => {
   
    let sawHeader = false;
    page.on('request', (req) => {
      if (req.url().endsWith('/api/ai/respond') && req.method() === 'POST') {
        const h = req.headers();
        if (h['x-user-openai-key'] === REAL_KEY) {
          sawHeader = true;
        }
      }
    });

    
    await page.goto('/');

    
    const providerSelect = page.locator('#providerSelect');
    await providerSelect.selectOption('openai');

  
    const msg = `playwright live ping ${Date.now()}`;
    await page.fill('#messageBox', msg);
    await page.click('#sendBtn');

   const botBubble = page.locator('.message.bot').first();
    await expect(botBubble).toBeVisible({ timeout: 20000 });
    await expect(botBubble).toHaveText(/.+/, { timeout: 20000 });

  
    await expect(page.locator('time.timestamp.bot').first()).toBeVisible();

   
    expect(sawHeader).toBeTruthy();
  });
});
