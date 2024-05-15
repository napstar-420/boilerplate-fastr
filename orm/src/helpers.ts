import { sql } from 'drizzle-orm';
import type { AnyMySqlColumn } from 'drizzle-orm/mysql-core';
import { customAlphabet } from 'nanoid';

export function takeFirst<T>(items: T[]) {
  return items?.[0] ?? null;
}

export function takeFirstOrThrow<T>(items: T[]) {
  if (!items?.[0]) {
    throw new Error('Items cannot be empty');
  }

  return items[0];
}

export function count(field?: AnyMySqlColumn) {
  return sql<number>`count(${field ?? '*'})`.mapWith(it => Number(it));
}

export function sum<T extends number>(field: AnyMySqlColumn) {
  return sql<T>`sum(${field})`;
}

export const publicId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);
