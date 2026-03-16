CREATE TABLE IF NOT EXISTS sales (
  id                  SERIAL PRIMARY KEY,
  period              DATE            NOT NULL,
  region              TEXT            NOT NULL,
  platform            TEXT            NOT NULL,
  shop_id             TEXT            NOT NULL,
  product_id          TEXT            NOT NULL,
  is_mall             BOOLEAN,
  l1_category         TEXT,
  l2_category         TEXT,
  l3_category         TEXT,
  l4_category         TEXT,
  sku_id              TEXT,
  origin              TEXT,
  nmv                 NUMERIC(14, 2),
  units_sold          INTEGER,
  avg_price_per_unit  NUMERIC(14, 2),
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);