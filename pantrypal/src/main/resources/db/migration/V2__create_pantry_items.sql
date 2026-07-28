CREATE TABLE pantry_items (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    quantity    NUMERIC(10, 2),
    unit        VARCHAR(50),
    category    VARCHAR(100),
    expires_at  DATE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX ix_pantry_items_user_id ON pantry_items (user_id);
