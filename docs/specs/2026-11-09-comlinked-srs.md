# ComLinked Software Requirements Specification

Version 0.2, Draft for review · 2026-11-10

## Document control

| Field       | Value                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| Document    | ComLinked Software Requirements Specification                                 |
| Version     | 0.2, Draft                                                                    |
| Date        | 2026-11-10                                                                    |
| Status      | For review by Richard. Not yet approved.                                      |
| Master copy | `docs/specs/2026-11-09-comlinked-srs.md`. The Word copy is generated from it. |

| Version | Date       | Change                                                                                                                 |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| 0.1     | 2026-11-09 | First draft, from the MVP Build Plan, AI Lead Agent specification, mockup decisions and repository rules.              |
| 0.2     | 2026-11-10 | ECCP replaces PCCI–Quezon City as the first pilot (section 1.4). OD-01 now asks only about the agent's Canadian pilot. |

### How to read this document

The document has three parts. Each answers a different question.

| Part             | Question it answers                                            | Who it is for                         |
| ---------------- | -------------------------------------------------------------- | ------------------------------------- |
| Part 1: Real MVP | What must the product do at launch?                            | Developers, testers, product owner    |
| Part 2: Phase 2  | What comes after the MVP, and how must it behave?              | Product owner, future build team      |
| Part 3: Mockup   | What does the demo do today, and what in it is only simulated? | Anyone presenting or reading the demo |

Each requirement has an ID, a priority, a description, testable acceptance criteria and a source.

| Priority | Meaning                                                           |
| -------- | ----------------------------------------------------------------- |
| Must     | The release cannot ship without it.                               |
| Should   | Important, but the release can ship with a documented workaround. |
| Could    | Include if time allows.                                           |

| Source tag | Meaning                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| Plan       | From the ComLinked MVP Build Plan, with its section number.               |
| Added      | Added after the plan, through mockup decisions. Richard to confirm.       |
| Website    | Promised by the approved website but not in the plan. Richard to confirm. |
| Spec       | From the AI Lead Agent Task Document, with its section number.            |
| Repo       | Already enforced by the codebase, or recorded in an ADR.                  |

Numbers are marked **Firm** when the plan or repository fixes them, and **Proposed** when they are starting points to confirm. Every Proposed number that affects product behavior is a configuration setting, listed in section 4.3.

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for ComLinked, a company-to-company network for chamber of commerce members. It gives a development team enough detail to estimate, build and test the MVP, and records the requirements for planned post-MVP work.

### 1.2 Product vision

The MVP is completely free, with no payments, paywall or premium tiers. It has one job: get a new company its first real lead within 24 hours, then give it a reason to come back every day.

Every MVP feature must help companies sign up, get leads, return daily, talk to other companies or share wins. Anything else waits until after launch.

### 1.3 Scope

**In scope for the MVP (Part 1):** 21 product features in five groups, chamber and community manager basics, the additions tagged Added, and the existing marketing website.

**Planned after the MVP (Part 2):** the AI Lead Agent and the ComLinked Team Dashboard.

**Out of scope:** the items in section 15.

### 1.4 Pilot

The MVP pilot is ECCP, the European Chamber of Commerce of the Philippines, decided on 2026-11-10. It replaces PCCI–Quezon City, which the plan named first. Which chambers follow, and in what order, is not yet set; the plan's other candidates are PCCI–Quezon City and the Toronto Region Board of Trade. The soft launch covers 30 to 50 companies and opens to all members after two weeks of fixes. The AI Lead Agent specification names its own pilot in Canada; see OD-01 in section 14.

### 1.5 References

| Reference                                             | Location                                             |
| ----------------------------------------------------- | ---------------------------------------------------- |
| ComLinked MVP Build Plan, with Adoption notes         | `docs/specs/2026-10-11-mvp-build-plan.md`            |
| AI Lead Agent Task Document and Process Specification | `docs/specs/2026-10-21-ai-lead-agent.pdf`            |
| AI Lead Agent simulator                               | `docs/specs/2026-10-21-ai-lead-agent-simulator.html` |
| MVP feature status                                    | `docs/specs/2026-11-08-mvp-feature-status.md`        |
| Coding standards                                      | `docs/specs/2026-07-31-coding-standards.md`          |
| Multi-tenancy specification                           | `docs/specs/2026-07-15-multi-tenancy.md`             |
| Architecture decisions                                | `docs/adr/` (ADR 0001 to 0009)                       |
| Domain glossary                                       | `CONTEXT.md`                                         |
| Contributor rules                                     | `AGENTS.md`, `CLAUDE.md`                             |
| Design system and website                             | `docs/design-system/`, `src/components/marketing/`   |
| Clickable mockup, local only                          | `docs/mockup/index.html`                             |

### 1.6 Definitions

Domain terms are capitalized, defined in section 16 and maintained in `CONTEXT.md`.

## 2. Overall description

### 2.1 Product perspective

ComLinked is a new mobile-first web application built on an existing Next.js template. The template provides authentication, a dashboard shell, a typed data layer, multi-tenant row-level security, testing and CI. The marketing website is already implemented. No product screens exist in the real application yet.

### 2.2 Product functions: the daily lead loop

Every MVP feature supports one step of this loop:

1. **Morning Digest:** new Leads, profile views and rank change.
2. **Act on today's Leads:** Connect, Message or answer an Ask in a few taps.
3. **Talk and close:** ComMail, with AI Drafts if on, then confirm the deal.
4. **Share the win:** a Testimonial, shared to social media.
5. **Rank rises:** the Activity Score lifts the Company in search, which brings more views into the next digest.

### 2.3 Users and roles

| Role                      | Who                                                                   | Main capabilities                                                    |
| ------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Visitor                   | Anyone not signed in                                                  | Read the marketing website, start a Join or Claim                    |
| Authorized Representative | A person allowed to act for a Company. Org Roles `owner` and `admin`. | All company-side features                                            |
| Company member            | Org Role `member`                                                     | Read the Company's data. Cannot send Connection Requests or ComMail. |
| Community Manager         | Works for a Chamber                                                   | Chamber tools for that Chamber only                                  |
| ComLinked Staff           | Works for ComLinked                                                   | Database dashboard in the MVP. Platform Role `superadmin`.           |
| Unclaimed Company         | A listed business with no users                                       | Has a directory profile and receives claim links                     |

| Capability                                     | Visitor | Authorized Representative | Company member   | Community Manager | ComLinked Staff |
| ---------------------------------------------- | ------- | ------------------------- | ---------------- | ----------------- | --------------- |
| Read marketing website                         | Yes     | Yes                       | Yes              | Yes               | Yes             |
| Read directory profiles in own Chamber Network | No      | Yes                       | Yes              | Yes               | Yes             |
| Edit own Company profile                       | No      | Yes                       | No               | No                | Database only   |
| Send Connection Requests, ComMail and Asks     | No      | Yes                       | No               | No                | No              |
| Read a Company's ComMail                       | No      | Own Company only          | Own Company only | No                | See OD-05       |
| Import members, send intros and announcements  | No      | No                        | No               | Own Chamber       | Database only   |
| Review unusual points                          | No      | No                        | No               | Own Chamber       | Database only   |

### 2.4 Constraints

| ID     | Constraint                                                                                           | Source           |
| ------ | ---------------------------------------------------------------------------------------------------- | ---------------- |
| CON-01 | No payments, paywall or premium tiers in the MVP.                                                    | Plan 1           |
| CON-02 | Web application only, mobile first. No native apps.                                                  | Plan 1, 6        |
| CON-03 | English only for the MVP.                                                                            | Plan 6           |
| CON-04 | Next.js 15 App Router, React 19, strict TypeScript, Tailwind v4, shadcn/ui, pnpm.                    | Repo             |
| CON-05 | Supabase for database, authentication and storage, in the Singapore region for the Philippine pilot. | Plan 7, ADR 0002 |
| CON-06 | Vercel hosting, with a preview link for every change.                                                | Plan 7           |
| CON-07 | Anthropic API for profile pre-building, Match Reasons and the AI Assistant.                          | Plan 7           |
| CON-08 | Screens and Server Actions access data only through `src/services/*`.                                | ADR 0003         |
| CON-09 | Reads use React Server Components. Writes use `'use server'` actions validated with `zod`.           | ADR 0004         |
| CON-10 | No custom admin console. Staff use the database dashboard.                                           | Plan 3.6, 6      |
| CON-11 | A person must approve every outgoing message. The AI Assistant never sends on its own.               | Plan 5.2         |

### 2.5 Assumptions and dependencies

| ID     | Assumption or dependency                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| ASM-01 | Chambers supply member lists with enough detail to find each company's public information.                 |
| ASM-02 | An SMS provider will be chosen before A2 and A3 ship (OD-02).                                              |
| ASM-03 | Google and Facebook sign-in need provider apps registered and configured in Supabase.                      |
| ASM-04 | Each user account belongs to one Company in the MVP. The data model allows more, but no screen exposes it. |
| ASM-05 | Org Roles `owner` and `admin` are treated as Authorized Representatives. Richard to confirm.               |
| ASM-06 | Community Managers work for the Chamber, and ComLinked Staff step in when a Company is waiting.            |

# Part 1: Real MVP

## 3. Functional requirements

### 3.1 Get listed (A1 to A5)

**A1. Pre-built company profiles**

| ID       | Requirement                                                                                                           | Priority | Acceptance criteria                                                                              | Source      |
| -------- | --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ | ----------- |
| FR-A1-01 | The system shall hold a directory profile for each listed Company before any user claims it.                          | Must     | A profile can exist with no linked Organization and appears in its Chamber Network's search.     | Plan 3.1    |
| FR-A1-02 | The system shall draft profile fields with AI from the Company's website, Facebook page or public directory listings. | Must     | Given a company with a public source, a draft description, offers and seeks are created.         | Plan 3.1, 7 |
| FR-A1-03 | The system shall store the source of every generated field.                                                           | Must     | Each AI-generated field shows a recorded source URL in the data.                                 | Added       |
| FR-A1-04 | Pre-building shall run as a background job with a recorded status.                                                    | Must     | A failed build is marked failed, can be retried, and does not stop other companies in the batch. | Added       |
| FR-A1-05 | Unclaimed profiles shall be distinguishable from claimed ones.                                                        | Must     | Search and profile data expose a claimed or unclaimed status.                                    | Added       |

**A2. Claim your profile**

| ID       | Requirement                                                                                                                             | Priority | Acceptance criteria                                                           | Source               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- | -------------------- |
| FR-A2-01 | The system shall send a personal claim link for a Company by email or SMS.                                                              | Must     | A link opens that Company's claim flow without searching.                     | Plan 3.1             |
| FR-A2-02 | The message shall read "Your company is on ComLinked. 3 companies are already a match." only when at least 3 Matches exist.             | Must     | With fewer than 3 Matches, the match claim is omitted.                        | Plan 3.1, Adoption 8 |
| FR-A2-03 | A claim link shall expire after 30 days (Proposed) and stop working once the Company is claimed.                                        | Must     | An expired or used link shows a way to request a new one.                     | Added                |
| FR-A2-04 | The claimer shall confirm "I'm authorized to connect my company with other companies on its behalf."                                    | Must     | A claim cannot complete with this unconfirmed.                                | Website              |
| FR-A2-05 | Claiming shall show "Your profile, and which companies view it, are visible to other companies on ComLinked." and record acceptance.    | Must     | The notice version and time are stored for each claim.                        | Plan 8.3             |
| FR-A2-06 | A claim shall create one Organization, link it to the Company and make the claimer its `owner`.                                         | Must     | After a claim, the claimer's Membership has Org Role `owner`.                 | Added, ADR 0009      |
| FR-A2-07 | The claimer shall review and correct the pre-built profile before confirming.                                                           | Must     | Edits made during the claim are saved.                                        | Plan 3.1             |
| FR-A2-08 | A Company not yet listed shall be able to create a profile, collecting company name, name, role, work email, chamber and authorization. | Must     | A new Company reaches its Day-one Matches at the end of the flow.             | Website              |
| FR-A2-09 | A claimed Company shall display a Verified badge.                                                                                       | Should   | The badge appears on claimed profiles only. How claims are verified is OD-08. | Website              |

**A3. Easy sign-in**

| ID       | Requirement                                                     | Priority | Acceptance criteria                                                                 | Source   |
| -------- | --------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- | -------- |
| FR-A3-01 | Users shall sign in with Google.                                | Must     | Completing Google sign-in creates a session.                                        | Plan 3.1 |
| FR-A3-02 | Users shall sign in with Facebook.                              | Must     | Completing Facebook sign-in creates a session.                                      | Plan 3.1 |
| FR-A3-03 | Users shall sign in with an email magic link.                   | Must     | A valid link creates a session, and an expired link shows a retry path.             | Plan 3.1 |
| FR-A3-04 | Users shall sign in with a mobile number and one-time code.     | Must     | A correct code creates a session, and an incorrect code shows an error without one. | Plan 3.1 |
| FR-A3-05 | All sign-in methods shall use Supabase Auth with the PKCE flow. | Must     | No other authentication provider is called.                                         | ADR 0002 |

**A4. Profile strength meter**

| ID       | Requirement                                                                                          | Priority | Acceptance criteria                                        | Source   |
| -------- | ---------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- | -------- |
| FR-A4-01 | The system shall show profile strength as 0 to 100%.                                                 | Must     | The value updates immediately after a profile change.      | Plan 3.1 |
| FR-A4-02 | The meter shall show the single next step and its gain, for example "Add your top 3 products: +15%". | Must     | Exactly one next step shows until the profile is complete. | Plan 3.1 |
| FR-A4-03 | Each company field's contribution shall be a configuration setting.                                  | Should   | Changing a weight changes strength without a code change.  | Added    |

**A5. Invite your business partners**

| ID       | Requirement                                                                                     | Priority | Acceptance criteria                                       | Source      |
| -------- | ----------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------- | ----------- |
| FR-A5-01 | An Authorized Representative shall invite customers and suppliers by link, email or chat share. | Must     | Each invite records the inviting Company.                 | Plan 3.1    |
| FR-A5-02 | When an invited Company joins and claims, the inviter shall earn the points in BR-09.           | Must     | Points appear once for each Company that claims.          | Plan 3.1, 4 |
| FR-A5-03 | The invited Company shall receive the New Member Boost as its ranking boost.                    | Must     | The partner appears in search with the boost for 30 days. | Added       |

### 3.2 Leads on day one (L1 to L4)

**L1. Day-one Matches**

| ID       | Requirement                                                                                             | Priority | Acceptance criteria                                      | Source      |
| -------- | ------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------- | ----------- |
| FR-L1-01 | Immediately after a Claim, the system shall show the 3 highest Fit Score Matches.                       | Must     | 3 Matches appear on first arrival when at least 3 exist. | Plan 3.2    |
| FR-L1-02 | Each Match shall show a one-line Match Reason.                                                          | Must     | No Match shows without a reason.                         | Plan 3.2    |
| FR-L1-03 | Each Match shall offer Connect, Message and Skip.                                                       | Must     | All three work from the Match card.                      | Plan 3.3    |
| FR-L1-04 | If fewer than 3 Matches exist, the Company shall appear in the Community Manager's needs-an-intro list. | Must     | The Company is listed in the activity view.              | Plan 1, 3.2 |

**L2. ComDash Interest Signals**

| ID       | Requirement                                                                                                 | Priority | Acceptance criteria                           | Source   |
| -------- | ----------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------- | -------- |
| FR-L2-01 | ComDash shall list who found the Company in search, viewed its profile, messaged it, or was recommended it. | Must     | All four types are recorded and listed.       | Plan 3.2 |
| FR-L2-02 | Every Interest Signal shall show the company name free of charge.                                           | Must     | No name is blurred or hidden for any Company. | Plan 1   |
| FR-L2-03 | Search signals shall show the term that found the Company.                                                  | Should   | A search signal displays its term.            | Website  |
| FR-L2-04 | ComDash shall show counts of search appearances, profile views and recommendations.                         | Must     | Counts match the underlying signals.          | Website  |
| FR-L2-05 | A Company shall not generate Interest Signals on its own profile.                                           | Must     | Viewing your own profile records nothing.     | Added    |

**L3. Asks Board**

| ID       | Requirement                                                                                      | Priority | Acceptance criteria                                                                 | Source          |
| -------- | ------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------- | --------------- |
| FR-L3-01 | An Authorized Representative shall post an Ask.                                                  | Must     | The Ask appears on the Asks Board.                                                  | Plan 3.2        |
| FR-L3-02 | The system shall match an Ask's keywords to what Companies offer and notify those Companies.     | Must     | A packaging Ask notifies Companies offering packaging and shows the notified count. | Plan 3.2, Added |
| FR-L3-03 | If an Ask matches no Company, the poster shall be told and advised to name a product or service. | Should   | The message appears and no one is notified.                                         | Added           |
| FR-L3-04 | A Company shall respond to an Ask through ComMail.                                               | Must     | Responding opens a ComMail conversation that references the Ask.                    | Plan 3.2        |
| FR-L3-05 | Asks matching what a Company offers shall be labeled and notified.                               | Should   | The label appears only on matching Asks.                                            | Added           |
| FR-L3-06 | The AI Assistant shall offer Polish on an Ask when switched on.                                  | Should   | Polished text is marked AI Draft until edited or posted.                            | Plan 5.1        |

**L4. Community Manager Intros**

| ID       | Requirement                                                                   | Priority | Acceptance criteria                                     | Source        |
| -------- | ----------------------------------------------------------------------------- | -------- | ------------------------------------------------------- | ------------- |
| FR-L4-01 | A Community Manager shall introduce two member Companies.                     | Must     | Both Companies receive the Intro.                       | Plan 3.2, 3.6 |
| FR-L4-02 | An Intro shall appear on the Company's ComDash and in its Notifications.      | Must     | The Intro shows the other Company and its Match Reason. | Added         |
| FR-L4-03 | Companies with no organic Lead shall be highlighted to the Community Manager. | Must     | They appear in the needs-an-intro list.                 | Plan 3.2      |

### 3.3 Come back every day (D1 to D5)

**D1. Morning Digest**

| ID       | Requirement                                                                                                                                                    | Priority | Acceptance criteria                                                | Source     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ | ---------- |
| FR-D1-01 | The system shall send a Morning Digest by web push and email at 8:00 a.m. in the Company's time zone.                                                          | Must     | The default for the Philippine pilot is Asia/Manila.               | Plan 3.3   |
| FR-D1-02 | The digest shall state new Leads, Companies that viewed the profile and rank change, for example "4 new leads, 2 companies viewed you, you moved up 3 places". | Must     | Numbers match that day's data.                                     | Plan 3.3   |
| FR-D1-03 | Users without web push shall still receive the email.                                                                                                          | Must     | iPhone users who have not installed the web app receive the email. | Adoption 9 |
| FR-D1-04 | Each user shall be able to turn the digest email off.                                                                                                          | Must     | An unsubscribe control works and is honored.                       | Added      |
| FR-D1-05 | The digest job shall be idempotent.                                                                                                                            | Must     | Running it twice for one day sends one digest.                     | Added      |

**D2. Daily Lead List**

| ID       | Requirement                                                                         | Priority | Acceptance criteria                                                  | Source   |
| -------- | ----------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- | -------- |
| FR-D2-01 | Each day the system shall give a Company 5 new Matches with the highest Fit Scores. | Must     | The list shows up to 5 Companies not previously listed or connected. | Plan 3.3 |
| FR-D2-02 | Each Lead shall offer Connect, Message or Skip.                                     | Must     | The chosen action is recorded.                                       | Plan 3.3 |
| FR-D2-03 | A Skip shall lower the Fit Score of similar Companies in future lists.              | Must     | After a skip, that category scores lower on the next list.           | Plan 3.3 |
| FR-D2-04 | The list shall show progress and a finished state.                                  | Should   | After all 5 are actioned, it says new Leads arrive at 8:00 a.m.      | Plan 3.3 |

**D3. Activity Score and Search Rank**

| ID       | Requirement                                                                                           | Priority | Acceptance criteria                                                               | Source |
| -------- | ----------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- | ------ |
| FR-D3-01 | The system shall calculate an Activity Score from the rules in BR-01 to BR-09 over a rolling 30 days. | Must     | Points older than 30 days stop counting.                                          | Plan 4 |
| FR-D3-02 | ComDash shall show the score and rank, such as "#4 of 12 in Food Suppliers".                          | Must     | The rank equals the Company's position among its category in its Chamber Network. | Plan 4 |
| FR-D3-03 | ComDash shall show the single next action worth the most points.                                      | Must     | The action shown is available and within limits.                                  | Plan 4 |
| FR-D3-04 | ComDash shall show what earns points and each limit.                                                  | Should   | All 9 rules are listed.                                                           | Added  |
| FR-D3-05 | Every point award shall be recorded with its rule, Company, counterparty and date.                    | Must     | The score can be recalculated from the ledger.                                    | Added  |

**D4. Freshness Nudges**

| ID       | Requirement                                                                                                                                           | Priority | Acceptance criteria                                      | Source   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------- | -------- |
| FR-D4-01 | After 14 days without a profile change, the system shall prompt: "Your profile hasn't changed in 14 days. Add a recent project to stay near the top." | Must     | The prompt appears on day 14 and clears after an update. | Plan 3.3 |

**D5. Monthly Top Companies**

| ID       | Requirement                                                                          | Priority | Acceptance criteria                  | Source      |
| -------- | ------------------------------------------------------------------------------------ | -------- | ------------------------------------ | ----------- |
| FR-D5-01 | Each Chamber shall have a leaderboard of its 10 most active Companies for the month. | Must     | The list resets each calendar month. | Plan 3.3    |
| FR-D5-02 | The leaderboard shall be recognition only.                                           | Must     | No prizes, badges or tiers appear.   | Plan 3.3, 6 |

### 3.4 Talk to other companies (C1 to C4)

**C1. Company Connections**

| ID       | Requirement                                                                                    | Priority | Acceptance criteria                                        | Source            |
| -------- | ---------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- | ----------------- |
| FR-C1-01 | An Authorized Representative shall send a Connection Request on behalf of the Company.         | Must     | Company members cannot send one.                           | Plan 3.4          |
| FR-C1-02 | A Connection shall exist only after an Authorized Representative of the other Company accepts. | Must     | No Connection forms without acceptance.                    | Plan 3.4          |
| FR-C1-03 | Connections shall belong to the Company and remain when a representative leaves.               | Must     | Removing a representative leaves all Connections in place. | Plan 1, 3.4       |
| FR-C1-04 | An owner shall be able to assign or remove Authorized Representatives.                         | Must     | A removed representative loses access immediately.         | Website, ADR 0005 |

**C2. ComMail**

| ID       | Requirement                                                                                        | Priority | Acceptance criteria                                              | Source   |
| -------- | -------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- | -------- |
| FR-C2-01 | The system shall provide company-to-company conversations.                                         | Must     | Both Companies' Authorized Representatives see the conversation. | Plan 3.4 |
| FR-C2-02 | ComMail shall provide introduction, quote request and partnership templates.                       | Must     | Each template fills the message box and stays editable.          | Plan 3.4 |
| FR-C2-03 | Any Company in the Chamber Network shall be able to message any other, free, without a Connection. | Must     | A non-connected Company can be messaged.                         | Added    |
| FR-C2-04 | Each message shall record the representative who sent it, for the Company.                         | Must     | The sender's name shows on the message.                          | Added    |
| FR-C2-05 | Each ComMail shall also be sent to the Company's registered email.                                 | Should   | The email arrives after each new message.                        | Website  |

**C3. AI Assistant switch**

| ID       | Requirement                                                                                                                                                                             | Priority | Acceptance criteria                                        | Source   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- | -------- |
| FR-C3-01 | Each Company shall have one AI Assistant: On / Off switch with the line "When on, AI writes a draft for you. Nothing is sent until you tap Send."                                       | Must     | One setting applies to the whole Company.                  | Plan 5   |
| FR-C3-02 | The switch shall start on for new Companies, take effect immediately and log each change.                                                                                               | Must     | The log records who changed it and when.                   | Plan 5.2 |
| FR-C3-03 | With the Assistant on, the system shall write an introduction, suggest a reply, draft a follow-up after 3 days without a reply, and polish profile descriptions, Asks and Testimonials. | Must     | Each of the four jobs produces a draft.                    | Plan 5.1 |
| FR-C3-04 | With the Assistant off, every screen shall work the same way, with an empty message box and templates; a reminder replaces the follow-up draft.                                         | Must     | All flows complete with the switch off.                    | Plan 5   |
| FR-C3-05 | Every message shall need one tap from a person.                                                                                                                                         | Must     | No code path sends without a user action.                  | Plan 5.2 |
| FR-C3-06 | Drafts shall use only the two Companies' profiles and the message thread.                                                                                                               | Must     | Prompt inputs contain no other Company's data.             | Plan 5.2 |
| FR-C3-07 | Drafts shall be labeled "AI draft" until edited or sent.                                                                                                                                | Must     | Editing removes the label.                                 | Plan 5.2 |
| FR-C3-08 | Drafting shall go through one server function, `draft(task, context)`, with four prompt templates.                                                                                      | Must     | No other code calls the Anthropic API for these jobs.      | Plan 5.3 |
| FR-C3-09 | Drafts shall be limited per Company per day, by default 30.                                                                                                                             | Must     | At the limit, the box is empty and a message explains why. | Plan 5.3 |

**C4. Outcome buttons**

| ID       | Requirement                                                   | Priority | Acceptance criteria                     | Source   |
| -------- | ------------------------------------------------------------- | -------- | --------------------------------------- | -------- |
| FR-C4-01 | Each conversation shall offer "We met" and "We did business". | Must     | Either Company can start one.           | Plan 3.4 |
| FR-C4-02 | An Outcome shall count only when both Companies confirm.      | Must     | One-sided confirmation earns no points. | Plan 4   |
| FR-C4-03 | Outcome points shall follow BR-06 and BR-07.                  | Must     | Limits apply per counterparty.          | Plan 4   |

### 3.5 Share the wins (S1 to S3)

| ID       | Requirement                                                                                                            | Priority | Acceptance criteria                                                 | Source          |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- | --------------- |
| FR-S1-01 | After both Companies confirm "We did business", each shall be asked what it needed and what happened.                  | Must     | Both Companies receive the prompt.                                  | Plan 3.5        |
| FR-S1-02 | Polish shall be available on Testimonials when the Assistant is on.                                                    | Should   | Polished text can be edited before posting.                         | Plan 3.5        |
| FR-S2-01 | The Success Wall shall show recent Testimonials and deals, with the latest on ComDash as Recent Wins.                  | Must     | A new Testimonial appears in both places.                           | Plan 3.5, Added |
| FR-S2-02 | A Testimonial shall appear on both Companies' profiles.                                                                | Must     | It is visible on each profile.                                      | Plan 3.5        |
| FR-S3-01 | A Testimonial shall be shareable as a card to Facebook, LinkedIn or Viber, with ComLinked branding and a sign-up link. | Must     | Each option opens the platform's share flow with the card and link. | Plan 3.5        |

### 3.6 Chamber and Community Manager basics

| ID       | Requirement                                                                            | Priority | Acceptance criteria                                               | Source          |
| -------- | -------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------- | --------------- |
| FR-CH-01 | A Community Manager shall upload a member list and preview its rows before processing. | Must     | Invalid rows are reported and do not block valid ones.            | Plan 3.6        |
| FR-CH-02 | Importing shall build a profile for each Company and send claim links.                 | Must     | Each row ends as built, sent or failed.                           | Plan 3.6        |
| FR-CH-03 | The activity view shall show who has claimed, who is active and who needs an intro.    | Must     | Counts match the member list.                                     | Plan 3.6        |
| FR-CH-04 | A Community Manager shall send an announcement to all members.                         | Must     | Every member Company receives it on ComDash and in Notifications. | Plan 3.6        |
| FR-CH-05 | A Community Manager shall review unusual spikes in points and clear or flag them.      | Must     | The decision and reviewer are recorded.                           | Plan 4          |
| FR-CH-06 | Community Manager access shall be limited to that Chamber.                             | Must     | Another Chamber's data cannot be read.                            | Added, ADR 0009 |
| FR-CH-07 | ComLinked Staff shall operate through the database dashboard.                          | Must     | No custom admin screens are added in the MVP.                     | Plan 3.6        |

### 3.7 Network and matching (added after the plan)

| ID        | Requirement                                                                                                                                         | Priority | Acceptance criteria                                  | Source         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------- | -------------- |
| FR-NET-01 | A Connection Request shall be pending until accepted or ignored.                                                                                    | Must     | Both states are stored and shown.                    | Added          |
| FR-NET-02 | The sender shall be able to withdraw a pending request.                                                                                             | Must     | The request disappears for both sides.               | Added          |
| FR-NET-03 | Ignoring a request shall not notify the sender.                                                                                                     | Must     | No notification is created.                          | Added          |
| FR-NET-04 | Accepting in either direction shall earn the points in BR-05.                                                                                       | Must     | Points are awarded to both Companies, within limits. | Plan 4         |
| FR-NET-05 | The system shall show Connection Degree (1st, 2nd, 3rd) on Companies.                                                                               | Must     | Labels update when Connections change.               | Added          |
| FR-NET-06 | The system shall show Mutual Connections on leads and profiles.                                                                                     | Must     | Only Companies connected to both are listed.         | Added          |
| FR-NET-07 | Other Companies shall see only a Company's Connection count and Mutual Connections.                                                                 | Must     | The full list is visible only to that Company.       | Added          |
| FR-NET-08 | Each Chamber Network shall be separate.                                                                                                             | Must     | Search, Matches and Degrees exclude other Chambers.  | Website, Added |
| FR-MAT-01 | The system shall calculate a Fit Score from 0 to 100 from BR-14.                                                                                    | Must     | The calculation uses configured weights.             | Added          |
| FR-MAT-02 | Each Lead shall show its Fit Score, Match Reason and any Mutual Connections.                                                                        | Must     | All three appear on the Lead card.                   | Website, Added |
| FR-NTF-01 | The system shall provide a notification center with an unread count.                                                                                | Must     | Opening it clears the unread count.                  | Added          |
| FR-NTF-02 | Events shall include Connection Requests, acceptances, ComMail replies, profile views, search appearances, matching Asks, Intros and announcements. | Must     | Each event creates a Notification.                   | Added          |
| FR-NTF-03 | Same-day profile views and search appearances shall be grouped.                                                                                     | Should   | Three views show as one grouped entry.               | Added          |
| FR-NTF-04 | A Connection Request shall be acceptable or ignorable from the notification center.                                                                 | Must     | Acting removes it from the list.                     | Added          |
| FR-SRC-01 | Companies shall search their Chamber Network by industry, product or need.                                                                          | Must     | Results return only from that Chamber Network.       | Plan 7.2       |
| FR-SRC-02 | Results shall be ordered by BR-11. Connection Degree shall not affect order.                                                                        | Must     | Two viewers see the same order.                      | Plan 4, Added  |
| FR-SRC-03 | Each Company shall have a profile page showing offers, seeks, products and Testimonials.                                                            | Must     | Viewing it records an Interest Signal.               | Plan 7.2       |

### 3.8 Website and measurement

| ID        | Requirement                                                                           | Priority | Acceptance criteria                                           | Source   |
| --------- | ------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------- | -------- |
| FR-WEB-01 | The website shall provide Home, How it works, ComDash, For chambers and Sign in.      | Must     | All five are reachable and responsive.                        | Repo     |
| FR-WEB-02 | The join form shall create a Company profile.                                         | Must     | Submitting starts the flow in FR-A2-08.                       | Website  |
| FR-WEB-03 | The chamber pilot form shall record a request.                                        | Should   | A submission reaches ComLinked Staff.                         | Website  |
| FR-WEB-04 | No unconfirmed placeholder or claim shall appear on the live website.                 | Must     | No `[CONFIRM]`, `[PILOT CHAMBER]` or similar text is present. | Plan 8.3 |
| FR-MET-01 | The system shall record what is needed to calculate the pilot targets in section 9.2. | Must     | Each target can be calculated from stored data.               | Plan 8.1 |

## 4. Business rules and configuration

### 4.1 Activity Score

| ID    | Action                                                   | Points | Limit                           | Status |
| ----- | -------------------------------------------------------- | ------ | ------------------------------- | ------ |
| BR-01 | Open the Daily Lead List and act on at least one Company | 2      | Once a day                      | Firm   |
| BR-02 | Update the profile (new product, project or photo)       | 5      | Twice a week                    | Firm   |
| BR-03 | Reply to a ComMail within 24 hours                       | 3      | 5 a day                         | Firm   |
| BR-04 | Post an Ask, or respond to another Company's Ask         | 5      | 3 a day                         | Firm   |
| BR-05 | Connection accepted, in either direction                 | 5      | 10 a day                        | Firm   |
| BR-06 | Meeting confirmed by both Companies                      | 10     | 2 a week with the same Company  | Firm   |
| BR-07 | Deal confirmed by both Companies                         | 25     | 2 a month with the same Company | Firm   |
| BR-08 | Testimonial posted                                       | 15     | One per deal                    | Firm   |
| BR-09 | A Company you invited joins and claims its profile       | 10     | No limit (OD-04)                | Firm   |

### 4.2 Ranking and matching rules

| ID    | Rule                                                                                                                                                                                                                                                                                    | Status              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| BR-10 | The Activity Score counts points from the last 30 days.                                                                                                                                                                                                                                 | Firm                |
| BR-11 | Search rank = relevance to the search × (1 + Activity boost of up to 30%). Relevance always comes first.                                                                                                                                                                                | Firm                |
| BR-12 | Every new Company gets the same 30-day New Member Boost, counted inside the 30% ceiling.                                                                                                                                                                                                | Firm, size Proposed |
| BR-13 | The Activity boost reaches 30% at the configured point total.                                                                                                                                                                                                                           | Proposed            |
| BR-14 | Fit Score = 12 (start) + seeks what you offer (30, or 40 for 2 or more overlaps) + offers what you seek (30) + 5 per Mutual Connection, up to 15 + same city 10, or same metro 5, − 8 per skip in that category, up to 16, − 25 if it offers the same as you. Clamped to 20 through 98. | Proposed            |
| BR-15 | A Skip does not earn BR-01 points.                                                                                                                                                                                                                                                      | Proposed            |
| BR-16 | Meetings and deals count only when both Companies confirm.                                                                                                                                                                                                                              | Firm                |
| BR-17 | The score, rank and Fit Score shall be calculated on the server only.                                                                                                                                                                                                                   | Added               |

### 4.3 Configuration settings

| ID     | Setting                       | Default                                    | Status                         |
| ------ | ----------------------------- | ------------------------------------------ | ------------------------------ |
| CFG-01 | Maximum search boost          | 30%                                        | Firm                           |
| CFG-02 | Points for the full boost     | 200                                        | Proposed                       |
| CFG-03 | New Member Boost              | 10% for 30 days                            | Proposed                       |
| CFG-04 | Fit Score weights             | See BR-14                                  | Proposed                       |
| CFG-05 | Day-one Matches               | 3                                          | Firm                           |
| CFG-06 | Daily Leads                   | 5                                          | Firm                           |
| CFG-07 | Digest hour and time zone     | 8:00 a.m., Asia/Manila                     | Firm                           |
| CFG-08 | Freshness nudge               | 14 days                                    | Firm                           |
| CFG-09 | Follow-up prompt              | 3 days without a reply                     | Firm                           |
| CFG-10 | AI drafts per Company per day | 30                                         | Firm as an example in the plan |
| CFG-11 | Profile strength weights      | Products 15, project 10, photo 10, base 65 | Proposed                       |
| CFG-12 | Claim link lifetime           | 30 days                                    | Proposed                       |

## 5. Non-functional requirements

### 5.1 Performance

| ID         | Requirement                                                                                         | Status   |
| ---------- | --------------------------------------------------------------------------------------------------- | -------- |
| NFR-PER-01 | Largest Contentful Paint at or under 2.5 seconds at the 75th percentile on a mid-range phone on 4G. | Proposed |
| NFR-PER-02 | Server Action response at or under 1 second at the 95th percentile, excluding AI calls.             | Proposed |
| NFR-PER-03 | Search results at or under 500 milliseconds at the 95th percentile.                                 | Proposed |
| NFR-PER-04 | AI Draft returned within 10 seconds at the 95th percentile.                                         | Proposed |
| NFR-PER-05 | All digests queued within 5 minutes of the scheduled time.                                          | Proposed |

### 5.2 Security

| ID         | Requirement                                                                                                                                    | Status         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| NFR-SEC-01 | Authentication through Supabase Auth with PKCE; sessions verified with the auth server on protected requests.                                  | Firm, Repo     |
| NFR-SEC-02 | Every tenant table protected by row-level security, tested against a real Postgres.                                                            | Firm, ADR 0005 |
| NFR-SEC-03 | All writes validated server-side with `zod`.                                                                                                   | Firm, ADR 0004 |
| NFR-SEC-04 | Nonce-based Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy and COOP/CORP on responses. | Firm, Repo     |
| NFR-SEC-05 | Roles read from `app_metadata`; client-set metadata never trusted.                                                                             | Firm, Repo     |
| NFR-SEC-06 | Database credentials, service keys and the Anthropic API key used on the server only.                                                          | Firm, ADR 0006 |
| NFR-SEC-07 | CodeQL analysis and Dependabot updates.                                                                                                        | Firm, Repo     |
| NFR-SEC-08 | Rate limits on sign-in, claim links, Connection Requests and AI drafts.                                                                        | Proposed       |

### 5.3 Privacy and compliance

| ID         | Requirement                                                                                                                                  | Status         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| NFR-PRV-01 | A privacy and security review against the Philippine Data Privacy Act and National Privacy Commission requirements before real members join. | Firm, Plan 8.3 |
| NFR-PRV-02 | The review shall cover building profiles from public sources and contacting companies before they opt in.                                    | Adoption 10    |
| NFR-PRV-03 | Pilot data stored in the Singapore Supabase region. A Canadian region added before Toronto, with Canadian privacy review.                    | Firm, Plan 7   |
| NFR-PRV-04 | Sign-up shall tell Companies that profile views are visible to others.                                                                       | Firm, Plan 8.3 |
| NFR-PRV-05 | Sources and consent for pre-built profiles retained.                                                                                         | Proposed       |

### 5.4 Reliability and scalability

| ID         | Requirement                                                                  | Status       |
| ---------- | ---------------------------------------------------------------------------- | ------------ |
| NFR-REL-01 | Monthly availability of 99.5%.                                               | Proposed     |
| NFR-REL-02 | Daily backups, recovery point of 24 hours and recovery time of 4 hours.      | Proposed     |
| NFR-REL-03 | Scheduled jobs idempotent and retried on failure.                            | Proposed     |
| NFR-REL-04 | If the AI service fails, the flow continues with an empty box and templates. | Firm, Plan 5 |
| NFR-SCA-01 | Support one Chamber of 500 Companies with 100 concurrent users.              | Proposed     |
| NFR-SCA-02 | Adding a Chamber shall need no code change.                                  | Proposed     |

### 5.5 Usability, accessibility and compatibility

| ID         | Requirement                                                                                 | Status        |
| ---------- | ------------------------------------------------------------------------------------------- | ------------- |
| NFR-USE-01 | Designed first for phones, usable from 360 pixels wide with no sideways scrolling.          | Firm, Plan 1  |
| NFR-USE-02 | Interactive targets at least 44 pixels.                                                     | Firm, Website |
| NFR-USE-03 | Follow the ComLinked Design System: Nunito Sans, logo blue accent, sentence case, no emoji. | Firm, Repo    |
| NFR-USE-04 | Automated axe accessibility gate in CI.                                                     | Firm, Repo    |
| NFR-USE-05 | Conformance with WCAG 2.1 AA.                                                               | Proposed      |
| NFR-USE-06 | Respect reduced-motion preferences.                                                         | Firm, Repo    |
| NFR-CMP-01 | Support the latest 2 versions of Chrome, Safari, Edge and Firefox, on iOS and Android.      | Proposed      |

### 5.6 Maintainability and quality

| ID         | Requirement                                                                                                                                                      | Status            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| NFR-MNT-01 | Every change passes lint, type check, unit tests with coverage, end-to-end tests and build in CI.                                                                | Firm, Repo        |
| NFR-MNT-02 | Coverage floors: global 15% lines and statements, 20% functions, 42% branches; `src/lib` 34/34/40/66; `src/services` 40/40/38/73. New product code raises these. | Firm, floors only |
| NFR-MNT-03 | Conventional Commits, with branches off `main`.                                                                                                                  | Firm, Repo        |
| NFR-MNT-04 | Hard-to-reverse decisions recorded as ADRs, and domain terms in `CONTEXT.md`.                                                                                    | Firm, Repo        |
| NFR-MNT-05 | Product analytics through PostHog, opt-in.                                                                                                                       | Firm, ADR 0007    |

## 6. Interface requirements

### 6.1 User interface inventory

| Screen                 | Features           | Mockup reference       |
| ---------------------- | ------------------ | ---------------------- |
| Claim flow             | A1, A2, A3         | `#claim`               |
| Day-one Matches        | L1                 | `#matches`             |
| ComDash                | L2, D3, A4, D4, S2 | `#dash`                |
| Daily Lead List        | D2                 | `#leads`               |
| ComMail                | C2, C3, C4         | `#mail`                |
| Asks Board             | L3                 | `#asks`                |
| Wins                   | S1, S2, S3, D5     | `#wins`                |
| Company profile, own   | A4, A5, C1, C3     | `#company`             |
| Company profile, other | C1, SRC            | Opens from any Company |
| Search                 | SRC                | `#search`              |
| Morning Digest         | D1                 | `#digest`              |
| Notifications          | NTF                | `#notifications`       |
| Chamber tools          | Section 3.6, L4    | `#chamber`             |

Phones use a bottom tab bar. Widths from 900 pixels use a top navigation bar. Both follow the mockup's layouts.

### 6.2 Software interfaces

| System                                | Used for                                                 | Status                        |
| ------------------------------------- | -------------------------------------------------------- | ----------------------------- |
| Supabase Auth                         | Google, Facebook, magic link and phone sign-in           | Firm                          |
| Supabase Postgres with Drizzle        | Application data                                         | Firm                          |
| Supabase Storage                      | Member lists, photos, share cards                        | Firm                          |
| Anthropic API                         | Profile pre-building, Match Reasons, four Assistant jobs | Firm                          |
| Transactional email service           | Claim links, digests, nudges, ComMail copies             | Provider to be chosen (OD-02) |
| Web push                              | Digest and nudges                                        | Firm                          |
| SMS provider                          | Claim links and one-time codes                           | Provider to be chosen (OD-02) |
| Facebook, LinkedIn, Viber share links | One-tap share                                            | Firm                          |
| PostHog                               | Product analytics, opt-in                                | Firm                          |
| Vercel                                | Hosting and previews                                     | Firm                          |

### 6.3 Scheduled jobs

| Job               | When            | Purpose                          |
| ----------------- | --------------- | -------------------------------- |
| Build profiles    | On import       | AI pre-building                  |
| Daily lead list   | Before digest   | Top Fit Scores for each Company  |
| Morning Digest    | 8:00 a.m. local | Push and email                   |
| Freshness nudges  | Daily           | 14-day prompt                    |
| Follow-up prompts | Daily           | 3-day follow-up                  |
| Score expiry      | Daily           | Remove points older than 30 days |
| Monthly reset     | Monthly         | Top companies                    |

## 7. System architecture and data

### 7.1 Architecture overview

The application follows the template's architecture. Server Components read through the Service Seam, and Server Actions validate and write through it. Each service begins as a mock and becomes real by changing that service only. Background jobs run on a schedule and use the same services.

### 7.2 Technology stack

| Layer                | Technology                                                 |
| -------------------- | ---------------------------------------------------------- |
| Framework            | Next.js 15 App Router, React 19, TypeScript in strict mode |
| User interface       | Tailwind CSS v4, shadcn/ui, Radix                          |
| Forms and validation | React Hook Form, Zod                                       |
| Data                 | PostgreSQL on Supabase, Drizzle ORM                        |
| Tables and charts    | TanStack Table, Recharts                                   |
| Testing              | Vitest, Testing Library, Playwright, axe                   |
| Delivery             | GitHub Actions, CodeQL, Dependabot, Vercel                 |
| Runtime              | Node 22, pnpm 10                                           |

### 7.3 Logical data model

Data divides into directory data, shared across a Chamber Network, and private data, protected per Organization (ADR 0009).

| Entity                    | Key information                                                            | Access                           |
| ------------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| Chamber                   | Name, region, time zone                                                    | Directory                        |
| ChamberStaff              | User, Chamber, role                                                        | Chamber                          |
| Company                   | Name, industry, city, description, offers, seeks, products, claimed status | Directory                        |
| ProfileSource             | Company, field, source URL                                                 | Staff                            |
| ChamberMember             | Chamber, Company, import batch                                             | Directory                        |
| Organization              | Linked Company                                                             | Private                          |
| Membership                | User, Organization, Org Role                                               | Private                          |
| ClaimLink                 | Company, token, expiry, status                                             | Server only                      |
| ConsentRecord             | Company, user, notice version, time                                        | Server only                      |
| Match                     | Two Companies, Fit Score, breakdown, reason                                | Private to the receiving Company |
| LeadList                  | Company, date, Matches, action taken                                       | Private                          |
| InterestSignal            | Target Company, acting Company, type, term, date                           | Private to target                |
| ConnectionRequest         | From, to, status, sender                                                   | Private to both                  |
| Connection                | Two Companies, date                                                        | Count shared, list private       |
| Thread and Message        | Two Companies, sender, text, AI flag                                       | Private to both                  |
| AiSetting and AiSwitchLog | Company, on or off, who, when                                              | Private                          |
| AiUsage                   | Company, date, count                                                       | Private                          |
| Ask and AskResponse       | Company, text, matched Companies                                           | Directory                        |
| Outcome                   | Two Companies, type, confirmations                                         | Private to both                  |
| ActivityLedger            | Company, rule, points, counterparty, date                                  | Private                          |
| Testimonial               | Company, deal, need, result                                                | Directory                        |
| Invite                    | Inviting Company, invitee, channel, status                                 | Private                          |
| Notification              | Company, type, reference, read status                                      | Private                          |
| Intro and Announcement    | Chamber, Companies, text                                                   | Chamber and recipients           |
| ImportBatch               | Chamber, rows, status                                                      | Chamber                          |
| PointsReview              | Chamber, Company, decision, reviewer                                       | Chamber                          |

### 7.4 Access rules

| ID    | Rule                                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------- |
| AR-01 | Directory data is readable only by signed-in users of the same Chamber Network.                                       |
| AR-02 | Private data is readable only by Memberships of the owning Organization, or of both Organizations for shared records. |
| AR-03 | Writes need the Org Role allowed by section 2.3.                                                                      |
| AR-04 | Chamber data is readable only by that Chamber's staff.                                                                |
| AR-05 | All of these are enforced by row-level security, not only application code.                                           |

### 7.5 Service interfaces

Services live in `src/services/` and are called only from Server Components, Server Actions and jobs. Names are indicative.

| Service       | Main operations                                            |
| ------------- | ---------------------------------------------------------- |
| companies     | getProfile, updateProfile, profileStrength                 |
| claims        | createClaimLink, verifyClaimLink, completeClaim            |
| matching      | fitScore, dayOneMatches, buildLeadList, recordAction       |
| signals       | record, listForCompany                                     |
| search        | searchCompanies, searchRank                                |
| connections   | sendRequest, accept, ignore, withdraw, degree, mutuals     |
| commail       | listThreads, getThread, sendMessage                        |
| ai            | `draft(task, context)`, setSwitch, buildProfile            |
| asks          | postAsk, matchAsk, respond                                 |
| outcomes      | confirmMeeting, confirmDeal                                |
| activity      | award, score, nextAction, topCompanies                     |
| testimonials  | post, wall, shareCard                                      |
| invites       | send, recordClaim                                          |
| notifications | create, list, markRead                                     |
| digests       | buildDigest, send                                          |
| chambers      | importMembers, activity, makeIntro, announce, reviewPoints |

## 8. Use cases

**UC-01: Claim a pre-built profile**

| Item              | Detail                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actor             | Authorized Representative                                                                                                                          |
| Precondition      | A pre-built profile exists and a claim link was sent.                                                                                              |
| Main flow         | 1. Opens the link. 2. Reviews and corrects the profile. 3. Confirms authorization and reads the visibility notice. 4. Signs in. 5. Sees 3 Matches. |
| Alternative flows | Expired link: requests a new one. Already claimed: is told who to contact. Fewer than 3 Matches: is placed in the needs-an-intro list.             |
| Postcondition     | An Organization exists and the Company is claimed.                                                                                                 |

**UC-02: Work the daily loop**

| Item              | Detail                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actor             | Authorized Representative                                                                                                                             |
| Precondition      | The Company is claimed.                                                                                                                               |
| Main flow         | 1. Receives the 8:00 a.m. digest. 2. Opens the Daily Lead List. 3. Chooses Connect, Message or Skip for each Lead. 4. Sees the score and rank update. |
| Alternative flows | No push: receives email. All Leads seen: list says none remain.                                                                                       |
| Postcondition     | Actions and points are recorded.                                                                                                                      |

**UC-03: Message with an AI Draft**

| Item              | Detail                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Actor             | Authorized Representative                                                                          |
| Precondition      | The Assistant is on and under its daily limit.                                                     |
| Main flow         | 1. Opens a conversation. 2. Receives a draft marked AI draft. 3. Edits it if needed. 4. Taps Send. |
| Alternative flows | Assistant off: empty box and templates. AI failure or limit reached: empty box and an explanation. |
| Postcondition     | A message is sent by a person and recorded.                                                        |

**UC-04: Confirm a deal and share it**

| Item              | Detail                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Actor             | Authorized Representatives of two Companies                                                                                                            |
| Precondition      | A conversation exists.                                                                                                                                 |
| Main flow         | 1. One Company selects We did business. 2. The other confirms. 3. Both earn points. 4. Each answers the Testimonial questions. 5. One shares the card. |
| Alternative flows | Not confirmed: no points. Limit reached: no points and an explanation.                                                                                 |
| Postcondition     | The Testimonial appears on the Success Wall and both profiles.                                                                                         |

**UC-05: Import a chamber's members**

| Item              | Detail                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Actor             | Community Manager                                                                                     |
| Precondition      | The Chamber exists and the manager has access.                                                        |
| Main flow         | 1. Uploads the list. 2. Reviews the preview. 3. Confirms. 4. Profiles build. 5. Claim links are sent. |
| Alternative flows | Invalid rows are reported. Build failures can be retried.                                             |
| Postcondition     | Members appear in the activity view.                                                                  |

**UC-06: Post and answer an Ask**

| Item              | Detail                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Actor             | Authorized Representative                                                                      |
| Precondition      | The Company is claimed.                                                                        |
| Main flow         | 1. Posts a need. 2. Companies offering it are notified. 3. A Company responds through ComMail. |
| Alternative flows | No match: poster is told to name a product or service.                                         |
| Postcondition     | The Ask is on the board, and points are awarded within limits.                                 |

## 9. Acceptance and testing

### 9.1 Test approach

| Level              | Tool                          | Covers                                                  |
| ------------------ | ----------------------------- | ------------------------------------------------------- |
| Unit and component | Vitest, Testing Library       | Scoring, limits, Fit Score, validation, components      |
| Row-level security | Vitest against local Postgres | Every access rule in section 7.4                        |
| End to end         | Playwright                    | Each use case in section 8, on phone and desktop widths |
| Accessibility      | axe                           | Every product screen                                    |
| Manual             | Phone                         | Every flow as a busy company owner, before each release |

Release acceptance requires every Must requirement to pass, with no open critical defect, and completion of the review in NFR-PRV-01.

### 9.2 Pilot success measures

The pilot succeeds if Companies get a Lead on their first day and keep coming back on their own within 90 days. These are starting points, to be reset after the first month.

| Goal              | Metric                                                                 | Target                         |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------ |
| Adoption          | Invited Companies that claim within 14 days                            | 40%                            |
| Immediate leads   | New Companies with at least 3 Matches and 1 Interest Signal on day one | 90%                            |
| Daily habit       | Active Companies opening the Daily Lead List                           | 3 or more days a week          |
| Engagement        | Weekly active Companies                                                | 50% of claimed profiles        |
| Communication     | ComMails sent per active Company                                       | 2 or more a week               |
| AI uptake         | Companies with the Assistant still on after 30 days                    | 60%                            |
| Profile freshness | Profiles updated in the last 30 days                                   | 50%                            |
| Results           | Deals confirmed by both Companies                                      | 20                             |
| Advocacy          | Testimonials posted / shared outside ComLinked                         | 10 / 25                        |
| Growth            | New Companies joining through invites                                  | 1 for every 5 active Companies |

## 10. Traceability

| Feature                     | Requirements                    | Build order step | Mockup    | Real app today                       |
| --------------------------- | ------------------------------- | ---------------- | --------- | ------------------------------------ |
| A1 Pre-built profiles       | FR-A1-01 to 05                  | 2                | Simulated | No                                   |
| A2 Claim your profile       | FR-A2-01 to 09                  | 3                | Simulated | No                                   |
| A3 Easy sign-in             | FR-A3-01 to 05                  | 3                | Simulated | Partly: Google, Facebook, email link |
| A4 Profile strength         | FR-A4-01 to 03                  | 3                | Simulated | No                                   |
| A5 Invite partners          | FR-A5-01 to 03                  | 12               | Simulated | No                                   |
| L1 Day-one Matches          | FR-L1-01 to 04, FR-MAT-01, 02   | 7                | Simulated | No                                   |
| L2 Interest Signals         | FR-L2-01 to 05                  | 4                | Simulated | No                                   |
| L3 Asks Board               | FR-L3-01 to 06                  | 8                | Simulated | No                                   |
| L4 Community Manager Intros | FR-L4-01 to 03                  | 12               | Simulated | No                                   |
| D1 Morning Digest           | FR-D1-01 to 05                  | 9                | Simulated | No                                   |
| D2 Daily Lead List          | FR-D2-01 to 04                  | 7                | Simulated | No                                   |
| D3 Activity Score and rank  | FR-D3-01 to 05, BR-01 to 13     | 10               | Simulated | No                                   |
| D4 Freshness Nudges         | FR-D4-01                        | 9                | Simulated | No                                   |
| D5 Monthly Top Companies    | FR-D5-01, 02                    | 10               | Simulated | No                                   |
| C1 Connections              | FR-C1-01 to 04, FR-NET-01 to 08 | 5                | Simulated | No                                   |
| C2 ComMail                  | FR-C2-01 to 05                  | 5                | Simulated | No                                   |
| C3 AI Assistant             | FR-C3-01 to 09                  | 6                | Simulated | No                                   |
| C4 Outcome buttons          | FR-C4-01 to 03                  | 11               | Simulated | No                                   |
| S1 Testimonial prompt       | FR-S1-01, 02                    | 11               | Simulated | No                                   |
| S2 Success Wall             | FR-S2-01, 02                    | 11               | Simulated | No                                   |
| S3 One-tap share            | FR-S3-01                        | 11               | Simulated | No                                   |
| Chamber basics              | FR-CH-01 to 07                  | 2, 12            | Simulated | No                                   |
| Search and profiles         | FR-SRC-01 to 03                 | 4                | Simulated | No                                   |
| Notifications               | FR-NTF-01 to 04                 | 9                | Simulated | No                                   |

Build order step 13 is the privacy and security review, member import and soft launch. As planned, A2's match message depends on L1; FR-A2-02 keeps the two consistent.

# Part 2: Phase 2

These requirements apply after the MVP. Nothing in this part changes MVP scope.

## 11. AI Lead Agent

### 11.1 Purpose and authority

The AI Lead Agent acts for one Company under a written Mandate. It finds a customer, vendor, supplier or partner, talks to the matched Company's agent, qualifies the fit, and books a virtual meeting when the match scores 75 or more. People make every commitment.

| Action                                                  | Agent alone             | Needs approval  | Never |
| ------------------------------------------------------- | ----------------------- | --------------- | ----- |
| Search the database and score candidates                | Yes                     |                 |       |
| Open a conversation with a matched Company's agent      | Yes                     |                 |       |
| Ask and answer using public or shareable information    | Yes                     |                 |       |
| Share anything confidential                             |                         | Yes, per item   |       |
| Send a claim-your-profile email to an unclaimed Company | Yes, within rate limits |                 |       |
| Propose meeting times from calendar free/busy           | Yes                     |                 |       |
| Confirm and book a meeting                              |                         | Yes, both sides |       |
| Quote binding prices, negotiate terms, accept an offer  |                         |                 | Yes   |
| Send or sign an NDA, LOI, contract or purchase order    |                         |                 | Yes   |
| Share banking, tax or staff personal data               |                         |                 | Yes   |
| Disclose one counterparty's information to another      |                         |                 | Yes   |

### 11.2 Requirements

| ID    | Requirement                                                                                                                                                                                                                                   | Priority | Acceptance criteria                                                                   | Source     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- | ---------- |
| AG-01 | A Mandate shall define match types, Ideal Partner Profile, approver roles, disclosure tiers, calendar connection and outreach limits.                                                                                                         | Must     | The agent cannot run without a signed-off Mandate.                                    | Spec 4     |
| AG-02 | Approver roles shall include Owner/Admin, Sales Lead, Procurement Lead and Meeting attendee, with the authority in Spec section 2.                                                                                                            | Must     | Only the right role can approve each item.                                            | Spec 2     |
| AG-03 | An unanswered approval shall trigger one reminder after one business day and escalate to the Owner after a second. Silence is never approval.                                                                                                 | Must     | No action proceeds without an approval.                                               | Spec 2     |
| AG-04 | Discovery shall search the Company's own Chamber by default.                                                                                                                                                                                  | Must     | Other Chambers are excluded unless the add-on is active.                              | Spec 3     |
| AG-05 | The agent shall run a 10-stage workflow: Mandate, Discover, Desk score, Engage, Qualify, Gate A, Final score, Gate B, Book, Outcome.                                                                                                          | Must     | Each engagement records its current stage.                                            | Spec 4     |
| AG-06 | The Match Score shall have 7 categories totaling 100: Need and offer fit 25, Capacity and commercial fit 15, Proximity and logistics 10, Credibility and trust 15, Intent and timing 15, Relationship and network 10, Agent qualification 10. | Must     | Categories 1 to 6 score before contact, out of 90.                                    | Spec 6     |
| AG-07 | Bands shall be Book at 75 to 100, Nurture at 60 to 74 and Drop below 60.                                                                                                                                                                      | Must     | Nurture re-checks in 30 days or on a profile change; Drop blocks contact for 90 days. | Spec 4     |
| AG-08 | Knock-outs shall block contact: opt-out, 90-day cool-off after a decline, open compliance or conduct flag, declared exclusivity conflict, inactive profile.                                                                                   | Must     | A knocked-out candidate is never contacted.                                           | Spec 6     |
| AG-09 | Every fact used in a score shall be recorded with its source.                                                                                                                                                                                 | Must     | The selection report can cite each one.                                               | Spec 3     |
| AG-10 | Scorecard weights shall be adjustable per match type and versioned.                                                                                                                                                                           | Should   | Each report cites its scorecard version.                                              | Spec 6     |
| AG-11 | Until 200 meetings are completed, reports shall call the score a match score, not a probability.                                                                                                                                              | Must     | The wording appears on every report.                                                  | Spec 6     |
| AG-12 | Each message shall carry an envelope of engagement, sender, receiver, type, disclosure tier, time and text, stored append-only.                                                                                                               | Must     | Sent messages cannot be edited.                                                       | Spec 7     |
| AG-13 | Message types shall be INTRO, MANDATE_CHECK, QUALIFY_Q, QUALIFY_A, DISCLOSURE_PENDING, DISCLOSURE_GRANT, DISCLOSURE_DECLINE, MEETING_PROPOSAL, MEETING_ACCEPT, MEETING_BOOKED, ESCALATE and CLOSE.                                            | Must     | Other types are rejected.                                                             | Spec 7     |
| AG-14 | Disclosure tiers shall be 0 Public, 1 Shareable, 2 Confidential (approval per item) and 3 Never. Uploads default to Tier 2.                                                                                                                   | Must     | The platform blocks unapproved Tier 2 and all Tier 3 content.                         | Spec 3, 7  |
| AG-15 | Every INTRO shall state that the sender is an AI agent and name the Company.                                                                                                                                                                  | Must     | The check runs before sending.                                                        | Spec 7, 10 |
| AG-16 | Agents shall answer only from their own Company's data and never pass on what another counterparty said.                                                                                                                                      | Must     | One agent instance runs per Company per engagement.                                   | Spec 7, 14 |
| AG-17 | Behavior signals shall shape the score but never be quoted to another agent.                                                                                                                                                                  | Must     | Outbound messages contain no such data.                                               | Spec 3     |
| AG-18 | A conversation shall be capped at 20 turns per side before escalating or closing.                                                                                                                                                             | Must     | The cap is enforced by the platform.                                                  | Spec 7, 10 |
| AG-19 | Figures shared shall be labeled "indicative, non-binding".                                                                                                                                                                                    | Must     | Binding commitments are refused.                                                      | Spec 7     |
| AG-20 | Unclaimed best matches shall get a claim email and wait 14 days, with a reminder at day 7. A claimed Company with its agent off gets an in-app card and 7 days.                                                                               | Must     | Unanswered matches are parked and re-checked on claim.                                | Spec 8     |
| AG-21 | Every claimed profile shall get a free inbound-only agent.                                                                                                                                                                                    | Must     | No payment is needed to answer.                                                       | Spec 8, 11 |
| AG-22 | Booking shall read free/busy only, propose 3 slots in the next 5 to 10 business days, and confirm on both sides before invites go out.                                                                                                        | Must     | No event details are read.                                                            | Spec 9     |
| AG-23 | Meetings shall be virtual, 30 or 45 minutes, on Google Meet or Microsoft Teams, with reminders at 24 hours and 1 hour.                                                                                                                        | Must     | The link matches the host's calendar.                                                 | Spec 9     |
| AG-24 | Each booking shall produce a handoff package: transcript, agenda and selection report with runners-up, reasons and risks, marked as AI-generated.                                                                                             | Must     | It attaches to the invite and saves to both ComDashes.                                | Spec 9, 10 |
| AG-25 | 24 hours after a meeting, each side shall answer: proceed, follow up later, or not a fit.                                                                                                                                                     | Must     | Answers recalibrate future scoring.                                                   | Spec 4     |
| AG-26 | The agent's work shall not earn Activity Score points. Meetings earn points only through the Outcome buttons.                                                                                                                                 | Must     | Agent activity adds no ledger entries.                                                | Added      |
| AG-27 | Off-platform emails shall comply with CASL: store source URL, a page capture with no opt-out statement, recipient role and relevance reason.                                                                                                  | Must     | A consent record exists for every email.                                              | Spec 10    |
| AG-28 | Every email shall identify ComLinked and the member, give a mailing address, and include a one-click unsubscribe honored within 10 business days.                                                                                             | Must     | The checks run before sending.                                                        | Spec 10    |
| AG-29 | Personal information shall be limited to business contact information for work communication, in line with PIPEDA. Transcripts are kept 24 months by default and can be exported or deleted.                                                  | Must     | Deletion removes a Company's transcripts.                                             | Spec 10    |
| AG-30 | Rate limits: 1 follow-up per unanswered engagement, 90-day cool-off, 2 claim emails per unclaimed Company per 90 days from all members, inbound cap default 10 a week.                                                                        | Must     | The platform enforces each limit.                                                     | Spec 10    |
| AG-31 | Outbound shall pause if declines and opt-outs exceed 30% over 20 engagements, until the Owner reviews the Mandate.                                                                                                                            | Must     | No new engagements start while paused.                                                | Spec 10    |
| AG-32 | The language model shall handle conversation and judgment. Deterministic services shall enforce scoring, disclosure, approvals and rate limits.                                                                                               | Must     | The model cannot decide on its own to share or book.                                  | Spec 14    |
| AG-33 | Messages, tool calls, approvals and score changes shall be written to an append-only log.                                                                                                                                                     | Must     | The transcript is built from the log.                                                 | Spec 14    |
| AG-34 | Paid tiers (placeholders): Member free, inbound only; Growth CAD 79, 10 engagements; Pro CAD 199, 40; Enterprise or Chamber Partner custom. Chambers share revenue.                                                                           | Could    | Prices are validated before launch.                                                   | Spec 11    |

### 11.3 Data and tasks

Core entities: Mandate, IdealPartnerProfile, Candidate, Engagement, AgentMessage, DisclosureItem, ApprovalRequest, ScoreRecord, Meeting, HandoffPackage, ConsentRecord and Outcome. The agent's tasks T01 to T18 are defined in Spec section 5.

### 11.4 Success measures (placeholders)

| KPI                    | Definition                               | Target                 |
| ---------------------- | ---------------------------------------- | ---------------------- |
| Engagement to meeting  | Meetings booked ÷ engagements opened     | 15%                    |
| Meeting to opportunity | Meetings where both sides choose proceed | 40%                    |
| Approval turnaround    | Median time from request to decision     | Under 4 business hours |
| Opt-out rate           | Opt-outs and declines ÷ engagements      | Under 10%              |
| Profile claim rate     | Claims ÷ claim emails sent               | 20%                    |
| Agent adoption         | Members with an agent active             | 50% by month 6         |

## 12. ComLinked Team Dashboard

### 12.1 Purpose

A dashboard for ComLinked Staff showing whether the pilot is working, who needs help, and whether the network is healthy. The MVP keeps the database dashboard, so this is Phase 2.

### 12.2 Requirements

| ID    | Requirement                                                                                                           | Priority | Acceptance criteria                        | Source   |
| ----- | --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ | -------- |
| TD-01 | The dashboard shall be restricted to ComLinked Staff, with its own header and no company navigation.                  | Must     | Other roles are denied.                    | Added    |
| TD-02 | Pilot health shall show the 10 targets in section 9.2 with current value, target and status.                          | Must     | Status uses a label, not color alone.      | Plan 8.1 |
| TD-03 | Cumulative targets shall be judged against time elapsed in the 90-day pilot. Rate targets shall be compared directly. | Must     | A deal count below pace shows Behind.      | Added    |
| TD-04 | Pilot health shall show a weekly active Companies trend with its target.                                              | Should   | A table view is available.                 | Added    |
| TD-05 | A work queue shall list Companies that have not claimed, have no Lead, or have been quiet for 7 days.                 | Must     | Each row states the reason.                | Added    |
| TD-06 | Network safety shall show unusual points, flagged accounts and opt-outs.                                              | Must     | Counts match the records.                  | Added    |
| TD-07 | AI and agent performance shall show AI Assistant use and the KPIs in section 11.4.                                    | Should   | Each KPI shows its target.                 | Spec 14  |
| TD-08 | Staff shall send a claim reminder, make an Intro, and clear or flag unusual points.                                   | Must     | An Intro appears on the Company's ComDash. | Added    |
| TD-09 | Each staff action shall be recorded with its actor and time.                                                          | Must     | The activity log lists it.                 | Added    |
| TD-10 | Staff shall see counts, statuses and company names, never conversations or confidential items.                        | Must     | No query returns message content (OD-05).  | Added    |
| TD-11 | Community Managers remain responsible for their Chamber through the chamber tools.                                    | Must     | Staff act only as back-up.                 | Added    |

# Part 3: Mockup

## 13. Mockup description

### 13.1 Purpose and location

A clickable demo for Richard and pilot chambers, presented from a laptop. It is one HTML file with no server, at `docs/mockup/index.html` and `~/Documents/ComLinked-mockup/index.html`. The repository copy is ignored by git. Its code is throwaway; its flows and layouts are the reference for Part 1.

### 13.2 Contents

| Area          | What it shows                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Website       | The 5 website pages, with forms that lead into the product                                                              |
| Product       | All 21 MVP features at phone and web widths                                                                             |
| Chamber tools | Member import, activity view, intros, announcements, points review                                                      |
| Engine        | 40 example Companies with fixed Connections, calculated Fit Scores, Connection Requests, ranking and overnight activity |
| Previews      | AI Lead Agent and ComLinked Team Dashboard, labeled after the MVP                                                       |
| What's next   | 9 read-only customer-facing items, without paid items                                                                   |

### 13.3 Operating the demo

Press **G** to open the presenter guide (a Guide button appears at phone widths). It offers **New company**, **Two weeks in** (rank #4 of 12 with a deal pending), **Next morning**, **Jump 14 days**, Engine, AI Lead Agent, Team Dashboard, What's next, Website and Reset. Reloading the page starts over.

### 13.4 What is simulated

| Mockup behavior                                                  | In the real MVP                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Example Companies and activity                                   | Real members and activity                                         |
| Connection Requests accepted by Fit Score (80 and 50 thresholds) | Real people accept or ignore. These thresholds do not carry over. |
| Overnight attention formula                                      | Real views and searches. The formula does not carry over.         |
| Pre-written ComMail replies                                      | Real replies from real Companies                                  |
| AI text from templates                                           | Anthropic API, through `draft(task, context)`                     |
| Other Company auto-confirms outcomes                             | The other Company's representative confirms                       |
| Time moved by buttons                                            | Real days and scheduled jobs                                      |
| Sample member list only                                          | Real file upload                                                  |
| Sign-in without an account                                       | Real Supabase Auth                                                |
| Push, email, SMS and share previews                              | Real delivery                                                     |
| Data lost on reload                                              | Persistent database                                               |
| Fit Score, rank, Activity Score and limits                       | Carry over as real logic, with configurable numbers               |

### 13.5 Verification

The most recent automated checks covered 36 Team Dashboard, 34 AI Lead Agent, 48 engine and 35 demo checks at laptop width, plus a full flow at phone width, with no script errors. These checks live in a temporary folder and are not part of the repository.

# Appendices

## 14. Open decisions

| ID    | Decision                                                                                                                         | Owner          | Blocks                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------- |
| OD-01 | The MVP pilot is ECCP (decided 2026-11-10). When does the agent spec's PCCC pilot in Canada, from Jan 1, 2027, fit in?           | Richard        | Agent timing, Canadian legal review |
| OD-02 | Which SMS and email providers?                                                                                                   | Technical lead | A2, A3, D1                          |
| OD-03 | Confirm scoring settings: CFG-02 to CFG-04 and BR-15.                                                                            | Richard        | D3, Fit Score tuning                |
| OD-04 | Should BR-09 invite points stay uncapped? Throwaway companies could earn unlimited points.                                       | Richard        | A5                                  |
| OD-05 | Reconcile Superadmin's unrestricted access (glossary, ADR 0005) with TD-10's rule that staff never see private content.          | Richard        | Team Dashboard, privacy notice      |
| OD-06 | The agent messages other agents on its own, which conflicts with "AI drafts, a person decides". How should the rule be reworded? | Richard        | Part 2                              |
| OD-07 | Final agent prices and chamber revenue share.                                                                                    | Richard        | Part 2                              |
| OD-08 | How are claims verified for the Verified badge, and is the badge kept?                                                           | Richard        | FR-A2-09                            |
| OD-09 | Keep the copy of each ComMail to the registered email?                                                                           | Richard        | FR-C2-05                            |
| OD-10 | Confirm that `owner` and `admin` are Authorized Representatives (ASM-05).                                                        | Richard        | C1, C2                              |
| OD-11 | Legal review items: Philippine Data Privacy Act now, and CASL and PIPEDA before Canada.                                          | Legal counsel  | Launch                              |
| OD-12 | Should counterparties see the initiator's Match Score, and can Gate A be pre-approved for repeat items?                          | Richard        | Part 2                              |

## 15. Out of scope for the MVP

| Item                                                     | Earliest phase                   |
| -------------------------------------------------------- | -------------------------------- |
| Premium plans, paywall blur, Stripe checkout             | After the pilot shows daily use  |
| Cross-chamber add-on, one-time purchases, extra seats    | After the pilot shows daily use  |
| Chamber subscriptions, setup fees, revenue-share payouts | Before the second paying chamber |
| GPLI course bundle and billing                           | Phase 2                          |
| Native iOS and Android apps                              | Phase 2                          |
| Leaderboard prizes, badges, tiers, sponsor rewards       | Phase 2                          |
| Deal and referral pipeline tracker                       | Phase 2                          |
| Chamber ROI reports, at-risk alerts, branding setup      | Before renewal season            |
| Custom superuser console, algorithm tuning screens       | Phase 2                          |
| Private browsing mode, multi-company accounts            | Phase 2                          |
| French and other languages, SMS digest                   | Before Quebec, or when needed    |
| Events, news feed, member posts                          | Later, if chambers ask           |

## 16. Glossary

`CONTEXT.md` is the authoritative glossary. The main terms are:

| Term                           | Meaning                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Activity Score                 | Points a Company earned from qualifying actions in the last 30 days.                      |
| AI Assistant                   | The per-Company on/off feature that writes AI Drafts for four jobs.                       |
| AI Draft                       | Text written by the AI Assistant, labeled as AI until a person edits or sends it.         |
| AI Lead Agent                  | A post-MVP agent that finds, qualifies and books meetings for a Company.                  |
| Ask, Asks Board                | A posted business need, and the board where Asks appear.                                  |
| Authorized Representative      | A person allowed to act on a Company's behalf.                                            |
| Chamber, Chamber Network       | A business association, and its Companies, kept separate from other Chambers.             |
| Claim                          | A Company taking over its Pre-built Profile through a personal link.                      |
| ComDash                        | A Company's home screen.                                                                  |
| ComLinked Staff                | People who work for ComLinked itself.                                                     |
| ComMail                        | Company-to-company messaging.                                                             |
| Community Manager              | A person working for a Chamber who supports its Companies.                                |
| Company                        | A business listed on ComLinked, with a shared profile and, once claimed, an Organization. |
| Connection, Connection Request | An accepted link between two Companies, and the pending ask to form one.                  |
| Connection Degree              | How many Connections separate two Companies.                                              |
| Daily Lead List                | The five new Matches a Company gets each day.                                             |
| Fit Score                      | A 0 to 100 measure of how well a Match suits a Company.                                   |
| Interest Signal                | A named record that another Company showed interest.                                      |
| Intro                          | An introduction between two Companies by a Community Manager.                             |
| Lead                           | A Company surfaced to another as a potential business contact.                            |
| Mandate                        | A Company's written instructions to its AI Lead Agent.                                    |
| Match, Match Reason            | A recommended Company, and the one-line "why you should meet".                            |
| Match Score                    | The AI Lead Agent's seven-category assessment, out of 100.                                |
| Morning Digest                 | The 8:00 a.m. summary of Leads, views and rank change.                                    |
| Mutual Connection              | A Company connected to both of two other Companies.                                       |
| New Member Boost               | The equal 30-day visibility boost for new Companies.                                      |
| Notification                   | An alert about one event or a group of similar events.                                    |
| Organization                   | The private account linked to a claimed Company.                                          |
| Outcome                        | A result confirmed by both Companies: We met or We did business.                          |
| Pre-built Profile              | A draft profile built by AI before the Company joins.                                     |
| Search Rank                    | A Company's position in results: relevance first, raised by activity.                     |
| Service Seam                   | The boundary between screens and their data source.                                       |
| Success Wall                   | The display of recent Testimonials and deals.                                             |
| Team Dashboard                 | ComLinked Staff's view across a Chamber's Companies.                                      |
| Testimonial                    | A Company's short account of a confirmed deal.                                            |

## 17. Approvals

This draft becomes version 1.0 once the open decisions that block the first build steps are resolved and these roles approve it.

| Role                      | Name    | Signature | Date |
| ------------------------- | ------- | --------- | ---- |
| Product owner             | Richard |           |      |
| Technical lead            |         |           |      |
| Legal or privacy reviewer |         |           |      |
