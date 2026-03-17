# Feature Specification

Marketplace analytics dashboard for oral care product sales data (Jan–Mar 2025, daily granularity).

## Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js    |
| Backend  | Express.js |
| Database | PostgreSQL |

## Data Source

Single `sales` table with daily marketplace records.

### Schema

| Column             | Type           | Nullable | Notes                          |
| ------------------ | -------------- | -------- | ------------------------------ |
| id                 | SERIAL PK      | no       | Auto-increment                 |
| period             | DATE           | no       | Daily granularity, Jan–Mar 2025 |
| region             | TEXT           | no       |                                |
| platform           | TEXT           | no       |                                |
| shop_id            | TEXT           | no       |                                |
| product_id         | TEXT           | no       |                                |
| is_mall            | BOOLEAN        | yes      | true = Mall shop               |
| l1_category        | TEXT           | yes      | Top-level category             |
| l2_category        | TEXT           | yes      |                                |
| l3_category        | TEXT           | yes      |                                |
| l4_category        | TEXT           | yes      | Most granular category         |
| sku_id             | TEXT           | yes      |                                |
| origin             | TEXT           | yes      |                                |
| nmv                | NUMERIC(14,2)  | yes      | Net Merchandise Value          |
| units_sold         | INTEGER        | yes      |                                |
| avg_price_per_unit | NUMERIC(14,2)  | yes      |                                |
| created_at         | TIMESTAMPTZ    | no       | Row insertion timestamp        |

### Key Measures

| Measure            | Derivation                                |
| ------------------ | ----------------------------------------- |
| Total NMV          | `SUM(nmv)`                                |
| Total Units Sold   | `SUM(units_sold)`                         |
| Avg Price Per Unit | `SUM(nmv) / NULLIF(SUM(units_sold), 0)`  |
| Unique Products    | `COUNT(DISTINCT product_id)`              |
| Unique Shops       | `COUNT(DISTINCT shop_id)`                 |

### Dimensions

| Dimension   | Column(s)                              |
| ----------- | -------------------------------------- |
| Date        | `period`                               |
| Region      | `region`                               |
| Platform    | `platform`                             |
| Category    | `l1_category` / `l2` / `l3` / `l4`    |
| Mall Status | `is_mall`                              |
| Origin      | `origin`                               |
| Shop        | `shop_id`                              |
| Product     | `product_id`                           |
| SKU         | `sku_id`                               |

---

## Pages

### 1. Home — KPI Summary Cards

Display headline metric cards. Each card shows the aggregate value and supports grouping by one or more dimensions.

| Card               | Metric                                   | Groupable By                        |
| ------------------ | ---------------------------------------- | ----------------------------------- |
| Total NMV          | `SUM(nmv)`                               | date, platform, category, region    |
| Total Units Sold   | `SUM(units_sold)`                        | date, platform, category, region    |
| Avg Price Per Unit | `SUM(nmv) / NULLIF(SUM(units_sold), 0)` | category, region, platform          |
| Unique Products    | `COUNT(DISTINCT product_id)`             | category, region, platform          |
| Unique Shops       | `COUNT(DISTINCT shop_id)`                | region, platform, mall status       |

When a grouping dimension is selected, the card expands into a breakdown (e.g., a small table or mini bar chart beneath the headline number).

---

### 2. Trends — Time Series Graphs

Line or area charts showing metrics over time. The user can toggle between **daily**, **weekly**, and **monthly** aggregation.

| Chart                  | Y-Axis                                    | Filterable By                |
| ---------------------- | ----------------------------------------- | ---------------------------- |
| NMV Over Time          | `SUM(nmv)`                                | platform, region, category   |
| Units Sold Over Time   | `SUM(units_sold)`                         | platform, region, category   |
| Avg Price Over Time    | `SUM(nmv) / NULLIF(SUM(units_sold), 0)`  | platform, region, category   |

**Time aggregation** (applies to all charts on this page):

| Granularity | SQL                              | Expected Points |
| ----------- | -------------------------------- | --------------- |
| Daily       | `GROUP BY period`                | ~90             |
| Weekly      | `GROUP BY DATE_TRUNC('week', period)`  | ~13       |
| Monthly     | `GROUP BY DATE_TRUNC('month', period)` | 3          |

When a filter dimension is applied, the chart shows one series per distinct value within that dimension.

---

### 3. Top Products & Shops — Rankings

Ranked lists (tables or horizontal bar charts) showing the top 10 entries.

#### Top 10 Products

| Ranking Metric   | Derivation        |
| ---------------- | ----------------- |
| By Total NMV     | `SUM(nmv)`        |
| By Total Units   | `SUM(units_sold)` |

Groupable / filterable by: **category, platform, region, date range**.

#### Top 10 Shops

| Ranking Metric       | Derivation                     |
| -------------------- | ------------------------------ |
| By Total NMV         | `SUM(nmv)`                     |
| By Total Units       | `SUM(units_sold)`              |
| By Unique Products   | `COUNT(DISTINCT product_id)`   |

Groupable / filterable by: **category, platform, region, date range**.

---

### 4. Records — Filtered Record Table

Paginated table listing individual `sales` rows.

#### Displayed Columns

`period`, `region`, `platform`, `shop_id`, `product_id`, `sku_id`, `l1_category`, `l2_category`, `l3_category`, `l4_category`, `is_mall`, `origin`, `nmv`, `units_sold`, `avg_price_per_unit`

#### Filters

| Filter          | UI Control              | Column(s)                            |
| --------------- | ----------------------- | ------------------------------------ |
| Period          | Date range picker       | `period`                             |
| Region          | Multi-select dropdown   | `region`                             |
| Platform        | Multi-select dropdown   | `platform`                           |
| Category L1–L4  | Multi-select dropdown   | `l1_category` … `l4_category`       |
| Mall Status     | Checkbox                | `is_mall`                            |

#### Sortable Columns

| Column             | Sort Options           |
| ------------------ | ---------------------- |
| period             | latest / earliest      |
| region             | alphanumeric asc/desc  |
| platform           | alphanumeric asc/desc  |
| nmv                | numeric asc/desc       |
| units_sold         | numeric asc/desc       |
| avg_price_per_unit | numeric asc/desc       |

---

## API Design Notes

Each page maps roughly to one or more backend endpoints. Suggested REST structure:

| Endpoint                    | Purpose                                  | Page     |
| --------------------------- | ---------------------------------------- | -------- |
| `GET /api/summary`          | KPI card aggregates with optional groupBy | Home     |
| `GET /api/trends`           | Time-series data with granularity param   | Trends   |
| `GET /api/top/products`     | Top 10 products with ranking metric param | Rankings |
| `GET /api/top/shops`        | Top 10 shops with ranking metric param    | Rankings |
| `GET /api/records`          | Paginated, filtered, sorted row listing   | Records  |
| `GET /api/filters`          | Distinct values for filter dropdowns      | All      |

Common query parameters across endpoints: `region`, `platform`, `l1_category`, `l2_category`, `l3_category`, `l4_category`, `is_mall`, `start_date`, `end_date`.
