import { createClient } from "@sanity/client";

export const getSanityWriteClient = (env: CloudflareBindings) =>
  createClient({
    projectId: env.SANITY_PROJECT_ID || "1ffjhas2",
    dataset: env.SANITY_DATASET || "production",
    useCdn: false,
    apiVersion: "2024-03-11",
    token: env.SANITY_WRITE_TOKEN,
    ignoreBrowserTokenWarning: true,
  });

export class SubmissionsService {
  static async submitLocation(env: CloudflareBindings, data: any) {
    const writeClient = getSanityWriteClient(env);
    return writeClient.create({
      _type: "location",
      ...data,
      status: "pending",
    });
  }

  static async reportProblem(
    env: CloudflareBindings,
    data: { locationId: string; description: string },
  ) {
    const writeClient = getSanityWriteClient(env);
    return writeClient.create({
      _type: "report",
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}
