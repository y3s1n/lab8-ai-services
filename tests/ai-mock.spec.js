import {test, expect } from '@playwright/test';

test('Mock provider rerplies with "MOCK: <userMsg>" in the chat box', async ({ page }) => {
    await page.goto('/');

    const providerSelect = page.locator('#providerSelect');
    await providerSelect.selectOption('mock');

    await page.fill('textarea', 'hello playwright');

    await page.getByRole('button', { name: /send/i }).click();
    await expect(page.getByText('MOCK: hello playwright')).toBeVisible();
})