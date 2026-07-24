import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("DB_CONNECTION_STRING is missing");
}

const sql = neon(connectionString);

export const db = drizzle({ client: sql });
