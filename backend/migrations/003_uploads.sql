CREATE TABLE IF NOT EXISTS uploads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mime       TEXT        NOT NULL,
  data       BYTEA       NOT NULL,
  size       INTEGER     NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);