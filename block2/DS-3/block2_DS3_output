# Test Plan: Program Name Validation and Duplicate Prevention

**Feature:** Program name validation and duplicate prevention  
**Actor:** Admin user  
**Primary UI:** Program **creation** form; primary action **Create**  
**Primary field under test:** **Name** (program name)  
**Reference data from acceptance criteria:** whitespace `   `; `Informatique & IA - Niveau 2`; existing program `Web Development 2026`  

**Assumption for “other required fields”:** The creation form exposes at least **Description** and any additional required controls the product defines (e.g. **Status**, dates). Until the live spec is attached, tests use **Description** with the concrete value `Programme avancé en intelligence artificielle et systèmes.` for the positive special-character scenario and other valid creates. Adjust labels to match the actual form.

---

## Positive flows

### TC-001
- **Title:** Program is created when **Name** contains ampersands, hyphens, accents, and spaces  
- **Preconditions:** Logged in as admin; on **program creation** form; no existing program named `Informatique & IA - Niveau 2`.  
- **Steps:**
  1. In **Name**, enter `Informatique & IA - Niveau 2`.
  2. Fill **Description** with `Programme avancé en intelligence artificielle et systèmes.`
  3. Complete every other **required** field on the form with valid values (same as used in regression for program create).
  4. Click **Create**.
- **Expected result:** Program is created successfully; success confirmation or redirect per product design; new row appears on **Programs** (or equivalent list) with **Name** exactly `Informatique & IA - Niveau 2`; no validation error on **Name**.  
- **Priority:** High  
- **Maps to AC:** Accept program name with special characters  

---

### TC-002
- **Title:** Valid **Name** with only “normal” characters creates successfully (baseline control)  
- **Preconditions:** Admin on creation form; **Name** `Data Literacy 2026` not yet used.  
- **Steps:**
  1. Set **Name** to `Data Literacy 2026`.
  2. Set **Description** to `Foundations of data analysis for business users.`
  3. Fill other required fields; click **Create**.
- **Expected result:** Program created; listed as `Data Literacy 2026`.  
- **Priority:** Medium  

---

### TC-003
- **Title:** **Name** differing only by trailing space from an existing program is handled per uniqueness rules  
- **Preconditions:** Program `Web Development 2026` exists.  
- **Steps:**
  1. Open creation form; set **Name** to `Web Development 2026 ` (single trailing space).
  2. Fill **Description** and required fields; click **Create**.
- **Expected result:** If trimming is applied before duplicate check, duplicate error matches TC-007 behavior; if not trimmed, product either rejects as duplicate or allows—**document actual rule**; must be consistent with TC-007 and whitespace AC.  
- **Priority:** Medium  

---

## Negative flows

### TC-004
- **Title:** Whitespace-only **Name** does not submit; trimmed value is treated as empty  
- **Preconditions:** Admin on **program creation** form; **Description** and other fields may be filled or left per field rules (focus is **Name**).  
- **Steps:**
  1. In **Name**, enter exactly three spaces: `   ` (same literal as acceptance criteria).
  2. Fill **Description** with `Test description for whitespace name validation.`
  3. Fill all other **required** fields with valid values.
  4. Click **Create**.
- **Expected result:** Form is **not** submitted (no new program persisted); user sees validation for empty/required **Name** after trim; **Create** does not complete a successful create flow; optional: network tab shows no successful create API (or no create call).  
- **Priority:** High  
- **Maps to AC:** Reject program name with only whitespace  

---

### TC-005
- **Title:** Empty **Name** (no characters) does not create a program  
- **Preconditions:** Admin on creation form.  
- **Steps:**
  1. Leave **Name** empty.
  2. Fill **Description** and required fields; click **Create**.
- **Expected result:** Same class of behavior as TC-004: no submit / validation error; no new program.  
- **Priority:** High  

---

### TC-006
- **Title:** Duplicate **Name** `Web Development 2026` shows error and does not create a second program  
- **Preconditions:** Program **Web Development 2026** already exists (single canonical row).  
- **Steps:**
  1. Open **program creation** form.
  2. Set **Name** to `Web Development 2026` (exact match to existing).
  3. Set **Description** to `Attempted duplicate — should fail.`
  4. Fill other required fields; click **Create**.
- **Expected result:** Error message indicates the **name already exists** (or equivalent wording); no second program with that **Name**; list still shows exactly one `Web Development 2026` (unless product uses non-name unique id—then assert by **Name** visibility rules).  
- **Priority:** High  
- **Maps to AC:** Reject duplicate program name  

---

### TC-007
- **Title:** Duplicate error does not alter or delete the existing program  
- **Preconditions:** `Web Development 2026` exists with known **Description** e.g. `Original cohort details unchanged.`  
- **Steps:**
  1. Attempt create with duplicate **Name** as in TC-006.
  2. After error, open existing **Web Development 2026** (view or edit) and verify fields.
- **Expected result:** Existing program’s data unchanged; only the failed create attempt occurred.  
- **Priority:** High  

---

### TC-008
- **Title:** Successful create must not occur when server returns duplicate conflict after race  
- **Preconditions:** Two tabs or rapid double-click on **Create** with same new **Name** (stress scenario).  
- **Steps:**
  1. Tab A: create `Parallel Test Program` successfully.
  2. Tab B: submit creation with **Name** `Parallel Test Program` again almost simultaneously.
- **Expected result:** At most one persisted program; second request gets duplicate/error; no duplicate rows.  
- **Priority:** Medium  

---

### TC-009
- **Title:** Non-admin cannot bypass validation via API or hidden form  
- **Preconditions:** Non-admin session; optional API client with user token.  
- **Steps:**
  1. Attempt program creation with duplicate or empty **Name** via UI if available, or POST create endpoint if exposed.
- **Expected result:** 403/401 or UI hidden; no program created.  
- **Priority:** High  

---

### TC-010
- **Title:** Misleading success toast must not appear when validation fails  
- **Preconditions:** Setup for TC-004 or TC-006.  
- **Steps:**
  1. Trigger failed create (whitespace **Name** or duplicate **Name**).
- **Expected result:** No “Program created” success message; UI state matches failure only.  
- **Priority:** Medium  

---

## Edge cases

### TC-011
- **Title:** **Name** at maximum allowed length is accepted when unique  
- **Preconditions:** Known max length *N* for **Name** from spec or UI; string of length *N* e.g. `MaxLen-` + repeated `x` to fill exactly *N* characters.  
- **Steps:**
  1. Enter max-length **Name**; fill required fields; **Create**.
- **Expected result:** Program created; **Name** stored and displayed at full length *N*.  
- **Priority:** Medium  

---

### TC-012
- **Title:** **Name** of length *N+1* is rejected or truncated per documented rules  
- **Preconditions:** Same *N* as TC-011.  
- **Steps:**
  1. Enter *N+1* characters in **Name**; **Create**.
- **Expected result:** Client or server validation blocks submit or truncates—**must match product spec**; no silent create with corrupted name.  
- **Priority:** Medium  

---

### TC-013
- **Title:** Case-only variant of existing **Name** is allowed or blocked consistently  
- **Preconditions:** `Web Development 2026` exists.  
- **Steps:**
  1. Create with **Name** `web development 2026` (all lowercase).
- **Expected result:** Product rule documented: either duplicate error (case-insensitive uniqueness) or success (case-sensitive); list behavior unambiguous.  
- **Priority:** Medium  

---

### TC-014
- **Title:** Unicode and emoji in **Name** are validated and stored per product policy  
- **Preconditions:** Clean environment or use unique **Name**.  
- **Steps:**
  1. Set **Name** to `Café Program 🎓 中文`
  2. Fill required fields; **Create**.
- **Expected result:** Either success with exact display or clear validation if disallowed; no replacement characters breaking uniqueness checks unexpectedly.  
- **Priority:** Low  

---

### TC-015
- **Title:** **Name** with HTML-like text is stored as plain text (no script execution)  
- **Preconditions:** Creation form available.  
- **Steps:**
  1. Set **Name** to `Course <script>alert(1)</script> 2026`
  2. **Create** (if allowed); open list/detail.
- **Expected result:** Value shown as literal text in UI; no script execution; duplicate check uses literal string.  
- **Priority:** Medium  

---

### TC-016
- **Title:** Tabs-only and newlines-only **Name** behave like whitespace-only (trim → empty)  
- **Preconditions:** Creation form.  
- **Steps:**
  1. Enter **Name** consisting of `\t\t\t` only, then repeat with `\n\n` only (if input allows).
  2. Fill required fields; **Create**.
- **Expected result:** Same as TC-004: not submitted; treated as empty after trim.  
- **Priority:** Medium  

---

### TC-017
- **Title:** Duplicate check uses normalized **Name** if normalization is defined (strip spaces, NFC)  
- **Preconditions:** If product normalizes Unicode: create `École` vs `E\u0301cole` per spec.  
- **Steps:**
  1. Create first program; attempt second with composed/decomposed variant if applicable.
- **Expected result:** Matches documented duplicate semantics; no accidental duplicate if normalization merges them.  
- **Priority:** Low  

---

### TC-018
- **Title:** Leading spaces on otherwise valid **Name** are trimmed or rejected consistently  
- **Preconditions:** No program named `Trimmed Name Test`.  
- **Steps:**
  1. Enter **Name** `   Trimmed Name Test`.
  2. **Create**; verify stored **Name** on list/edit.
- **Expected result:** Stored as `Trimmed Name Test` or creation blocked with message—consistent with duplicate detection for `Trimmed Name Test`.  
- **Priority:** Low  

---

## Traceability summary

| Acceptance criterion | Test case IDs |
|----------------------|---------------|
| Whitespace-only **Name**; trim → empty; form not submitted | TC-004, TC-016 |
| Accept **Name** `Informatique & IA - Niveau 2` with required fields | TC-001 |
| Duplicate `Web Development 2026`; error name exists | TC-006, TC-007 |

---

## Ambiguities and gaps in the acceptance criteria

1. **“Other required fields”** are not enumerated; testers must map the real **Create** form (field names, defaults, conditional required fields).  
2. **Whitespace:** AC specifies three spaces only; behavior for tabs, NBSP, or mixed whitespace is not stated (TC-016 partially covers).  
3. **Duplicate semantics:** Case sensitivity, trimming before compare, and Unicode normalization are unspecified (TC-003, TC-013, TC-017).  
4. **Edit vs create:** AC only mentions **creation** form; duplicate rules on **edit** (rename to existing **Name**) are out of scope here but affect data integrity in production.  
5. **Error UX:** Exact copy for “name already exists,” inline vs summary errors, and field focus are not specified.  
6. **Max length** for **Name** is not in ACs; TC-011/TC-012 require a spec or discovery.  
7. **Successful create** path: no AC for redirect vs modal close vs staying on form—only “created successfully.”  
8. **API-only clients** (integrations) are not mentioned; duplicate prevention may need parity with UI.  
9. **Soft-deleted or archived** programs: unclear if **Name** remains reserved for duplicates.  
10. **Accessibility:** No requirements for announcing validation errors to assistive tech.  

---

*Align **Description** and other required field names with the live application; update TC-001/TC-004 steps if the form differs.*
