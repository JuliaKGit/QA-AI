Feature: DS-3 Program name validation and duplicate prevention
  As an admin user at https://test.didaxis.studio
  I want the system to prevent invalid or duplicate program names
  So that data integrity is maintained

  # Happy paths

  Scenario: Accept program name with special characters
    Given I am logged in as admin at https://test.didaxis.studio/login
    And I am on the program creation form in the "New Program" dialog
    When I enter "Informatique & IA - Niveau 2" as the Program Name
    And I fill in Description with "French IT and AI program"
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Informatique & IA - Niveau 2"

  Scenario: Accept program name with accented characters
    Given I am on the program creation form in the "New Program" dialog
    When I enter "Développement Été" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Développement Été"

  Scenario: Accept program name with mixed Unicode, emoji, and symbols
    Given I am on the program creation form in the "New Program" dialog
    When I enter "プログラム \"2026\" — Test & <Demo>" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows the Program Name with all characters intact

  Scenario: Unique program name is accepted without duplicate error
    Given I am on the program creation form in the "New Program" dialog
    When I enter "Unique Program Test" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Unique Program Test"

  Scenario: Very similar but distinct program names are allowed
    Given a program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form in the "New Program" dialog
    When I enter "Web Development 2026!" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows both "Web Development 2026" and "Web Development 2026!"

  Scenario: Program name with leading and trailing spaces is trimmed before saving
    Given I am on the program creation form in the "New Program" dialog
    When I enter "   Web Analytics 2026   " as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Web Analytics 2026"
    When I reopen the edit form for "Web Analytics 2026"
    Then the Program Name field shows "Web Analytics 2026"

  # Negative

  Scenario: Reject program name with only whitespace
    Given I am on the program creation form in the "New Program" dialog
    When I enter "   " as the Program Name
    And I attempt to click Create
    Then the form is not submitted
    And the Program Name is trimmed and treated as empty
    And the Create button is disabled

  Scenario: Single space in program name is rejected
    Given I am on the program creation form in the "New Program" dialog
    When I enter " " as the Program Name
    Then the Create button is disabled
    And the form is not submitted

  Scenario: Tab characters in program name are treated as whitespace and rejected
    Given I am on the program creation form in the "New Program" dialog
    When I enter tab characters only as the Program Name
    Then the Create button is disabled
    And the form is not submitted

  Scenario: Reject duplicate program name on create
    Given a program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form in the "New Program" dialog
    When I enter "Web Development 2026" as the Program Name
    And I fill in Description with "Duplicate attempt"
    And I click Create
    Then the "New Program" dialog remains open
    And I see an error indicating the name already exists
    And no second program named "Web Development 2026" is created

  Scenario: Duplicate name check is case-insensitive
    Given a program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form in the "New Program" dialog
    When I enter "web development 2026" as the Program Name
    And I click Create
    Then the "New Program" dialog remains open
    And I see an error indicating the name already exists

  Scenario: Duplicate name with extra spaces is still rejected
    Given a program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form in the "New Program" dialog
    When I enter "  Web Development 2026  " as the Program Name
    And I click Create
    Then the "New Program" dialog remains open
    And I see an error indicating the name already exists

  Scenario: Duplicate program name on edit rename shows an error
    Given programs "Web Development 2026" and "Data Analytics 2026" exist in the Programs list
    And I am editing "Data Analytics 2026" in the "Edit Program" dialog
    When I change the Program Name to "Web Development 2026"
    And I click Save
    Then the "Edit Program" dialog remains open
    And I see an error indicating the name already exists
    And "Data Analytics 2026" is unchanged in the Programs list

  Scenario: Whitespace-only name is rejected in the edit form
    Given a program "Edit WS Test" exists in the Programs list
    And I am editing "Edit WS Test" in the "Edit Program" dialog
    When I change the Program Name to "   "
    Then the Save button is disabled
    And the form is not submitted

  Scenario: HTML and script injection in program name does not execute
    Given I am on the program creation form in the "New Program" dialog
    When I enter "<script>alert('XSS')</script>" as the Program Name
    And I click Create
    Then no script executes in the browser
    And the Programs list renders the value as plain text

  Scenario: SQL injection attempt in program name is safely handled
    Given I am on the program creation form in the "New Program" dialog
    When I enter "'; DROP TABLE programs; --" as the Program Name
    And I click Create
    Then the program is created or rejected without database corruption
    And the Programs page remains functional

  Scenario: Duplicate error clears when the name is changed to a unique value
    Given a program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form with "Web Development 2026" entered
    And I see an error indicating the name already exists
    When I change the Program Name to "Web Development 2026 - v2"
    And I click Create
    Then the duplicate error is cleared
    And the "New Program" dialog closes
    And the Programs list shows "Web Development 2026 - v2"

  # Edge cases

  Scenario: Single-character program name is accepted
    Given I am on the program creation form in the "New Program" dialog
    When I enter "Q" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Q"

  Scenario: Program name with only numbers is accepted
    Given I am on the program creation form in the "New Program" dialog
    When I enter "20260430" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "20260430"

  Scenario: Program name at maximum 100 characters is accepted
    Given I am on the program creation form in the "New Program" dialog
    When I enter a Program Name of exactly 100 characters ending in "MAX"
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows the full Program Name without truncation

  Scenario: Program name exceeding 100 characters is rejected or blocked
    Given I am on the program creation form in the "New Program" dialog
    When I attempt to enter a Program Name of 101 characters
    Then input is blocked or validation prevents save with an error message

  Scenario: Program name with embedded newline characters is handled safely
    Given I am on the program creation form in the "New Program" dialog
    When I enter "Line1\nLine2" as the Program Name
    Then the field strips the newline or stores it without breaking the form
    And no layout or database errors occur

  Scenario: Duplicate check allows reuse after a program is deleted
    Given a program "Recycled Program" was previously created and then deleted
    And I am on the program creation form in the "New Program" dialog
    When I enter "Recycled Program" as the Program Name
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Recycled Program"

  Scenario: Rapid concurrent creation of the same name produces only one program
    Given no program named "Race Condition Test" exists
    When two admin sessions submit "Race Condition Test" at nearly the same time
    Then only one program named "Race Condition Test" exists in the Programs list
    And the second submission shows a duplicate error or is deduplicated server-side

#
# Ambiguities and gaps in DS-3 acceptance criteria
#
# 1. Case sensitivity: AC says "the same name" but does not define whether "web development 2026"
#    matches "Web Development 2026". Confluence implies unique per organization; case rule needs confirmation.
# 2. Trimming before duplicate check: AC confirms whitespace-only is trimmed; unclear if
#    "  Web Development 2026  " is treated as duplicate of "Web Development 2026".
# 3. Duplicate check on edit/rename: AC only mentions create. Edit-form duplicate rejection assumed (TC-012).
# 4. Error message content and placement: AC requires an error but not exact wording, inline vs toast, or modal behavior.
# 5. Create button on whitespace-only: AC says form not submitted; unclear if button is disabled vs clickable with error.
# 6. Maximum name length: not in DS-3 ACs. Confluence Field Definitions specify max 100 characters.
# 7. Special characters scope: AC gives one example ("Informatique & IA - Niveau 2"); full allowed set undefined.
# 8. Deleted programs: no AC on whether soft-deleted names still block duplicates.
# 9. Concurrent submissions: no AC for race conditions when two users create the same name simultaneously.
# 10. Edit form whitespace validation: AC references creation form only; edit form parity assumed.
# 11. Error recovery: no AC on whether Description and other fields are preserved after a duplicate error.
# 12. Known gap: duplicate prevention may not yet be implemented in the app (see DS-12, SS-25 bugs).
