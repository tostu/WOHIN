<!--
Sync Impact Report
Version change: 1.0.0 → 1.1.0
List of modified principles:
- None (Added Principle VI)
Added sections:
- VI. Decoupled Service Architecture
Removed sections:
- None
Templates requiring updates:
- .specify/templates/plan-template.md (✅ updated)
- .specify/templates/tasks-template.md (✅ updated)
- .specify/templates/spec-template.md (✅ verified)
- .specify/templates/agent-file-template.md (✅ updated)
Follow-up TODOs:
- None
-->

# WOHIN Constitution

## Core Principles

### I. Vibe-First Engineering
Focus on high-level intent ("WHAT") while the AI handles implementation details ("HOW"). Maintain strict production-grade standards through architectural consistency and design patterns. Implementation must never compromise on structural integrity for the sake of speed.

### II. Standardized Lifecycle (START → BUILD → SHIP)
All development must follow the START (Discovery/Planning), BUILD (Implementation), and SHIP (Verification/Deployment) phases. No implementation is allowed without a preceding plan; no change is allowed to ship without explicit verification.

### III. Independent User Stories (MVP-Driven)
Features must be broken into independent, testable user stories with clear priorities (P1, P2, P3). Each story must deliver value as a standalone slice of functionality, allowing for incremental delivery and parallel development.

### IV. Automated Verification (NON-NEGOTIABLE)
Every feature, bug fix, or refactor must be verified by automated tests. Validation is the only path to finality. Contract and integration tests should ideally be written and failed before implementation (TDD approach).

### V. Modular Extension & Plugin Architecture
Extend system capabilities through plugins (e.g., Claude Vibes, Speckit) and MCP servers. Core modification is a last resort; prefer composable, decoupled extensions that preserve system stability.

### VI. Decoupled Service Architecture
External dependencies (APIs, databases, third-party services) must be abstracted behind interfaces. Use dependency injection (similar to Spring Boot patterns) to ensure modules remain decoupled, testable, and swappable.

## Quality & Standards

### Code Quality & Security
- **Standards**: Strict adherence to linting and formatting rules.
- **Security**: No hardcoded secrets. Use environment variables and approved secret management.
- **Performance**: Define and track measurable outcomes (SC-XXX) for every feature.

## Governance & Evolution

### Amendments & Compliance
- **Amendments**: Changes to the constitution require a version bump and synchronization across all templates.
- **Compliance**: All PRs and plans must be checked against these principles. Use the "Constitution Check" gate in plans to justify deviations.

## Governance

The WOHIN Constitution is the ultimate source of truth for engineering practices. All project activities must align with these principles. Amendments are managed through the `.specify/memory/constitution.md` file and require a version increment. Every feature plan MUST include a "Constitution Check" to ensure alignment.

**Version**: 1.1.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-12
