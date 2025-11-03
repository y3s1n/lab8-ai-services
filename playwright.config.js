import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests',
    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
    },
    webServer: {
        command: 'npx http-server ./src -p 5173 -c-1',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 30_000,
    },
});