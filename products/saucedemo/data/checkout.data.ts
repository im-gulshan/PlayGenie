/**
 * Test data for checkout flows in SauceDemo.
 *
 * Centralized test data management avoids hardcoded strings in step definitions.
 * Add new personas or data variations as needed.
 */

export interface CheckoutUserData {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export const checkoutData: Record<string, CheckoutUserData> = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '12345',
  },
  emptyFirstName: {
    firstName: '',
    lastName: 'Doe',
    zipCode: '12345',
  },
  emptyLastName: {
    firstName: 'John',
    lastName: '',
    zipCode: '12345',
  },
  emptyZipCode: {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '',
  },
};
