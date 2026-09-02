/**
 * Centralized test data for the SauceDemo product.
 *
 * HOW TO USE:
 *   import { sauceDemoData } from '../data/saucedemo.data';
 *
 * HOW TO EXTEND:
 *   - Add a new section below (e.g., `productData`, `addressData`)
 *   - Keep related values grouped together under a descriptive key
 */

export const sauceDemoData = {

  // ─── Checkout Information ──────────────────────────────────────────────────
  checkout: {
    firstName: 'Gulshan',
    lastName: 'Kumar',
    zipCode: '112233',
  },

  // ─── Expected UI Messages ──────────────────────────────────────────────────
  messages: {
    orderConfirmation: 'Thank you for your order!',
    lockedOutError: 'Epic sadface: Sorry, this user has been locked out.',
  },

};
