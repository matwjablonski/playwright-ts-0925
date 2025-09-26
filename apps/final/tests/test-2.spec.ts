import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/#/');
  await page.getByRole('textbox', { name: 'Wprowadź hasło...' }).click();
  await page.getByRole('textbox', { name: 'Wprowadź hasło...' }).fill('admin123');
  await page.getByRole('textbox', { name: 'Wprowadź hasło...' }).press('Enter');
  await page.getByText('Znaleziono 6 zadań').click();
});