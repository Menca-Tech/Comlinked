# Spec: ComLinked website redesign (quiet authority)

Status: ready-for-agent · Created 2026-11-09 · Vision: [MVP Build Plan](2026-10-11-mvp-build-plan.md) ·
Vocabulary: [CONTEXT.md](../../CONTEXT.md) · Requires the demo clean-up to land first

## Problem Statement

ComLinked's public website has to win over two people: a Chamber Leader deciding whether to lend the chamber's name to a pilot, and a company owner checking whether ComLinked can be trusted. Today the site does not feel established enough for either of them.

Near-black bands repeat down each page, every headline competes for attention, and the homepage hero offers no way in for a Chamber Leader. Claims rest on figures labelled as example data. The pilot form appears before the case for a pilot has been made. The site also reads differently from the signed-in product, so moving from one to the other feels like changing companies.

## Solution

Redesign the four main public pages around one feeling: quiet authority. Pages are calm and spacious, with Source Serif 4 headlines, paper-white backgrounds, one deep navy hero and one strong visual per page.

A shared homepage hero makes the promise of first leads within 24 hours and offers two paths, one for companies and one for chambers. Specific commitments from the MVP Build Plan replace example figures as the proof. Only the homepage Network Ring moves, in one short sequence that tells the story of a company being connected and then stops.

Forms check their fields properly and then lead into the simulated product, and the site says plainly that nothing was sent.

### Decisions at a glance

| Topic         | Decision                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------- |
| First readers | Chamber Leader and company owner, jointly                                                           |
| Feel          | Quiet authority: calm, spacious, confident type, little movement, one strong visual per page        |
| Type          | Source Serif 4 headlines, Nunito Sans for everything else                                           |
| Colour        | Paper-white pages, one deep navy hero per page, logo blue headline accent on the homepage hero only |
| Proof         | Specific commitments from the plan, with no example figures in the sales argument                   |
| Motion        | Only the homepage Network Ring moves; hover and focus feedback stay                                 |
| Forms         | Validated, then lead into the demo. Nothing is stored or sent                                       |
| Honesty       | One quiet "Working mockup" ribbon above the navigation                                              |
| Build order   | Foundation, homepage, review with Richard, then the other three pages                               |

## User Stories

### Chamber Leader

1. As a Chamber Leader, I want to see a path meant for chambers in the homepage hero, so that I know the site is speaking to me.
2. As a Chamber Leader, I want "For chambers" to be the first navigation item, so that I can find my page immediately.
3. As a Chamber Leader, I want a chamber section high on the homepage, so that I don't have to scroll past the whole company pitch.
4. As a Chamber Leader, I want the site to feel calm and established, so that I am comfortable lending my chamber's name to it.
5. As a Chamber Leader, I want to read what my members get before being asked for anything, so that I can judge the value of a pilot.
6. As a Chamber Leader, I want to see how ComLinked works for my chamber, so that I understand importing members, seeing who is active and making introductions.
7. As a Chamber Leader, I want to know what a pilot asks of me, so that I can judge the work for my staff.
8. As a Chamber Leader, I want to see that pilot chambers and their members join free, so that cost is not a barrier to saying yes.
9. As a Chamber Leader, I want a commitment that each Chamber Network is kept separate, so that I know my members are not exposed to other chambers.
10. As a Chamber Leader, I want to see an example of the activity view, so that I know I will be able to see whether the pilot is alive.
11. As a Chamber Leader, I want the pilot form at the end of the page, so that I am asked only after the case has been made.
12. As a Chamber Leader who has already decided, I want a hero button that takes me to the form, so that I don't have to scroll.
13. As a Chamber Leader, I want clear answers to common questions, so that I can resolve doubts without contacting anyone.
14. As a Chamber Leader, I want to be told plainly when an answer is still to be confirmed, so that I am not misled.

### Company owner

15. As a company owner, I want the promise of first leads within 24 hours to be the first thing I read, so that I know why ComLinked matters to me.
16. As a company owner on a phone, I want the headline and both buttons on my first screen, so that I can act without scrolling.
17. As a company owner, I want to see three named example matches with a reason to meet, so that the promise feels concrete.
18. As a company owner, I want to understand that connections stay with my company when people leave, so that I see how this differs from personal networks.
19. As a company owner, I want to see specific commitments, so that I can trust ComLinked without relying on invented numbers.
20. As a company owner, I want to know that company names are never hidden and that the MVP is free, so that I know there is no paywall waiting for me.
21. As a company owner, I want to know that AI never sends anything without a person tapping Send, so that I stay in control of what my company says.
22. As a company owner, I want to follow one company's journey from claiming its profile through every day after, so that I understand what using ComLinked involves.
23. As a company owner, I want to see the Daily Lead Loop as one simple picture, so that I understand why I would come back each day.
24. As a company owner, I want to see what a company profile contains, so that I know what I am claiming.
25. As a company owner, I want to see an example of who is interested in my company, by name, so that I understand ComDash immediately.
26. As a company owner, I want to know in plain words how rank works, so that I know what lifts my company in search.
27. As an invited company owner, I want the site to confirm that ComLinked is legitimate, so that I feel safe claiming my profile.

### Forms

28. As a visitor, I want a correctly completed Join form to take me into the claim flow, so that I can try the product.
29. As a Chamber Leader, I want a correctly completed pilot form to take me to the chamber tools, so that I can see what my staff would use.
30. As a visitor who leaves a required field blank, I want a clear message beside that field, so that I know what to fix.
31. As a visitor who enters a badly formed email, I want a clear message beside that field, so that I can correct it.
32. As a visitor with several mistakes, I want focus moved to the first problem, so that I can correct them in order.
33. As a visitor who fixes a field, I want its message to clear, so that I know it is now acceptable.
34. As a visitor, I want to be told that nothing was sent, so that I don't wait for a reply that will never come.
35. As a visitor, I want my details never placed in a web address, so that they don't end up in browser history or logs.

### Presenter

36. As a presenter, I want every main website action to lead into the simulated product, so that the demo flows without breaking.
37. As a presenter, I want moving between the website and the product to keep the simulation's state, so that a demo isn't accidentally reset.
38. As a presenter, I want the Network Ring sequence to play when the page opens on a laptop, so that the room sees the idea.
39. As a presenter, I want the site and product to look like one company, so that the step into the claim flow feels continuous.

### Everyone

40. As any visitor, I want one quiet line telling me this is a working mockup with example data, so that I am not misled.
41. As any visitor, I want that line to scroll away, so that it doesn't follow me down the page.
42. As any visitor, I want the headline and buttons to appear immediately, so that animation never makes me wait.
43. As a visitor who prefers reduced motion, I want the finished Network Ring with no animation, so that the page is comfortable to use.
44. As a visitor whose browser doesn't run the script, I want to see the finished Network Ring, so that nothing is missing.
45. As a phone visitor, I want the Network Ring's sequence to start when I reach it, so that I don't miss it.
46. As a phone visitor, I want a simplified ring with three matches and short names, so that the labels stay readable.
47. As a visitor on a 360 pixel wide phone, I want no sideways scrolling, so that the page is easy to read.
48. As a keyboard user, I want visible focus on every control and a working skip link, so that I can use the site without a mouse.
49. As a screen reader user, I want the visuals described in text, so that I get the same meaning.
50. As a visitor with an old link to a section, I want it to still land in the right place, so that links keep working.
51. As a visitor following a section link, I want the target to appear below the top bar, so that its heading isn't covered.

### Team

52. As Richard, I want to review the foundation and homepage before the other pages are built, so that a change of direction costs one page and not four.
53. As Richard, I want to approve the page headlines and the chamber button wording, so that the product message stays mine to set.
54. As Richard, I want the first real chamber's name and quote to appear only once I confirm them, so that a placeholder can never go public.
55. As a developer, I want the written design system to match the site, so that future work follows one set of rules.
56. As a developer, I want a small shared set of section components, so that pages stay consistent and easy to change.
57. As a developer, I want the ribbon in one component, so that it can be removed in one change at launch.

## Happy and sad paths

### Homepage hero

| Path  | Situation                          | Expected result                                                                                             |
| ----- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Happy | Laptop, page opens                 | Headline and buttons show at once. The ring plays its sequence once, in about 1.2 seconds, then stays still |
| Happy | Phone, ring below the first screen | Headline and stacked buttons fill the first screen. The sequence starts when the ring comes into view       |
| Happy | Company path                       | "Join ComLinked free" reaches the Join form                                                                 |
| Happy | Chamber path                       | "Bring ComLinked to your chamber" reaches the For chambers page                                             |
| Sad   | Reduced motion is on               | The finished ring shows with no animation                                                                   |
| Sad   | Script fails or JavaScript is off  | The finished ring shows, and the page stays fully readable                                                  |
| Sad   | The ring never comes into view     | The sequence does not play, and nothing else on the page depends on it                                      |
| Sad   | Slow connection                    | Headline and buttons do not wait for the ring, and the layout doesn't jump as it appears                    |
| Sad   | Serif font fails to load           | The fallback serif shows and no text is hidden                                                              |
| Sad   | Very narrow phone or 200% zoom     | Ring labels stay readable and there is no sideways scrolling                                                |

### Join and pilot forms

| Path  | Situation                                | Expected result                                                                                     |
| ----- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Happy | Join form valid                          | Leads into the claim flow, keeping the simulation in the browser                                    |
| Happy | Pilot form valid                         | Shows "This is a demo, so nothing was sent. Opening the chamber tools." and opens the chamber tools |
| Sad   | Required field blank                     | Message beside the field, and no navigation                                                         |
| Sad   | Email badly formed                       | Message beside the field, and no navigation                                                         |
| Sad   | Only spaces entered                      | Treated as blank                                                                                    |
| Sad   | Several errors                           | All are shown, and focus moves to the first                                                         |
| Sad   | Error corrected                          | Its message clears                                                                                  |
| Sad   | Submit pressed twice                     | One navigation only                                                                                 |
| Sad   | Very long input                          | Stays inside the field and doesn't break the layout                                                 |
| Sad   | JavaScript is off                        | Nothing is submitted and no value appears in a web address; the page stays readable                 |
| Sad   | Visitor has already claimed in this demo | The existing product behaviour applies: the claim route opens ComDash                               |

### Navigation and links

| Path  | Situation                                                  | Expected result                                                         |
| ----- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| Happy | Section links (`#join`, `#free`, `#pilot`, `#how`, `#faq`) | Each lands on the right section, below the top bar                      |
| Happy | Website to product and back                                | Simulation state is kept                                                |
| Happy | Phone menu                                                 | Opens, closes with Escape, and closes on navigation, with focus handled |
| Sad   | Footer legal links with no page yet                        | Unchanged by this work                                                  |
| Sad   | Real chamber details not confirmed                         | The reserved spot renders nothing: no empty space, no placeholder       |
| Sad   | The reserved spot is switched on with its details missing  | It still renders nothing                                                |
| Sad   | Unknown page                                               | The existing not-found page shows                                       |

## Implementation Decisions

### Foundation

- The public site stays light only.
- Source Serif 4 is used for headlines on public pages. It and Nunito Sans are already loaded site-wide, so no new font is added.
- The dark ground on public pages moves from near-black to the deep navy already used by the product's main buttons and claim panel.
- Each page has exactly one navy band, its hero. All other sections are flat paper or white. Closing calls to action sit on paper with one navy button.
- The hero's main button keeps a light fill, because a navy button can't be seen on navy.
- Decorative logo rings are removed from public pages. The homepage hero's Network Ring replaces them.
- The logo blue headline accent appears on the homepage hero only.
- A small shared set of section components carries layout, spacing and type. Pages compose them instead of repeating one-off utility classes.
- Pages stay server components. Client code is limited to the navigation, the ring trigger and the two forms.
- No new dependencies are added. The website does not load the product's animation library.
- Removed: page-load fades, the unused scroll-reveal classes and the rules that only supported them. Hover and keyboard-focus feedback stay.
- The written design system is updated to match: Site Mode's type, grounds, motion and tone line.

### Navigation, footer and ribbon

- Solid white top bar that stays in view. It is never transparent, because the logo's grey wordmark would not read on navy and no light version of the logo exists.
- Link order: For chambers, How it works, ComDash. Sign in is a quiet link. "Join free" is the only filled button.
- The footer loses its two buttons and keeps its line, "ComLinked connects companies, not individuals.", and its link columns.
- The ribbon is one thin, muted line above the navigation, on paper, reading "Working mockup. All companies and figures are example data." with "Try the product". It scrolls away with the page and lives in one component.

### Homepage, in order

1. Hero: the promise, two paths ("Join ComLinked free", "Bring ComLinked to your chamber") and the Network Ring.
2. Your first day: three named example matches, each with a reason to meet.
3. For chambers: one strong section leading to the For chambers page.
4. When people leave, relationships shouldn't.
5. What we commit to: merges "Real companies only" and "Free for every company", and takes over the `#free` anchor.
6. Questions: shortened to the doubts that stop someone joining.
7. Join: the form ends the page and keeps the `#join` anchor.

"One network, three ways in" and the closing band are removed. "What your company profile shows" moves to How it works.

### For chambers, in order

1. Navy hero with one message, the activity view panel and one "Request a pilot" button.
2. What your members get.
3. How it works for your chamber (keeps `#how`).
4. What a pilot asks of you, including that pilot chambers and their members join free.
5. What we commit to, with chamber-specific promises.
6. Questions, shortened (keeps `#faq`).
7. Request a pilot: the form ends the page and keeps `#pilot`.

### How it works, in order

1. Navy hero with one message and one button.
2. Claim your profile, showing what a company profile contains.
3. Your first day.
4. Every day after, with the Daily Lead Loop's five steps as the page's visual: Morning Digest, act on Leads, talk and close, share the win, rank rises.
5. AI drafts. You decide, including that everything works with the AI Assistant off.
6. Closing on paper with one navy "Join ComLinked free" button.

### ComDash page, in order

1. Navy hero with one message and a large "Who's interested" panel of named example companies.
2. Who's interested, by name: the four Interest Signals, and that names are never hidden.
3. Climb by being active: relevance first, activity lifts a Company among relevant results, with a shortened list of what earns points.
4. Closing on paper with one navy button.

### Visuals

- One strong visual per page: Network Ring (Home), activity view panel (For chambers), Daily Lead Loop (How it works), "Who's interested" panel (ComDash).
- Visuals are built in the page, not screenshots, so they stay sharp and don't go stale.
- Every visual showing example companies or figures is marked as an example and has a text alternative.
- The chamber visual is deliberately not a Network Ring. That term means one Company at the centre, and a chamber-wide drawing would imply members can see each other's full Connections.

### Network Ring in the hero

- Laptop: one Company at the centre, its three first-day Matches and a few Connections, each named as an example.
- Phone: the centre and three Matches only, with short names, placed below the headline and buttons.
- The finished drawing is the default state. A small script arms the sequence, so a script failure leaves the finished drawing visible.
- Sequence: the centre appears, the Matches arrive, thin lines draw to connect them. Each piece takes about 260ms, the whole about 1.2 seconds, with no bounce. It runs once per page load, when the ring is in view, then stays still.
- The sequence never delays the headline or buttons and causes no layout shift.

### Proof and copy

- Commitments come only from the MVP Build Plan and accepted ADRs: free for every company, company names never hidden, Connections stay with the Company, each Chamber Network kept separate, and AI drafts while a person decides.
- Example figures such as "312" are removed from the sales argument. Example values may appear only inside clearly marked example visuals.
- The Verified badge stays out of the commitments until Richard confirms it (OD-08).
- Strong lines are kept, including "When people leave, relationships shouldn't." and "ComLinked connects companies, not individuals." Other copy is tightened to one idea per section, with no new claims.
- Answers still unconfirmed keep the demo clean-up's "We'll confirm this with your chamber during pilot planning" wording.
- One reserved spot for the first real chamber's name and quote is off by default and renders nothing until switched on with complete details.
- Voice follows the Design System: sentence case, no emoji, no exclamation marks.

### Forms

- Join and pilot forms use the project's existing form and validation tools, with one validation schema per form.
- Valid forms lead into the demo through client-side navigation so the simulation is kept.
- Values are not stored, sent or placed in a web address.
- The pilot confirmation changes from the demo clean-up's wording to "This is a demo, so nothing was sent. Opening the chamber tools."

### Delivery

- Work happens on its own branch from `feat/comlinked-brand-and-website`, after the demo clean-up has landed.
- Build order: foundation, homepage, review, then For chambers, How it works and ComDash.
- The review covers a laptop and a phone and includes Richard. The other three pages wait until the direction is accepted.
- Sign in links keep pointing into the demo, as set by the demo clean-up. The sign-in page gets a light restyle only.

## Testing Decisions

A good test checks what a visitor can see and do, through the real pages. It doesn't assert class names, internal structure or the steps of an animation.

**Seam 1: Playwright end to end.** The main seam, extending the existing public-page specs and accessibility gate. It covers:

- page content and section order, and that no placeholder text or removed example figures appear
- every main action and section link, including client-side moves that keep the simulation
- form happy and sad paths from the tables above
- viewports at 360, 390, 1280 and 1440 pixels wide, with no sideways scrolling
- reduced motion and JavaScript-off contexts, where the finished ring is visible
- the headline and buttons being visible without waiting for the ring
- axe with no serious or critical violations on every public page

**Seam 2: Vitest on the form validation schemas.** Pure tests of accepted and rejected input: blank, spaces only, badly formed email, very long values and valid values. Prior art: the existing unit tests under the service and auth areas, and the testing-unit project skill.

Prior art for Seam 1: the public-page accessibility spec, the auth smoke spec, the product smoke spec, and the testing-e2e project skill.

Manual checks at the review: the ring sequence looks right on a real laptop and phone, the serif headlines read well, and the page feels calm.

## Out of Scope

- Real form submission (FR-WEB-02 and FR-WEB-03), real sign-in and any backend
- Privacy and security review, which real submissions would require
- Decisions on the Verified badge and ComMail email copies
- Changes to the product screens under `/app`, including the Network Ring component there
- A light version of the logo, photography, dark mode, and other languages
- Legal pages; the existing footer legal links stay as they are
- A second animated moment, such as in "When people leave"
- The demo clean-up itself, which is a separate handoff

## Further Notes

- **Dependency:** the demo clean-up removes placeholders and connects the website to `/app` first, so the site stays presentable while this is built.
- **Non-blocking:** Richard approves the four page headlines and the chamber button wording before launch.
- **Unknown:** the demo date was not given, so whether the redesign makes the first demo is undecided. The clean-up site remains the fallback.
- **Design system exception:** Source Serif 4 headlines and the single navy hero change the written Site Mode rules on purpose. The rules are updated rather than excepted.
- **Glossary:** Chamber Leader was added and Site Mode now reads "spacious".
- **No ADR is needed,** because these choices are not hard to reverse.
