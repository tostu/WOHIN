# Submission API Contract

Contract for submitting new locations and reporting data issues.

## Endpoints

### `POST /api/v1/submissions/location`
Proposes a new location for the platform.

**Request Body**:
- `name`: string (required)
- `address`: string (required)
- `description`: string (required)
- `activities`: array of strings (Activity IDs)

**Response (202 Accepted)**:
```json
{
  "message": "Submission received and is pending moderation.",
  "submissionId": "string"
}
```

### `POST /api/v1/submissions/report`
Reports a problem with existing location data.

**Request Body**:
- `locationId`: string (required)
- `issueType`: string (enum: "incorrect_data", "closed", "other")
- `description`: string (required)

**Response (201 Created)**:
```json
{
  "message": "Report submitted successfully.",
  "reportId": "string"
}
```
