# cube-take-home-exam

Take home exam for Full-stack developer positions at Cube Asia

## Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js    |
| Backend  | Express.js |
| Database | PostgreSQL |

## Seeder

The seeder is a short-lived Node.js service that populates the `sales` table from `.xlsx` report files. It runs once at startup and exits.

### How it works

```
docker compose up
       │
       ▼
  ┌─────────┐    healthy    ┌──────────┐   completed   ┌────────┐
  │   db    │ ─────────────▶│  migrate │──────────────▶│ seeder │
  │ Postgres│               │  (DDL)   │               │ (data) │
  └─────────┘               └──────────┘               └────────┘
```

1. **db** — PostgreSQL starts and passes its healthcheck.
2. **migrate** — Runs schema migrations (creates the `sales` table).
3. **seeder** — Reads every `.xlsx` file from `seeder/data/`, cleans and inserts rows into `sales`.

### Pipeline (index.js)

1. Connect to Postgres via `DATABASE_URL`.
2. Read all `.xlsx` files in the `data/` directory (bind-mounted at runtime).
3. For each sheet in each file:
    - Skip the header row.
    - **Clean** each row — normalize empty values to `null`, convert Excel serial dates, cast types (`utils.js → cleanRow`).
    - **Validate** — drop rows missing required columns: `region`, `platform`, `period`, `product_id`, `shop_id` (`utils.js → isValidRow`).
    - **Chunk** valid rows into batches of 500.
    - **Insert** each batch with a single parameterized multi-row `INSERT` statement.
4. Log progress per sheet/chunk, then disconnect.

### Data cleaning (utils.js)

| Column               | Transformation                            |
| -------------------- | ----------------------------------------- |
| `period`             | Excel serial number → `Date`              |
| `is_mall`            | `"Mall"` → `true`, anything else → `null` |
| `nmv`                | Non-numeric → `0`                         |
| `units_sold`         | Non-numeric → `0`                         |
| `avg_price_per_unit` | Non-numeric → `0`                         |
| `sku_id`             | Non-string → `null`                       |
| All columns          | `undefined`, `""`, `"-"` → `null`         |

### Docker details

-   **Build context:** `seeder/` — contains `Dockerfile`, `package.json`, `index.js`, `utils.js`.
-   **Bind mount:** `./seeder/data/ → /app/data` — xlsx files are mounted at runtime, not baked into the image.
-   **`.dockerignore`** excludes `node_modules` and `data` from the build.
-   Dependencies are installed inside the image via `npm ci --omit=dev`.

### Adding new data

Drop additional `.xlsx` files into `seeder/data/` and re-run:

```bash
docker compose up --build seeder
```

The seeder will process every file in the directory.
