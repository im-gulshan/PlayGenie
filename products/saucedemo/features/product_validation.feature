@saucedemo @purchase
Feature: SauceDemo Place Order
    As a user of SauceDemo
    I want to Place The orders

    Background: Login into the application
        Given I navigate to the SauceDemo login page
        When I log in with valid credentials
        Then the SauceDemo dashboard should be visible

    Scenario: Place a successful order
        When User adds the first product to the cart
        And User proceeds to checkout
# And User fills in the checkout information
# Then User should see the product name and price on the overview page
# And User completes the order
# Then User should see the order confirmation message
