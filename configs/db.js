import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString =
  process.env.DB_CONNECTION_STRING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Set DB_CONNECTION_STRING, DATABASE_URL, POSTGRES_URL, or NEON_DATABASE_URL.",
  );
}

const sql = neon(connectionString);

export const db = drizzle({ client: sql });
