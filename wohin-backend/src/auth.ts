import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { getDb } from "./db";

export function createAuth(env: CloudflareBindings) {
  return betterAuth({
    baseURL: env.ORIGIN || "http://localhost:8787",
    secret: env.BETTER_AUTH_SECRET || "development-secret-only",
    emailAndPassword: { enabled: true },
    database: drizzleAdapter(getDb(env.DB), { provider: "sqlite" }),
    plugins: [expo()],
    trustedOrigins: ["http://192.168.178.45:8787", "http://localhost:8787", "http://localhost:8081"],
  });
}
