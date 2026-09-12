@portfolio @projects
Feature: Portfolio Projects Section
  As a visitor
  I want to view the projects section
  So that I can explore Gulshan's open-source work

  Background: Navigate to Projects section
    When I navigate to the Projects section

  Scenario: Projects section is visible with correct heading
    Then the Projects section should be visible
    And the Projects section heading should be "Projects"

  Scenario: Projects section shows at least one project card
    Then the projects section should display at least one project card

  Scenario: Each project card has a GitHub link
    Then each project card should have a GitHub link

  Scenario: First project GitHub link is valid
    Then the first project should have a GitHub link pointing to github.com
