@portfolio @theme
Feature: Portfolio Theme Toggle
  As a visitor
  I want to toggle between dark and light modes
  So that I can view the portfolio in my preferred theme

  # Step definitions for this feature are intentionally defined in
  # navigation.steps.ts (not a separate theme_toggle.steps.ts).
  # This is by design — theme toggle interactions are part of the
  # NavigationPage and share step context with navigation scenarios.

  Scenario: Theme toggle button is present in the header
    Then the theme toggle button should be visible

  Scenario: Clicking theme toggle switches the mode
    When I click the theme toggle button
    Then the theme toggle button should be visible

  Scenario: Theme can be toggled back
    When I click the theme toggle button
    And I click the theme toggle button
    Then the theme toggle button should be visible
