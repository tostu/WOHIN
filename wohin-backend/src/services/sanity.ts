import { createClient } from "@sanity/client";

export const getSanityClient = (env: CloudflareBindings) =>
  createClient({
    projectId: env.SANITY_PROJECT_ID || "1ffjhas2",
    dataset: env.SANITY_DATASET || "production",
    useCdn: false, // set to `false` for fresh data
    apiVersion: "2024-03-11", // use current date
  });
