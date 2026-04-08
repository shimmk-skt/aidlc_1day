import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import type { AuthUser } from '../types/index.js';

let io: Server | null = null;

export const initSocketIO = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: env.corsOrigin, credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const user = jwt.verify(token as string, env.jwtSecret) as AuthUser;
      (socket as any).user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as AuthUser;
    logger.info({ userId: user.id, role: user.role }, 'WebSocket connected');

    // Join role-based rooms
    socket.join(`user:${user.id}`);
    if (['admin', 'operations_manager', 'inventory_manager', 'finance_manager'].includes(user.role)) {
      socket.join('admin');
    }

    socket.on('disconnect', () => {
      logger.debug({ userId: user.id }, 'WebSocket disconnected');
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

export const getIO = () => io;

export const broadcast = {
  inventoryUpdate: (productId: number, stock: number, reservedQty: number) => {
    io?.to('admin').emit('inventory_update', { productId, stock, reservedQty });
  },
  orderUpdate: (orderId: number, status: string, userId: number) => {
    io?.to('admin').emit('order_update', { orderId, status });
    io?.to(`user:${userId}`).emit('order_update', { orderId, status });
  },
  newOrder: (orderId: number, total: number, customerName: string) => {
    io?.to('admin').emit('new_order', { orderId, total, customerName });
  },
  alert: (userId: number, type: string, message: string) => {
    io?.to(`user:${userId}`).emit('alert', { type, message });
  },
};
