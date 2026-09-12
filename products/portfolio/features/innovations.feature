@portfolio @innovations
Feature: Portfolio Innovations Section
  As a visitor
  I want to view the innovations section
  So that I can explore Gulshan's side projects and experiments

  Background: Navigate to Innovations section
    When I navigate to the Innovations section

  Scenario: Innovations section is visible with correct heading
    Then the Innovations section should be visible
    And the Innovations section heading should be "Innovations"

  Scenario: Innovations section shows at least 6 items
    Then the innovations section should show at least 6 items

  Scenario: All expected innovation titles are present
    Then all expected innovation titles should be present

  Scenario: AI Self-Healing Locator innovation is listed
    Then the innovation titles should include "AI-Based Self-Healing Locator"

  Scenario: Karate AI Agent innovation is listed
    Then the innovation titles should include "Karate AI Agent"

  Scenario: Expanding an innovation item reveals its description
    When I expand the first innovation item
    Then the first innovation item should be expanded
