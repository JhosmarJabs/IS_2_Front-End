export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  phone?: string;
  sexo?: 'M' | 'F' | 'O';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface PrevalidateResponse {
  emailExists: boolean;
  isVerified: boolean;
  canLogin: boolean;
  availableLoginMethods: ('password' | 'otp' | 'magic_link')[];
}

export interface GoogleLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
  isNewUser: boolean;
  user: User;
}

export enum VerificationPurpose {
    EMAIL_VERIFICATION = "email_verification",
    OTP = "otp",
    MAGIC_LINK = "magic_link",
    PASSWORD_RESET = "password_reset"
}