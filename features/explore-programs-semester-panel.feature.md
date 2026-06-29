## Coverage snapshot
- Page: `/programs`
- Already covered: create, edit, delete, name validation, list display, sidebar nav, empty state
- Explored via a11y tree: 2026-06-29

## Selected gap (one flow)
**Flow:** Program selection reveals semester management panel
**Why this one:** Exercises the right-hand semester panel — a distinct UI region that no existing spec asserts.

## Gherkin test plan

Feature: Programs — semester panel selection (discovered)

  # Positive path
  Scenario: Selecting a program reveals the semester panel
    Given I am logged in as admin
    And I am on the Programs page
    And a program "Semester Panel Program" exists in the list
    When I click the program name "Semester Panel Program"
    Then I do not see "Select a program to manage semesters"
    And I see "Semesters & scheduling config"
    And I see the button "+ Semester"

  # Edge case
  Scenario: Switching selection updates the semester panel
    Given I am logged in as admin
    And programs "Alpha" and "Beta" exist in the list
    And I have selected program "Alpha"
    When I click the program name "Beta"
    Then the semester panel shows "Beta"
    And the semester panel does not show "Alpha"

## Locator hints (from a11y tree)
- Program row: `getByRole('row', { name: /ProgramName/ })`
- Semester hint: `getByText('Select a program to manage semesters')`
- Panel heading: `getByRole('heading', { name: ProgramName, level: 4 })`
- Panel subtitle: `getByText('Semesters & scheduling config')`
- New semester: `getByRole('button', { name: '+ Semester' })`
- Empty semesters: `getByText('No semesters yet')`

## For test-writer
- Suggested file: `tests/ds6-program-semester-panel.spec.ts`
- POM updates: `ProgramsPage` — `selectProgram`, semester panel locators
