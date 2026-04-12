# Feedback API Contract

Contract for submitting and retrieving user vibe feedback.

## Endpoints

### `POST /api/v1/feedback/vibe`
Submits a thumbs up/down for a location's activity.

**Request Body**:
- `locationId`: string (required) - Sanity Location ID
- `activityId`: string (required) - Sanity Activity ID
- `vibe`: boolean (required) - true = thumbs up, false = thumbs down

**Response (201 Created)**:
```json
{
  "id": "uuid",
  "locationId": "string",
  "activityId": "string",
  "vibe": "boolean",
  "createdAt": "iso-date"
}
```

**Security**: Requires Bearer Auth Token.

### `GET /api/v1/feedback/me`
Retrieves the current user's submitted feedback for a list of locations.

**Query Parameters**:
- `locationIds`: array of strings (required)

**Response (200 OK)**:
```json
{
  "feedback": [
    { "locationId": "string", "activityId": "string", "vibe": "boolean" }
  ]
}
```
