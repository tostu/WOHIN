# WOHIN (Workflow-Oriented High-Integrity Network)

WOHIN is a production-grade framework for "vibe coding" with Gemini CLI and Claude Code. It implements structured workflows and specialized agents to transform intent into verified, production-ready applications.

## 🏛️ Constitution

All development is governed by the **WOHIN Constitution** (v1.0.0), located at `.specify/memory/constitution.md`.

### Core Principles

1.  **I. Vibe-First Engineering**: Focus on "WHAT" (intent), AI handles "HOW" (implementation).
2.  **II. Standardized Lifecycle**: Follow the **START → BUILD → SHIP** workflow.
3.  **III. Independent User Stories**: Features are broken into testable P1/P2/P3 MVP slices.
4.  **IV. Automated Verification**: Tests (Contract/Integration) are mandatory and written first.
5.  **V. Modular Architecture**: Extend via plugins and MCP servers.

## 🔄 The Workflow

```mermaid
graph TD
    START[START: Discovery & Plan] --> BUILD[BUILD: Implement & Test]
    BUILD --> SHIP[SHIP: Verify & Commit]
    SHIP --> FIX[FIX: Debug & Patch]
    FIX --> REFACTOR[REFACTOR: Evolve]
## 📂 Project Structure

- `app/`: SvelteKit PWA Frontend.
- `cms/`: Sanity Studio Content Management.
- `wohin-app/`: Expo (React Native) Mobile App.
- `wohin-backend/`: Hono (Cloudflare Workers) Backend.
- `.specify/`: Governance and orchestration templates.

## 🛠️ Development

WOHIN is managed as a monorepo using Bun.

### Start all parts at once
```bash
bun dev
```

### Individual parts
```bash
bun run dev:app      # SvelteKit
bun run dev:cms      # Sanity
bun run dev:backend  # Hono/Cloudflare
bun run dev:mobile   # Expo (Web)
```

## 🔄 The Workflow
