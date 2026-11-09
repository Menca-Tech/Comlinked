# 10. Client-side product simulation behind the seam

Date: 2026-11-09

## Status

Accepted

## Context

ComLinked's product screens were first built as a hand-written HTML mockup with a
simulated engine: Fit Scores, rank, overnight activity, and demo controls such as
"Two weeks in" and "Next morning". That mockup could not use React UI libraries, so
the screens were moved into this app, still on mock data. The demo depends on
browser-held state, timers and time travel, which does not fit ADR 0004's
"Reads = RSC, writes = Server Actions".

## Decision

The `/app/*` product routes are client components that read a browser-held simulation
through one Service Seam, `src/services/comlinked`. Screens import only the seam. A
full page load resets the simulation, as it did in the mockup.

This is a deliberate, temporary exception to ADR 0004. ADR 0003 still holds: screens
never touch a data source directly.

## Consequences

- The whole product can be demonstrated with no backend or environment variables.
- Screens stay reusable. Making a feature real means replacing what the seam does and
  moving that feature's reads and writes to Server Components and Server Actions.
- Demo state is not shared between browsers and does not survive a reload.
- Claiming and sign-in on these routes are simulated. Real authentication stays in
  `/auth` and `/dashboard` until a feature is made real.
