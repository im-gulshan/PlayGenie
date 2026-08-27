import { When } from '@cucumber/cucumber';

When('User adds the first product to the cart', async function () {
  await this.pages.productsPage.selectFirstProduct();
});

When('User proceeds to checkout', async function () {
  await this.pages.productsPage.openCart();
  await this.pages.cartPage.clickOnCheckout();
});
