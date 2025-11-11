import request from 'supertest';
import app from '../../src/server'; // Assuming app is exported from server.ts
import prisma from '../../src/config/database'; // Mocked Prisma client
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock bcrypt and jsonwebtoken
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        telegram: '@testuser',
        createdAt: new Date(),
      });
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        telegram: '@testuser',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token', 'mockedToken');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashedPassword',
          name: 'Test User',
          telegram: '@testuser',
        },
        select: {
          id: true,
          email: true,
          name: true,
          telegram: true,
          createdAt: true,
        },
      });
    });

    it('should return 409 if user with email or telegram already exists', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existingUser' }); // User already exists

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        telegram: '@testuser',
      });

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error', 'User with this email or telegram already exists');
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        telegram: '@testuser',
        passwordHash: 'hashedPassword',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Passwords match
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).not.toHaveProperty('passwordHash');
      expect(res.body).toHaveProperty('token', 'mockedToken');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          id: true,
          email: true,
          name: true,
          telegram: true,
          passwordHash: true,
        },
      });
    });

    it('should return 401 for invalid credentials (user not found)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // User not found

      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for invalid credentials (incorrect password)', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        telegram: '@testuser',
        passwordHash: 'hashedPassword',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Passwords do not match

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});
