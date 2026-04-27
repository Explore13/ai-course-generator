import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.jsx",
  dbCredentials: {
    url: `${process.env.DB_CONNECTION_STRING}`,
  },
});
