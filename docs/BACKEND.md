# Backend

## Structure

The backend is a TypeScript Express app with `tsoa` handling route generation and OpenAPI output.

- `src/controllers/`: request-facing controllers that define routes and accepted query params
- `src/services/`: business logic and SQL orchestration
- `src/models/`: shared request/response and domain types
- `src/db/`: PostgreSQL connection setup plus reusable SQL helpers
- `src/ioc.ts`: wires controllers to service instances for `tsoa`

The main app setup lives in `src/app.ts`, where Express enables CORS, JSON parsing, generated `tsoa` routes, Swagger docs at `/docs`, a `/health` endpoint, and a fallback 404 handler.

## Tech Choices

- `Express.js` keeps the HTTP layer minimal and familiar.
- `tsoa` is used to declare controllers with decorators, generate route bindings, and produce an OpenAPI spec automatically.
- `pg` is used directly instead of a full ORM, which fits this app well because most backend behavior is filterable reporting and aggregation over one main table.

## Controller Responsibilities

### `RootController`

- `GET /`
- Simple connectivity check that runs `SELECT 1` and returns a hello payload plus DB confirmation.

### `RecordController`

- `GET /records`
- Returns paginated raw sales records.
- Accepts filters like platform, region, mall status, origin, category levels, date range, sorting, page, and limit.
- Enforces safe pagination bounds before calling `RecordService`.

### `SummaryController`

- `GET /summary/nmv`
- `GET /summary/units_sold`
- `GET /summary/avg_price`
- `GET /summary/products`
- `GET /summary/shops`

These endpoints return KPI-style aggregates over the filtered dataset. Some also support `group_by`, which lets the frontend request breakdowns by dimensions such as platform, region, mall status, origin, or category.

### `TrendController`

- `GET /trends`
- Returns monthly aggregated trend data.
- Supports optional grouping by `platform` or `region`.
- Powers the charts shown on the Trends page.

### `TopController`

- `GET /top/products`
- `GET /top/shops`

These endpoints return the top 10 products or shops ranked by a selected metric such as NMV, units sold, or product count.

### `FiltersController`

- `GET /filters/regions`
- `GET /filters/platforms`
- `GET /filters/l1_categories`
- `GET /filters/l2_categories`
- `GET /filters/l3_categories`
- `GET /filters/l4_categories`

These endpoints provide distinct values for filter dropdowns, including cascading category filters.

## Service Layer

- `RecordService`: builds filtered, sorted, paginated record queries.
- `SummaryService`: calculates overall KPI totals and optional grouped breakdowns.
- `TrendService`: aggregates monthly trend metrics and optionally splits them by platform or region.
- `TopService`: ranks top products and shops.
- `FiltersService`: returns distinct filter values from the `sales` table.

`src/db/queryBuilder.ts` centralizes shared SQL fragments for:

- `buildWhere`: dynamic filter conditions
- `buildOrderBy`: validated sorting
- `buildPagination`: limit/offset handling

This keeps the services relatively small and consistent across endpoints.
