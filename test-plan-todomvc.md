# Test Plan — TODO MVC Application

**Application URL:** https://demo.playwright.dev/todomvc/#/  
**Date:** 2026-05-08  
**Author:** QA AI  

---

## Positive Flows

### TC-001 — New todo item appears in the list after pressing Enter
- **Preconditions:** App is loaded, todo list is empty.
- **Steps:**
  1. Click the input field with placeholder "What needs to be done?"
  2. Type "Buy groceries"
  3. Press Enter
- **Expected Result:** "Buy groceries" appears as the first item in the todo list. The item count shows "1 item left".
- **Priority:** High

### TC-002 — Multiple todo items can be added sequentially
- **Preconditions:** App is loaded, todo list is empty.
- **Steps:**
  1. Type "Buy groceries" and press Enter
  2. Type "Clean the house" and press Enter
  3. Type "Walk the dog" and press Enter
- **Expected Result:** All three items appear in the list in order. The item count shows "3 items left".
- **Priority:** High

### TC-003 — Todo item is marked as completed when toggled
- **Preconditions:** A todo item "Buy groceries" exists in the list.
- **Steps:**
  1. Click the toggle checkbox next to "Buy groceries"
- **Expected Result:** The item is visually struck through / marked as completed. The item count shows "0 items left".
- **Priority:** High

### TC-004 — Completed todo item can be unchecked to restore it as active
- **Preconditions:** A completed todo item "Buy groceries" exists.
- **Steps:**
  1. Click the toggle checkbox next to "Buy groceries" again
- **Expected Result:** The item is no longer struck through. The item count shows "1 item left".
- **Priority:** Medium

### TC-005 — Todo item is removed from the list when the destroy button is clicked
- **Preconditions:** A todo item "Buy groceries" exists in the list.
- **Steps:**
  1. Hover over the "Buy groceries" item
  2. Click the destroy (×) button
- **Expected Result:** "Buy groceries" is removed from the list. The list is empty. The footer is hidden.
- **Priority:** High

### TC-006 — Item count updates correctly after completing and removing items
- **Preconditions:** Three todo items exist: "Item A", "Item B", "Item C".
- **Steps:**
  1. Mark "Item A" as completed
  2. Verify count shows "2 items left"
  3. Remove "Item B" using the destroy button
  4. Verify count shows "1 item left"
- **Expected Result:** The active item count reflects only uncompleted, non-deleted items.
- **Priority:** High

### TC-007 — "Clear completed" removes all completed items at once
- **Preconditions:** Three todo items exist; two are marked as completed.
- **Steps:**
  1. Click "Clear completed" button
- **Expected Result:** Only the active (uncompleted) item remains in the list. "Clear completed" button disappears.
- **Priority:** High

### TC-008 — Filter "Active" shows only uncompleted items
- **Preconditions:** Two items exist: one active, one completed.
- **Steps:**
  1. Click "Active" filter link
- **Expected Result:** Only the active item is visible. The completed item is hidden.
- **Priority:** Medium

### TC-009 — Filter "Completed" shows only completed items
- **Preconditions:** Two items exist: one active, one completed.
- **Steps:**
  1. Click "Completed" filter link
- **Expected Result:** Only the completed item is visible. The active item is hidden.
- **Priority:** Medium

### TC-010 — Filter "All" shows every item regardless of status
- **Preconditions:** Two items exist: one active, one completed. "Completed" filter is selected.
- **Steps:**
  1. Click "All" filter link
- **Expected Result:** Both items are visible.
- **Priority:** Medium

### TC-011 — Todo item text can be edited by double-clicking
- **Preconditions:** A todo item "Buy groceries" exists in the list.
- **Steps:**
  1. Double-click on "Buy groceries"
  2. Clear the text, type "Buy milk"
  3. Press Enter
- **Expected Result:** The item text is updated to "Buy milk".
- **Priority:** Medium

### TC-012 — Toggle-all marks every item as completed
- **Preconditions:** Three active todo items exist.
- **Steps:**
  1. Click the toggle-all chevron (❯) at the top of the list
- **Expected Result:** All items are marked as completed. The count shows "0 items left".
- **Priority:** Medium

---

## Negative Flows

### TC-013 — Empty input does not create a todo item
- **Preconditions:** App is loaded.
- **Steps:**
  1. Click the input field
  2. Press Enter without typing anything
- **Expected Result:** No item is added to the list. No footer appears.
- **Priority:** High

### TC-014 — Whitespace-only input does not create a todo item
- **Preconditions:** App is loaded.
- **Steps:**
  1. Type "   " (spaces only) into the input field
  2. Press Enter
- **Expected Result:** No item is added to the list.
- **Priority:** High

### TC-015 — Editing a todo to empty text removes the item
- **Preconditions:** A todo item "Buy groceries" exists.
- **Steps:**
  1. Double-click on "Buy groceries"
  2. Clear all text
  3. Press Enter
- **Expected Result:** The item is removed from the list.
- **Priority:** Medium

---

## Edge Cases

### TC-016 — Special characters are preserved in todo text
- **Preconditions:** App is loaded.
- **Steps:**
  1. Type `<script>alert('xss')</script>` and press Enter
- **Expected Result:** The item appears literally as `<script>alert('xss')</script>` — no script execution.
- **Priority:** Medium

### TC-017 — Duplicate todo items are allowed
- **Preconditions:** App is loaded.
- **Steps:**
  1. Type "Buy groceries" and press Enter
  2. Type "Buy groceries" and press Enter
- **Expected Result:** Two separate "Buy groceries" items appear in the list. Count shows "2 items left".
- **Priority:** Low

### TC-018 — Very long todo text is accepted and displayed
- **Preconditions:** App is loaded.
- **Steps:**
  1. Type a 200-character string and press Enter
- **Expected Result:** The item is created and the full text is stored (visible on hover or in DOM).
- **Priority:** Low

### TC-019 — Leading and trailing whitespace is trimmed from todo text
- **Preconditions:** App is loaded.
- **Steps:**
  1. Type "  Buy groceries  " and press Enter
- **Expected Result:** The item is displayed as "Buy groceries" (trimmed).
- **Priority:** Medium

### TC-020 — Page persists todos after reload
- **Preconditions:** A todo item "Buy groceries" exists.
- **Steps:**
  1. Reload the page
- **Expected Result:** "Buy groceries" still appears in the list (local storage persistence).
- **Priority:** Medium

---

## Ambiguities / Gaps in Acceptance Criteria

1. **Editing:** ACs do not mention editing existing todo items (double-click to edit). Covered in TC-011, TC-015.
2. **Filtering:** ACs do not mention the Active / Completed / All filter tabs. Covered in TC-008 to TC-010.
3. **Clear completed:** ACs mention "Remove item" but not the bulk "Clear completed" action. Covered in TC-007.
4. **Toggle all:** ACs do not mention the toggle-all checkbox. Covered in TC-012.
5. **Persistence:** ACs do not specify whether todos should survive a page reload. Covered in TC-020.
6. **Input validation:** ACs say "Add items" but don't define behavior for empty, whitespace, or special-character input. Covered in TC-013, TC-014, TC-016, TC-019.
7. **Duplicate handling:** ACs don't specify whether duplicate items are allowed. Covered in TC-017.

---

*Re-validation: Every AC (Create list, Add items, Finish item, Remove item) is covered by at least one High-priority positive-flow test case (TC-001/002, TC-003, TC-005). Edge cases and negative flows extend coverage beyond the ACs.*
