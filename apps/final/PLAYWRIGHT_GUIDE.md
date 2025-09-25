# Playwright Testing Guide

## 🧪 Setup Playwright

```bash
# Instalacja Playwright
npm init playwright@latest

# Alternatywnie dodaj do package.json
npm install --save-dev @playwright/test
npx playwright install
```

## 📝 Przykładowe testy E2E

### **Basic CRUD Operations**

```javascript
// tests/todo-crud.spec.js
import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should add new todo with high priority', async ({ page }) => {
    // Fill form
    await page.fill('input[name="task"]', 'Test zadanie');
    await page.fill('textarea[name="description"]', 'To jest opis testowy zadania');
    await page.selectOption('select[name="priority"]', '1');
    await page.fill('input[name="due_date"]', '2024-12-31');
    
    // Submit
    await page.click('button:has-text("Dodaj zadanie")');
    
    // Verify
    await expect(page.locator('.card')).toContainText('Test zadanie');
    await expect(page.locator('.card .tag')).toContainText('🔴');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Dodaj zadanie")');
    
    // Check validation errors
    await expect(page.locator('.help.is-danger')).toHaveCount(2);
    await expect(page.locator('.help.is-danger').first()).toContainText('Tytuł zadania musi mieć co najmniej 3 znaki');
  });

  test('should toggle todo status', async ({ page }) => {
    // Add a todo first
    await page.fill('input[name="task"]', 'Test toggle');
    await page.fill('textarea[name="description"]', 'Test description for toggle');
    await page.click('button:has-text("Dodaj zadanie")');
    
    // Toggle status
    await page.click('button:has-text("✓ Ukończ")');
    
    // Verify completion
    await expect(page.locator('.card[data-done="true"]')).toBeVisible();
    await expect(page.locator('button:has-text("↶ Przywróć")')).toBeVisible();
  });
});
```

### **Filtering and Search**

```javascript  
// tests/todo-filters.spec.js
test.describe('Todo Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Add sample todos with different priorities and statuses
    const todos = [
      { task: 'High Priority Task', description: 'Important task description', priority: '1' },
      { task: 'Medium Priority Task', description: 'Medium task description', priority: '2' },
      { task: 'Low Priority Task', description: 'Low priority task description', priority: '3' }
    ];
    
    for (const todo of todos) {
      await page.fill('input[name="task"]', todo.task);
      await page.fill('textarea[name="description"]', todo.description);
      await page.selectOption('select[name="priority"]', todo.priority);
      await page.click('button:has-text("Dodaj zadanie")');
    }
  });

  test('should filter by status', async ({ page }) => {
    // Mark one task as completed
    await page.click('button:has-text("✓ Ukończ")').first();
    
    // Filter by completed
    await page.click('button:has-text("Ukończone")');
    
    // Should show only completed tasks
    await expect(page.locator('.card[data-done="true"]')).toHaveCount(1);
    await expect(page.locator('.card[data-done="false"]')).toHaveCount(0);
  });

  test('should filter by priority', async ({ page }) => {
    // Filter by high priority
    await page.selectOption('select:near(:text("Wszystkie priorytety"))', '1');
    
    // Should show only high priority tasks
    await expect(page.locator('.card')).toHaveCount(1);
    await expect(page.locator('.card .tag')).toContainText('🔴');
  });

  test('should search todos', async ({ page }) => {
    // Search for specific task
    await page.fill('input[placeholder*="Wyszukaj"]', 'High Priority');
    
    // Should show only matching tasks
    await expect(page.locator('.card')).toHaveCount(1);
    await expect(page.locator('.card')).toContainText('High Priority Task');
  });

  test('should combine filters', async ({ page }) => {
    // Mark high priority task as completed
    await page.click('.card:has(.tag:text("🔴")) button:has-text("✓ Ukończ")');
    
    // Filter by completed AND high priority
    await page.click('button:has-text("Ukończone")');
    await page.selectOption('select:near(:text("Wszystkie priorytety"))', '1');
    
    // Should show only completed high priority tasks
    await expect(page.locator('.card')).toHaveCount(1);
    await expect(page.locator('.card[data-done="true"]')).toBeVisible();
  });
});
```

### **Bulk Operations**

```javascript
// tests/todo-bulk.spec.js
test.describe('Bulk Operations', () => {
  test('should select all todos', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Add multiple todos
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[name="task"]', `Task ${i}`);
      await page.fill('textarea[name="description"]', `Description ${i}`);
      await page.click('button:has-text("Dodaj zadanie")');
    }
    
    // Select all
    await page.click('button:has-text("✓ Zaznacz wszystkie")');
    
    // Verify all are completed
    await expect(page.locator('.card[data-done="true"]')).toHaveCount(3);
  });

  test('should clear completed todos', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Add and complete some todos
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[name="task"]', `Task ${i}`);
      await page.fill('textarea[name="description"]', `Description ${i}`);
      await page.click('button:has-text("Dodaj zadanie")');
    }
    
    // Complete first two
    await page.click('button:has-text("✓ Ukończ")').first();
    await page.click('button:has-text("✓ Ukończ")').first();
    
    // Clear completed
    await page.click('button:has-text("🗑️ Usuń ukończone")');
    
    // Confirm dialog
    await page.click('button:has-text("OK")');
    
    // Should have only 1 active todo left
    await expect(page.locator('.card')).toHaveCount(1);
    await expect(page.locator('.card[data-done="false"]')).toHaveCount(1);
  });
});
```

### **Data Persistence**

```javascript
// tests/todo-persistence.spec.js
test.describe('Data Persistence', () => {
  test('should persist todos in localStorage', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Add a todo
    await page.fill('input[name="task"]', 'Persistent Task');
    await page.fill('textarea[name="description"]', 'This should persist');
    await page.click('button:has-text("Dodaj zadanie")');
    
    // Reload page
    await page.reload();
    
    // Verify todo still exists
    await expect(page.locator('.card')).toContainText('Persistent Task');
  });

  test('should show initial data on first visit', async ({ page, context }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies();
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Should load initial data from JSON
    await expect(page.locator('.card')).toHaveCount.greaterThan(0);
    await expect(page.locator('.card').first()).toContainText('Posprzątaj pokój');
  });
});
```

### **Responsive Design**

```javascript
// tests/todo-responsive.spec.js
test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    
    // Check mobile layout
    const grid = page.locator('.fixed-grid .grid');
    await expect(grid).toHaveCSS('grid-template-columns', '1fr');
    
    // Test mobile interactions
    await page.fill('input[name="task"]', 'Mobile Task');
    await page.fill('textarea[name="description"]', 'Mobile description');
    await page.click('button:has-text("Dodaj zadanie")');
    
    await expect(page.locator('.card')).toContainText('Mobile Task');
  });
});
```

## 📊 Advanced Testing Patterns

### **Page Object Model**

```javascript
// tests/pages/TodoPage.js
export class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('http://localhost:5173');
  }

  async addTodo({ task, description, priority = '2', dueDate = null }) {
    await this.page.fill('input[name="task"]', task);
    await this.page.fill('textarea[name="description"]', description);
    await this.page.selectOption('select[name="priority"]', priority);
    
    if (dueDate) {
      await this.page.fill('input[name="due_date"]', dueDate);
    }
    
    await this.page.click('button:has-text("Dodaj zadanie")');
  }

  async filterBy(status) {
    await this.page.click(`button:has-text("${status}")`);
  }

  async searchFor(query) {
    await this.page.fill('input[placeholder*="Wyszukaj"]', query);
  }

  async getTodosCount() {
    return await this.page.locator('.card').count();
  }

  async getCompletedTodosCount() {
    return await this.page.locator('.card[data-done="true"]').count();
  }
}
```

## 🔧 Playwright Configuration

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 🎯 Testing Scenarios for Trainees

1. **Form Validation** - Test wszystkich reguł walidacji
2. **CRUD Operations** - Pełny cykl życia todo
3. **Filtering & Search** - Kombinacje filtrów
4. **Bulk Operations** - Operacje masowe
5. **Data Persistence** - localStorage i synchronizacja  
6. **Responsive Design** - Mobile vs desktop
7. **Accessibility** - ARIA labels, keyboard navigation
8. **Performance** - Loading times, animations
9. **Error Handling** - Network failures, edge cases
10. **Cross-browser** - Chrome, Firefox, Safari compatibility