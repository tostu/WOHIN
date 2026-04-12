# Discovery API Contract

Contract for searching and listing locations based on activities and intentions.

## Endpoints

### `GET /api/v1/discovery/search`
Searches for locations by activity and coordinates.

**Query Parameters**:
- `activityId`: string (required) - Sanity Activity ID
- `lat`: number (optional) - User latitude
- `lng`: number (optional) - User longitude
- `radius`: number (optional, default: 5000) - Search radius in meters

**Response (200 OK)**:
```json
{
  "results": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "distance": "number (meters)",
      "rating": "number (0-5)",
      "photos": ["string (URL)"],
      "activities": [
        { "id": "string", "name": "string", "themeColor": "string (matcha|peach|sunny)" }
      ]
    }
  ]
}
```

### `GET /api/v1/discovery/location/:slug`
Fetches a detailed location profile.

**Response (200 OK)**:
```json
{
  "id": "string",
  "name": "string",
  "address": "string",
  "coordinates": { "lat": "number", "lng": "number" },
  "hours": [ { "day": "string", "open": "string", "close": "string" } ],
  "description": "string (HTML/Markdown)",
  "photos": ["string (URL)"],
  "activities": [
    { "id": "string", "name": "string", "feedbackCount": "number" }
  ]
}
```
