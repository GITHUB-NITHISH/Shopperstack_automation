import { faker } from '@faker-js/faker';

export class DataGenerator {
  static randomEmail(): string {
    return `qa_${Date.now()}_${faker.internet.userName()}@mailinator.com`.toLowerCase();
  }

  static randomPassword(): string {
    return `Pass@${faker.number.int({ min: 1000, max: 9999 })}`;
  }

  static randomPhone(): string {
    return faker.string.numeric({ length: 10, exclude: ['0'] });
  }

  static randomUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: this.randomEmail(),
      password: this.randomPassword(),
      phoneNumber: this.randomPhone(),
      gender: 'MALE',
      dateOfBirth: '2001-10-04',
    };
  }

  static randomAddress() {
    return {
      fullName: faker.person.fullName(),
      phoneNumber: this.randomPhone(),
      pincode: faker.string.numeric(6),
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: 'Tamil Nadu',
      country: 'India',
      addressType: 'HOME' as const,
      isDefault: true,
    };
  }
}
