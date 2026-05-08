import { test, expect, type Page } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc/#/';

async function addTodo(page: Page, text: string) {
  await page.getByPlaceholder('What needs to be done?').fill(text);
  await page.getByPlaceholder('What needs to be done?').press('Enter');
}

async function createDefaultTodos(page: Page) {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Clean the house');
  await addTodo(page, 'Walk the dog');
}

// ---------------------------------------------------------------------------
// Positive Flows
// ---------------------------------------------------------------------------

test.describe('Positive Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-001 — New todo item appears in the list after pressing Enter', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    await expect(page.getByTestId('todo-title')).toHaveText('Buy groceries');
    await expect(page.getByText('1 item left')).toBeVisible();
  });

  test('TC-002 — Multiple todo items can be added sequentially', async ({ page }) => {
    await createDefaultTodos(page);

    const items = page.getByTestId('todo-title');
    await expect(items).toHaveCount(3);
    await expect(items).toHaveText(['Buy groceries', 'Clean the house', 'Walk the dog']);
    await expect(page.getByText('3 items left')).toBeVisible();
  });

  test('TC-003 — Todo item is marked as completed when toggled', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.getByRole('checkbox').check();

    await expect(todoItem).toHaveClass(/completed/);
    await expect(page.getByText('0 items left')).toBeVisible();
  });

  test('TC-004 — Completed todo can be unchecked to restore it as active', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    const checkbox = page.getByTestId('todo-item').getByRole('checkbox');
    await checkbox.check();
    await expect(page.getByText('0 items left')).toBeVisible();

    await checkbox.uncheck();
    await expect(page.getByTestId('todo-item')).not.toHaveClass(/completed/);
    await expect(page.getByText('1 item left')).toBeVisible();
  });

  test('TC-005 — Todo item is removed when the destroy button is clicked', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.hover();
    await todoItem.locator('button.destroy').click();

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.locator('.footer')).toBeHidden();
  });

  test('TC-006 — Item count updates after completing and removing items', async ({ page }) => {
    await addTodo(page, 'Item A');
    await addTodo(page, 'Item B');
    await addTodo(page, 'Item C');

    // Complete Item A
    await page.getByTestId('todo-item').filter({ hasText: 'Item A' }).getByRole('checkbox').check();
    await expect(page.getByText('2 items left')).toBeVisible();

    // Remove Item B
    const itemB = page.getByTestId('todo-item').filter({ hasText: 'Item B' });
    await itemB.hover();
    await itemB.locator('button.destroy').click();
    await expect(page.getByText('1 item left')).toBeVisible();
  });

  test('TC-007 — "Clear completed" removes all completed items', async ({ page }) => {
    await createDefaultTodos(page);

    // Complete first two items
    await page.getByTestId('todo-item').nth(0).getByRole('checkbox').check();
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Walk the dog');
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  });

  test('TC-008 — Filter "Active" shows only uncompleted items', async ({ page }) => {
    await addTodo(page, 'Active task');
    await addTodo(page, 'Done task');
    await page.getByTestId('todo-item').filter({ hasText: 'Done task' }).getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Active task');
  });

  test('TC-009 — Filter "Completed" shows only completed items', async ({ page }) => {
    await addTodo(page, 'Active task');
    await addTodo(page, 'Done task');
    await page.getByTestId('todo-item').filter({ hasText: 'Done task' }).getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Completed' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-title')).toHaveText('Done task');
  });

  test('TC-010 — Filter "All" shows every item regardless of status', async ({ page }) => {
    await addTodo(page, 'Active task');
    await addTodo(page, 'Done task');
    await page.getByTestId('todo-item').filter({ hasText: 'Done task' }).getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Completed' }).click();
    await page.getByRole('link', { name: 'All' }).click();

    await expect(page.getByTestId('todo-item')).toHaveCount(2);
  });

  test('TC-011 — Todo item text can be edited by double-clicking', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('Buy milk');
    await editInput.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText('Buy milk');
  });

  test('TC-012 — Toggle-all marks every item as completed', async ({ page }) => {
    await createDefaultTodos(page);

    await page.getByLabel('Mark all as complete').check();

    const items = page.getByTestId('todo-item');
    await expect(items).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(items.nth(i)).toHaveClass(/completed/);
    }
    await expect(page.getByText('0 items left')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Negative Flows
// ---------------------------------------------------------------------------

test.describe('Negative Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-013 — Empty input does not create a todo item', async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.locator('.footer')).toBeHidden();
  });

  test('TC-014 — Whitespace-only input does not create a todo item', async ({ page }) => {
    await addTodo(page, '   ');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('TC-015 — Editing a todo to empty text removes the item', async ({ page }) => {
    await addTodo(page, 'Buy groceries');

    const todoItem = page.getByTestId('todo-item');
    await todoItem.dblclick();

    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('');
    await editInput.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// Edge Cases
// ---------------------------------------------------------------------------

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC-016 — Special characters are preserved in todo text', async ({ page }) => {
    const specialText = "<script>alert('xss')</script>";
    await addTodo(page, specialText);

    await expect(page.getByTestId('todo-title')).toHaveText(specialText);
  });

  test('TC-017 — Duplicate todo items are allowed', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Buy groceries');

    const items = page.getByTestId('todo-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).getByTestId('todo-title')).toHaveText('Buy groceries');
    await expect(items.nth(1).getByTestId('todo-title')).toHaveText('Buy groceries');
    await expect(page.getByText('2 items left')).toBeVisible();
  });

  test('TC-018 — Very long todo text is accepted and displayed', async ({ page }) => {
    const longText = 'A'.repeat(200);
    await addTodo(page, longText);

    await expect(page.getByTestId('todo-title')).toHaveText(longText);
  });

  test('TC-019 — Leading and trailing whitespace is trimmed', async ({ page }) => {
    await addTodo(page, '  Buy groceries  ');

    await expect(page.getByTestId('todo-title')).toHaveText('Buy groceries');
  });

  test('TC-020 — Todos persist after page reload', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await expect(page.getByTestId('todo-title')).toHaveText('Buy groceries');

    await page.reload();

    await expect(page.getByTestId('todo-title')).toHaveText('Buy groceries');
    await expect(page.getByText('1 item left')).toBeVisible();
  });
});
