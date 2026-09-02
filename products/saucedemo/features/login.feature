@saucedemo @login @smoke
Feature: SauceDemo Authentication
  As a user of SauceDemo
  I want to log in
  So that I can access my dashboard

  Scenario Outline: Successful login with valid credentials
    Given I navigate to the SauceDemo login page
    When I log in as "<username>"
    Then the SauceDemo dashboard should be visible

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario Outline: Login with locked out user
    Given I navigate to the SauceDemo login page
    When I log in as "<username>"
    Then I should see a locked out error message

    Examples:
      | username        |
      | locked_out_user |
