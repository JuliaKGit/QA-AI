# Test Plan: Edit Existing Program Details

**Feature:** Edit existing program details  
**Actor:** Admin user  
**Primary UI:** Programs page → edit icon on a program row → edit modal/form with **Save** button  
**Fields referenced in acceptance criteria:** **Program Name**, **Description**  
**Sample values used in ACs:** Program Name = `Web Development 2026`; updated to `Web Development 2026 - Updated`  

---

## Positive Flows

### TC-001
- **Title:** Edit form opens pre-populated with current program data  
- **Preconditions:** Logged in as admin; on the **Programs** page; program `Web Development 2026` exists.  
- **Steps:**
  1. Click the **edit icon** on the `Web Development 2026` row.
  2. Observe the form/modal that appears.
- **Expected result:** An edit form is displayed with **Program Name** pre-filled as `Web Development 2026` and **Description** pre-filled with the program's current description; the **Save** button is visible.  
- **Priority:** High  
- **Maps to AC:** Open program for editing  

---

### TC-002
- **Title:** Successfully editing a program name closes modal and updates the list  
- **Preconditions:** Logged in as admin; edit form is open for `Web Development 2026`.  
- **Steps:**
  1. Clear the **Program Name** field and enter `Web Development 2026 - Updated`.
  2. Click **Save**.
- **Expected result:** The modal closes; the **Programs** list immediately shows `Web Development 2026 - Updated` in place of the old name; no page refresh required.  
- **Priority:** High  
- **Maps to AC:** Successfully edit a program name  

---

### TC-003
- **Title:** Editing only the Description preserves the Name and other fields  
- **Preconditions:** Logged in as admin; edit form is open for a program with known Name and Description values.  
- **Steps:**
  1. Leave the **Program Name** field unchanged.
  2. Change the **Description** to `Updated description for testing`.
  3. Click **Save**.
- **Expected result:** The modal closes; the program list still shows the original **Program Name**; reopening the edit form confirms the **Description** is `Updated description for testing` and **Program Name** is unchanged.  
- **Priority:** High  
- **Maps to AC:** Edit preserves unchanged fields  

---

### TC-004
- **Title:** Editing only the Name preserves the Description  
- **Preconditions:** Logged in as admin; edit form is open for a program with Description = `Full-stack web development program`.  
- **Steps:**
  1. Change the **Program Name** to `Web Development 2026 - Renamed`.
  2. Leave the **Description** field unchanged.
  3. Click **Save**.
- **Expected result:** The modal closes; reopening the edit form confirms the **Program Name** is `Web Development 2026 - Renamed` and **Description** is still `Full-stack web development program`.  
- **Priority:** High  
- **Maps to AC:** Edit preserves unchanged fields  

---

### TC-005
- **Title:** Edited program data persists after page refresh  
- **Preconditions:** Program was just renamed to `Web Development 2026 - Updated` via TC-002.  
- **Steps:**
  1. Refresh the browser (F5).
  2. Navigate to the **Programs** page.
  3. Locate `Web Development 2026 - Updated` in the list.
- **Expected result:** The program is visible with the updated **Program Name**; data is persisted to the backend; original name no longer appears.  
- **Priority:** High  

---

### TC-006
- **Title:** Save button is enabled when form opens with valid pre-populated data  
- **Preconditions:** Edit form is open for a program with a valid **Program Name**.  
- **Steps:**
  1. Observe the **Save** button without making any changes.
- **Expected result:** The **Save** button is enabled (the form has valid data from the existing program); clicking Save without changes either saves successfully (no-op) or the system handles gracefully.  
- **Priority:** Medium  

---

### TC-007
- **Title:** Clearing and re-entering the Program Name allows save  
- **Preconditions:** Edit form is open for `Web Development 2026`.  
- **Steps:**
  1. Clear the **Program Name** field entirely.
  2. Enter `Cybersecurity Fundamentals 2026`.
  3. Click **Save**.
- **Expected result:** The modal closes; the **Programs** list shows `Cybersecurity Fundamentals 2026`; the old name `Web Development 2026` is no longer present.  
- **Priority:** Medium  

---

## Negative Flows

### TC-008
- **Title:** Non-admin user cannot access the edit icon  
- **Preconditions:** Logged in as a non-admin user (e.g., instructor or student role); on the **Programs** page; programs exist in the list.  
- **Steps:**
  1. Observe the program rows for an edit icon or edit action.
  2. Attempt to access the edit endpoint directly via URL/API.
- **Expected result:** The edit icon is either hidden or disabled for non-admin roles; direct URL/API access to the edit endpoint returns 403 Forbidden.  
- **Priority:** High  

---

### TC-009
- **Title:** Saving with an empty Program Name is prevented  
- **Preconditions:** Edit form is open for a program with a valid name.  
- **Steps:**
  1. Clear the **Program Name** field (leave it empty).
  2. Observe the **Save** button state.
  3. Attempt to click **Save** if enabled.
- **Expected result:** The **Save** button is disabled when **Program Name** is empty **or** a validation error is shown on submit; the program is not saved with a blank name.  
- **Priority:** High  

---

### TC-010
- **Title:** Renaming to a duplicate Program Name is handled without data corruption  
- **Preconditions:** Programs `Web Development 2026` and `Data Analytics 2026` both exist; edit form is open for `Data Analytics 2026`.  
- **Steps:**
  1. Change the **Program Name** to `Web Development 2026`.
  2. Click **Save**.
- **Expected result:** Either the system prevents the rename with a validation message (e.g., "A program with this name already exists") **or** allows duplicates if the business rule permits—in either case the original `Web Development 2026` program is not altered. Document the actual behavior against the business requirement.  
- **Priority:** High  

---

### TC-011
- **Title:** Network failure during save shows an error and preserves the form data  
- **Preconditions:** Edit form is open; network throttling or API error simulation is available.  
- **Steps:**
  1. Change the **Program Name** to `Network Failure Edit Test`.
  2. Disconnect network or mock a 500 server response.
  3. Click **Save**.
- **Expected result:** An error message is displayed to the user; the modal remains open with the entered data intact; the program retains its original name in the backend; no partial update is applied.  
- **Priority:** High  

---

### TC-012
- **Title:** HTML/script injection in edited fields does not execute  
- **Preconditions:** Edit form is open for any program.  
- **Steps:**
  1. Change **Program Name** to `<script>alert('XSS')</script>`.
  2. Change **Description** to `<img onerror=alert(1) src=x>`.
  3. Click **Save** (if allowed by validation).
  4. View the program list and open program details.
- **Expected result:** No script execution occurs; values are rendered as plain text (escaped) in the list and any detail views; no alert dialogs or injected HTML elements.  
- **Priority:** High  

---

### TC-013
- **Title:** Closing the edit modal without saving discards changes  
- **Preconditions:** Edit form is open for `Web Development 2026`; user has changed the name to `Discarded Edit`.  
- **Steps:**
  1. Click **Cancel**, press **Esc**, or click the modal backdrop/X button (whichever dismiss mechanism exists).
  2. Observe the **Programs** list.
- **Expected result:** Modal closes; `Web Development 2026` is still shown in the list (not `Discarded Edit`); no backend changes applied.  
- **Priority:** Medium  

---

### TC-014
- **Title:** Rapid double-click on Save does not produce duplicate updates or errors  
- **Preconditions:** Edit form open; **Program Name** changed to `Double Click Edit Test`.  
- **Steps:**
  1. Rapidly double-click the **Save** button.
  2. Wait for any API responses; observe the list.
- **Expected result:** The program is updated exactly once to `Double Click Edit Test`; no duplicate records created; no server errors; button is disabled after first click or duplicate requests are deduplicated on the server.  
- **Priority:** Medium  

---

### TC-015
- **Title:** Concurrent edit by another admin does not silently overwrite changes  
- **Preconditions:** Two admin sessions (User A and User B) both have the edit form open for the same program `Web Development 2026`.  
- **Steps:**
  1. User A changes the name to `Version A` and clicks **Save**.
  2. User B (whose form still shows the original name) changes the name to `Version B` and clicks **Save**.
- **Expected result:** Either User B receives a conflict error (e.g., "This program has been modified by another user") **or** a last-write-wins policy is applied and documented; no data loss or silent merge of partial changes.  
- **Priority:** Medium  

---

## Edge Cases

### TC-016
- **Title:** Edited Program Name at maximum allowed length saves and displays correctly  
- **Preconditions:** Known maximum length for **Program Name** (e.g., 100 or 255 characters); edit form is open.  
- **Steps:**
  1. Replace the current **Program Name** with a max-length string ending with `...MAX`.
  2. Click **Save**.
  3. Verify the program in the list and reopen to view details.
- **Expected result:** Full string is stored and displayed without truncation; no server error; list layout remains intact.  
- **Priority:** Medium  

---

### TC-017
- **Title:** Edited Program Name exceeding maximum length is rejected or truncated per rules  
- **Preconditions:** Same max length as TC-016.  
- **Steps:**
  1. Attempt to enter max length + 1 character in **Program Name**.
  2. Observe field behavior and attempt **Save**.
- **Expected result:** Either the field prevents input beyond the limit (character count enforcement) **or** validation displays an error on submit; no corrupted data saved.  
- **Priority:** Medium  

---

### TC-018
- **Title:** Whitespace-only Program Name does not save  
- **Preconditions:** Edit form is open for a program with a valid name.  
- **Steps:**
  1. Clear **Program Name** and enter `   ` (three spaces).
  2. Observe the **Save** button or attempt to click it.
- **Expected result:** The **Save** button is disabled (spaces-only treated as empty) **or** validation error is shown on submit; the program retains its original name.  
- **Priority:** Medium  

---

### TC-019
- **Title:** Leading and trailing spaces in edited Program Name are trimmed  
- **Preconditions:** Edit form is open.  
- **Steps:**
  1. Change **Program Name** to `   Web Development 2026   ` (leading and trailing spaces).
  2. Click **Save**.
  3. Reopen the edit form for the program.
- **Expected result:** The stored Program Name is `Web Development 2026` (trimmed); no leading/trailing whitespace visible in the list or edit form.  
- **Priority:** Low  

---

### TC-020
- **Title:** Special characters and Unicode in edited fields persist correctly  
- **Preconditions:** Edit form is open.  
- **Steps:**
  1. Change **Program Name** to `Développement Web 2026 — "Été" & <Hiver> 日本語`.
  2. Change **Description** to `Symbols: &<>"/'; Emoji: 🎓📚; Accents: àéîõü`.
  3. Click **Save**.
  4. View the program in the list and reopen for editing.
- **Expected result:** All characters are stored and displayed correctly; no encoding issues, mojibake, or HTML entity escaping visible to the user; emojis render properly.  
- **Priority:** Medium  

---

### TC-021
- **Title:** Very long Description edit (multi-paragraph) saves without truncation  
- **Preconditions:** Edit form is open; max length for Description is known or assumed (e.g., 2000 characters).  
- **Steps:**
  1. Replace the **Description** with a multi-paragraph text of 1500+ characters (include line breaks if the field supports them).
  2. Click **Save**.
  3. Reopen the program to verify.
- **Expected result:** Full description text persisted; line breaks preserved if multiline field; UI layout handles long text gracefully (scrollbar or expand, no overflow breaking the page).  
- **Priority:** Low  

---

### TC-022
- **Title:** Save button disables if Program Name is cleared during editing  
- **Preconditions:** Edit form open; **Program Name** contains the pre-populated value.  
- **Steps:**
  1. Select all text in **Program Name** and delete it (field now empty).
  2. Observe the **Save** button.
- **Expected result:** The **Save** button transitions to disabled state; real-time validation reflects the empty state.  
- **Priority:** Medium  

---

### TC-023
- **Title:** Save button re-enables after entering a valid name following a cleared field  
- **Preconditions:** Edit form open; **Program Name** was cleared (Save button disabled per TC-022).  
- **Steps:**
  1. Type `Restored Program Name` in **Program Name**.
  2. Observe the **Save** button.
- **Expected result:** The **Save** button transitions from disabled to enabled as soon as a non-empty value is present.  
- **Priority:** Medium  

---

### TC-024
- **Title:** Edit form is accessible via keyboard navigation  
- **Preconditions:** Logged in as admin; on the **Programs** page; programs exist in the list.  
- **Steps:**
  1. Use **Tab** to focus the edit icon on a program row; press **Enter**.
  2. Use **Tab** to navigate through form fields (**Program Name** → **Description** → **Save**).
  3. Edit fields using keyboard only; press **Enter** on **Save**.
- **Expected result:** All interactive elements are reachable via Tab; focus order is logical; form can be submitted entirely via keyboard; focus trap keeps user within the modal.  
- **Priority:** Low  

---

## Traceability Summary

| Acceptance Criterion | Test Case IDs |
|---|---|
| Open program for editing (pre-populated form) | TC-001 |
| Successfully edit a program name (modal closes, list updates) | TC-002, TC-005, TC-007 |
| Edit preserves unchanged fields | TC-003, TC-004 |

---

## Ambiguities and Gaps in the Acceptance Criteria

1. **Empty name validation:** The ACs do not specify what happens if the admin clears the Program Name during editing and attempts to save. TC-009 and TC-022 assume the same disabled-button behavior as DS-1, but this is not explicitly stated.
2. **Uniqueness constraint on rename:** No AC specifies whether renaming a program to an existing program's name is allowed. TC-010 needs a business decision.
3. **Description required or optional on edit?** The ACs show editing only the Description as valid, but do not state whether Description can be cleared entirely. Is a blank Description allowed?
4. **Cancel/dismiss behavior:** No AC covers what happens if the user closes the modal without clicking Save—assumed to discard (TC-013) but not specified.
5. **Error handling on network or server failure:** No AC describes the expected behavior if the API call fails during save (TC-011).
6. **Double submission prevention:** No AC covers rapid repeated clicks on Save (TC-014).
7. **Concurrent editing:** No AC addresses what happens when two admins edit the same program simultaneously (TC-015). Optimistic locking vs. last-write-wins is undefined.
8. **Role-based access:** The AC implies admin access but does not specify what non-admin users should see—edit icon hidden, disabled, or endpoint returning 403 (TC-008).
9. **Maximum field lengths:** No specification for maximum character limits on **Program Name** or **Description** during editing (TC-016, TC-017, TC-021).
10. **Whitespace handling:** ACs do not define behavior for whitespace-only or leading/trailing spaces in **Program Name** during edits (TC-018, TC-019).
11. **Modal or page?** The AC mentions "modal closes" for the success scenario—but is the edit form guaranteed to be a modal?
12. **Edit icon identification:** The AC references "the edit icon" but does not specify its visual appearance, location in the row, or tooltip text.
13. **Saving without changes:** No AC defines behavior when the user opens edit, makes no changes, and clicks Save—should it be a no-op, show a message, or submit anyway?
14. **Accessibility requirements:** No mention of keyboard navigation, screen reader support, or ARIA labels for the edit modal and form fields.

---

*Prepared for QA execution; align maximum field lengths, uniqueness rules, and concurrent-edit policies with the live application specification when available.*
