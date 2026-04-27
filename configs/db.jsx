import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DB_CONNECTION_STRING);
export const db = drizzle({ client: sql });
