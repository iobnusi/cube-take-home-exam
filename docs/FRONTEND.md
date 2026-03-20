# Frontend

## Structure

The frontend is a `Next.js` App Router application inside `frontend/src/app`.

Main pages:

- `/`: dashboard page with KPI cards and top charts
- `/trends`: monthly trend charts
- `/records`: paginated sales table

Shared UI lives in `frontend/src/components`, while request helpers and query-param utilities live in `frontend/src/lib`.

The root layout renders a persistent sidebar and page content area, so navigation feels like a single analytics workspace instead of separate standalone pages.

## Libraries Used

- `Next.js` for routing, rendering, and data fetching
- `React` for UI composition
- `Tailwind CSS v4` for styling
- `recharts` for KPI/top-chart/trend visualizations
- `@tanstack/react-table` for the records table

There is no large component library such as MUI or Chakra here; most UI pieces are custom components styled with Tailwind utility classes.

## Page Structure

### Dashboard (`/`)

The dashboard combines two sections:

- KPI cards: summary metrics fetched from backend summary endpoints
- Top charts: top products and top shops, with their own scoped filter set using `top_*` query params

This page uses server components to fetch data and compose the page, while interactive pieces like filters and charts run on the client.

### Trends (`/trends`)

The Trends page renders:

- a filter bar
- a group-by toggle for platform, region, or no grouping
- six chart cards for monthly metrics such as NMV, units sold, active shops, and active products

### Records (`/records`)

The Records page renders:

- a filter bar
- a paginated, sortable sales table

Sorting and pagination are reflected in the URL so the table state is shareable and reload-safe.

## Server-Side vs Client-Side Rendering

### Server-side rendering

Server-side rendering is used for page-level data fetching in the App Router:

- `src/app/page.tsx`
- `src/app/trends/page.tsx`
- `src/app/records/page.tsx`

These pages await `searchParams`, call backend fetch helpers, and render initial HTML from the server. All backend fetches use `cache: 'no-store'`, so the UI always reflects the latest query state.

### Client-side rendering

Client-side rendering is used for interactive components marked with `'use client'`, including:

- `FilterBar`
- `SalesTable`
- `TrendChart`
- `Sidebar`
- KPI and top-chart display components

These components respond to user input, update URL query params, manage loading transitions, and render browser-only chart/table behavior.

## Server-Side Fetching

Server-side fetching is implemented through `frontend/src/lib/api.ts` and `frontend/src/lib/api/filters.ts`.

- `BASE_URL` switches between `API_URL` on the server and `NEXT_PUBLIC_API_URL` in the browser.
- `buildQuery` and `filtersFromParams` convert URL params into backend query strings.
- Page components call helpers such as `fetchRecords`, `fetchTrends`, `fetchSummaryMetric`, `fetchTopProducts`, and `fetchTopShops`.

The pattern is simple: the server page reads URL state, turns it into backend filters, fetches data from the API, and passes the results into client components for rendering and interaction.
