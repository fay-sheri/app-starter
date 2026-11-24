/**
CREATE TABLE user_profiles (
  user_id    BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(64) NOT NULL,
  role       VARCHAR(128),
  bio        TEXT,
  avatar     TEXT,
  location   VARCHAR(128),
  extras     JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE skills (
  id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE user_skills (
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id   BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, skill_id)
);
 */

// db/profile.ts
import { pool } from '../lib/db.js';
import type { PoolClient } from 'pg';
import type { ProfileWithSkills, UserProfile } from '../types/profile.js';

export async function findProfileByUserId(
  userId: string
): Promise<ProfileWithSkills | null> {
  const { rows } = await pool.query<ProfileWithSkills>(
    `SELECT
      p.user_id,
      p.name,
      p.role,
      p.bio,
      p.avatar,
      p.location,
      p.extras,
      p.updated_at,
      COALESCE(
        json_agg(s.name ORDER BY us.sort_order)
        FILTER (WHERE s.name IS NOT NULL),
        '[]'
      ) AS skills
    FROM user_profiles p
    LEFT JOIN user_skills us ON us.user_id = p.user_id
    LEFT JOIN skills s ON s.id = us.skill_id
    WHERE p.user_id = $1
    GROUP BY p.user_id`,
    [userId]
  );

  return rows[0] ?? null;
}

//测试使用
export async function initProfile(
  userId: string,
  name: string
): Promise<void> {
  await pool.query(
    `INSERT INTO user_profiles (user_id, name)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, name]
  );
}

export async function insertProfile(
  client: PoolClient,
  userId: string,
  name: string
): Promise<void> {
  await client.query(
    `INSERT INTO user_profiles (user_id, name)
     VALUES ($1, $2)`,
    [userId, name]
  );
}

export async function updateProfile(
  userId: string,
  data: Partial<Pick<UserProfile, 'name' | 'role' | 'bio' | 'avatar' | 'location' | 'extras'>>
): Promise<void> {
  await pool.query(
    `UPDATE user_profiles
     SET
       name = COALESCE($1, name),
       role = COALESCE($2, role),
       bio = COALESCE($3, bio),
       avatar = COALESCE($4, avatar),
       location = COALESCE($5, location),
       extras = COALESCE($6::jsonb, extras),
       updated_at = now()
     WHERE user_id = $7`,
    [
      data.name ?? null,
      data.role ?? null,
      data.bio ?? null,
      data.avatar ?? null,
      data.location ?? null,
      data.extras ? JSON.stringify(data.extras) : null,
      userId,
    ]
  );
}

export async function replaceUserSkills(
  userId: string,
  skillNames: string[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. 删除该用户所有技能
    await client.query(
      'DELETE FROM user_skills WHERE user_id = $1',
      [userId]
    );

    // 2. 逐个插入新技能（保持数组顺序）
    for (let i = 0; i < skillNames.length; i++) {
      await client.query(
        `INSERT INTO user_skills (user_id, skill_id, sort_order)
         SELECT $1, id, $2
         FROM skills
         WHERE name = $3
         ON CONFLICT (user_id, skill_id) DO NOTHING`, //CONFLICT (user_id, skill_id) DO NOTHING 不需要先查，幂等
        [userId, i, skillNames[i]]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function ensureSkillsExist(
  skillNames: string[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const name of skillNames) {  //CONFLICT (name) DO NOTHING 不需要先查，幂等
      await client.query(
        `INSERT INTO skills (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}