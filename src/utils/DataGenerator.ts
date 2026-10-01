import { faker } from '@faker-js/faker';

export class DataGenerator {
  static randomEmail(): string {
    return `qa_${Date.now()}_${faker.internet.username()}@gmail.com`.toLowerCase();
  }

  static randomPassword(): string {
    return `Pass@${faker.number.int({ min: 1000, max: 9999 })}`;
  }

  static randomPhone(): string {
    return faker.helpers.arrayElement(['9', '8', '7']) + faker.string.numeric(9);
  }

  /** Deterministic invalid phone (too short) for negative tests. */
  static invalidPhone(): string {
    return '123';
  }

  static randomUser() {
    return {
      firstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      lastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      email: this.randomEmail(),
      password: this.randomPassword(),
      phoneNumber: this.randomPhone(),
      gender: 'Male' as const,
      dateOfBirth: '2001-10-04',
    };
  }

  /**
   * Reusable registration data builder for SHOPPER / ADMIN / MERCHANT.
   * Produces payloads matching the live Swagger schemas:
   *   - SHOPPER  → ShopperRequest  (POST /shopping/shoppers)  — phone is integer
   *   - ADMIN    → User            (POST /shopping/admin)     — phone is string, role='ADMIN'
   *   - MERCHANT → User-like       (POST /shopping/merchants)
   *
   * Pass overrides to customize any field for negative / edge-case tests.
   *
   * Usage:
   *   DataGenerator.buildRegistrationData('SHOPPER');
   *   DataGenerator.buildRegistrationData('ADMIN');
   *   DataGenerator.buildRegistrationData('SHOPPER', { email: 'x@y.com' });
   */
  static buildRegistrationData<T extends Record<string, any> = Record<string, any>>(
    role: 'SHOPPER' | 'ADMIN' | 'MERCHANT' = 'SHOPPER',
    overrides: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string | number;
      password: string;
      gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
      city: string;
      state: string;
      country: string;
      zoneId: string;
      dob: string;
    }> = {},
  ): T {
    const u = this.randomUser();
    const phoneStr = u.phoneNumber;

    const base = {
      firstName: overrides.firstName ?? u.firstName,
      lastName:  overrides.lastName  ?? u.lastName,
      email:     overrides.email     ?? u.email,
      password:  overrides.password  ?? u.password,
      gender:    overrides.gender    ?? 'MALE',
      city:      overrides.city      ?? 'Chennai',
      state:     overrides.state     ?? 'Tamil Nadu',
      country:   overrides.country   ?? 'India',
      zoneId:    overrides.zoneId    ?? 'ALPHA',
    };

    if (role === 'SHOPPER') {
      // ShopperRequest — phone is integer
      const phone = overrides.phone !== undefined
        ? Number(overrides.phone)
        : Number(phoneStr);
      return { ...base, phone } as unknown as T;
    }

    // ADMIN / MERCHANT — User schema (phone is string, role required)
    return {
      ...base,
      phone: overrides.phone !== undefined ? String(overrides.phone) : phoneStr,
      dob:   overrides.dob ?? u.dateOfBirth,
      role,
    } as unknown as T;
  }

  /** Returns the correct Endpoints.auth.* key for a given role. */
  static registrationEndpointKey(role: 'SHOPPER' | 'ADMIN' | 'MERCHANT'): 'register' | 'adminSignup' | 'merchantSignup' {
    if (role === 'ADMIN')    return 'adminSignup';
    if (role === 'MERCHANT') return 'merchantSignup';
    return 'register';
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
