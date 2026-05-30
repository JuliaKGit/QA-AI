Feature: DS-2 Edit existing program details
  As an admin user at https://test.didaxis.studio
  I want to edit an existing program's details
  So that I can correct or update program information after creation

  # Happy paths

  Scenario: Open program for editing
    Given I am logged in as admin at https://test.didaxis.studio/login
    And I am on the Programs page
    And a program "Web Development 2026" exists with Description "Full-stack web development program"
    When I click the edit icon on "Web Development 2026"
    Then I see the "Edit Program" dialog
    And the Program Name field shows "Web Development 2026"
    And the Description field shows "Full-stack web development program"
    And the Save button is visible

  Scenario: Successfully edit a program name
    Given I am editing "Web Development 2026" in the "Edit Program" dialog
    When I change the Program Name to "Web Development 2026 - Updated"
    And I click Save
    Then the "Edit Program" dialog closes
    And the Programs list immediately shows "Web Development 2026 - Updated"
    And "Web Development 2026" is no longer shown in the list

  Scenario: Edit preserves unchanged fields when only Description is changed
    Given I am editing a program with Program Name "Web Development 2026" and Description "Full-stack web development program"
    When I change the Description to "Updated description for testing"
    And I leave the Program Name unchanged
    And I click Save
    Then the "Edit Program" dialog closes
    And the Programs list still shows Program Name "Web Development 2026"
    When I reopen the edit form for "Web Development 2026"
    Then the Program Name is "Web Development 2026"
    And the Description is "Updated description for testing"

  Scenario: Edit preserves Description when only Program Name is changed
    Given I am editing a program with Program Name "Web Development 2026" and Description "Full-stack web development program"
    When I change the Program Name to "Web Development 2026 - Renamed"
    And I leave the Description unchanged
    And I click Save
    Then the "Edit Program" dialog closes
    When I reopen the edit form for "Web Development 2026 - Renamed"
    Then the Program Name is "Web Development 2026 - Renamed"
    And the Description is still "Full-stack web development program"

  Scenario: Edited program data persists after page refresh
    Given I have renamed "Web Development 2026" to "Web Development 2026 - Updated"
    When I refresh the browser
    And I navigate to the Programs page
    Then the Programs list shows "Web Development 2026 - Updated"
    And "Web Development 2026" is not shown in the list

  Scenario: Save button is enabled when edit form opens with valid data
    Given I am editing "Web Development 2026" in the "Edit Program" dialog
    When I observe the Save button without making any changes
    Then the Save button is enabled

  Scenario: Clearing and re-entering Program Name allows save
    Given I am editing "Web Development 2026" in the "Edit Program" dialog
    When I clear the Program Name field
    And I enter "Cybersecurity Fundamentals 2026"
    And I click Save
    Then the "Edit Program" dialog closes
    And the Programs list shows "Cybersecurity Fundamentals 2026"

  # Negative

  Scenario: Saving with an empty Program Name is prevented
    Given I am editing a program with a valid Program Name in the "Edit Program" dialog
    When I clear the Program Name field completely
    Then the Save button is disabled

  Scenario: Save button re-enables after entering a valid name following a cleared field
    Given I am editing a program in the "Edit Program" dialog
    And I have cleared the Program Name field
    And the Save button is disabled
    When I enter "Restored Program Name" in the Program Name field
    Then the Save button becomes enabled

  Scenario: Closing the edit dialog without saving discards changes
    Given I am editing "Web Development 2026" in the "Edit Program" dialog
    And I have changed the Program Name to "Discarded Edit"
    When I dismiss the "Edit Program" dialog without clicking Save
    Then the Programs list still shows "Web Development 2026"
    And "Discarded Edit" is not shown in the list

  Scenario: Viewer role cannot edit a program
    Given I am logged in as a viewer user
    And I am on the Programs page
    And a program "Web Development 2026" exists
    Then the edit icon is not available on the "Web Development 2026" row

  Scenario: Renaming to a duplicate Program Name is rejected
    Given programs "Web Development 2026" and "Data Analytics 2026" exist in the Programs list
    And I am editing "Data Analytics 2026" in the "Edit Program" dialog
    When I change the Program Name to "Web Development 2026"
    And I click Save
    Then creation is blocked with a validation message indicating the name already exists
    And the original "Web Development 2026" program is not altered

  Scenario: Network failure during save does not apply a partial update
    Given I am editing "Web Development 2026" in the "Edit Program" dialog
    And I have changed the Program Name to "Network Failure Edit Test"
    When the save request fails due to a server or network error
    And I click Save
    Then an error message is shown to the user
    And the Programs list still shows "Web Development 2026"

  Scenario: HTML and script content in edited fields does not execute
    Given I am editing a program in the "Edit Program" dialog
    When I change Program Name to "<script>alert('XSS')</script>"
    And I change Description to "<img onerror=alert(1) src=x>"
    And I click Save if the Save button is enabled
    Then no script executes in the browser
    And displayed values are rendered as plain text in the Programs list

  Scenario: Rapid double-click on Save does not create duplicate records or errors
    Given I am editing a program in the "Edit Program" dialog
    And I have changed the Program Name to "Double Click Edit Test"
    When I double-click the Save button quickly
    Then exactly one program named "Double Click Edit Test" appears in the Programs list

  Scenario: Concurrent edit by another admin is handled without silent data loss
    Given admin User A and admin User B both have the edit form open for "Web Development 2026"
    When User A changes the Program Name to "Version A" and clicks Save
    And User B changes the Program Name to "Version B" and clicks Save
    Then User B receives a conflict error or a documented last-write-wins outcome
    And no silent merge of partial changes occurs

  # Edge cases

  Scenario: Whitespace-only Program Name does not save
    Given I am editing a program with a valid Program Name in the "Edit Program" dialog
    When I clear the Program Name field and enter "   "
    Then the Save button remains disabled

  Scenario: Leading and trailing spaces in edited Program Name are trimmed on save
    Given I am editing a program in the "Edit Program" dialog
    When I change the Program Name to "   Web Development 2026   "
    And I click Save
    Then the Programs list shows "Web Development 2026" without leading or trailing spaces

  Scenario: Special characters and Unicode in edited fields persist correctly
    Given I am editing a program in the "Edit Program" dialog
    When I change Program Name to "Développement Web 2026 — \"Été\" & <Hiver> 日本語"
    And I change Description to "Symbols: &<>\"'/; Emoji: 🎓📚; Accents: àéîõü"
    And I click Save
    Then the Programs list shows the updated Program Name and Description with all characters intact

  Scenario: Edited Program Name at maximum 100 characters saves correctly
    Given I am editing a program in the "Edit Program" dialog
    When I change the Program Name to a string of exactly 100 characters ending in "MAX"
    And I click Save
    Then the Programs list shows the full Program Name without truncation

  Scenario: Edited Program Name exceeding 100 characters is rejected or blocked
    Given I am editing a program in the "Edit Program" dialog
    When I attempt to enter a Program Name of 101 characters
    Then input is blocked or validation prevents save with an error message

  Scenario: Edited Description at maximum 500 characters saves correctly
    Given I am editing a program in the "Edit Program" dialog
    When I change the Description to a string of exactly 500 characters
    And I click Save
    Then reopening the edit form shows the full Description without truncation

  Scenario: Edited Description exceeding 500 characters is rejected or blocked
    Given I am editing a program in the "Edit Program" dialog
    When I change the Program Name to "Overlong Description Edit Test"
    And I attempt to enter a Description of 501 characters
    Then input is blocked or validation prevents save with an error message

  Scenario: Very long Description edit saves without truncation
    Given I am editing a program in the "Edit Program" dialog
    When I replace the Description with a multi-paragraph text of 1500 or more characters
    And I click Save
    Then reopening the edit form shows the full Description text preserved

#
# Ambiguities and gaps in DS-2 acceptance criteria
#
# 1. Empty name validation: ACs do not specify behavior when Program Name is cleared during edit.
#    Assumed same as DS-1 (Save disabled). Confluence Validation Rules say trimmed empty blocks submit.
# 2. Uniqueness on rename: not in DS-2 ACs. Confluence Field Definitions require unique name per organization.
# 3. Description required or optional on edit? AC shows editing Description only, but does not say if Description can be cleared.
# 4. Cancel/dismiss behavior (Esc, backdrop, X) is not defined in DS-2 ACs.
# 5. API/network failure handling is not specified in DS-2 ACs.
# 6. Double-submit prevention is not specified (known pattern from DS-1 bugs DS-79, SS-26).
# 7. Concurrent editing policy (optimistic locking vs last-write-wins) is undefined.
# 8. Role access: AC implies admin. Confluence UI Behavior shows edit for ADMIN and EDITOR only; VIEWER read-only.
# 9. Maximum lengths: not in DS-2 ACs. Confluence defines Program Name max 100 chars, Description max 500 chars.
# 10. Whitespace-only and leading/trailing space handling is not defined in DS-2 ACs.
# 11. Saving without changes: no AC defines no-op vs submit when user opens edit and clicks Save unchanged.
# 12. Edit icon: AC references "edit icon" but does not specify label, tooltip, or row location (UI uses ✏️ button).
