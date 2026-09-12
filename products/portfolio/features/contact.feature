@portfolio @contact
Feature: Portfolio Contact Section
  As a visitor
  I want to view and interact with the contact section
  So that I can connect with Gulshan through various channels

  Background: Navigate to Contact section
    When I navigate to the Contact section

  Scenario: Contact section is visible with availability badge
    Then the Contact section should be visible
    And the availability status badge should be visible

  Scenario: Contact section email card links to the correct email
    Then the email contact card should be visible
    And the email contact link should point to "gulshan.sdet@gmail.com"

  Scenario: Contact section LinkedIn card has a valid link
    Then the LinkedIn contact card should link to the correct profile

  Scenario: Contact section GitHub card has a valid link
    Then the GitHub contact card should link to the correct profile

  Scenario: Footer LinkedIn link is correct
    Then the footer LinkedIn link should be correct

  Scenario: Footer GitHub link is correct
    Then the footer GitHub link should be correct

  Scenario: Copyright text is present in the footer
    Then the copyright text should contain "Gulshan Kumar"

  Scenario: Scroll to top button is visible after navigating to contact
    Then the scroll to top button should be visible

  Scenario: Scroll to top button returns to hero section
    When I click the scroll to top button
    Then the hero section should be visible
