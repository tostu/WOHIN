import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import { DiscoveryService } from "./services/discovery";
import { FeedbackService } from "./services/feedback";
import { SubmissionsService } from "./services/submissions";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  "*",
  cors({
    origin: "*", // In production, replace with your app's origin
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Auth endpoints
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

// Discovery API
app.get("/api/v1/discovery/search", async (c) => {
  const activityId = c.req.query("activityId");
  if (!activityId) return c.json({ error: "Missing activityId" }, 400);

  const lat = c.req.query("lat");
  const lng = c.req.query("lng");
  const radius = c.req.query("radius");

  const results = await DiscoveryService.searchLocations(c.env, {
    activityId,
    lat: lat ? parseFloat(lat) : undefined,
    lng: lng ? parseFloat(lng) : undefined,
    radius: radius ? parseInt(radius) : 5000,
  });

  return c.json({ results });
});

app.get("/api/v1/discovery/location/:slug", async (c) => {
  const slug = c.req.param("slug");
  const location = await DiscoveryService.getLocationBySlug(c.env, slug);
  if (!location) return c.json({ error: "Location not found" }, 404);
  return c.json(location);
});

app.get("/api/v1/discovery/featured", async (c) => {
  const limit = c.req.query("limit");
  const results = await DiscoveryService.getFeaturedLocations(
    c.env,
    limit ? parseInt(limit) : 10,
  );
  return c.json({ results });
});

app.get("/api/v1/discovery/activities", async (c) => {
  const activities = await DiscoveryService.getActivities(c.env);
  return c.json({ activities });
});

// Feedback API
app.get("/api/v1/feedback/location/:id", async (c) => {
  const id = c.req.param("id");
  const vibes = await FeedbackService.getVibesForLocation(c.env.DB, id);
  return c.json(vibes);
});

app.get("/api/v1/feedback/me", async (c) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const vibes = await FeedbackService.getMyVibes(c.env.DB, session.user.id);
  return c.json(vibes);
});

app.post("/api/v1/feedback/vibe", async (c) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const { locationId, activityId, vibe } = body;

  if (!locationId || !activityId || !vibe) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const result = await FeedbackService.submitVibe(c.env.DB, {
    userId: session.user.id,
    locationId,
    activityId,
    vibe,
  });
  return c.json(result[0]);
});

// Submissions API
app.post("/api/v1/submissions/location", async (c) => {
  const data = await c.req.json();
  if (!data.name) return c.json({ error: "Missing required fields" }, 400);
  try {
    const result = await SubmissionsService.submitLocation(c.env, data);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to submit location" }, 500);
  }
});

app.post("/api/v1/submissions/report", async (c) => {
  const data = await c.req.json();
  if (!data.locationId || !data.description)
    return c.json({ error: "Missing required fields" }, 400);
  try {
    const result = await SubmissionsService.reportProblem(c.env, data);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to submit report" }, 500);
  }
});

export default app;
