class HomePage {
    constructor(page) {
        this.page = page;

        // Locators strictly encapsulated within the Page Object
        this.dashboardHeading = page.getByText('Swag Labs');
    }
}

module.exports = { HomePage };