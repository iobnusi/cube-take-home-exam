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

In addition to the primary key on `id`, two composite indexes have been added:

-   `idx_sales_platform_region_origin_is_mall` on `(platform, region, origin, is_mall)`
-   `idx_sales_l1_l2_l3_l4` on `(l1_category, l2_category, l3_category, l4_category)`

These indexes were chosen to match the app's most common filter patterns:

-   the platform/region/origin/is_mall index supports common dashboard, summary, top, trend, and record queries where those dimensions are filtered together
-   the category index supports the cascading L1-L4 category filters used throughout the UI and API

This keeps the current schema optimized around the main analytical dimensions without adding unnecessary index overhead.

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

Cursor IDE was used for the development of this application.
Using Claude Opus 4.6 as a research tool/planner and Claude Sonnet 4.6 as a code template builder

Used Claude Opus 4.6 for System Design planning and researching architecture decisions such as:

-   Researching appropriate seeder libraries
-   Researching Dockerfile and docker compose best practices
-   Researching database and migration CLI tools (pg, golang-migrate)
-   Researching appropriate backend tech stacks given the exam requirements (Express.js, tsoa, to use ORM's or not)

Used Claude Sonnet 4.6 via Cursor for setting up the backend structure, document generation, and the creation of vital front-end components such as:

-   Setup Express.js backend structure with Open API docs setup via tsoa
-   Setup Next.js application structure
-   Bar charts and Pie Charts used in the records and trends pages using the recharts.js library
-   Sales table UI using Tan stack Table for table data management
-   KPI cards used in the main page using basic HTML with TailwindCSS

Used Anthopics Claude skill "frontend-design" to give context to Claude Sonnet 4.6 to generate clean frontend UI
https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md

## What I Would Improve With More Time

The data given provides periods that date truncated by month, if daily dates are provided, we can:

-   Add composite index on `(platform, region, period)` if time-based filtering becomes the dominant access pattern
-   Expand filter and grouping by date capabilities, especially around date ranges and ranking controls.
-   Include time series/line graphs for more comprehensive trends page

Improve the seeder by:

-   Implementing more data cleaning logic such as duplicate-protection
-   Add unit/integration test using Jest for quality assurance

Improve the frontend by:

-   Add stronger error handling and clearer user-facing loading/error states
-   Use a component manage such as Storybook for better component development process
-   Use an icon library such FontAwesome to replace hard coded SVGs in components
-   Add unit tests for components and integration tests for pages using Jest for quality assurance

Impove the backend by:

-   Tighten typing further between backend DTOs and frontend consumers.
-   Add unit test for API routes/services or integration tests by creating a mock PostgreSQL container
-   Add search by product name or shop name if a reference to product and shop ids are given
-   Add indexes on `product_id` and `shop_id` to support top-list and record queries

Others:

-   Add local development instructions outside Docker for faster iteration
