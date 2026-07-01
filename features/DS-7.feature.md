Feature: DS-7 Create semester for a program
  As an admin user at https://test.didaxis.studio
  I want to create a semester for a selected program
  So that I can configure scheduling for that academic term

  # Happy paths

  Scenario: Open new semester form from semester panel
    Given I am logged in as admin
    And I am on the Programs page with a program selected
    When I click "+ Semester"
    Then I see the "New Semester" dialog
    And the form shows fields "Semester Name", "Start Date", and "End Date"
    And the "Create Semester" button is visible

  Scenario: Successfully create a semester
    Given I have selected a program on the Programs page
    And I am on the "New Semester" dialog
    When I fill in Semester Name with "Fall 2026"
    And I set Start Date to "2026-09-01"
    And I set End Date to "2026-12-15"
    And I click Create Semester
    Then the "New Semester" dialog closes
    And the semester panel shows "Fall 2026"
    And "No semesters yet" is no longer shown

  Scenario: Create Semester button enables after required fields are filled
    Given I am on the "New Semester" dialog with empty required fields
    And the Create Semester button is disabled
    When I fill in Semester Name with "Spring 2027"
    And I set Start Date to "2027-01-10"
    And I set End Date to "2027-05-20"
    Then the Create Semester button becomes enabled

  Scenario: Weekday defaults are Mon through Fri
    Given I am on the "New Semester" dialog
    Then weekdays Mon, Tue, Wed, Thu, and Fri are selected
    And Sat and Sun are not selected

  # Negative

  Scenario: Create Semester stays disabled with empty semester name
    Given I am on the "New Semester" dialog
    When I set Start Date and End Date but leave Semester Name empty
    Then the Create Semester button remains disabled

  Scenario: Cancel does not create a semester
    Given I have selected a program showing "No semesters yet"
    And I am on the "New Semester" dialog with "Abandoned Semester" entered
    When I click Cancel
    Then the dialog closes
    And "Abandoned Semester" does not appear in the semester panel
    And "No semesters yet" is still shown

  # Edge cases

  Scenario: Multiple semesters can be created for one program
    Given I have selected a program
    And a semester "Fall 2026" already exists
    When I create a semester named "Winter 2027"
    Then both "Fall 2026" and "Winter 2027" appear in the semester panel

#
# Ambiguities and gaps in DS-7 acceptance criteria
#
# 1. Exact validation rules for date ordering (end before start) are unspecified.
# 2. Maximum length for Semester Name is not defined in ticket ACs.
# 3. Whether scheduling limit fields are required or optional is unspecified.
# 4. Semester list row structure (table vs cards) is not defined in ACs.
# 5. Duplicate semester names within a program are not addressed in ACs.
