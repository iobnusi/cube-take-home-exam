# Architecture

## Overview

This project is a small full-stack analytics app for exploring sales data. It is organized into four main parts:

- `frontend/`: a Next.js dashboard UI
- `backend/`: an Express.js API documented and routed through `tsoa`
- `migrations/`: SQL schema migrations for PostgreSQL
- `seeder/`: a one-off Node.js process that loads Excel report files into the database

At a high level, data flows like this:

1. PostgreSQL starts.
2. A migration job creates the `sales` table.
3. The seeder imports `.xlsx` report files into that table.
4. The backend exposes filtered and aggregated API endpoints over the seeded data.
5. The frontend fetches from the backend and renders dashboard, trends, and records pages.

## Tech Stack Decisions

- Frontend: `Next.js` with the App Router for page-based server rendering and client-side interactivity where needed.
- Backend: `Express.js` because it stays lightweight, while `tsoa` adds typed controllers plus generated OpenAPI routes/specs.
- Database: `PostgreSQL` for straightforward relational querying and aggregation.
- Charts and tables: `recharts` for charts and `@tanstack/react-table` for the records table.
- Seeder: plain `Node.js`, `pg`, and `node-xlsx` to keep the import pipeline simple and easy to run in Docker.

## Docker Compose Setup

`docker-compose.yml` orchestrates the app as a startup pipeline:

- `db`: PostgreSQL 16 with a persistent `pgdata` volume and a healthcheck.
- `migrate`: runs SQL migrations using the `migrate/migrate` image after the database is healthy.
- `seeder`: builds from `seeder/`, waits for migrations to finish, mounts `./seeder/data` into the container, imports the Excel files, then exits.
- `backend`: builds from `backend/`, connects to Postgres through `DATABASE_URL`, and exposes port `4000`.
- `frontend`: builds from `frontend/`, points server-side requests at `http://backend:4000`, exposes port `3000`, and waits for the backend healthcheck.

This ordering matters: the app is designed so schema creation happens before seeding, and seeding happens before the user starts querying data through the UI.

## Runtime Notes

- The backend and seeder both talk directly to the same `sales` table.
- The frontend uses `API_URL` for server-side fetches inside the container network and `NEXT_PUBLIC_API_URL` for browser requests from the host machine.
- The backend also serves Swagger docs at `/docs`, generated from the `tsoa` controllers.
