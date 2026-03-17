import pg from "pg";

const pool = new pg.Pool({
    connectionString:
        process.env.DATABASE_URL ??
        "postgres://app:secret@localhost:5433/marketplace",
});

export default pool;
