import { pool } from "../lib/db.js";

/**
CREATE TABLE users (
    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
 */
export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date; //PG库自动把TIMESTAMPTZ转成JS的Date对象
}

//Omit排除对象字段类型
export async function createUser(
  username: string,
  passwordHash: string,
): Promise<Omit<User, "password_hash">> {
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, passwordHash],
  );
  return rows[0];
}

export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0] || null; //rows[0]可能是undefined
}

export async function findUserById(
  id: number,
): Promise<Omit<User, "password_hash"> | null> {
  const { rows } = await pool.query(
    "SELECT id, username, created_at FROM users WHERE id = $1",
    [id],
  );
  return rows[0] || null;
}

async function updatePasswordHash(
  userId: number,
  newPasswordHash: string,
): Promise<boolean> {
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [newPasswordHash, userId],
  );
  return (rowCount ?? 0) > 0; //rowCount可能是null
}

async function deleteUser(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
    id,
  ]);
  return (rowCount ?? 0) > 0;
}
