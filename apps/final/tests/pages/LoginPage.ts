import { test, expect, type Page, type Locator } from '@playwright/test';

export class LoginPage {
    passwordInput: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.passwordInput = this.page.getByRole('textbox', { name: 'Wprowadź hasło...' });
    }

    async login(password: string) {
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
    }
}