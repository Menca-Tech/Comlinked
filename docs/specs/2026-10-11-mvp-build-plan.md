# ComLinked MVP Build Plan: Free Launch

Status: adopted as the product vision and guide (2026-11-08) · Author: @Richard,
Oct 11, 2026 · Original: [PDF, Ver 2](2026-10-11-mvp-build-plan.pdf) · Decision:
[ADR 0008](../adr/0008-free-mvp-product-direction.md) · Vocabulary:
[CONTEXT.md](../../CONTEXT.md)

> Sections 1–8 transcribe the PDF without changing its wording. The
> [Adoption notes](#adoption-notes) at the end are not part of the plan: they
> record where it meets the current codebase and what it leaves open.

The MVP is completely free, with no payments, no paywall and no premium tiers.
It has one job: get a new company its first real lead within 24 hours, then give
it a reason to come back every day.

Any feature that doesn't help companies sign up, get leads, return daily, talk
to other companies or share their wins waits until after launch. The pilot is
PCCI–Quezon City, with ECCP and the Toronto Region Board of Trade next.

## 1. Launch principles

| Principle                   | What it means in the MVP                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free for everyone           | Every feature is open to every company. Interest signals show the company names behind them; nothing is blurred                                                 |
| First lead in 24 hours      | Each new company gets at least 3 relevant matches and one "who's interested" signal on its first day; community managers make intros where the system can't yet |
| A reason to return daily    | Fresh leads, new interest signals and a visible rise in search ranking every morning                                                                            |
| Activity earns visibility   | Companies that update their profile, reply, post asks and share wins rank higher in search results                                                              |
| Success is shared           | Every closed deal invites both sides to post a short testimonial that other companies see                                                                       |
| AI is optional              | One switch turns the AI Assistant on or off; everything works manually too                                                                                      |
| Company-owned relationships | Connections belong to the company, not the employee, so they stay when people leave                                                                             |
| Mobile first                | A web app that works well on phones, since most owners in the pilot will use a phone                                                                            |

## 2. The daily lead loop

**Every action today raises tomorrow's visibility.** The daily lead loop each
MVP feature is built to support:

1. **Morning digest.** New leads, profile views and your rank change.
2. **Act on today's leads.** Connect, message or answer an ask in a few taps.
3. **Talk and close.** ComMail, with AI drafts if on; confirm the deal.
4. **Share the win.** Testimonial posted and shared to social media.
5. **Rank rises.** Activity Score lifts your place in search results. More views
   tomorrow lead back to step 1.

Every MVP feature supports one step of this loop. The digest brings companies
in, and acting on leads gets them talking. Closed deals become testimonials, and
all that activity lifts their search rank. A higher rank brings more views,
which fill the next morning's digest.

## 3. MVP features

The MVP has 21 features in five groups, plus basic chamber tools, and each one
passes the same test: does it get companies signed up, bring leads, bring them
back, get them talking, or get them sharing wins?

### 3.1 Get listed in 5 minutes (adoption)

| ID  | Feature                       | What the user sees                                                                                                             | Why it's in the MVP                                    |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| A1  | Pre-built company profiles    | AI builds draft profiles from each company's website, Facebook page or public directory listings before launch                 | Nobody starts from a blank form                        |
| A2  | Claim your profile            | A personal link by email or SMS: "Your company is on ComLinked. 3 companies are already a match." One tap to claim and confirm | Turns the pre-built database into active users         |
| A3  | Easy sign-in                  | Google, Facebook, email magic link or mobile number with a one-time code                                                       | Fewer drop-offs on phones                              |
| A4  | Profile strength meter        | A 0–100% bar with the next single step, e.g., "Add your top 3 products: +15%"                                                  | Better profiles mean better matches and higher ranking |
| A5  | Invite your business partners | Invite existing customers and suppliers by link, email or chat; both companies get a ranking boost when they join              | Each user brings in more companies at no cost          |

### 3.2 Leads on day one

| ID  | Feature                  | What the user sees                                                                                                                         | Why it's in the MVP                                          |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| L1  | Day-one matches          | 3 matched companies right after claiming, each with a one-line "why you should meet"                                                       | The first visit shows real value                             |
| L2  | ComDash interest signals | Who found you in search, who viewed your profile, who messaged you, and who was recommended your company. **Company names are shown free** | The "someone's looking at me" moment that brings people back |
| L3  | Asks board               | Post a need ("Looking for a packaging supplier in QC"); matching companies are notified and can respond                                    | Creates leads both ways, every day                           |
| L4  | Community manager intros | Pilot community managers hand-pick introductions for companies with no organic leads yet                                                   | No early adopter goes a week without a lead                  |

### 3.3 Come back every day (stickiness)

| ID  | Feature                        | What the user sees                                                                                        | Why it's in the MVP                               |
| --- | ------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| D1  | Morning digest                 | Push notification and email at 8:00 a.m.: "4 new leads, 2 companies viewed you, you moved up 3 places"    | The daily trigger to open the app                 |
| D2  | Daily lead list                | 5 new matched companies each day; for each one: Connect, Message or Skip (a Skip improves future matches) | A short, finishable daily task                    |
| D3  | Activity Score and search rank | A visible score and "your rank in [industry] searches," with what to do to climb (Section 4)              | A clear reason to act daily                       |
| D4  | Freshness nudges               | "Your profile hasn't changed in 14 days. Add a recent project to stay near the top."                      | Keeps profiles current                            |
| D5  | Monthly top companies          | Simple chamber leaderboard of the 10 most active companies; recognition only, no prizes                   | Public recognition motivates people to keep going |

### 3.4 Talk to other companies

| ID  | Feature             | What the user sees                                                                                                                    | Why it's in the MVP                      |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| C1  | Company connections | An authorized representative sends a connection request; the other company accepts. Connections belong to the company, not the person | ComLinked's core idea                    |
| C2  | ComMail             | Company-to-company messaging with ready-made templates (introduction, quote request, partnership)                                     | Turns a lead into a conversation         |
| C3  | AI Assistant switch | On: AI drafts messages, replies and follow-ups for you to approve. Off: do it all yourself (Section 5)                                | Saves time without taking away control   |
| C4  | Outcome buttons     | "We met" and "We did business," confirmed by both companies                                                                           | Proves results and triggers testimonials |

### 3.5 Share the wins (advocacy)

| ID  | Feature            | What the user sees                                                                                                                                             | Why it's in the MVP                         |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| S1  | Testimonial prompt | After both sides confirm "We did business," each answers 2 questions: what did you need, and what happened? (AI can polish the wording if the Assistant is on) | Real proof from real users                  |
| S2  | Success wall       | Recent testimonials and deals on the home feed and on both companies' profiles                                                                                 | Shows newcomers that it works               |
| S3  | One-tap share      | Share a testimonial card to Facebook, LinkedIn or Viber with ComLinked branding and a sign-up link                                                             | Free marketing that brings new companies in |

### 3.6 Chamber and community manager basics

- **Member import.** Upload the member list; profiles are built and claim links
  sent.
- **Activity view.** One screen showing who has claimed, who is active, and who
  needs an intro.
- **Intros and broadcasts.** Make an introduction between two members; send an
  announcement to all members.
- **Admin back office.** ComLinked staff use the database dashboard directly; no
  custom admin console in the MVP.

## 4. Search ranking: the Activity Score

Companies that use ComLinked every day show up higher in search results. That's
the main reason to keep coming back. Relevance always comes first, so an
inactive packaging company still appears in a packaging search. Among relevant
results, though, active companies rank above inactive ones.

**How rank is set:** search rank = relevance to the search × (1 + Activity boost
of up to 30%).

**The Activity Score** counts points earned over the last 30 days, so it drops
if a company stops using the platform.

| Action                                                   | Points | Limit                           |
| -------------------------------------------------------- | ------ | ------------------------------- |
| Open the daily lead list and act on at least one company | 2      | Once a day                      |
| Update the profile (new product, project or photo)       | 5      | Twice a week                    |
| Reply to a ComMail within 24 hours                       | 3      | 5 a day                         |
| Post an ask, or respond to someone else's ask            | 5      | 3 a day                         |
| Connection accepted (either direction)                   | 5      | 10 a day                        |
| Meeting confirmed by both companies                      | 10     | 2 a week with the same company  |
| Deal confirmed by both companies                         | 25     | 2 a month with the same company |
| Testimonial posted                                       | 15     | One per deal                    |
| A company you invited joins and claims its profile       | 10     | No limit                        |

**Anti-gaming rules:**

- Meetings and deals count only when both companies confirm.
- Daily limits stop anyone from earning points through spam.
- Community managers review unusual spikes in points.

**What users see.** ComDash shows the score, the rank ("#4 of 37 in Food
Suppliers, Quezon City"), and the single next action worth the most points.
Every company also gets the same 30-day "new member" boost, so newcomers can be
found right away.

## 5. AI Assistant: one switch, on or off

Each company gets a single switch labelled **AI Assistant: On / Off**, with one
line of explanation underneath: _"When on, AI writes a draft for you. Nothing is
sent until you tap Send."_ With the switch off, every screen works the same way,
with an empty message box and ready-made templates instead of AI drafts. The
rule is simple: AI drafts, a person decides.

### 5.1 What the Assistant does (four jobs only)

| Job                           | Assistant on                                                                                     | Assistant off                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Introduce yourself to a match | Writes a short intro using both profiles and the "why you should meet" reason; you edit and send | Pick a template or write your own                |
| Reply to a ComMail            | Suggests a reply under the message; you edit and send                                            | Write the reply yourself                         |
| Follow up                     | After 3 days without a reply, drafts a polite follow-up and asks "Send?"                         | A reminder appears; write the follow-up yourself |
| Polish your words             | Tidies profile descriptions, asks and testimonials                                               | Write and edit them yourself                     |

### 5.2 Rules that keep it simple and safe

- **Never sends on its own.** Every message needs one tap from a person.
- **Can be switched any time.** Changes take effect immediately, and each switch
  is recorded.
- **Starts on for new companies.** People see the benefit on their first match,
  and can turn it off with one tap.
- **Uses only ComLinked information.** The two companies' profiles and the
  message thread, nothing else.
- **Says what it is.** Drafts are marked "AI draft" until the user edits or
  sends them.

### 5.3 How the development team builds it

1. One on/off setting per company in the database.
2. One server function, `draft(task, context)`, with four short prompt templates
   (intro, reply, follow-up, polish) calling the Anthropic API.
3. The draft appears in the normal message box, fully editable; the Send button
   is the same as in manual mode.
4. A daily limit per company (for example, 30 drafts) to keep AI costs
   predictable.

The full AI lead-generation agent is postponed until after the MVP. That version
would find and qualify leads, talk to other companies' agents, and book
meetings.

## 6. Postponed until after the MVP

The features below wait, either because they charge money or because they don't
directly drive sign-ups, leads, daily use or shared wins. Bring them back once
the pilot shows companies coming back on their own.

| Postponed feature                                                                               | Why it waits                                                           | Earliest phase                                    |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| Premium plans, paywall blur, Stripe checkout                                                    | No payments in the MVP; hiding names would block the first-lead moment | After the pilot shows daily use                   |
| Cross-chamber add-on, one-time purchases, extra seats                                           | Payment features                                                       | Same as above                                     |
| Chamber subscriptions, setup fees, revenue-share payouts                                        | Billing; pilot chambers join free                                      | Before the second paying chamber                  |
| GPLI course bundle and its billing                                                              | Valuable for keeping members, but not a lead driver                    | Phase 2 (can be offered as a free link meanwhile) |
| Full AI lead-generation agent (agent-to-agent talks, qualification scorecard, calendar booking) | Complex; the simple Assistant comes first                              | Phase 2                                           |
| Native iOS and Android apps                                                                     | A mobile-friendly web app is enough for the pilot                      | Phase 2                                           |
| Leaderboard prizes, badges, tiers, sponsor rewards                                              | Recognition alone is enough at launch                                  | Phase 2                                           |
| Deal and referral pipeline tracker                                                              | The outcome buttons cover the MVP need                                 | Phase 2                                           |
| Chamber ROI PDF reports, at-risk alerts, branding setup                                         | Not needed to win early users                                          | Before renewal season                             |
| Custom superuser console, algorithm tuning screens                                              | Staff use the database dashboard                                       | Phase 2                                           |
| Private browsing mode, multi-company accounts                                                   | Edge cases                                                             | Phase 2                                           |
| French and other languages; SMS digest                                                          | English is enough for the Philippine pilot                             | Before Quebec, or when needed                     |
| Events, news feed, member posts                                                                 | Off-topic for leads                                                    | Later, if chambers ask                            |

## 7. Tech stack and build order

The stack stays on hosted services and drops Stripe, since nothing is sold in
the MVP. Features are built in the order that delivers a working lead experience
soonest, so testing can start with real PCCI–Quezon City members early.

| Layer                    | Service                                              | Why                                                                                            |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Web app                  | Next.js, mobile-first                                | Works well on phones; no app-store approval needed                                             |
| Database, sign-in, files | Supabase (Singapore region for the Philippine pilot) | Database, login and storage in one place, close to users; add a Canadian region before Toronto |
| Hosting                  | Vercel                                               | One-click deploys and a preview link for every change                                          |
| AI                       | Anthropic API                                        | Profile pre-building, match reasons and the four AI Assistant jobs                             |
| Email and push           | A transactional email service plus web push          | Morning digest, claim links, nudges                                                            |

### 7.1 Build loop for every feature

1. Ask Claude for one feature in plain English, naming its ID from Section 3
   (e.g., "Build A2 and A3"), and review the plan first.
2. Test it on the preview link as a new company owner, on a phone.
3. Tell Claude what's wrong, retest, then commit to GitHub.

### 7.2 Build order

- [ ] Project setup: GitHub, Supabase, Vercel, `CLAUDE.md` written from this plan
- [ ] Company profiles, member import and AI pre-built profiles (A1)
- [ ] Claim link, easy sign-in and profile strength meter (A2–A4)
- [ ] Search, profile pages and ComDash interest signals with names shown (L2)
- [ ] Company connections and ComMail with templates (C1, C2)
- [ ] AI Assistant switch and `draft()` function (C3)
- [ ] Day-one matches and the daily lead list (L1, D2)
- [ ] Asks board (L3)
- [ ] Morning digest and freshness nudges (D1, D4)
- [ ] Activity Score, search ranking boost and monthly top companies (D3, D5)
- [ ] Outcome buttons, testimonials, success wall and one-tap share (C4, S1–S3)
- [ ] Invite partners, community manager intros and chamber basics (A5, L4, 3.6)
- [ ] Privacy and security review, PCCI–Quezon City member import, soft launch

## 8. Launch metrics, timeline and human help

The pilot succeeds if companies get a lead on their first day and keep coming
back on their own within 90 days. The targets below are proposed starting
points, to be reset after the first month of real data.

### 8.1 Pilot targets (first 90 days, PCCI–Quezon City)

| Goal              | Metric                                                                 | Proposed target                |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------ |
| Adoption          | Invited companies that claim their profile within 14 days              | 40%                            |
| Immediate leads   | New companies with at least 3 matches and 1 interest signal on day one | 90%                            |
| Daily habit       | Active companies opening the daily lead list                           | 3+ days a week                 |
| Engagement        | Weekly active companies                                                | 50% of claimed profiles        |
| Communication     | ComMails sent per active company                                       | 2+ a week                      |
| AI uptake         | Companies with the AI Assistant still on after 30 days                 | 60%                            |
| Profile freshness | Profiles updated in the last 30 days                                   | 50%                            |
| Results           | Deals confirmed by both companies                                      | 20                             |
| Advocacy          | Testimonials posted / shared outside ComLinked                         | 10 / 25                        |
| Growth            | New companies joining through invites                                  | 1 for every 5 active companies |

### 8.2 Timeline

The reduced MVP takes about 5–7 weeks of focused daily build sessions, whether
you or the main technical developer drives Claude Code. Start the PCCI–Quezon
City soft launch with a group of 30–50 companies, then open it to all members
after two weeks of fixes.

### 8.3 Where to bring in human help

- **Community managers.** For the first weeks, they hand-pick introductions and
  post asks on behalf of quiet members, so every early adopter sees a lead.
  Their effort tapers off as activity becomes self-sustaining.
- **A privacy and security review before real members join.** Check the
  Philippine Data Privacy Act and the National Privacy Commission requirements
  for the pilot, and Canadian privacy law before Toronto. Make sure sign-up tells
  companies that profile views are visible to others.
- **Your own testing.** Go through every flow on a phone as a busy company owner
  before each release.

**Next step:** connect GitHub and have Claude write `CLAUDE.md` from this plan,
then build the first two items in the build order.

---

## Adoption notes

Added 2026-11-08 when the plan was adopted. **None of this is from the PDF.**
Each item needs an answer before the feature it names is built. Remove an item
once it is resolved, and record any hard-to-reverse answer as an ADR.

### Where the plan meets the current codebase

1. **Company profiles must be visible across Organizations; today they can't
   be.** Search, profile pages, interest signals, asks and the success wall all
   show one company's data to another. [ADR 0005](../adr/0005-multi-tenancy.md)
   limits reads to an Organization's own members, and the migration's
   `organizations_select_members` policy enforces that. Pre-built profiles also
   have no members until they are claimed. This needs a design and an ADR before
   A1. It includes whether a Company is an Organization, and whether a Chamber
   is one too.
2. **Sign-in is password-only today.** The auth forms use `signInWithPassword`
   and `signUp`. A3 replaces that with Google, Facebook, magic link and mobile
   one-time code, all still on Supabase Auth, so ADR 0002 stands.
3. **One company per account for the MVP.** Multi-company accounts are postponed
   (Section 6), but the `memberships` table allows many. ADR 0005's workspace
   switcher is not built in `src/`, and the MVP does not need it.
4. **No new admin screens.** The custom superuser console is postponed
   (Section 6). The template's Superadmin `role-settings` page should not be
   extended.

### What the plan leaves open

5. **No SMS provider in the stack.** A2 sends claim links by SMS and A3 uses a
   mobile one-time code, but Section 7 lists only email and web push. Postponing
   the SMS digest does not cover these two.
6. **Activity Score has no conversion to the boost.** Section 4 gives points and
   a 30% ceiling, but not how points become a boost, nor the size of the "new
   member" boost.
7. **Invite rewards don't match.** A5 says both companies get a ranking boost;
   Section 4 awards only the inviter. That row is also the only uncapped action,
   so invitations to throwaway companies could earn unlimited points.
8. **Build order runs ahead of its dependency.** The A2 claim message says "3
   companies are already a match" at build step 3, and the "was recommended"
   signal in L2 is at step 4, but matching (L1) arrives at step 7. Either build
   basic matching earlier or hold those strings until it exists.
9. **Web push reach on iPhones.** iOS delivers web push only to web apps added
   to the Home Screen, so most iPhone owners will get D1 by email alone unless
   the product prompts them to install it.
10. **Privacy review scope.** Section 8.3 names visible profile views. It should
    also cover building profiles from public sources (A1) and contacting
    companies before they have opted in (A2).
11. **Website promises outside this plan.** The website offers a Verified badge
    when a company claims its profile, and a copy of every ComMail sent to the
    company's registered email. Neither is in Section 3. The mockup keeps both;
    Richard to confirm before a real build.
12. **Scoring numbers used in the mockup.** For item 6, the mockup assumes 200
    points reach the full 30% boost and the New Member Boost is 10% inside that
    ceiling. It also assumes Skip earns no daily lead list points. For item 7,
    the inviter gets 10 points and the partner gets the New Member Boost.
    Richard to confirm before a real build.
13. **Engine settings used in the mockup.** The Fit Score weights, the 80 and 50
    Connection Request thresholds and the overnight attention formula are
    placeholders. Richard to confirm before a real build.
14. **The AI Lead Agent spec differs from this plan.** The
    [task document](2026-10-21-ai-lead-agent.pdf), dated Oct 21, 2026, describes
    what Section 6 postpones to Phase 2. It names a different pilot (PCCC in
    Canada from Jan 1, 2027, while the MVP pilot is ECCP; see item 16), is a
    paid upgrade, and
    has the agent message other agents on its own, against "AI drafts, a person
    decides". The mockup shows it only as a labeled preview. Richard to settle
    these before a real build.
15. **Staff access to private content.** The mockup previews a ComLinked Team
    Dashboard, where staff see counts, statuses and company names but never
    conversations or confidential items. The glossary and ADR 0005 give a
    Superadmin unrestricted access, so the two must be reconciled before a real
    build. Section 3.6's "no custom admin console" still applies to the MVP.

### Decided since adoption

16. **ECCP is the first pilot.** On 2026-11-10 the European Chamber of Commerce
    of the Philippines (ECCP) replaced PCCI–Quezon City as the first pilot for
    the whole MVP. The opening summary and Sections 7, 7.2, 8.1 and 8.2 still
    name PCCI–Quezon City; read them as ECCP. Which chambers follow, and in what
    order, is not yet set. The Section 8.1 targets were written for PCCI–Quezon
    City, so check that they still fit.

### Awaiting Richard: choices in the Pilot Preview

Added 2026-11-18. The [Pilot Preview](2026-11-17-pilot-preview.md) for ECCP shows
four things the plan says differently. They stay open until Richard confirms them,
and Sections 1 to 8 are unchanged until he does. The spec lists them under
[Questions for Richard](2026-11-17-pilot-preview.md#questions-for-richard).

17. **Who supplies the Community Manager.** Section 3.6 and L4 speak of pilot
    community managers without saying who employs them, and Section 8.3 treats
    them as human help brought in for the first weeks. The SRS has them work for
    the Chamber. The Pilot Preview shows ComLinked supplying the Community
    Manager, with ECCP naming one Chamber Contact.
18. **Who sends the claim links.** A2 sends a personal link by email or SMS, and
    Section 3.6 has the member import send the claim links. The Pilot Preview has
    ECCP send each link from its own address, with a message ComLinked prepares,
    so the Member List holds only company names and websites.
19. **What shows before a Claim.** A1 builds a draft profile for every company
    before launch. The Pilot Preview shows a Company that has not claimed with
    its public basics only: name, industry, city and website. The AI-written
    description appears once the Company has checked it while claiming.
20. **Matching before a Claim.** L1 gives 3 matches right after claiming, and
    does not say whether they may include companies that have not claimed. The
    Pilot Preview allows it: such a Match shows its basics and a reason drawn
    from the viewer's needs, cannot be connected with, and a message to it waits
    until it claims.
