@portfolio @hero @smoke
Feature: Portfolio Hero Section
  As a visitor of the portfolio
  I want to see the hero section content
  So that I can get a quick overview of Gulshan's profile

  Scenario: Hero section is visible with correct name
    Then the hero section should be visible
    And the name "Gulshan Kumar" should be displayed
    And the profile image should be visible

  Scenario: Hero section displays correct stats
    Then the stats should show "7+" years of experience
    And the stats should show "4" domains
    And the stats should show "6+" innovations

  Scenario: Hero section email link is correct
    Then the email link should point to "gulshan.sdet@gmail.com"

  Scenario: Hero section LinkedIn link is present
    Then the LinkedIn link should be visible in the hero section

  Scenario: Page title is correct
    Then the page title should be "Gulshan Kumar | SDET Portfolio"
