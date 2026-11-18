# ComLinked MVP feature status

Created 2026-11-08 · Last updated 2026-11-19 · Scope: [MVP Build Plan](2026-10-11-mvp-build-plan.md) ·
Repo state: branch `feat/website-redesign-pages` at commit `5d8f98e`, plus the
Pilot Preview's final check

Full requirements are in the [ComLinked SRS](2026-11-09-comlinked-srs.md), version
0.4, a draft for Richard's review. This file tracks progress against them.

The pilot is ECCP, the European Chamber of Commerce of the Philippines, decided on
2026-11-10. It replaces PCCI–Quezon City, which the plan named first.

**All 21 MVP features are now simulated in the local mockup.** No launch is
planned for now. The Demo is for Richard and pilot chambers. Richard presents the
[Pilot Preview](#pilot-preview) in a first meeting, sharing his screen, and then
sends a private link that can be replayed and forwarded.

The mockup's leads, Connection Requests and overnight activity are calculated by
a simulated engine, modeled on how LinkedIn works but built around companies.
There is still no real server.

The mockup also has labeled previews of two things planned for after the MVP:
the [AI Lead Agent](#ai-lead-agent-preview) and a
[ComLinked Team Dashboard](#comlinked-team-dashboard-preview).

**No MVP feature is complete in the real app.** Only easy sign-in (A3) has real
code, and it is partial.

The mockup is at [`docs/mockup/index.html`](../mockup/index.html), with a copy at
`~/Documents/ComLinked-mockup/index.html`. Since the ComDash redesign of 2026-11-11, the
Next.js app at `/app` is the main version again, and the mockup is frozen as the
backup. The mockup's ComDash is the older design and says so. Its code is throwaway:
only its flows, layouts and design carry over to a real build.

## How to read the tables

| Status    | Meaning                                                                 |
| --------- | ----------------------------------------------------------------------- |
| Simulated | Usable in the mockup, with example data. Nothing real is sent or saved. |
| Partly    | Part of the feature exists; the notes say what is missing.              |
| Done      | Complete for what this item covers.                                     |
| No        | Not built.                                                              |

## The 21 MVP features

| ID  | Feature                        | Mockup    | Real app | What was done                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ------------------------------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1  | Pre-built company profiles     | Simulated | No       | Member import shows each profile building from its source, and every finished draft opens. No AI actually runs.                                                                                                                                                                                                                                                                                                                            |
| A2  | Claim your profile             | Simulated | No       | Text message preview, one-tap claim, profile check and authorization checkbox.                                                                                                                                                                                                                                                                                                                                                             |
| A3  | Easy sign-in                   | Simulated | Partly   | Mockup has all four methods. The repo's sign-in form has code and unit tests for Google, Facebook and email link. Mobile one-time code is missing, and it needs Supabase configured.                                                                                                                                                                                                                                                       |
| A4  | Profile strength meter         | Simulated | No       | 0–100% bar with the next step. It starts at 55% at the Claim; products, project, photo and logo raise it to 100%. The logo shows large at the top of the profile.                                                                                                                                                                                                                                                                          |
| A5  | Invite business partners       | Simulated | No       | Invite by link, email or chat. The inviter gets 10 points; the partner gets the New Member Boost and appears in search.                                                                                                                                                                                                                                                                                                                    |
| L1  | Day-one matches                | Simulated | No       | The 3 highest Fit Scores right after claiming, each with a fit number, "why meet" line and any mutual connections.                                                                                                                                                                                                                                                                                                                         |
| L2  | ComDash interest signals       | Simulated | No       | Every interested company is named, with its Interest Level (Hot, Warm or New), a summary and a dated timeline. Signals: found you in search, viewed, saved, messaged and recommended. Next.js ComDash (redesigned 2026-11-11) adds top numbers, a visibility chart, an interest funnel, alerts and search terms with profile gaps.                                                                                                         |
| L3  | Asks board                     | Simulated | No       | Asks reach the companies that offer what they name, responses follow Fit Score, and new asks arrive overnight. Answers go through ComMail.                                                                                                                                                                                                                                                                                                 |
| L4  | Community manager intros       | Simulated | No       | A manager picks two companies, and the intro appears on ComDash.                                                                                                                                                                                                                                                                                                                                                                           |
| D1  | Morning digest                 | Simulated | No       | "Next morning" builds the 8:00 a.m. banner and digest from that night's calculated activity. No real push or email.                                                                                                                                                                                                                                                                                                                        |
| D2  | Daily lead list                | Simulated | No       | The 5 highest Fit Scores each day, with Connect, Message or Skip; skips lower the fit of that category.                                                                                                                                                                                                                                                                                                                                    |
| D3  | Activity Score and search rank | Simulated | No       | All 9 point rules, their limits, the 30-day window and the rank formula. Rank is calculated against 11 example food suppliers with fixed scores.                                                                                                                                                                                                                                                                                           |
| D4  | Freshness nudges               | Simulated | No       | Prompt appears after 14 days without a profile update.                                                                                                                                                                                                                                                                                                                                                                                     |
| D5  | Monthly top companies          | Simulated | No       | Top 10 list, recognition only, which resets when the simulated month changes.                                                                                                                                                                                                                                                                                                                                                              |
| C1  | Company connections            | Simulated | No       | Connection Requests resolve by fit, can be withdrawn, and arrive from others to accept or ignore. An Authorized Representative sends a Connection Request; a Company Admin accepts. Connections stay with the company when its people change. Next.js ComDash has a Connections tab: Manage connections, Invitations, Companies in your chamber, Buyers of what you sell, and "From your connections" with replies that send only on Send. |
| C2  | ComMail                        | Simulated | No       | Conversations, 3 templates, sending and pre-written replies.                                                                                                                                                                                                                                                                                                                                                                               |
| C3  | AI Assistant switch            | Simulated | No       | On/off switch, change log, "AI draft" label, nothing sent without a tap, 30-a-day counter. Polish covers descriptions, asks and testimonials. Text is pre-written.                                                                                                                                                                                                                                                                         |
| C4  | Outcome buttons                | Simulated | No       | "We met" and "We did business"; the other company auto-confirms and points are awarded.                                                                                                                                                                                                                                                                                                                                                    |
| S1  | Testimonial prompt             | Simulated | No       | 2 questions after a confirmed deal, with optional Polish.                                                                                                                                                                                                                                                                                                                                                                                  |
| S2  | Success wall                   | Simulated | No       | The full wall is on the Wins tab and company profiles. The mockup shows recent wins on ComDash. In Next.js, Connections' wins appear under "From your connections" instead.                                                                                                                                                                                                                                                                |
| S3  | One-tap share                  | Simulated | No       | Share card and a post preview for Facebook, LinkedIn or Viber, with a placeholder sign-up link. Nothing is posted.                                                                                                                                                                                                                                                                                                                         |

## Chamber tools and supporting features

| Feature                          | Mockup    | Real app | What was done                                                                                                                                                                                                                                                                                                                          |
| -------------------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Member import                    | Simulated | No       | The Member List of 100 company names and websites, always the sample list. Building ends with 100 profiles and claim links ready for the chamber to send. Nothing is sent. In the Next.js Demo it counts ECCP's 1,000 members and builds the 100 named rows.                                                                           |
| Activity view                    | Simulated | No       | ECCP's Activity View: claimed of 1,000 in the Next.js Demo (of 100 in the mockup), active, need an intro, deals confirmed and wins posted, one status per member with filters, and the Success Wall and Monthly Top Companies beside it. The Chamber Contact only reads it; the Community Manager sees the same screen with the tools. |
| Intros and broadcasts            | Simulated | No       | Both work in the mockup, and announcements appear on ComDash.                                                                                                                                                                                                                                                                          |
| Admin back office                | No        | No       | Left out by design: the plan has staff use the database dashboard.                                                                                                                                                                                                                                                                     |
| Search and company profile pages | Simulated | No       | Example search ranked by relevance × boost, plus profile pages. Degree and mutual connections are labels only.                                                                                                                                                                                                                         |
| Anti-gaming rules                | Simulated | No       | Limits are enforced, deals need both sides, and there is one example points spike to review.                                                                                                                                                                                                                                           |
| New member boost                 | Simulated | No       | 30 days at 10%. The 10% is an assumption; the plan gives no size.                                                                                                                                                                                                                                                                      |
| Visible-views notice at sign-up  | Simulated | No       | Shown in the mockup's claim flow. The repo's join form has the text but is not connected.                                                                                                                                                                                                                                              |
| Mobile-first and web layouts     | Simulated | Partly   | The mockup, the five public pages and the simulated product at `/app` all have phone and web layouts.                                                                                                                                                                                                                                  |
| Website pages                    | Done      | Partly   | All 5 pages are in the mockup and the repo. In the repo, the join and pilot forms check their fields and lead into the simulated product; nothing is stored or sent. The repo's pages have since been redesigned, so they no longer match the mockup, which has the current design.                                                    |

## Agreed for the demo

| Topic              | Decision                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Demo surface       | Since 2026-11-11 the demo runs on the Next.js app at `/app`. The HTML mockup is the frozen backup.                   |
| Audience           | ECCP's Chamber Leader first. Richard presents in a first meeting, then sends a private link that works without him.  |
| Scope              | The 21 MVP features and chamber basics, plus a read-only "What's next" page.                                         |
| "What's next" page | Customer-facing postponed items only, with no paid items or staff tools. Reached from the presenter guide only.      |
| Website claims     | Chamber quote, pilot block and About link removed. Unknown answers say they will be confirmed during pilot planning. |
| Contact            | "Contact us" goes to the chamber pilot form.                                                                         |
| Demo start         | The Pilot Preview's Opening, or from the Presenter Guide a new company, or Day 14 with its first deal confirmed.     |
| Presenter controls | The G key opens the guide. Phone widths keep a Guide button, except inside the Pilot Preview.                        |
| Honesty markers    | The "Working mockup" ribbon and "Example data" labels stay, so example companies are not mistaken for real activity. |

## Pilot Preview

Added 2026-11-17 in the Next.js Demo, for ECCP. Brief: the
[Pilot Preview spec](2026-11-17-pilot-preview.md). Script: the
[Run of Show](../presentations/2026-11-17-pilot-preview-run-of-show.md).

- **Opening and six Stops**, at `/app/preview`. Day 0, the Member List becomes
  profiles. Day 1, a member claims. Day 2, the morning digest. Day 14, the member
  and then ECCP's Activity View. Last, what a pilot asks of ECCP. Each Stop has
  its own address and opens in a prepared state.
- **Story Bar** under the top bar names the day, the Stop and the Seat, with Back
  and Next. Stop 5 adds a side step into the Community Manager's Seat.
- **Later items hidden.** Possible future pricing and the after-MVP previews are
  off in the Pilot Preview. The presenter switches them on from the guide.
- **The ask.** The Member List and one Chamber Contact who sends the claim links.
  The email button goes to the presenter's address, set on the deployment.
- **What changed underneath.** One claim day per Company. A Company that has not
  claimed shows its basics only and never acts. Wins are dated, so the Success
  Wall is empty on Days 0 to 2. One status rule feeds the Activity View and the
  Team Dashboard.
- **Day 1k.** Since 2026-11-19 every chamber-wide figure counts ECCP's Chamber
  Size of 1,000, with 100 named Example Companies.
- **Name check.** Started on 2026-11-18. Some invented names match real
  businesses and are still to be renamed before the link is shared.

## Simulated engine

Runs entirely inside the mockup, and every demo runs the same way.

| Part                | How it works                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Network             | 100 example ECCP members, all invented, in the mockup and the Next.js Demo: the original 39 companies around Kalayaan Foods plus 60 added on 2026-11-10 across ECCP-style industries. Fixed connections, one Chamber Network. 12 are food suppliers.                                                                                                                                                     |
| Connection Degree   | 1st, 2nd or 3rd degree and mutual connections on every company, updating as connections change.                                                                                                                                                                                                                                                                                                          |
| Fit Score           | Starts at 12. Adds points for seeking what you offer, offering what you seek, mutual connections and location. Past skips and offering the same as you subtract.                                                                                                                                                                                                                                         |
| Connection Requests | 80 or more accepted in seconds, 50 to 79 by the next morning, below 50 pending until withdrawn. Others also send them.                                                                                                                                                                                                                                                                                   |
| Asks                | An ask's keywords are matched to what companies offer. Those companies are notified: 80 or more respond in seconds, 50 to 79 by the next morning. One new ask arrives each morning.                                                                                                                                                                                                                      |
| Overnight activity  | Attention = 1 + 1 per 15 points in the last 7 days + 1 per 3 places above last. It sets views, searches and requests.                                                                                                                                                                                                                                                                                    |
| Notifications       | Every event creates one. Views and search appearances on the same day are grouped.                                                                                                                                                                                                                                                                                                                       |
| Member activity     | Members interact with each other every simulated day: they claim profiles, post and answer asks, confirm deals with testimonials and update profiles. These appear on the Asks board, the Success Wall, Monthly top companies, the Team dashboard and an ECCP activity feed. Connections and ComMail stay private and show only as totals. The feed is not in the MVP plan, which postpones a news feed. |
| Engine page         | Opened from the presenter guide: network map, log of what happened and why, and each lead's fit breakdown.                                                                                                                                                                                                                                                                                               |

Deliberately unlike LinkedIn:

- Connections belong to companies, not people.
- Any company can message any other, free. There is no connection gate or paid
  messaging.
- Connection Degree does not change search order, so rank is the same for every
  viewer.
- Other companies see only the connection count and mutual connections, which
  keeps customers and suppliers private.
- Each Chamber Network is separate, rather than one global network.

## AI Lead Agent preview

Not an MVP feature, and not built in the real app. It is simulated in the mockup
and labeled "Preview: after the MVP". Source:
[task document](2026-10-21-ai-lead-agent.pdf) and original
[simulator](2026-10-21-ai-lead-agent-simulator.html).

| Part                       | In the mockup                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How to open it             | From the presenter guide, or the AI Lead Agent card on What's next.                                                                                                   |
| Mandate                    | Choose customer, vendor, supplier or partner, then edit a pre-filled need.                                                                                            |
| Candidates                 | Found and scored from the 100-company network, so different needs give different results.                                                                             |
| Match Score                | 7 categories, 90 before contact and 10 after. Book at 75 or more, Nurture at 60 to 74, Drop below 60. It is separate from the Fit Score on leads.                     |
| Gate A and Gate B          | The presenter approves or declines for Kalayaan Foods, and the decision changes the outcome. The other company's approver is simulated.                               |
| Companies without an agent | A fixed few are opted out (knocked out) or unclaimed (claim email sent).                                                                                              |
| Agent conversation         | Generated from templates and company profiles, with the spec's message types and disclosure tiers. No live AI runs.                                                   |
| Handoff package            | Selection report with runners-up, meeting agenda and transcript.                                                                                                      |
| Link to the MVP            | A booking creates a Notification and a ComMail conversation with the handoff package. "We met" and "We did business" then earn points as usual; the agent earns none. |
| Left out                   | Prices, chamber revenue share, cross-chamber search, and real calendar booking. The preview notes that pricing has not been decided.                                  |

## ComLinked Team Dashboard preview

Not an MVP feature, and not built in the real app. The plan has ComLinked Staff
use the database dashboard and postpones a custom console to Phase 2, so this is
simulated in the mockup and labeled "Preview: after the MVP".

| Part                   | In the mockup                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| How to open it         | From the presenter guide only, with its own "ComLinked team" header and no company navigation.                                      |
| Pilot health           | The 10 targets from Section 8.1 with current value and an on track or behind status, plus a weekly active companies trend.          |
| Companies needing help | A queue of companies that haven't claimed, have no lead yet, or have gone quiet.                                                    |
| Network safety         | Unusual points to clear or flag, flagged accounts and opt-outs.                                                                     |
| AI and agent           | AI Assistant use, and the 6 KPIs from the AI Lead Agent specification.                                                              |
| Data                   | A fixed activity record for the 99 other example companies that advances with simulated days, plus Kalayaan Foods' live actions.    |
| Chambers               | ECCP by name, with invented members marked as example data.                                                                         |
| Privacy                | Staff see counts, statuses and company names, never conversations or confidential items.                                            |
| Staff actions          | Send a claim reminder, make an intro, and clear or flag unusual points. Each is recorded in an activity log and affects the mockup. |
| Community Managers     | During the Pilot ComLinked supplies the Community Manager, awaiting Richard's answer. ComLinked Staff step in when one is waiting.  |

## Still needed before any launch

No launch is planned for now. These remain for when it is.

| Item                                       | Status      | Where it stands                                                                                                                    |
| ------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Project setup                              | Partly      | GitHub repo exists. This checkout has no `.env` or `.vercel` link, so the Supabase and Vercel connections are unconfirmed.         |
| `CLAUDE.md` written from the plan          | Done        | Vision section committed in `294593c`.                                                                                             |
| Database with real data                    | Not started | Only the template's tables exist: organizations, memberships, invitations and customers. Shared company data needs a design first. |
| Real sign-in                               | Partly      | See A3.                                                                                                                            |
| Real AI (`draft()` with the Anthropic API) | Not started |                                                                                                                                    |
| Email, web push and SMS                    | Not started | The plan names no SMS provider.                                                                                                    |
| Privacy and security review                | Not started | Needs a qualified person before real members join.                                                                                 |
| Member import and soft launch              | Not started | Last step in the build order.                                                                                                      |

## Open items for Richard

These are in the mockup but not settled by the plan. They are also listed in the
plan's [Adoption notes](2026-10-11-mvp-build-plan.md#adoption-notes).

- Scoring: 200 points reach the full 30% boost, the New Member Boost is 10%
  inside that ceiling, and Skip earns no daily lead list points.
- The Verified badge and the copy of every ComMail sent to the company's
  registered email come from the website, not the plan.
- Engine settings: the Fit Score weights, the 80 and 50 request thresholds and
  the overnight attention formula are placeholders.
- AI Lead Agent: the spec names its own pilot (PCCC in Canada from Jan 1, 2027)
  beside the MVP pilot at ECCP, is a paid upgrade, and messages other agents on
  its own, which conflicts with "AI drafts, a person decides".
- ComLinked Team Dashboard: the glossary defines a Superadmin as having
  unrestricted access, but the dashboard promises staff never see private
  content. The on track and behind labels also rely on pilot targets the plan
  calls starting points.
- The Pilot Preview's four choices, listed in its spec under
  [Questions for Richard](2026-11-17-pilot-preview.md#questions-for-richard):
  ComLinked supplies the Community Manager during the pilot; ECCP sends the claim
  links, so the Member List has no contact details; a Company shows its basics
  only before it claims; and Companies that have not claimed can still be
  Matches.
- Five questions from the meeting on 2026-11-18, listed in the
  [admins, privacy and Day 1k spec](2026-11-18-admins-privacy-and-day-1k.md#further-notes)
  and as OD-17 to OD-21 in the SRS: how many people a Company may have and
  whether any of it is paid later; whether the two admins are equal, as built;
  that only the person shares their own contact details; that names and titles
  show to connections by default, with contact details on request; and whether
  1,000 members with 100 named examples suits ECCP.

## Next decision for a real build

Decide whether a Company and a Chamber are each an Organization in the data
model. Feature A1 depends on it. See item 1 of the plan's
[Adoption notes](2026-10-11-mvp-build-plan.md#adoption-notes).

## Next.js port (mock data)

As of 2026-11-09, the app screens from the HTML mockup also exist in the Next.js app under
`/app/*`, running on a browser-held simulation behind `src/services/comlinked`
(see `docs/adr/0010-client-side-product-simulation.md`). Open `/app/claim` to start.

Ported: claim (A2, A3), matches (L1), ComDash (L2, D3, A4, D4, S2), Leads (D2), ComMail
(C2, C3, C4), Asks (L3), Wins (S1, S2, S3, D5), company profile (A4, A5, C1, C3), search
(L2), digest (D1), chamber tools (A1, L4), notifications (C1, L2), What's next, and the
Engine, AI Lead Agent and Team Dashboard previews. Data and sign-in are still simulated.

Since the port, the Next.js app has gained things the mockup does not have: a
redesigned public website ([spec](2026-11-09-website-redesign.md)) and, on 2026-11-11,
the redesigned ComDash ([spec](2026-11-11-comdash-redesign.md)). ComDash has five tabs
(Overview, Interest Signals, AI Lead Agent, Connections, Profile) and a labelled "View
as" switcher, whose Growth and Pro views are a demo of possible future pricing only.
The Network Ring, the rank card and Recent wins left ComDash. Since 2026-11-19 the full
Demo starts with that pricing off, so every name shows
([admins, privacy and Day 1k spec](2026-11-18-admins-privacy-and-day-1k.md)). The same
spec added the account menu on the company mark, with a page for admins and authorized
users and a privacy page; a People section and Contact Requests on connected profiles;
the chamber of 1,000; and Kalayaan Foods' logo. With this redesign the
Next.js app became the main version again; the HTML mockup is frozen as the backup.
