import { Request } from 'express';
import { dbStore } from '../db.ts';
import { User } from '../types.ts';

/**
 * Resolves the authenticated user from the Authorization Bearer header.
 * In production, this verifies the JWT session; in this setup, it correlates
 * with the active session user record.
 */
export function getAuthUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return dbStore.users.find((u) => u.id === token) || null;
}
