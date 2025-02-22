// import { expect, test as setup } from '@playwright/test';

// setup('Login and save authentication state', async ({ page }) => {
//   await page.goto('/login'); // Adjust URL as needed

//   await page.fill('input[name="email"]', 'instructor@demo.com'); // Use valid credentials
//   await page.fill('input[name="password"]', 'Sadegh@123');
//   await page.click('button[type="submit"]');

//   // Wait for navigation or a dashboard element that confirms login
//   await page.waitForURL('/dashboards/lms-instructor');
//   await expect(page.locator('text=Dashboard')).toBeVisible();

//   // Save authentication state
//   await page.context().storageState({ path: 'auth.json' });
// });


import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests', // Ensure this points to your tests directory
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
