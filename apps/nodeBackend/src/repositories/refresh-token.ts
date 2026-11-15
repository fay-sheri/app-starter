import { pool } from "../lib/db.js";
import crypto from "crypto";

//hash工具函数
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/*
CREATE TABLE refresh_tokens (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked     BOOLEAN NOT NULL DEFAULT FALSE
);
*/

export interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date; //PG库自动把TIMESTAMPTZ转成JS的Date对象
  created_at: Date;
  revoked: boolean;
}

export async function saveRefreshToken(
  userId: number,
  refreshToken: string,
): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [userId, tokenHash],
  );
}

export async function consumeRefreshToken(
  refreshToken: string,
): Promise<{ user_id: number } | null> {
  const tokenHash = hashToken(refreshToken);
  const client = await pool.connect(); //获取连接，记得释放
  await client.query("BEGIN"); //开启事务BEGIN,ROLLBACK,ROLLBACK
  try {
    const result = await client.query<RefreshTokenRow>(
      `SELECT id, user_id FROM refresh_tokens
       WHERE token_hash = $1
        AND revoked = FALSE
        AND expires_at > NOW()
        FOR UPDATE`, //FOR UPDATE行锁
      [tokenHash],
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }
    const row = result.rows[0];
    await client.query(
      `UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1`,
      [row.id],
    );
    await client.query("COMMIT");
    return { user_id: row.user_id };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return null;
  } finally {
    client.release(); //释放
  }
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await pool.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`,
    [tokenHash],
  );
}

export async function cleanupExpiredTokens(): Promise<number> {
  const result = await pool.query(`DELETE FROM refresh_tokens WHERE expires_at < NOW()`);
  return result.rowCount ?? 0;
}
