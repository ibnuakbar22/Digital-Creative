-- Tabel project portfolio. Jalankan: npm run migrate
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  emoji       TEXT        NOT NULL DEFAULT '✨',
  cover_url   TEXT,
  year        SMALLINT,
  demo_url    TEXT,
  repo_url    TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  published   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS projects_order_idx ON projects (sort_order, created_at);
