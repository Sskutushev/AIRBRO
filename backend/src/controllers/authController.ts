import { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { UserRegistration, UserLogin } from '../models/user';
import { generateToken } from '../config/jwt';
import prisma from '../config/database';
// import { sendTelegramNotification } from '../config/telegram';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, telegram }: UserRegistration = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { telegram }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email or telegram already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        telegram,
      },
      select: {
        id: true,
        email: true,
        name: true,
        telegram: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    // Send Telegram notification about new registration
    // try {
    //   await sendTelegramNotification(
    //     `🆕 New user\n\n` +
    //     `👤 Name: ${user.name}\n` +
    //     `📧 Email: ${user.email}\n` +
    //     `💬 Telegram: ${user.telegram}\n` +
    //     `📅 Date: ${user.createdAt}`
    //   );
    // } catch (notificationError) {
    //   console.error('Failed to send Telegram notification:', notificationError);
    // }

    return res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserLogin = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        telegram: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    // Return user data without password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        telegram: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
