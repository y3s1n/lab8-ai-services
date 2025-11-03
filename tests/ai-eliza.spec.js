import { test, expect } from '@playwright/test';

test('Eliza provider generates a visible bot reply', async ({ page }) => {
    await page.goto('/');

    await page.locator('#providerSelect').selectOption('eliza');

    const allMsgs = page.locator('.chatBox .userMsg, .chatBox .message.bot');
    const before = await allMsgs.count();

    await page.fill('#messageBox', 'hello eliza');
    await page.click('#sendBtn');

    await expect(allMsgs).toHaveCount(before + 2, { timeout: 10_000 });
    const lastText = await page.locator('.chatBox .message.bot').last().textContent();
    expect((lastText ?? '').trim().length).toBeGreaterThan(0);
});