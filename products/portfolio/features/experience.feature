@portfolio @experience
Feature: Portfolio Experience Section
  As a visitor
  I want to view the experience section
  So that I can see Gulshan's work history

  Background: Navigate to Experience section
    When I click the "Experience" tab in the section navigation

  Scenario: Experience section is visible with correct heading
    Then the Experience section should be visible
    And the Experience section heading should be "Experience"

  Scenario: Experience section shows the correct number of companies
    Then the Experience section should show 3 company cards

  Scenario: Experience section shows correct company names
    Then all company names from the expected list should be present

  Scenario: First company is S&P Global
    Then the first company should be "S&P Global"

  Scenario: Second company is Tata Consultancy Services
    Then the second company should be "Tata Consultancy Services"

  Scenario: Third company is Amazon
    Then the third company should be "Amazon"

  Scenario: Clicking a collapsed experience card expands it
    When I click on the second experience card
    Then the second experience card should be expanded
