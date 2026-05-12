Write Playwright tests for creating a new program on Didaxis Studio.

## App context (from manual inspection)

- Login page: https://test.didaxis.studio/login
  - Email field: getByLabel('Email')
  - Password field: getByLabel('Password')
  - Sign In button: getByRole('button', { name: 'Sign In' })
- Programs page: /programs
  - "New Program" button: getByRole('button', { name: 'New Program' })
  - Modal form:
    - Program Name: getByLabel('Program Name')
    - Description: getByLabel('Description')
    - Create button: getByRole('button', { name: 'Create' })

## Credentials

Use dotenv. Read email and password from process.env:

- process.env.DIDAXIS_EMAIL
- process.env.DIDAXIS_PASSWORD
Do NOT hardcode credentials in the test file.

## Test plan

### TC-001
- **Title:** Program creation form displays with correct fields after clicking "+ New Program"  
- **Preconditions:** Logged in as admin; on the **Programs** page.  
- **Steps:**
  1. Click the **+ New Program** button.
  2. Observe the form/modal that appears.
- **Expected result:** A program creation form is displayed containing at minimum the fields **Program Name** and **Description**; the **Create** button is visible; no pre-filled values (fields are empty).  
- **Priority:** High  
- **Maps to AC:** Navigate to program creation form  

## Requirements

- TypeScript
- Use Playwright locators (getByRole, getByLabel, getByText)
- Login as the first step in each test (or use beforeEach)
- Each test is independent
- Use unique test data with Date.now() suffix
- Save as tests/ds1-create-program.spec.ts