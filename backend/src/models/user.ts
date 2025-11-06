// User model types based on Prisma schema
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  telegram: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  telegram: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfileUpdate {
  name?: string;
  telegram?: string;
}