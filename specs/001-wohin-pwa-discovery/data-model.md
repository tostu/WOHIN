# Data Model: wohin-pwa-discovery (Sun-Drenched Social)

## Entities

### Location (Sanity Document)
- **name**: string
- **slug**: slug
- **address**: string
- **coordinates**: geopoint
- **hours**: array of objects
- **description**: portable text
- **photos**: array of images
- **activities**: array of references to Activity
- **status**: string (enum: "pending", "approved")

### Activity (Sanity Document)
Refined for Sun-Drenched Social strategy:
- **name**: string (e.g., "study", "relax", "party")
- **slug**: slug
- **themeColor**: string (e.g., "matcha", "peach", "sunny") - Maps to `secondary-container` or `tertiary-container` in UI.
- **icon**: icon name/image
- **description**: string

### VibeFeedback (Drizzle Schema)
- **id**: uuid
- **userId**: uuid
- **locationId**: string (Sanity ID)
- **activityId**: string (Sanity ID)
- **vibe**: string (enum: 'sparkle', 'fire', 'chill', 'nope' - powering playful floating animations)
- **createdAt**: timestamp

### Submission (Sanity Document)
- **details**: object (Location data)
- **status**: "pending"

## Design System Mapping
- **Matcha Theme**: `tertiary-container` (`#deffaf`)
- **Peach Theme**: `primary-container` (`#ff9e6d`)
- **Sunny Theme**: `secondary-container` (`#fdd752`)
