# 9. Company directory, Organizations and Chambers

Date: 2026-11-09

## Status

Accepted. Amends [ADR 0005](0005-multi-tenancy.md) for shared company data. Follows
[ADR 0008](0008-free-mvp-product-direction.md), which required this decision before
company profiles are built.

## Context

ADR 0005 limits reads to an Organization's own members. ComLinked needs Companies to
see each other's profiles, search results and Asks. Pre-built profiles also exist
before anyone claims them, so they have no members at all.

## Decision

Split company data into two kinds.

- **Directory data.** Every Company has one shared profile, readable by signed-in users
  in the same Chamber Network. A pre-built profile exists with no Organization.
- **Private data.** Claiming a Company creates one Organization linked to it. ComMail,
  leads, notifications and the activity ledger belong to that Organization and stay
  under ADR 0005's row-level security.
- **Chambers.** A Chamber is a separate record that groups Companies. Community Managers
  have access through Chamber staff records, not through Organization Memberships.
- **Network boundary.** Each Chamber Network is kept separate from the others. Row-level
  security enforces it, as ADR 0005 requires for tenant data.

Alternatives considered: making every Company an Organization, which needs exceptions
for ownerless Organizations and shared profiles; and making a Chamber an Organization,
which mixes two different kinds of account.

## Consequences

- Row-level security needs a second kind of read rule, based on Chamber Network, and
  tests for it.
- A Company's profile is readable by others, so anything sensitive must live in private
  data.
- The template's "one Organization per signed-up user" onboarding changes: an
  Organization is now created by a Claim.
- Requirements are in the
  [ComLinked SRS](../specs/2026-11-09-comlinked-srs.md).
