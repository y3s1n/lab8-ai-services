import { test, expect } from '@playwright/test';

test('OpenAI provider sends BYOK header and renders mocked reply', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('openai_user_key', 'sk-test-PLAYWRIGHT-123');
  });

 
  await page.route('http://localhost:3000/api/ai/respond', async (route, request) => {
    const headers = request.headers();
    const bodyText = request.postData() || '{}';
    let body;
    try { body = JSON.parse(bodyText); } catch { body = {}; }

   
    expect(headers['x-user-openai-key']).toBe('sk-test-PLAYWRIGHT-123');
    expect(body.provider).toBe('openai');
    expect(typeof body.input).toBe('string');

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reply: 'Hello from OpenAI (mocked)', provider: 'openai' })
    });
  });

  await page.goto('/'); 

  
  const providerSelect = page.locator('#providerSelect');
  await providerSelect.selectOption('openai');


  await page.fill('#messageBox', 'test via playwright');
  await page.click('#sendBtn');


  await expect(page.getByText('Hello from OpenAI (mocked)')).toBeVisible({ timeout: 3000 });
});