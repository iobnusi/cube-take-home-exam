CREATE INDEX IF NOT EXISTS idx_sales_platform_region_origin_is_mall
ON sales (platform, region, origin, is_mall);

CREATE INDEX IF NOT EXISTS idx_sales_l1_l2_l3_l4
ON sales (l1_category, l2_category, l3_category, l4_category);