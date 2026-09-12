@portfolio @skills
Feature: Portfolio Skills Section
  As a visitor
  I want to view the skills section
  So that I can explore the technologies Gulshan works with

  Background: Navigate to Skills section
    When I navigate to the Skills section

  Scenario: Skills section is visible with correct heading
    Then the Skills section should be visible
    And the Skills section heading should be "Skills"

  Scenario: Skills section has all expected category tabs
    Then the skills category tabs should contain all expected categories

  Scenario: Skills section has 5 category tabs
    Then there should be 5 skill category tabs

  Scenario: Default category shows skill tags
    Then the skill tags should be displayed

  Scenario Outline: Clicking a skill category shows relevant tags
    When I click the "<category>" skills category
    Then the skill tags should be displayed

    Examples:
      | category              |
      | Programming Languages |
      | Automation Testing    |
      | Performance Testing   |
      | Manual Testing        |
      | API Testing           |

  Scenario: Programming Languages category includes Java
    When I click the "Programming Languages" skills category
    Then the skill tags should include "Java"

  Scenario: Automation Testing category includes Playwright
    When I click the "Automation Testing" skills category
    Then the skill tags should include "Playwright"
