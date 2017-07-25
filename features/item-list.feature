Feature: Item List

Background:
Given I am on the item list page

@ac1
Scenario: Adding an item
When I add a new item with an ID of "12" called "test" with "5" inventory and a description of "My description"

Then I should see that the item list contains an item with ID "12"
And I should see that the item with an ID of "12" is named "test"
And I should see that the item with an ID of "12" has "5" inventory
@ac2
#Normally we shouldn't rely on any data not created during a test - but for the sake of brevity, we'll do just that.
Scenario: Updating an item
When I click the Edit button next to the item with ID "12"
And I enter a description of "Test Description"
And I click the Save button next to the item with ID "12"

Then I should see that the item with an ID of "12" has a description of "Test Description"

@ac3
Scenario: Updating inventory
When I click the Plus button next to the item with ID "12"

Then I should see that the item with an ID of "12" has "6" inventory

@ac4
Scenario: Updating inventory
When I click the Minus button next to the item with ID "12"

Then I should see that the item with an ID of "12" has "5" inventory

@ac5
Scenario: Viewing an item
When I click the View button next to the item with ID "12"

Then I should see that I am viewing the details page for the item with an ID of "12"

@ac6
Scenario: Deleting an item
When I click the Delete button next to the item with an ID "12"

Then I should see that the item list does not contain an item called "test"

