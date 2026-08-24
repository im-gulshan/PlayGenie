const { LoginPage } = require('./LoginPage');
const { HomePage } = require('./HomePage');

class PageManager {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.homePage = new HomePage(this.page);
    // Add future pages here (e.g., this.inventoryPage = new InventoryPage(this.page);)
  }
}

module.exports = { PageManager };
