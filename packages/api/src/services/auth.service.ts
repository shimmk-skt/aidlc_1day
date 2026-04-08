import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { refreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { UnauthorizedError, ConflictError, ValidationError } from '../utils/errors.js';
import type { AuthUser, TokenPair } from '../types/index.js';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const generateTokenPair = async (user: AuthUser): Promise<TokenPair> => {
  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtAccessExpiresIn });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await refreshTokenRepository.create(user.id, refreshToken, expiresAt);
  return { accessToken, refreshToken };
};

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError('Invalid credentials');
    const tokens = await generateTokenPair(user);
    return { ...tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },

  register: async (email: string, password: string, name: string) => {
    if (!PASSWORD_REGEX.test(password)) throw new ValidationError('Password must be at least 8 characters with letters and numbers');
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create(email, hashed, name);
    const tokens = await generateTokenPair(user);
    return { ...tokens, user };
  },

  refreshToken: async (token: string) => {
    const stored = await refreshTokenRepository.findValid(token);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    await refreshTokenRepository.revoke(token);
    const user = await userRepository.findById(stored.user_id);
    if (!user) throw new UnauthorizedError('User not found');
    return generateTokenPair(user);
  },

  logout: async (refreshToken: string) => {
    await refreshTokenRepository.revoke(refreshToken);
  },
};
