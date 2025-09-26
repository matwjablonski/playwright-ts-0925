import { test, expect } from "@playwright/test";

test('check if page contains todo cards', async ({
    page
}) => {
    await page.goto('http://localhost:5174/');

    await page.getByRole('textbox', { name: 'Wprowadź hasło...' }).fill('admin123');

    await page.getByRole('textbox', { name: 'Wprowadź hasło...' }).press('Enter');

    // await page.keyboard.press('Enter');

   // await page.getByRole('button', { name: 'Zaloguj się' }).click();

    await expect(page.getByTestId('test-action-list-wrapper').locator('div').filter({ hasText: 'Znaleziono 6 zadań' })).toBeVisible();

    // await expect(page.getByRole('heading', { name: 'Lista zadań' })).toBeVisible();
});