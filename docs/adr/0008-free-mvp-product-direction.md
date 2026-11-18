# 8. Free MVP product direction

Date: 2026-11-08

## Status

Accepted. Builds on [ADR 0002](0002-supabase-only-auth.md) (Supabase-only auth).
Requires a follow-up decision amending
[ADR 0005](0005-multi-tenancy.md) (tenant read isolation) before company profiles
are built.

## Context

Comlinked was seeded from a general B2B SaaS template, so nothing in the code
says what the product is or what it deliberately leaves out. The
[ComLinked MVP Build Plan](../specs/2026-10-11-mvp-build-plan.md) defines both.
Several of its choices would look like oversights to someone reading the code
later, so they are recorded here.

## Decision

Adopt the plan as the product vision and guide. Its scope test applies to all
work: a feature must help companies sign up, get leads, return daily, talk to
other companies or share wins. Anything else waits (plan, Section 6).

- **Free launch.** No payments, paywall or premium tiers, so no Stripe. Interest
  signals show company names, because hiding them would block the first-lead
  moment the MVP exists to create.
- **Visibility is earned.** Search rank is relevance, boosted by up to 30% from
  a 30-day Activity Score. Relevance always comes first.
- **Relationships belong to companies.** Connections stay with the company when
  people leave.
- **AI drafts, a person decides.** One per-company switch, four jobs, and nothing
  sends without a person's tap. Every flow works with the switch off. The full
  lead-generation agent waits for Phase 2.
- **Mobile web only.** A mobile-first web app; native apps wait for Phase 2.
- **No custom admin console.** ComLinked staff use the database dashboard.
- **Hosted services.** Next.js on Vercel, Supabase in Singapore for the
  Philippine pilot, the Anthropic API, a transactional email service and web
  push.

## Consequences

- ADR 0005 limits reads to an Organization's own members, but the product depends
  on companies seeing each other. Shared company data needs its own design and
  ADR before feature A1.
- Password sign-in gives way to Google, Facebook, magic link and mobile one-time
  code, all through Supabase Auth.
- The template's Superadmin screens and multi-Organization membership stay
  available but are not extended for the MVP.
- A Canadian data region is required before the Toronto launch.
- Open questions from adoption are tracked in the plan's
  [Adoption notes](../specs/2026-10-11-mvp-build-plan.md#adoption-notes).
