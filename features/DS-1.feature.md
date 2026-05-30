Feature: DS-1 Create new academic program
  As an admin user at https://test.didaxis.studio
  I want to create a new academic program
  So that I can begin designing its curriculum structure

  # Happy paths

  Scenario: Navigate to program creation form
    Given I am logged in as admin at https://test.didaxis.studio/login
    When I navigate to the Programs page
    And I click "+ New Program"
    Then I see the "New Program" dialog
    And the form shows fields "Program Name" and "Description"
    And the "Create" button is visible
    And both fields are empty

  Scenario: Successfully create a program
    Given I am on the program creation form in the "New Program" dialog
    When I fill in Program Name with "Web Development 2026"
    And I fill in Description with "Full-stack web development program"
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows a row with Program Name "Web Development 2026"

  Scenario: Create program with only Program Name and no Description
    Given I am on the program creation form in the "New Program" dialog
    When I fill in Program Name with "Data Analytics 2026"
    And I leave Description empty
    And I click Create
    Then the "New Program" dialog closes
    And the Programs list shows "Data Analytics 2026"

  Scenario: Create button becomes enabled after entering a Program Name
    Given I am on the program creation form with an empty Program Name
    And the Create button is disabled
    When I fill in Program Name with "Cybersecurity Fundamentals"
    Then the Create button becomes enabled

  Scenario: Newly created program persists after page refresh
    Given I have created program "Web Development 2026" with Description "Full-stack web development program"
    When I refresh the browser
    And I navigate to the Programs page
    Then the Programs list still shows "Web Development 2026"

  # Negative

  Scenario: Validation prevents empty program name
    Given I am on the program creation form in the "New Program" dialog
    When I leave the Program Name field empty
    Then the Create button is disabled

  Scenario: Create button re-disables when Program Name is cleared
    Given I am on the program creation form
    And I have filled Program Name with "Temp Value"
    And the Create button is enabled
    When I clear the Program Name field completely
    Then the Create button is disabled again

  Scenario: Closing the dialog without Create does not save a program
    Given I am on the program creation form
    And I have filled Program Name with "Abandoned Program"
    When I dismiss the "New Program" dialog without clicking Create
    Then the Programs list does not show "Abandoned Program"

  Scenario: Viewer role cannot create a new program
    Given I am logged in as a viewer user
    When I navigate to the Programs page
    Then the "+ New Program" button is not visible

  Scenario: Duplicate Program Name is rejected
    Given program "Web Development 2026" already exists in the Programs list
    And I am on the program creation form
    When I fill in Program Name with "Web Development 2026"
    And I fill in Description with "Duplicate test"
    And I click Create
    Then creation is blocked with a validation message indicating the name already exists
    And the existing "Web Development 2026" program is not altered

  Scenario: Network failure during creation does not add a partial program
    Given I am on the program creation form
    And I have filled Program Name with "Network Failure Test"
    When the create request fails due to a server or network error
    And I click Create
    Then an error message is shown to the user
    And "Network Failure Test" does not appear in the Programs list

  Scenario: HTML and script content in fields does not execute
    Given I am on the program creation form
    When I fill in Program Name with "<script>alert('XSS')</script>"
    And I fill in Description with "<img onerror=alert(1) src=x>"
    And I click Create if the Create button is enabled
    Then no script executes in the browser
    And displayed values are rendered as plain text in the Programs list

  Scenario: Rapid double-click on Create does not create duplicate programs
    Given I am on the program creation form
    And I have filled Program Name with "Double Click Test"
    When I double-click the Create button quickly
    Then exactly one program named "Double Click Test" appears in the Programs list

  # Edge cases

  Scenario: Whitespace-only Program Name keeps Create disabled
    Given I am on the program creation form
    When I fill in Program Name with "   "
    Then the Create button remains disabled

  Scenario: Single-character Program Name is accepted
    Given I am on the program creation form
    When I fill in Program Name with "A"
    And I click Create
    Then the Programs list shows "A"

  Scenario: Leading and trailing spaces in Program Name are trimmed on save
    Given I am on the program creation form
    When I fill in Program Name with "   Web Development 2026   "
    And I click Create
    Then the Programs list shows "Web Development 2026" without leading or trailing spaces

  Scenario: Special characters and Unicode persist correctly
    Given I am on the program creation form
    When I fill in Program Name with "Développement Web 2026 — \"Été\" & <Hiver> 日本語"
    And I fill in Description with "Symbols: &<>\"'/; Emoji: 🎓📚; Accents: àéîõü"
    And I click Create
    Then the Programs list shows the Program Name and Description with all characters intact

  Scenario: Program Name at maximum 100 characters saves correctly
    Given I am on the program creation form
    When I fill in Program Name with a string of exactly 100 characters ending in "MAX"
    And I fill in Description with "Max length name test"
    And I click Create
    Then the Programs list shows the full Program Name without truncation

  Scenario: Program Name exceeding 100 characters is rejected or blocked
    Given I am on the program creation form
    When I attempt to enter a Program Name of 101 characters
    Then input is blocked or validation prevents save with an error message

  Scenario: Description at maximum 500 characters saves correctly
    Given I am on the program creation form
    When I fill in Program Name with "Long Description Test"
    And I fill in Description with a string of exactly 500 characters
    And I click Create
    Then the program is created with the full Description text preserved

  Scenario: Description exceeding 500 characters is rejected or blocked
    Given I am on the program creation form
    When I fill in Program Name with "Overlong Description Test"
    And I attempt to enter a Description of 501 characters
    Then input is blocked or validation prevents save with an error message

#
# Ambiguities and gaps in DS-1 acceptance criteria
#
# 1. Description required or optional? Success AC fills Description but does not state it is mandatory.
#    Confluence Field Definitions mark Description as not required (max 500 characters).
# 2. Duplicate Program Name: DS-1 ACs do not mention uniqueness. Confluence specifies unique per organization.
# 3. Maximum lengths: not in DS-1 ACs. Confluence defines Program Name max 100 chars, Description max 500 chars.
# 4. Whitespace-only input: AC only covers empty field. Confluence Validation Rules say trimmed empty blocks submit.
# 5. Cancel/dismiss behavior (Esc, backdrop, X) is not defined in DS-1 ACs.
# 6. API/network failure handling is not specified in DS-1 ACs.
# 7. Double-submit prevention is not specified in DS-1 ACs (known bugs DS-79, SS-26).
# 8. Role access: AC says "logged in as admin". Confluence UI Behavior shows "+ New Program" for ADMIN and EDITOR only.
# 9. List ordering after create (top, bottom, alphabetical) is not specified.
# 10. Persistence after refresh is implied but not in the DS-1 ACs.
