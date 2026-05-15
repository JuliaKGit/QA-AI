# Test Plan: Edit Existing Program Details

**Feature:** Edit existing program details  
**Actor:** Admin user  
**Primary UI:** Programs page → edit icon → edit modal/form with **Save**  
**Fields referenced in acceptance criteria:** **Name**, **Description** (plus any other fields exposed on the edit form)  
**Sample program used in ACs:** Web Development 2026  

---

## Positive flows

### TC-001
- **Title:** Edit form opens with all current program values shown in the correct fields  
- **Preconditions:** Logged in as admin; on **Programs** page; program **Web Development 2026** exists with known **Name** and **Description** (and note values of any other visible fields on the row or detail view if available).  
- **Steps:**
  1. Locate the row for **Web Development 2026**.
  2. Click the **edit** icon for that program.
  3. Observe each field on the edit form (**Name**, **Description**, and any others shown).
- **Expected result:** The edit form is displayed; **Name** shows `Web Development 2026`; **Description** matches the stored value; every other field on the form matches the program’s current data (no blanking, no stale data from another program).  
- **Priority:** High  
- **Maps to AC:** Open program for editing  

---

### TC-002
- **Title:** Saving a name change closes the modal and updates the list without refresh  
- **Preconditions:** Same as TC-001; edit modal open for **Web Development 2026**.  
- **Steps:**
  1. In **Name**, change the value to `Web Development 2026 - Updated`.
  2. Click **Save**.
  3. Observe the **Programs** list.
- **Expected result:** The modal closes; the list row for that program shows **Name** `Web Development 2026 - Updated` immediately (no manual page refresh required); **Description** and other fields remain as before the edit unless the UI intentionally mirrors only certain columns.  
- **Priority:** High  
- **Maps to AC:** Successfully edit a program name  

---

### TC-003
- **Title:** Saving a description-only change leaves Name and all untouched fields unchanged  
- **Preconditions:** Program **Web Development 2026** exists; original **Name** is `Web Development 2026`; original **Description** is `Cohort covering HTML, CSS, and JavaScript fundamentals.` (use the actual stored string in your environment); edit modal open.  
- **Steps:**
  1. Change **Description** only to `Cohort covering HTML, CSS, JavaScript, and accessibility. Updated May 2026.`
  2. Do not change **Name** or any other fields.
  3. Click **Save**.
  4. Re-open the program via the **edit** icon.
- **Expected result:** **Name** remains `Web Development 2026`; **Description** matches the new text; all other fields match their pre-edit values (no silent resets to defaults).  
- **Priority:** High  
- **Maps to AC:** Edit preserves unchanged fields  

---

### TC-004
- **Title:** Multiple field updates persist together after Save  
- **Preconditions:** Edit modal open for an existing program with baseline values recorded for **Name**, **Description**, and any other editable fields.  
- **Steps:**
  1. Update **Name** to `Web Development 2026 - May Intake`.
  2. Update **Description** to `Evening schedule; instructor-led labs.`
  3. Update any other editable fields on the form (e.g. dates or status if present) to new valid values.
  4. Click **Save**; reopen edit for the same program.
- **Expected result:** All edited fields show the new values; no partial save.  
- **Priority:** Medium  

---

### TC-005
- **Title:** Cancel or dismiss without Save does not persist changes  
- **Preconditions:** Edit modal open; baseline **Name** `Web Development 2026`.  
- **Steps:**
  1. Change **Name** to `Web Development 2026 - Should Not Save`.
  2. Close the modal via **Cancel**, **Esc**, or the **X** control (whichever the product provides) without clicking **Save**.
  3. Confirm the list and reopen edit.
- **Expected result:** **Name** remains `Web Development 2026`; no backend update for the discarded edit.  
- **Priority:** Medium  

---

## Negative flows

### TC-006
- **Title:** Saving with empty Name does not silently overwrite data or close the modal without clear handling  
- **Preconditions:** Edit modal open for **Web Development 2026**.  
- **Steps:**
  1. Clear the **Name** field (empty string).
  2. Click **Save**.
- **Expected result:** System blocks save or shows a validation error; modal remains open or closes only per product rules **with** user-visible error; **Programs** list still shows `Web Development 2026` (or last successfully saved name)—no blank name in the list.  
- **Priority:** High  

---

### TC-007
- **Title:** Invalid or failed save does not update the list or other programs  
- **Preconditions:** Two programs exist, e.g. **Web Development 2026** and **Data Analytics 2026**; network throttling or API error simulation available if applicable.  
- **Steps:**
  1. Open edit for **Web Development 2026**; change **Name** to `Web Development 2026 - Network Test`.
  2. Trigger a failed save (e.g. disconnect network before **Save**, or use mocked 500 response if in a test environment).
  3. Click **Save**; observe UI and list.
- **Expected result:** User sees an error; **Web Development 2026** row is unchanged; **Data Analytics 2026** is unchanged; no duplicate or merged rows.  
- **Priority:** High  

---

### TC-008
- **Title:** Concurrent or stale edit does not overwrite newer data without warning (if product supports concurrency)  
- **Preconditions:** Two browser sessions or two admin users both open edit for the same program; Session B saves first.  
- **Steps:**
  1. Session A opens edit (loads original **Description**).
  2. Session B changes **Description** to `Updated by B.` and saves.
  3. Session A saves without refreshing, with **Description** still showing the old text or a conflicting value.
- **Expected result:** Product defines behavior: optimistic lock / conflict message / last-write-wins—**whichever is implemented**, the outcome must be consistent and not a silent partial corrupt state; document actual behavior as pass/fail vs requirement.  
- **Priority:** Medium  

---

### TC-009
- **Title:** Non-admin cannot edit program details (authorization)  
- **Preconditions:** User without admin role; **Web Development 2026** visible or not per product rules.  
- **Steps:**
  1. Open **Programs** as non-admin.
  2. Attempt to open edit via direct URL or API if **edit** is hidden.
- **Expected result:** **Edit** is unavailable or request is denied; program data unchanged.  
- **Priority:** High  

---

### TC-010
- **Title:** Saving does not create a duplicate program row  
- **Preconditions:** **Web Development 2026** exists once in the list.  
- **Steps:**
  1. Edit the program; change **Description** only; **Save**.
  2. Count rows with **Name** `Web Development 2026`.
- **Expected result:** Still exactly one program with that identity (same id/row); list count unchanged except for intentional sorting.  
- **Priority:** High  

---

## Edge cases

### TC-011
- **Title:** Name at maximum allowed length saves and displays correctly  
- **Preconditions:** Known max length for **Name** (e.g. 100, 255—use actual spec or discover via validation message); construct string of exactly that length, e.g. repeat `W`/`D` pattern to fill, ending with recognizable suffix `...END`.  
- **Steps:**
  1. Open edit; set **Name** to the max-length string.
  2. Click **Save**; verify list and reopen edit.
- **Expected result:** Full string stored and shown (no truncation mid-character); no server error.  
- **Priority:** Medium  

---

### TC-012
- **Title:** Name one character over maximum is rejected or truncated per rules  
- **Preconditions:** Same max length as TC-011.  
- **Steps:**
  1. Set **Name** to max length plus one extra character `X`.
  2. Click **Save**.
- **Expected result:** Validation prevents save or product documents truncation; list must not show corrupted or partial name inconsistent with rules.  
- **Priority:** Medium  

---

### TC-013
- **Title:** Description at maximum allowed length handles gracefully  
- **Preconditions:** Known max length for **Description**; baseline program **Web Development 2026**.  
- **Steps:**
  1. Paste or type **Description** of exactly max length (repeat `Line test.\n` to fill if multiline allowed).
  2. **Save**; reopen edit.
- **Expected result:** Value persists completely within product limits; list/detail views render without layout break.  
- **Priority:** Medium  

---

### TC-014
- **Title:** Special characters and Unicode in Name and Description persist correctly  
- **Preconditions:** Edit modal open.  
- **Steps:**
  1. Set **Name** to `Web Development 2026 <May> & "Evening" — 日本語`.
  2. Set **Description** to `Symbols: <>&"'`; emoji: 📚; newline after this line.\nSecond line.`
  3. **Save**; reopen edit; check list display.
- **Expected result:** No HTML injection (values display as text, not executed markup); encoding preserved; line breaks in **Description** preserved if multiline is supported.  
- **Priority:** Medium  

---

### TC-015
- **Title:** Whitespace-only Name is invalid  
- **Preconditions:** Edit modal open.  
- **Steps:**
  1. Set **Name** to three spaces `   ` (or tabs only).
  2. Click **Save**.
- **Expected result:** Validation error or trim-to-empty treated like TC-006; list unchanged.  
- **Priority:** Medium  

---

### TC-016
- **Title:** Leading and trailing spaces on Name are trimmed or consistently rejected  
- **Preconditions:** Edit modal open.  
- **Steps:**
  1. Set **Name** to `   Web Development 2026 - Trim Test   `.
  2. **Save**; observe stored value on reopen.
- **Expected result:** Behavior is consistent: either trimmed to `Web Development 2026 - Trim Test` or user is warned; no duplicate-looking names that differ only by spaces.  
- **Priority:** Low  

---

### TC-017
- **Title:** Duplicate Name against another existing program is prevented or clearly resolved  
- **Preconditions:** Programs **Web Development 2026** and **Data Analytics 2026** exist.  
- **Steps:**
  1. Edit **Data Analytics 2026**; set **Name** to `Web Development 2026` (same as the other program).
  2. Click **Save**.
- **Expected result:** Save blocked with message **or** product allows duplicates—document expected business rule; list must not show ambiguous duplicate keys if uniqueness is required.  
- **Priority:** High  

---

### TC-018
- **Title:** Very long single-line input without spaces wraps or scrolls without breaking the modal  
- **Preconditions:** Edit modal open.  
- **Steps:**
  1. Set **Description** to a single line of 5000 `a` characters (below any hard max if known).
  2. Observe form layout; **Save** if within limits.
- **Expected result:** UI remains usable; no modal overflow that hides **Save**; if over limit, validation matches TC-012 pattern.  
- **Priority:** Low  

---

### TC-019
- **Title:** Edit icon is only actionable for the intended program row  
- **Preconditions:** Multiple programs on **Programs** page.  
- **Steps:**
  1. Click **edit** on **Web Development 2026** only.
- **Expected result:** Form loads data for **Web Development 2026** only, not an adjacent row.  
- **Priority:** High  

---

## Traceability summary

| Acceptance criterion | Test case IDs |
|----------------------|---------------|
| Open program for editing (pre-populated form) | TC-001, TC-019 |
| Edit name → Save → modal closes → list updates | TC-002 |
| Description-only edit preserves Name and other fields | TC-003 |

---

## Ambiguities and gaps in the acceptance criteria

1. **Field inventory:** Only **Name** and **Description** are named. If the real form includes **Status**, **Start date**, **End date**, **Code**, **Owner**, etc., ACs do not say whether those must appear pre-populated or how partial updates interact with required/optional rules.  
2. **Uniqueness:** No rule stated for duplicate **Name** (or other unique keys); TC-017 needs a product decision.  
3. **Validation:** No AC for required **Name**, empty **Description**, or max lengths—assumed for quality but not specified.  
4. **“Immediately” on list update:** Unclear if this requires optimistic UI, websocket, or refetch; failure handling (TC-007) is not in ACs.  
5. **Cancel/dismiss:** Not in ACs; TC-005 is recommended for regression safety.  
6. **Permissions:** Story says “admin” but ACs only imply happy path; non-admin and API-level auth gaps.  
7. **Concurrency:** No expected behavior when two admins edit the same program.  
8. **List vs detail:** AC says “program list” shows updated **Name**; if **Description** is not a list column, verification of TC-003 may require reopening edit or opening a detail view—AC does not specify where **Description** is visible after save.  
9. **Accessibility:** No requirements for keyboard focus trap in modal, **Save** via keyboard, or screen reader labels for **edit** icon.  
10. **Audit / history:** No requirement to log who changed what and when.  

---

*Prepared for QA execution; align max lengths and extra field names with the live application specification when available.*
