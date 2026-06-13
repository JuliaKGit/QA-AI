Feature: DS-5 Program list filtering and display
  As an admin user at https://test.didaxis.studio
  I want to see all programs in a clear list
  So that I can quickly find and manage them

  # Happy paths

  Scenario: Display program list with name and description
    Given I am logged in as admin at https://test.didaxis.studio
    And a program "Web Development 2026" with description "Full-stack web track" exists
    When I navigate to the Programs page
    Then I see a list of programs
    And the row for "Web Development 2026" shows its name and description "Full-stack web track"

  Scenario: Multiple programs are all listed
    Given programs "Web Development 2026" and "Data Analytics 2026" exist
    When I navigate to the Programs page
    Then the list shows a row for "Web Development 2026"
    And the list shows a row for "Data Analytics 2026"

  Scenario: Each listed program exposes management controls
    Given a program "Web Development 2026" exists
    When I navigate to the Programs page
    Then the row for "Web Development 2026" has an Edit control
    And the row for "Web Development 2026" has a Delete control

  # Empty state

  Scenario: Empty state when no programs exist
    Given no programs exist in the system
    When I navigate to the Programs page
    Then I see a message indicating no programs have been created
    And I see a prompt to create the first program

  Scenario: Creating the first program clears the empty state
    Given no programs exist in the system
    And I am on the Programs page showing the empty state
    When I create a program named "First Program"
    Then the empty-state message is no longer shown
    And the list shows a row for "First Program"

  # Negative

  Scenario: Empty state is not shown while programs exist
    Given a program "Web Development 2026" exists
    When I navigate to the Programs page
    Then the "no programs" empty-state message is not shown

  Scenario: Deleted program no longer appears in the list
    Given a program "Temp Program" exists
    And I am on the Programs page
    When I delete "Temp Program" and confirm
    Then the list no longer shows a row for "Temp Program"

  Scenario: Deleting the last program returns the empty state
    Given exactly one program "Only Program" exists
    And I am on the Programs page
    When I delete "Only Program" and confirm
    Then I see the empty-state message indicating no programs have been created

  # Edge cases

  Scenario: Program with no description still renders cleanly
    Given a program "No Desc Program" with an empty description exists
    When I navigate to the Programs page
    Then the row for "No Desc Program" is shown
    And the description cell is empty without layout errors

  Scenario: Special characters in name and description display intact
    Given a program "Informatique & IA - Niveau 2" with description "Très complet — <démo>" exists
    When I navigate to the Programs page
    Then the row shows "Informatique & IA - Niveau 2" with all characters intact
    And the description renders as plain text without executing markup

  Scenario: Two programs with the same name are individually distinguishable
    Given two programs both named "Duplicate Name" exist with different descriptions
    When I navigate to the Programs page
    Then the list shows two distinct rows for "Duplicate Name"
    And each row shows its own description

  Scenario: Program list survives a page refresh
    Given a program "Persistent Program" exists
    And I am on the Programs page
    When I refresh the page
    Then the row for "Persistent Program" is still shown

  Scenario: Long program name does not break the row layout
    Given a program with a 100-character name ending in "MAX" exists
    When I navigate to the Programs page
    Then the full name is shown without breaking the list layout

  Scenario: List remains usable when the programs API fails
    Given the programs API returns a 500 error
    When I navigate to the Programs page
    Then I see an error or recovery state rather than a misleading empty state
    And the page does not crash

<!--
Ambiguities / gaps in DS-5 acceptance criteria:
1. "Filtering" is in the title but no AC describes a search/filter control — scope of filtering is undefined.
2. Empty-state wording and the exact "create the first program" prompt text/control are unspecified.
3. No AC for sort order of the list (alphabetical, creation order, etc.).
4. No AC for API/error states; TC for 500 is exploratory (see DS-72).
5. Management controls (Edit/Delete) are implied by "manage" but not enumerated in ACs (see DS-73).
6. Pagination / large-list behavior is unspecified.
7. Duplicate-name display behavior is unspecified (see DS-75).
Known related bugs from the 2026-05-24 re-verification: DS-72 (empty state on API 500), DS-73 (missing action icons),
DS-74 (second program creation blocked), DS-75 (duplicate names indistinguishable), DS-76 (refresh consistency timeout).
-->
