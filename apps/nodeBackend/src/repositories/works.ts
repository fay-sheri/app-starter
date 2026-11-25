/**
CREATE TABLE works (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  cover VARCHAR(500) NOT NULL,
  author VARCHAR(100) NOT NULL,  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_works_cursor ON works(created_at DESC, id DESC);
 */
import { pool } from "../lib/db.js"

export interface Work {
  id: string;
  title: string;
  cover: string;
  author: string;
  created_at: string;
}

export interface WorksPage {
  list: Work[];
  nextCursor: string | null;
}

export function decodeCursor(cursor: string) {
  const decoded = Buffer.from(cursor, "base64").toString();
  const [createdAt, id] = decoded.split("_");
  return { createdAt, id };
}

export function encodeCursor(createdAt: string, id: string) {
  return Buffer.from(`${createdAt}_${id}`).toString("base64");
}

async function findWorks(limit: number, cursor?: string): Promise<WorksPage> {
    const queryLimit = limit + 1;
    let query = `
      SELECT id, title, cover, author, created_at
      FROM works
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      query += ` WHERE (created_at, id) < ($${paramIndex}, $${paramIndex + 1})`;
      params.push(createdAt, id);
      paramIndex += 2;
    }

    query += ` ORDER BY created_at DESC, id DESC LIMIT $${paramIndex}`;
    params.push(queryLimit);

    const result = await pool.query<Work>(query, params);
    const rows = result.rows;

    const hasMore = rows.length > limit;
    const list = rows.slice(0, limit);
    const nextCursor = hasMore
      ? encodeCursor(String(list[list.length - 1].created_at), list[list.length - 1].id)
      : null;

    return { list, nextCursor };
  }