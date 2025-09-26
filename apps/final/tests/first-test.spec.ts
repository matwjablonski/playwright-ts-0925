import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";

test('check if page contains todo cards', async ({
    page
}) => {
    await page.goto('http://localhost:5174/');

    const loginPage = new LoginPage(page);
    await loginPage.login('admin123');

    // await page.keyboard.press('Enter');

   // await page.getByRole('button', { name: 'Zaloguj się' }).click();

    await expect(page.getByTestId('test-action-list-wrapper').locator('div').filter({ hasText: 'Znaleziono 6 zadań' })).toBeVisible();

    // await expect(page.getByRole('heading', { name: 'Lista zadań' })).toBeVisible();
});

test('check if we can add new todo', async ({ page }) => {
    await page.goto('http://localhost:5174/');

    const loginPage = new LoginPage(page);
    await loginPage.login('admin123');

    await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

    await expect(page.getByText('Tytuł zadania musi mieć co najmniej 3 znaki')).toBeVisible();

    await expect(page.getByText('Opis zadania musi mieć co najmniej 10 znaków')).toBeVisible();

    await page.getByRole('textbox', { name: 'Wpisz tytuł zadania (min. 3' }).fill('Nowe zadanie');
    
    await page.getByRole('textbox', { name: 'Wpisz szczegółowy opis zadania' }).fill('Opis nowego zadania');

    await page.locator('select[name="priority"]').selectOption('1');
    
    await page.locator('input[name="due_date"]').fill('2024-12-31');

    await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

    // await expect(page.getByTestId('test-action-form-wrapper').locator('div').filter({ hasText: 'Dodaj nowe zadanie' })).toBeVisible();

    // await page.getByLabel('Nazwa').click();
    // await page.getByLabel('Nazwa').fill('Nowe zadanie');
    // await page.getByLabel('Nazwa').press('Tab');
    // await page.getByLabel('Opis').fill('Opis nowego zadania');
    // await page.getByLabel('Opis').press('Tab');
    // await page.getByLabel('Priorytet').selectOption('wysoki');
    // await page.getByLabel('Priorytet').press('Tab');
    // await page.getByLabel('Data zakończenia').fill('2024-12-31');
    // await page.getByLabel('Data zakończenia').press('Tab');
    // await page.getByRole('button', { name: 'Dodaj zadanie' }).click();

    // czy pole z formularza zostało wyczyszczone
    await expect(page.getByRole('textbox', { name: 'Wpisz tytuł zadania (min. 3' })).toHaveValue('');
    await page.locator('.card-footer-item').first().click({
      button: 'right'
    });
    await page.getByTestId('test-action-list-wrapper').locator('div').filter({ hasText: 'Posprzątaj pokójUpewnij si' }).nth(3).click();
    await page.locator('body').press('Escape');
    await page.getByText('Upewnij się, że wszystkie').click();
    await page.getByText('Upewnij się, że wszystkie').click({
      button: 'right'
    });

    // await expect(page.getByTestId('test-action-list-wrapper').locator('div').filter({ hasText: 'Znaleziono 7 zadań' })).toBeVisible();
});

// - napisz test, który będzie w menu nawigacyjnym pierwszy element na lewo od **O aplikcji** - czyli **"Strona głowna"**
// - sprawdź czy footer zawiera poprawny tekst `/Todo App/`
// - wykorzystaj do tego celu złożone selektory CSS

test('check navigation menu and footer', async ({ page }) => {
    await page.goto('http://localhost:5174/');

    const loginPage = new LoginPage(page);
    await loginPage.login('admin123');

    const home = page.locator('nav :left-of(:text("O aplikacji")):nth-child(2)');

    await expect(home).toHaveText('Strona główna');

    await home.click();

    await expect(page.locator('footer')).toHaveText(/Todo App/);
});