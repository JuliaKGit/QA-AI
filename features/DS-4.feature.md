Feature: DS-4 Delete program with confirmation
  As an admin user at https://test.didaxis.studio
  I want to delete a program with confirmation
  So that accidental deletions are prevented

  # Happy paths

  Scenario: Delete program with confirmation
    Given I am logged in as admin
    And a program "Test Program" exists on the Programs page
    When I click the delete control for "Test Program"
    Then I see a native confirmation dialog referencing "Test Program"
    When I confirm deletion
    Then "Test Program" is removed from the program list

  Scenario: Cancel program deletion
    Given a program "Test Program" exists on the Programs page
    When I click the delete control for "Test Program"
    And I see the confirmation dialog
    And I dismiss the dialog
    Then "Test Program" still exists in the list

  Scenario: Confirmation appears before the program is removed
    Given a program "Test Program" exists on the Programs page
    When I click the delete control for "Test Program"
    Then the confirmation dialog is visible
    And "Test Program" is still shown in the list
    When I confirm deletion
    Then "Test Program" is removed from the program list

  Scenario: Recreate program with same name after delete
    Given "Test Program" was deleted with confirmation
    When I create a new program with Name "Test Program"
    Then the program is created successfully

  # Negative

  Scenario: Deleting one program does not remove another
    Given "Test Program" and "Web Development 2026" both exist
    When I confirm delete of "Test Program" only
    Then "Web Development 2026" remains in the list

  Scenario: Cancel does not remove the program
    Given a program "Test Program" exists
    When I open delete confirmation and dismiss it
    Then "Test Program" remains in the list

  # Edge cases

  Scenario: Special characters in program name appear in confirmation
    Given a program "Informatique & IA - Niveau 2" exists
    When I click delete for that program
    Then the confirmation message includes the full program name
    When I confirm deletion
    Then that program is removed from the list

  Scenario: Keyboard activation opens delete confirmation
    Given a program "Test Program" exists
    When I focus the delete control and press Enter
    Then the confirmation dialog appears
    When I dismiss the dialog
    Then "Test Program" remains in the list

<!--
Ambiguities / gaps (from block2 test plan):
- Delete uses a native browser confirm(), not a custom modal.
- Confirm button is the browser OK action; Cancel maps to dismiss().
- No AC for API failure, non-admin access, or programs with dependencies.
- Soft vs hard delete and audit logging are unspecified.
-->
