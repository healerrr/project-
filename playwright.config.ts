import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 7_500
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    launchOptions: {
      executablePath: 'C:/Users/Thinkpad User/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'
    },
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
