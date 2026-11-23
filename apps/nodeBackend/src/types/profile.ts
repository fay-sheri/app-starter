export interface UserProfile {
  user_id: string; // bigint 在 JS 里用 string 更安全
  name: string;
  role: string | null;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  extras: Record<string, unknown>;
  updated_at: Date;
}

export interface ProfileWithSkills extends UserProfile {
  skills: string[];
}

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