@portfolio @education
Feature: Portfolio Education Section
  As a visitor
  I want to view the education section
  So that I can learn about Gulshan's academic background

  Background: Navigate to Education section
    When I navigate to the Education section

  Scenario: Education section is visible with correct heading
    Then the Education section should be visible
    And the Education section heading should be "Education"

  Scenario: Education section displays 3 academic entries
    Then the education section should display 3 cards

  Scenario: First institution is Lovely Professional University
    Then the first institution should be "Lovely Professional University"

  Scenario: All expected institutions are present
    Then all expected institution names should be present
