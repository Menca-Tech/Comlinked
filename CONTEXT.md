# Context

The shared vocabulary for this repository. This file is a glossary and nothing
else — no implementation details, no decisions. Decisions live in `docs/adr/`.

## Glossary

- **Web App Template** — the reusable starter Comlinked was seeded from
  (`RafaelIIIPrudente/web-app-template`). Anything still named or branded
  "Web App Template" / "Acme" is a leftover placeholder to be renamed.

- **Reference Feature** — the one fully-worked example feature (**Customers**)
  that demonstrates every canonical pattern end to end: routing, the Service
  Seam, Server Actions, validation, a data table, and tests. New features are
  built by copying it.

- **Service Seam** — the boundary between the UI and its data source. Screens
  read and write through it and never touch a data source directly. It returns
  mock data by default; making the app real means changing the seam, not the
  screens.

- **Auth Strategy** — the pluggable authentication-provider abstraction. The
  template wires exactly one strategy (**Supabase**); the abstraction exists so
  another can be added without rewriting callers.

- **Organization** (a.k.a. **Tenant**) — the top-level account that owns data.
  Users reach data only through a Membership in an Organization; every
  tenant-scoped row belongs to exactly one Organization.

- **Membership** — the link between a User and an Organization. It carries the
  User's Org Role in that Organization. A User may hold Memberships in many
  Organizations.

- **Active Organization** — the Organization a signed-in User is currently
  acting within, selected via the workspace switcher and persisted server-side.
  It scopes what data the User sees.

- **Org Role** — a User's role _within a specific Organization_ (`owner`,
  `admin`, `member`), stored on the Membership. Governs access to that
  Organization's data and settings.

- **Platform Role** — a global role (`superadmin`) for the operator's own staff,
  stored in the User's auth `app_metadata`. It transcends Organizations and
  grants system-management access. Distinct from Org Role.

- **Role** — an umbrella term: in this app a Role is either an Org Role
  (per-Organization) or a Platform Role (global). A User's effective access is
  the union of their Active Organization's Org Role and any Platform Role.

- **Guard** — a mechanism that permits or denies access based on the current
  User's Role. A _route Guard_ protects a URL; a _component Guard_ protects a
  region of a screen.

- **Superadmin** — the sole Platform Role: an operator-staff User with
  unrestricted, cross-Organization access, including system-management screens
  ordinary Users never see.

- **Dashboard Shell** — the authenticated application frame (sidebar, top bar,
  theme toggle, user menu) that hosts feature screens.

- **Marketing Landing** — the public, unauthenticated entry page shown to
  visitors who are not signed in.

## Product language

Terms from the [ComLinked MVP Build Plan](docs/specs/2026-10-11-mvp-build-plan.md).

- **ComLinked** — the product: a network where Companies find leads, talk to each
  other and share their wins. The repository is named Comlinked; the product is
  spelled ComLinked.

### Participants

- **Company** — a business listed on ComLinked, and the party that owns its
  Connections and reputation. Avoid "member" for this, since that is also an Org
  Role.

- **Authorized Representative** — a person allowed to act on a Company's behalf.

- **Chamber** — a business association whose members join ComLinked together.

- **Community Manager** — a person who supports a Chamber's Companies with Intros
  and Asks, and reviews unusual spikes in points.

- **Pilot** — the first 90-day launch, at PCCI–Quezon City.

### Getting listed

- **Pre-built Profile** — a draft Company profile built by AI from public sources
  before the Company joins.

- **Claim** — a Company taking over its Pre-built Profile through a personal link.

- **Profile Strength** — a 0–100% measure of how complete a Company's profile is.

- **Partner Invite** — a Company's invitation to an existing customer or supplier
  to join ComLinked.

### Leads

- **Lead** — a Company surfaced to another as a potential business contact,
  through a Match, an Interest Signal, an Ask or an Intro.

- **Match** — a Company recommended to another as relevant, with a Match Reason.

- **Match Reason** — the one-line "why you should meet" attached to a Match.

- **Interest Signal** — a named record that another Company found this one in
  search, viewed its profile, messaged it or was recommended it.

- **ComDash** — a Company's home screen for its Interest Signals, Activity Score,
  rank and next best action.

- **Ask** — a business need posted by a Company for others to respond to. Asks
  appear on the **Asks Board**.

- **Intro** — an introduction between two Companies made by a Community Manager.

### Daily habit

- **Daily Lead Loop** — the five-step cycle every MVP feature supports: Morning
  Digest, act on Leads, talk and close, share the win, rank rises.

- **Morning Digest** — the 8:00 a.m. summary of new Leads, profile views and rank
  change.

- **Daily Lead List** — the five new Matches a Company gets each day, each to
  Connect, Message or Skip.

- **Activity Score** — the points a Company has earned from qualifying actions in
  the last 30 days.

- **Search Rank** — a Company's position in search results: relevance first,
  raised by its Activity Score.

- **New Member Boost** — the equal 30-day visibility boost every new Company gets.

- **Freshness Nudge** — a prompt to update a profile that has gone unchanged.

- **Monthly Top Companies** — a Chamber's leaderboard of its 10 most active
  Companies, for recognition only.

### Talking and closing

- **Connection** — an accepted link between two Companies, owned by the Companies
  rather than the people who made it.

- **ComMail** — company-to-company messaging.

- **AI Assistant** — the single per-Company on/off feature that writes AI Drafts
  for four jobs: intro, reply, follow-up and polish.

- **AI Draft** — text written by the AI Assistant, labelled as AI until a person
  edits or sends it.

- **Outcome** — a result confirmed by both Companies: "We met" or "We did
  business."

### Sharing wins

- **Testimonial** — a Company's short account of a confirmed deal: what it needed
  and what happened.

- **Success Wall** — the display of recent Testimonials and deals on the home feed
  and on both Companies' profiles.
