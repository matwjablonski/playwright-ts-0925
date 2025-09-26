import type { Locator, Page } from "playwright/test";

export class TodosPage {
    addTodoButton: Locator;
    inputTitle: Locator;
    inputDescription: Locator
    inputDueDate: Locator;
    selectPriority: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.addTodoButton = this.page.getByRole('button', { name: 'Dodaj zadanie' });
        this.inputTitle = this.page.getByRole('textbox', { name: 'Wpisz tytuł zadania (min. 3' });
        this.inputDescription = this.page.getByRole('textbox', { name: 'Wpisz szczegółowy opis zadania' });
        this.inputDueDate = this.page.locator('input[name="due_date"]');
        this.selectPriority = this.page.locator('select[name="priority"]');
    }

    async addTodo(title: string, description: string, dueDate: string, priority: '1' | '2' | '3') {
        await this.inputTitle.fill(title);
        await this.inputDescription.fill(description);
        await this.inputDueDate.fill(dueDate);
        await this.selectPriority.selectOption(priority);
        await this.addTodoButton.click();
    }

    async removeTodo() {}

    async getTodoCount() {}
}