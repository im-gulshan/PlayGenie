@saucedemo @login @smoke
Feature: SauceDemo Authentication
  As a user of SauceDemo
  I want to log in
  So that I can access my dashboard

  Scenario: Successful login with valid credentials
    Given I navigate to the SauceDemo login page
    When I log in with valid credentials
    Then the SauceDemo dashboard should be visible
