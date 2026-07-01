Feature: DS-8 Edit semester for a program
  As an admin user at https://test.didaxis.studio
  I want to edit an existing semester for a selected program
  So that I can update scheduling configuration for that academic term

  # Happy paths

  Scenario: Open edit semester form from semester panel
    Given I am logged in as admin
    And I have selected a program with a semester "Fall 2026"
    When I click the edit control for "Fall 2026"
    Then I see the "Edit Semester" dialog
    And the form shows fields "Semester Name", "Start Date", and "End Date"
    And the Save button is visible

  Scenario: Successfully edit a semester name
    Given I have selected a program with a semester "Fall 2026"
    And I am on the "Edit Semester" dialog for "Fall 2026"
    When I change Semester Name to "Fall 2026 Updated"
    And I click Save
    Then the "Edit Semester" dialog closes
    And the semester panel shows "Fall 2026 Updated"
    And "Fall 2026" is no longer shown

  Scenario: Edit semester dates
    Given I have selected a program with a semester "Spring 2027"
    And I am on the "Edit Semester" dialog for "Spring 2027"
    When I set Start Date to "2027-01-15"
    And I set End Date to "2027-05-01"
    And I click Save
    Then the semester panel shows "Spring 2027"
    And the semester card reflects the updated date range

  Scenario: Save button enables when required fields are valid
    Given I am on the "Edit Semester" dialog with all required fields filled
    Then the Save button is enabled

  # Negative

  Scenario: Cancel does not persist semester changes
    Given I have selected a program with a semester "Fall 2026"
    And I am on the "Edit Semester" dialog for "Fall 2026"
    When I change Semester Name to "Abandoned Edit"
    And I click Cancel
    Then the dialog closes
    And the semester panel still shows "Fall 2026"
    And "Abandoned Edit" does not appear

  Scenario: Save stays disabled when semester name is cleared
    Given I am on the "Edit Semester" dialog for "Fall 2026"
    When I clear the Semester Name field
    Then the Save button is disabled

  # Edge cases

  Scenario: Special characters in edited semester name display intact
    Given I have selected a program with a semester "Fall 2026"
    When I edit the semester name to "Hiver 2026 — Groupe A"
    And I save the changes
    Then the semester panel shows "Hiver 2026 — Groupe A" with all characters intact

#
# Ambiguities and gaps in DS-8 acceptance criteria
#
# 1. Validation for end date before start date is unspecified.
# 2. Maximum length for Semester Name is not defined in ticket ACs.
# 3. Whether scheduling limit fields are required on edit is unspecified.
# 4. Semester edit/delete controls lack accessible names (icon-only ✏️/🗑).
