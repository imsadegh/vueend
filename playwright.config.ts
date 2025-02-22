import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173', // Adjust according to your dev server
    storageState: 'auth.json', // Store auth session here
  },
  webServer: {
    command: 'pnpm dev', // Ensure your app runs before tests
    port: 5173, // Adjust this based on your development server
    reuseExistingServer: true,
  },
});
