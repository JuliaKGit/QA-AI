# Test Plan: Program Name Validation and Duplicate Prevention

**Feature:** Program name validation and duplicate prevention  
**Actor:** Admin user  
**Primary UI:** Programs page → "+ New Program" button → creation modal/form with **Create** button; also applies to edit modal with **Save** button  
**Fields referenced in acceptance criteria:** **Program Name**  
**Sample values used in ACs:** `"   "` (whitespace-only), `Informatique & IA - Niveau 2`, `Web Development 2026` (duplicate)  

---

## Positive Flows

### TC-001
- **Title:** Program name with special characters is accepted and created successfully  
- **Preconditions:** Logged in as admin; on the **Programs** page; program creation form is open.  
- **Steps:**
  1. Enter `Informatique & IA - Niveau 2` in the **Program Name** field.
  2. Fill in **Description** with `French IT and AI program`.
  3. Click **Create**.
- **Expected result:** The modal closes; the **Programs** list displays `Informatique & IA - Niveau 2`; all special characters (`&`, `-`) are preserved exactly as entered.  
- **Priority:** High  
- **Maps to AC:** Accept program name with special characters  

---

### TC-002
- **Title:** Program name with accented characters creates successfully  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `Développement Été 2026` in the **Program Name** field.
  2. Click **Create**.
- **Expected result:** The modal closes; the program list shows `Développement Été 2026`; accented characters are stored and displayed correctly without encoding issues.  
- **Priority:** High  
- **Maps to AC:** Accept program name with special characters  

---

### TC-003
- **Title:** Program name with mixed Unicode, emoji, and symbols creates successfully  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `プログラム "2026" — Test & <Demo>` in the **Program Name** field.
  2. Click **Create**.
- **Expected result:** The modal closes; the program list shows the full name with Japanese characters, curly quotes, em dash, ampersand, and angle brackets rendered as plain text; no HTML injection or encoding issues.  
- **Priority:** Medium  
- **Maps to AC:** Accept program name with special characters  

---

### TC-004
- **Title:** Program name with leading/trailing spaces is trimmed before saving  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `   Web Analytics 2026   ` (leading and trailing spaces) in the **Program Name** field.
  2. Click **Create**.
  3. Locate the new program in the list and open its edit form.
- **Expected result:** The program is created successfully; the stored name is `Web Analytics 2026` (trimmed); no leading/trailing whitespace visible in the list or edit form.  
- **Priority:** Medium  

---

### TC-005
- **Title:** Unique program name is accepted without duplicate error  
- **Preconditions:** Logged in as admin; program creation form is open; no program with the name `Unique Program Test` exists.  
- **Steps:**
  1. Enter `Unique Program Test` in the **Program Name** field.
  2. Click **Create**.
- **Expected result:** The modal closes; the program list shows `Unique Program Test`; no duplicate error message is displayed.  
- **Priority:** High  

---

## Negative Flows

### TC-006
- **Title:** Whitespace-only program name is rejected (form not submitted)  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `   ` (three spaces) in the **Program Name** field.
  2. Observe the **Create** button state.
  3. Attempt to click **Create** if enabled.
- **Expected result:** The form is not submitted; the name is trimmed and treated as empty; the **Create** button is disabled **or** a validation error is shown; no program with a blank name is created.  
- **Priority:** High  
- **Maps to AC:** Reject program name with only whitespace  

---

### TC-007
- **Title:** Single space in program name is rejected  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter ` ` (one space) in the **Program Name** field.
  2. Observe the **Create** button state.
- **Expected result:** The **Create** button is disabled; the single space is trimmed and treated as empty; no submission occurs.  
- **Priority:** Medium  
- **Maps to AC:** Reject program name with only whitespace  

---

### TC-008
- **Title:** Tab characters in program name are treated as whitespace and rejected  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Paste a string consisting of only tab characters in the **Program Name** field.
  2. Observe the **Create** button state.
- **Expected result:** The **Create** button is disabled; the input is treated as empty after trimming; no program is created.  
- **Priority:** Low  
- **Maps to AC:** Reject program name with only whitespace  

---

### TC-009
- **Title:** Duplicate program name on create shows an error  
- **Preconditions:** Logged in as admin; program `Web Development 2026` already exists in the list.  
- **Steps:**
  1. Click **+ New Program**.
  2. Enter `Web Development 2026` in the **Program Name** field.
  3. Click **Create**.
- **Expected result:** An error message is displayed indicating the name already exists (e.g., "A program with this name already exists"); the modal remains open; no duplicate program is created.  
- **Priority:** High  
- **Maps to AC:** Reject duplicate program name  

---

### TC-010
- **Title:** Duplicate name check is case-insensitive  
- **Preconditions:** Logged in as admin; program `Web Development 2026` already exists.  
- **Steps:**
  1. Click **+ New Program**.
  2. Enter `web development 2026` (all lowercase) in the **Program Name** field.
  3. Click **Create**.
- **Expected result:** Either the system rejects the name with a duplicate error (case-insensitive match) **or** allows it if duplicates are only checked case-sensitively. Document the actual behavior against the business requirement.  
- **Priority:** High  
- **Maps to AC:** Reject duplicate program name  

---

### TC-011
- **Title:** Duplicate name with extra spaces is still rejected  
- **Preconditions:** Logged in as admin; program `Web Development 2026` already exists.  
- **Steps:**
  1. Click **+ New Program**.
  2. Enter `  Web Development 2026  ` (leading/trailing spaces) in the **Program Name** field.
  3. Click **Create**.
- **Expected result:** After trimming, the name matches the existing program; a duplicate error is shown; no new program is created.  
- **Priority:** Medium  
- **Maps to AC:** Reject duplicate program name  

---

### TC-012
- **Title:** Duplicate program name on edit (rename) shows an error  
- **Preconditions:** Logged in as admin; programs `Web Development 2026` and `Data Analytics 2026` both exist.  
- **Steps:**
  1. Click the edit icon on `Data Analytics 2026`.
  2. Change the **Program Name** to `Web Development 2026`.
  3. Click **Save**.
- **Expected result:** An error message is displayed indicating the name already exists; the modal remains open with the entered data; `Data Analytics 2026` is not renamed; the original `Web Development 2026` program is unaffected.  
- **Priority:** High  
- **Maps to AC:** Reject duplicate program name  

---

### TC-013
- **Title:** Whitespace-only name is rejected in the edit form  
- **Preconditions:** Logged in as admin; edit form is open for an existing program.  
- **Steps:**
  1. Clear the **Program Name** field and enter `   ` (three spaces).
  2. Observe the **Save** button state.
- **Expected result:** The **Save** button is disabled; the input is trimmed and treated as empty; the program retains its original name.  
- **Priority:** High  
- **Maps to AC:** Reject program name with only whitespace  

---

### TC-014
- **Title:** HTML/script injection in program name does not execute  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `<script>alert('XSS')</script>` in the **Program Name** field.
  2. Click **Create** (if allowed by validation).
  3. View the program in the list and open its details.
- **Expected result:** No script execution occurs; the value is rendered as plain text (escaped) in the list and any detail views; no alert dialogs or injected HTML elements.  
- **Priority:** High  

---

### TC-015
- **Title:** SQL injection attempt in program name is safely handled  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `'; DROP TABLE programs; --` in the **Program Name** field.
  2. Click **Create** (if allowed by validation).
- **Expected result:** If the name is accepted, it is stored as a literal string; no SQL injection occurs; the database remains intact; the program list continues to function normally.  
- **Priority:** High  

---

## Edge Cases

### TC-016
- **Title:** Program name at maximum allowed length is accepted  
- **Preconditions:** Known maximum length for **Program Name** (e.g., 100 or 255 characters); program creation form is open.  
- **Steps:**
  1. Enter a string of exactly the maximum length ending with `...MAX` in the **Program Name** field.
  2. Click **Create**.
  3. Verify the program in the list and reopen to view details.
- **Expected result:** Full string is stored and displayed without truncation; no server error; list layout remains intact.  
- **Priority:** Medium  

---

### TC-017
- **Title:** Program name exceeding maximum length is rejected or truncated  
- **Preconditions:** Same max length as TC-016.  
- **Steps:**
  1. Attempt to enter max length + 1 character in **Program Name**.
  2. Observe field behavior and attempt **Create**.
- **Expected result:** Either the field prevents input beyond the limit (character count enforcement) **or** validation displays an error on submit; no corrupted data saved.  
- **Priority:** Medium  

---

### TC-018
- **Title:** Single-character program name is accepted  
- **Preconditions:** Logged in as admin; program creation form is open; no program named `A` exists.  
- **Steps:**
  1. Enter `A` in the **Program Name** field.
  2. Click **Create**.
- **Expected result:** The program `A` is created successfully and visible in the list (minimum length = 1 character unless a longer minimum is specified).  
- **Priority:** Low  

---

### TC-019
- **Title:** Program name with only numbers is accepted  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Enter `12345` in the **Program Name** field.
  2. Click **Create**.
- **Expected result:** The program `12345` is created successfully; numeric-only names are not rejected by validation.  
- **Priority:** Low  

---

### TC-020
- **Title:** Program name with newline characters is handled gracefully  
- **Preconditions:** Logged in as admin; program creation form is open.  
- **Steps:**
  1. Paste a name containing embedded newline characters, e.g., `Line1\nLine2`.
  2. Observe the field behavior and attempt **Create**.
- **Expected result:** The field either strips the newline (single-line input) **or** stores it gracefully; no form errors, broken layout, or database issues occur.  
- **Priority:** Low  

---

### TC-021
- **Title:** Duplicate check works after a program is deleted and recreated  
- **Preconditions:** Logged in as admin; program `Recycled Program` was previously created and then deleted.  
- **Steps:**
  1. Click **+ New Program**.
  2. Enter `Recycled Program` in the **Program Name** field.
  3. Click **Create**.
- **Expected result:** The program is created successfully; deleted programs do not trigger the duplicate check; no error message is shown.  
- **Priority:** Medium  

---

### TC-022
- **Title:** Duplicate error message clears when the name is changed to a unique value  
- **Preconditions:** Logged in as admin; program `Web Development 2026` already exists; creation form is open and showing a duplicate error after attempting `Web Development 2026`.  
- **Steps:**
  1. Change the **Program Name** to `Web Development 2026 - v2`.
  2. Click **Create**.
- **Expected result:** The duplicate error message clears; the program `Web Development 2026 - v2` is created successfully; modal closes; the new program appears in the list.  
- **Priority:** Medium  
- **Maps to AC:** Reject duplicate program name  

---

### TC-023
- **Title:** Very similar but distinct program names are allowed  
- **Preconditions:** Logged in as admin; program `Web Development 2026` already exists.  
- **Steps:**
  1. Click **+ New Program**.
  2. Enter `Web Development 2026!` in the **Program Name** field (with trailing exclamation mark).
  3. Click **Create**.
- **Expected result:** The program is created successfully; the names differ by one character and are treated as distinct; no duplicate error.  
- **Priority:** Low  

---

### TC-024
- **Title:** Rapid consecutive creation of the same program name produces only one program  
- **Preconditions:** Logged in as admin; no program named `Race Condition Test` exists.  
- **Steps:**
  1. Open two browser tabs on the **Programs** page.
  2. In both tabs, open the creation form and enter `Race Condition Test`.
  3. Click **Create** in Tab A, then immediately click **Create** in Tab B.
- **Expected result:** Only one program `Race Condition Test` is created; the second submission either shows a duplicate error **or** is deduplicated server-side; no two programs with the same name exist.  
- **Priority:** Medium  

---

## Traceability Summary

| Acceptance Criterion | Test Case IDs |
|---|---|
| Reject program name with only whitespace (trimmed, treated as empty) | TC-006, TC-007, TC-008, TC-013 |
| Accept program name with special characters | TC-001, TC-002, TC-003 |
| Reject duplicate program name (error shown) | TC-009, TC-010, TC-011, TC-012, TC-022 |

---

## Ambiguities and Gaps in the Acceptance Criteria

1. **Case sensitivity of duplicate check:** The AC says "the same name" but does not specify whether `web development 2026` and `Web Development 2026` are considered duplicates. TC-010 tests both interpretations—needs a business decision.
2. **Trimming before duplicate check:** The AC says whitespace-only names are trimmed, but does not confirm whether leading/trailing spaces are trimmed before the duplicate check (e.g., `  Web Development 2026  ` vs. `Web Development 2026`). TC-011 assumes they are.
3. **Duplicate check on edit/rename:** The AC only mentions "create a new program" for duplicates. Does the same validation apply when renaming an existing program? TC-012 assumes yes—needs confirmation.
4. **Error message content and placement:** The AC says "I see an error indicating the name already exists" but does not specify the exact wording, position (inline vs. toast), or whether the modal stays open. TC-009 assumes modal remains open.
5. **Error message dismissal:** No AC specifies whether the duplicate error clears automatically when the user changes the name, or if it persists until the next submit attempt. TC-022 tests auto-clearing.
6. **Create button behavior on whitespace-only:** The AC says "the form is not submitted" but does not specify whether the **Create** button is disabled or whether the user can click it and then see an error. TC-006 tests both scenarios.
7. **Maximum name length:** No AC specifies a maximum character limit for Program Name. TC-016 and TC-017 need actual limits from the spec or database schema.
8. **Special characters scope:** The AC provides one example (`Informatique & IA - Niveau 2`) but does not define the full range of accepted special characters (e.g., `<>`, `"`, `'`, `\`, emoji). TC-003 and TC-014 extend coverage.
9. **Duplicate check across deleted programs:** No AC clarifies whether soft-deleted programs should still trigger the duplicate check. TC-021 assumes they do not.
10. **Race condition / concurrent submissions:** No AC addresses what happens if two users try to create a program with the same name simultaneously. TC-024 tests this scenario.
11. **Validation applies to edit form:** The whitespace rejection AC only references "the program creation form." TC-013 assumes the same validation applies to the edit form—needs confirmation.
12. **Newline and control characters:** No AC addresses handling of newline, tab, or other control characters in the program name. TC-008 and TC-020 test these edge cases.
13. **Error recovery:** No AC defines whether form data is preserved after a duplicate error, allowing the user to correct the name without re-entering other fields.

---

*Prepared for QA execution; align case-sensitivity rules, maximum field lengths, and edit-form duplicate check policies with the live application specification when available.*
