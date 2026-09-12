@portfolio @navigation @smoke
Feature: Portfolio Navigation
  As a visitor
  I want to use the navigation controls
  So that I can move between sections and toggle the theme

  Scenario: Sticky tab navigation is visible
    Then the sticky tab navigation should be visible

  Scenario: All expected section tabs are present
    Then the tab navigation should contain all expected tabs

  Scenario: Brand name appears correctly in the header
    Then the brand name "Gulshan Kumar" should appear in the header

  Scenario: Theme toggle button is visible
    Then the theme toggle button should be visible

  Scenario: Theme toggle changes the theme
    When I click the theme toggle button
    Then the theme toggle button should be visible

  Scenario: Clicking Experience tab navigates to Experience section
    When I click the "Experience" tab in the section navigation
    Then the Experience section should be visible

  Scenario: Clicking Skills tab navigates to Skills section
    When I click the "Skills" tab in the section navigation
    Then the Skills section should be visible

  Scenario: Clicking Projects tab navigates to Projects section
    When I click the "Projects" tab in the section navigation
    Then the Projects section should be visible

  Scenario: Clicking Innovations tab navigates to Innovations section
    When I click the "Innovations" tab in the section navigation
    Then the Innovations section should be visible

  Scenario: Clicking Education tab navigates to Education section
    When I click the "Education" tab in the section navigation
    Then the Education section should be visible

  Scenario: Clicking Contact tab navigates to Contact section
    When I click the "Contact" tab in the section navigation
    Then the Contact section should be visible
