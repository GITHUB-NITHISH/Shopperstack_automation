export type UserRole = 'SHOPPER' | 'MERCHANT' | 'ADMIN';
export interface LoginRequest { email: string; password: string; role: UserRole; }
export interface RegisterRequest {
  firstName: string; lastName: string; email: string; password: string;
  confirmPassword: string; phoneNumber: string; gender?: string; dateOfBirth?: string;
}
export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { email: string; otp: string; newPassword: string; }
