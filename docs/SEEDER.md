# Seeder

## Purpose

The seeder is a short-lived Node.js process that imports Excel sales reports into PostgreSQL. It is intended to run after migrations and before the frontend/backend start serving real data.

## Directory Structure

- `seeder/index.js`: main import pipeline
- `seeder/utils.js`: column definitions, cleaning helpers, and validation rules
- `seeder/data/`: source `.xlsx` files mounted into the container at runtime
- `seeder/Dockerfile`: container image for the one-off seeding job

## How It Works

`index.js` performs the full import flow:

1. Connect to PostgreSQL using `pg` and `DATABASE_URL`.
2. Read all files in the `data/` directory.
3. Parse each workbook with `node-xlsx`.
4. Iterate through every sheet in every workbook.
5. Skip the header row, clean each row, and discard invalid rows.
6. Split valid rows into chunks of 500.
7. Insert each chunk with one parameterized multi-row `INSERT` into `sales`.
8. Log progress and close the DB connection at the end.

## Cleaning and Validation

`utils.js` defines the import schema through the `columns` array, which maps spreadsheet column order to database column order.

It also contains:

- `sanitize`: converts empty values like `""`, `undefined`, and `"-"` into `null`
- `excelDateToDate`: converts Excel serial dates into JavaScript `Date` objects
- `cleanRow`: applies column-specific transformations
- `isValidRow`: ensures required fields such as `region`, `platform`, `period`, `product_id`, and `shop_id` are present

Examples of transformations:

- `period`: Excel number to date
- `is_mall`: `"Mall"` to `true`, otherwise `null`
- numeric metrics like `nmv`, `units_sold`, and `avg_price_per_unit`: default to `0` when not numeric
- `sku_id`: kept only when it is a string

## Libraries Used

- `pg`: connects to PostgreSQL and executes inserts
- `node-xlsx`: parses `.xlsx` workbook files
- Node.js built-in `fs/promises`: reads the input directory

The seeder intentionally avoids extra abstractions. Its job is narrow: parse spreadsheet rows, normalize them, and insert them efficiently into the database.
