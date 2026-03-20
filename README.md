# cube-take-home-exam

Take-home exam for Full-stack Developer positions at Cube Asia.

## Stack

| Layer       | Technology                                                   |
| ----------- | ------------------------------------------------------------ |
| Frontend    | Next.js 16, React 19, Tailwind CSS, Recharts, TanStack Table |
| Backend     | Express.js, TypeScript, tsoa, pg                             |
| Database    | PostgreSQL 16                                                |
| Data import | Node.js seeder with `node-xlsx`                              |

## Project Docs

-   [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
-   [BACKEND.md](./docs/BACKEND.md)
-   [FRONTEND.md](./docs/FRONTEND.md)
-   [SEEDER.md](./docs/SEEDER.md)
-   [FEATURES.md](./docs/FEATURES.md)

## How To Run

The full app is designed to run through Docker Compose:

```bash
docker compose up --build
```

This starts the services in sequence:

1. `db` starts PostgreSQL and waits until it is healthy.
2. `migrate` creates the schema from the SQL migration files.
3. `seeder` reads all `.xlsx` files from `seeder/data/` and inserts rows into `sales`.
4. `backend` starts on port `4000`.
5. `frontend` starts on port `3000`.

App URLs:

-   Frontend: `http://localhost:3000`
-   Backend: `http://localhost:4000`
-   Swagger docs: `http://localhost:4000/docs`

To rerun only the seeder after adding data files:

```bash
docker compose up --build seeder
```

## Assumptions And Data Cleaning Decisions

The seeder makes a few normalization decisions so Excel data can be inserted consistently:

-   Empty values such as `undefined`, `""`, and `"-"` are converted to `null`.
-   Excel serial dates in `period` are converted into JavaScript dates before insertion.
-   `is_mall` is mapped from `"Mall"` to `true`; anything else becomes `null`.
-   `nmv`, `units_sold`, and `avg_price_per_unit` default to `0` when the source value is not numeric.
-   `sku_id` is only kept when it is a string; otherwise it becomes `null`.
-   Rows missing required fields are skipped. The required fields are `region`, `platform`, `period`, `product_id`, and `shop_id`.

These choices favor keeping the import resilient while preserving uncertainty explicitly as `null` where possible.

## Schema Design Choices

The app uses a single `sales` table because the data shape is already reporting-oriented and the main use cases are filtering, grouping, ranking, and time-series aggregation.

Notable choices:

-   `period` is stored as `DATE` because the source data is monthly and trends group by month.
-   `region`, `platform`, `shop_id`, and `product_id` are required because they are core analytical dimensions.
-   category levels, `origin`, `sku_id`, and `is_mall` are nullable because some source rows may not contain them.
-   `nmv` and `avg_price_per_unit` use numeric types to avoid floating-point precision issues.
-   `created_at` is stored for ingestion traceability.

This schema keeps the backend simple and works well for the current scope, where most queries read from one fact-like table.

## Indexes Added And Why

No explicit indexes beyond the primary key on `id` have been added yet.

That was an intentional tradeoff for this take-home scope:

-   the dataset is small enough to work without premature optimization
-   the query patterns were easier to validate first before committing to index strategy

With more time, I would likely add:

-   an index on `period` for date filtering and trend queries
-   a composite index on `(platform, region, period)` for common dashboard filters
-   indexes on `product_id` and `shop_id` to support top-list and record queries
-   possibly category-focused indexes depending on real query frequency

## API Overview

The backend exposes reporting-oriented REST endpoints:

-   `GET /health`: container healthcheck
-   `GET /`: basic API and DB connectivity check
-   `GET /records`: paginated raw sales records with filters and sorting
-   `GET /summary/nmv`
-   `GET /summary/units_sold`
-   `GET /summary/avg_price`
-   `GET /summary/products`
-   `GET /summary/shops`
-   `GET /trends`: monthly aggregated metrics, optionally grouped by platform or region
-   `GET /top/products`: top 10 products ranked by NMV or units sold
-   `GET /top/shops`: top 10 shops ranked by NMV, units sold, or product count
-   `GET /filters/regions`
-   `GET /filters/platforms`
-   `GET /filters/l1_categories`
-   `GET /filters/l2_categories`
-   `GET /filters/l3_categories`
-   `GET /filters/l4_categories`

The route layer is implemented with `tsoa`, which generates Express route bindings and OpenAPI docs from typed controllers.

## Server Components Vs Client Components

The frontend uses a hybrid Next.js App Router setup.

Server Components are used for page-level composition and data fetching:

-   `src/app/page.tsx`
-   `src/app/trends/page.tsx`
-   `src/app/records/page.tsx`

Why:

-   they can read `searchParams` directly
-   they fetch backend data before rendering
-   they reduce client-side data-fetching boilerplate for the initial page load

Client Components are used for interactivity and browser-driven UI:

-   `FilterBar`
-   `SalesTable`
-   `TrendChart`
-   `Sidebar`
-   KPI card and top-chart display components

Why:

-   they manage query-string updates
-   they respond to clicks, sorting, pagination, and grouped chart toggles
-   charting and table libraries are naturally interactive client-side concerns

In short, the app keeps data loading close to the route and interactivity close to the UI widgets.

## AI Usage Notes

AI was used as an implementation aid, not as an unreviewed source of truth.

Typical uses:

-   drafting or refining documentation
-   speeding up repetitive UI and API wiring
-   helping reason through query and component structure

All generated code and docs were reviewed against the repository itself, and behavior-specific descriptions in this README are based on the checked-in code.

## What I Would Improve With More Time

-   Add targeted database indexes after measuring real query plans.
-   Add tests for the seeder, backend services, and key frontend flows.
-   Add stronger error handling and clearer user-facing loading/error states.
-   Add idempotency or duplicate-protection to the seeder.
-   Expand filter capabilities, especially around date ranges and ranking controls.
-   Tighten typing further between backend DTOs and frontend consumers.
-   Add local development instructions outside Docker for faster iteration.
