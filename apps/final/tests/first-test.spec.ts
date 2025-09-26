import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { TodosPage } from "./pages/TodosPages.js";
import { generateRandomString } from "./utils/todos.js";

test('check if page contains todo cards', async ({
    page
}) => {
    await page.goto('http://localhost:5174/');

    const loginPage = new LoginPage(page);

    await expect(page).toHaveScreenshot('login-page.png')

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

    const todosPage = new TodosPage(page);
    await todosPage.addTodo(generateRandomString(1), '', '2024-12-31', '1');

    expect(page.getByText('Tytuł zadania musi mieć conajmniej 3 znaki')).toBeVisible();
    
    await todosPage.addTodo(
        generateRandomString(10), 
        'Opis nowego zadania',
        '2027-12-31', 
        '1'
    );
    
    await expect(todosPage.inputTitle).toHaveValue('');
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