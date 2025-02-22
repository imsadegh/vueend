import { expect, test } from '@playwright/test';

test.describe('Instructor Assignments', () => {
  // Option A: If you need to log in programmatically (without a stored session):
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto('http://localhost:5173/login');

    // Fill in login form (adjust selectors as necessary)
    await page.fill('input[name="email"]', 'instructor@demo.com');
    await page.fill('input[name="password"]', 'password123');

    // Click login button
    await page.click('button:has-text("Login")');

    // Wait for navigation or an element that indicates login success
    await page.waitForURL('**/dashboard');
  });

  // This test covers the entire flow: create, edit, and delete
  test('should allow instructor to create, edit, and delete an assignment', async ({ page }) => {
    const courseId = 7; // or read from config / environment

    // 1) Navigate to the instructor’s assignments page for a specific course
    await page.goto(`http://localhost:5173/instructor/courses/${courseId}/assignments`);

    // 2) Click "Create New Assignment" (button text must match your UI)
    await page.click('button:has-text("Create New Assignment")');

    // 3) Fill out the "Create Assignment" form
    await page.fill('input[label="Title"]', 'E2E Testing Assignment');
    await page.fill('textarea[label="Description"]', 'Write about your testing strategy.');
    await page.fill('input[label="submissionDeadline"]', '2025-02-28T23:59');
    // Toggle "Visible" switch if needed:
    // await page.click('input[type="checkbox"][label="Visible"]');
    // Or with text if you use a VSwitch: await page.click('div:has-text("Visible")');

    // 4) Click "Save" to create the assignment
    await page.click('button:has-text("Save")');

    // Expect the newly created assignment to appear in the table
    await expect(page.locator('table')).toContainText('E2E Testing Assignment');

    // 5) Edit the newly created assignment
    // Locate the row that contains "E2E Testing Assignment" and click the "Edit" button
    // (Adjust the selector logic if your table is structured differently)
    const assignmentRow = page.locator('tr', { hasText: 'E2E Testing Assignment' });
    await assignmentRow.getByRole('button', { name: /edit/i }).click();

    // Change the assignment type to "group"
    await page.selectOption('select[label="Type"]', 'group');
    // Or if it’s a VSelect, you may do a click and select from a list:
    // await page.click('label:has-text("Type")');
    // await page.click('div:has-text("Group")');

    // Save changes
    await page.click('button:has-text("Save")');

    // Expect assignment row to show type is now "group"
    await expect(assignmentRow).toContainText('group');

    // 6) Delete the assignment
    await assignmentRow.getByRole('button', { name: /delete/i }).click();

    // Confirm the deletion if your UI triggers a confirmation
    // e.g. a native JS confirm() or a custom dialog:
    // If it’s a native confirm(), you can use the Page event:
    page.once('dialog', dialog => dialog.accept());

    // 7) Verify assignment is removed from the table
    await expect(page.locator('table')).not.toContainText('E2E Testing Assignment');
  });
});
