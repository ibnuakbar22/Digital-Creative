CREATE TABLE IF NOT EXISTS certificates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  issuer         TEXT        NOT NULL DEFAULT '',
  image_url      TEXT        NOT NULL,
  year           SMALLINT,
  credential_url TEXT,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  published      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS certificates_order_idx ON certificates (sort_order, created_at);