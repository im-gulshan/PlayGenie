import { expect } from '@playwright/test';
import { When, Then } from '../support/steps';
import { sauceDemoData } from '../data';

When('User adds the first product to the cart', async function () {
  this.logger.info('Adding the first product to the cart...');
  this.sharedData.firstProdName = await this.pages.productsPage.selectFirstProduct();
  this.logger.info('First product successfully added to the cart.');
  this.logger.info('Extracted first product name : ' + this.sharedData.firstProdName);
});

When('User proceeds to checkout', async function () {
  this.logger.info('Navigating to the shopping cart page...');
  await this.pages.productsPage.openCart();

  await this.pages.cartPage.clickOnCheckout();
  this.logger.info('Successfully proceeded to the checkout information page.');
});

When('User add details in the checkout information page and click on Continue', async function () {
  const { firstName: fName, lastName: lName, zipCode: zCode } = sauceDemoData.checkout;

  await this.pages.checkoutInfoPage.addCheckoutInfo(fName, lName, zCode);
  this.logger.info(
    'Added checkout details First Name as :' +
      fName +
      ', Last Name as : ' +
      lName +
      ', Zip Code as : ' +
      zCode,
  );

  await this.pages.checkoutInfoPage.clickContinue();
  this.logger.info('Clicked on Continue');
});

Then('User should see the product name and price on the overview page', async function () {
  const expectedProductName = this.sharedData.firstProdName;
  this.logger.info(
    'Validating that the overview page shows the correct product: ' + expectedProductName,
  );

  const product: string[] = await this.pages.checkoutOverviewPage.getAllProductNames();
  this.logger.info('Product name which we extracted from UI : ' + product[0]);

  expect(product[0]).toBe(expectedProductName);
  this.logger.info(
    'Products on checkout overview page - ' +
      product[0] +
      ' | Products added in cart - ' +
      expectedProductName,
  );
});

When('User completes the order', async function () {
  await this.pages.checkoutOverviewPage.clickFinish();
  this.logger.info('User clicked on Finish button to complete the order');
});

Then('User should see the order confirmation message', async function () {
  const expectedSuccessOrderMsg = sauceDemoData.messages.orderConfirmation;

  const actualSuccessOrderMsg: string =
    await this.pages.checkoutCompletePage.getConfirmationHeader();
  expect(actualSuccessOrderMsg).toBe(expectedSuccessOrderMsg);
  this.logger.info(
    'Matched expected :' +
      expectedSuccessOrderMsg +
      ', and actual Success order msg :' +
      actualSuccessOrderMsg,
  );
});

When('User add {int} product in cart', async function (n: number) {
  this.logger.info(`Starting to add ${n} product(s) to the cart...`);
  this.sharedData.allProductsName = await this.pages.productsPage.selectMultipleProduct(n);
  this.logger.info(`${n} product(s) successfully added to the cart.`);
  this.logger.info(
    `Extracted ${this.sharedData.allProductsName.length} product name(s) : ` +
      JSON.stringify(this.sharedData.allProductsName),
  );
});

Then('User should see the multiple product name and price on the overview page', async function () {
  const expectedProductName = this.sharedData.allProductsName;
  this.logger.info(
    'Validating that the overview page shows the correct product: ' +
      JSON.stringify(expectedProductName),
  );

  const product: string[] = await this.pages.checkoutOverviewPage.getAllProductNames();
  this.logger.info('Product name which we extracted from UI : ' + JSON.stringify(product));

  expect(product).toEqual(expectedProductName);
  this.logger.info(
    'Products on checkout overview page - ' +
      JSON.stringify(product) +
      ' | Products added in cart - ' +
      JSON.stringify(expectedProductName),
  );
});
