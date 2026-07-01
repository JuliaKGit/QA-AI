Feature: DS-9 Delete semester with confirmation
  As an admin user at https://test.didaxis.studio
  I want to delete a semester from a selected program with confirmation
  So that I can remove obsolete academic terms safely

  # Happy paths

  Scenario: Delete confirmation shows semester name
    Given I have selected a program with a semester "Fall 2026"
    When I click the delete control for "Fall 2026"
    Then I see a confirmation mentioning "Fall 2026"

  Scenario: Confirming delete removes the semester
    Given I have selected a program with a semester "Fall 2026"
    When I delete "Fall 2026" and confirm
    Then the semester panel no longer shows "Fall 2026"
    And I see "No semesters yet"

  Scenario: Canceling delete keeps the semester
    Given I have selected a program with a semester "Fall 2026"
    When I click delete for "Fall 2026" and cancel
    Then "Fall 2026" is still shown in the semester panel

  # Edge cases

  Scenario: Deleting one semester leaves others intact
    Given I have selected a program with semesters "Fall 2026" and "Winter 2027"
    When I delete "Fall 2026" and confirm
    Then "Fall 2026" is no longer shown
    And "Winter 2027" is still shown

#
# Ambiguities and gaps in DS-9 acceptance criteria
#
# 1. Semester delete control lacks an accessible name (icon-only 🗑).
# 2. Keyboard dismissal behavior for the native confirm is unspecified.
