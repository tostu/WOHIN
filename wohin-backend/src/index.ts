import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import { DiscoveryService } from "./services/discovery";
import { FeedbackService } from "./services/feedback";
import { SubmissionsService } from "./services/submissions";
import { FavoritesService } from "./services/favorites";

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
  const q = c.req.query("q");
  const activityId = c.req.query("activityId");
  const lat = c.req.query("lat");
  const lng = c.req.query("lng");

  if (!q && !activityId) {
    return c.json({ error: "Provide q or activityId" }, 400);
  }

  const results = await DiscoveryService.searchLocations(c.env, c.env.DB, {
    q: q || undefined,
    activityId: activityId || undefined,
    userLat: lat ? parseFloat(lat) : undefined,
    userLng: lng ? parseFloat(lng) : undefined,
  });

  return c.json({ results });
});

app.get("/api/v1/discovery/location/:slug", async (c) => {
  const slug = c.req.param("slug");
  const location = await DiscoveryService.getLocationBySlug(c.env, c.env.DB, slug);
  if (!location) return c.json({ error: "Location not found" }, 404);
  return c.json(location);
});

app.get("/api/v1/discovery/featured", async (c) => {
  const limit = c.req.query("limit");
  const lat = c.req.query("lat");
  const lng = c.req.query("lng");

  const results = await DiscoveryService.getFeaturedLocations(
    c.env,
    c.env.DB,
    limit ? parseInt(limit) : 10,
    lat ? parseFloat(lat) : undefined,
    lng ? parseFloat(lng) : undefined,
  );
  return c.json({ results });
});

app.get("/api/v1/discovery/activities", async (c) => {
  const activities = await DiscoveryService.getActivities(c.env);
  return c.json({ activities });
});

// Curated Lists API
app.get("/api/v1/discovery/lists", async (c) => {
  const results = await DiscoveryService.getCuratedLists(c.env, c.env.DB);
  return c.json({ results });
});

app.get("/api/v1/discovery/lists/:slug", async (c) => {
  const slug = c.req.param("slug");
  const list = await DiscoveryService.getCuratedListBySlug(c.env, c.env.DB, slug);
  if (!list) return c.json({ error: "Curated list not found" }, 404);
  return c.json(list);
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

// Favorites API
app.post("/api/v1/favorites/toggle", async (c) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const { locationId } = await c.req.json();
  if (!locationId) return c.json({ error: "Missing locationId" }, 400);

  const result = await FavoritesService.toggle(
    c.env.DB,
    session.user.id,
    locationId,
  );
  return c.json(result);
});

app.get("/api/v1/favorites", async (c) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const favorites = await FavoritesService.getMyFavorites(
    c.env.DB,
    session.user.id,
  );
  return c.json(favorites);
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
