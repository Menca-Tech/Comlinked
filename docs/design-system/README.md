# ComLinked Design System

The visual system for **ComLinked**, the company-to-company network where
connections belong to the company, not the person.

This system started as a recolour of the Arcbound Design System and has since
been **re-derived from the ComLinked logo** so the two brands stay distinct: the
type echoes the rounded "comlinked" wordmark, the ring from the logo mark is the
motif, and shapes are rounded like the mark. Every colour comes from the logo's
blue and grey. Sample copy comes from the ComLinked site.

> **The tone in one line:** friendly, confident, clear. Bold rounded headlines,
> the logo blue for accents, and the ring from the ComLinked mark.

**One system, two modes.** The brand, colours, font and voice below apply
everywhere. **Site Mode** is the expressive form for public pages. **App Mode** is
the compact form for signed-in screens. Rules in [App Mode](#app-mode) override the
general rules on signed-in screens. The mockup at `docs/mockup/` is the reference
for how each screen works.

---

## Sources

| Source                            | Notes                                                                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arcbound Design System            | The starting structure (token families, component set). Its type, labels, markers, square shapes and glows were replaced (Review 4) so ComLinked does not look like Arcbound. |
| `assets/Logos/comlinked-logo.png` | The only colour source. Sampled: blue **#55A2D4** (mark and "com"), grey **#838587** ("linked").                                                                              |
| ComLinked Sign Up page            | Sample copy in previews and examples.                                                                                                                                         |

Unlike Arcbound, ComLinked **has a logo file**. Use it wherever the brand mark is
needed; don't set the name in type as a substitute.

---

## Content fundamentals

**Voice.** Plain, company-first and specific. ComLinked talks to the company
through its authorized representative.

- "Your company", "company profile", "company connection". The person is an
  "authorized rep"; never "your network".
- Contrast pairs carry the message: "When people leave, relationships
  shouldn't." · "ComLinked connects companies, not individuals."
- **Casing:** sentence case everywhere: headlines, labels, buttons, tags.
- In Site Mode, only each page's **main headline** carries a key phrase, set
  **upright in heavy logo blue**: "Your first business leads **within 24
  hours.**" Every other heading is one colour. App Mode titles carry no
  key phrase.
- **No emoji. No exclamation.** Numbers are specific (`312`, `87`, `120+`).
  Example figures are labelled **Example data**.
- **No labels above headings.** The heading says what the section is; links
  name where they go.

---

## Visual foundations

**Two grounds, one accent.** The system alternates between a **cool near-black**
field (`cl-black` #1A1D20) and a **cool off-white paper** (`cl-paper` #F3F5F7).
One blue does the accent work: headline key phrases, statistics, the ring, borders,
the recommended tier.

- On paper and white the accent is **`cl-blue` #286FA3**, the logo blue deepened
  so it reads as text (4.9:1 on paper).
- On the dark field the accent is the pure logo blue **`cl-sky` #55A2D4**
  (6.1:1). `Headline onDark` and anything inside `.cl-field-dark` switch
  automatically through `--accent-current`.
- The logo grey **`cl-grey` #838587** is the neutral mark colour (rules you want
  visible, the cover bar). It is too light for text on paper; text uses
  `text-muted` (`cl-n-500`).

**Type.** One family: Nunito Sans. ExtraBold for headlines and big figures,
regular to bold for text, labels and buttons. Its warmth sits with the rounded
logo, while firmer headlines keep the logo the only rounded type on the page.
No monospace.

**Layout.** Generous space; content left-aligned. Sections open with the heading
itself, never a label above it.

**Backgrounds.** No photography. Dark grounds carry the **logo rings**: faint
concentric rings from the ComLinked mark bleeding off one corner (`--rings-top-right`,
`--rings-bottom-left`). Paper grounds are flat.

**Cards.** Rounded corners (`radius-card` 16px), a 1px hairline border and no drop
shadow. Inputs use `radius-control` (8px); buttons, tags and chips are pills
(`radius-pill`), round like the logo. Three card grounds: white-on-paper, dark
surface, and the **recommended** tier (`cl-blue-tint` + `cl-blue` border).

**Data.** In Site Mode, the proof device is an **oversized blue figure** with a
short caption and an optional superscript unit (`/mo`). App Mode figures are small
and plain.

**The ring.** The logo's concentric mark, small (`.cl-ring`), leads Site Mode list
rows and marks "live" or "new" items (never a label above a heading). It replaces
dashes, dots and plus signs on public pages. It does not mark tabs or statuses.

**Motion.** Restrained, with no bounce. Each page's hero content rises into place once
on load (about 0.7s on `--ease-out`, slightly staggered); controls respond in about
150ms. Hover = slight darken (`brightness(0.92)`); press = `scale(0.985)`. Reduced
motion turns all of it off.

---

## Iconography

The **logo ring** (`.cl-ring`) is the only brand glyph. Site Mode needs no other
icons, though check marks may show included features.

Other companies are shown by **initials only** (no logos or photos): a dark chip
with 8px corners, or an oversized monogram (ink, accent or steel). In App Mode the
chip is a pale square with navy initials, and only your own company's stays solid
navy. Squares mean companies; circles would read as people.

**App Mode controls use Lucide** at a 2px stroke, in ink or muted. Blue appears only
on the active item. Never put an icon on a tinted tile.

---

## App Mode

The rules for signed-in screens and the claim steps. The job of every screen is to
make the next action obvious, so one thing leads and the rest stays quiet.

**The feeling.** "This is serious, and I was invited." Calm and precise, closer to a
private bank than a consumer app.

**Theme.** Light only for the MVP. Dark sections and rings stay on public pages, with
one exception: the claim steps are the doorway into the app, so they use a navy panel
with the rings.

**Navigation.** Five places, in this order: ComDash, Leads, ComMail, Asks, Wins.
Words in a top bar from 900px; bottom tabs with Lucide icons on phones. The active
tab has a tinted icon and a bold label. The phone top bar holds a bell with its
count, search and the company's initials. Community Manager and ComLinked Staff
tools use their own simple header.

**Type.** Source Serif 4 for page titles and the rank figure only, one formal line per
screen. Nunito Sans for everything else, kept light: bold (700 and up) is rare.

| Role                          | Phone, laptop | Font and weight          |
| ----------------------------- | ------------- | ------------------------ |
| Claim headline                | 34px, 46px    | Source Serif 4, 500      |
| Page title                    | 26px, 32px    | Source Serif 4, 500      |
| Rank figure                   | 32px          | Source Serif 4, 500      |
| Score, where the number leads | 28px          | Nunito Sans, 600         |
| Section title                 | 18px          | Nunito Sans, 600         |
| Body, company names           | 16px          | Nunito Sans, 400 and 600 |
| Details such as city or time  | 14px          | Nunito Sans, 400         |
| Count badge, tab label        | 12px          | Nunito Sans, 600         |

**Layout.** Phones are single-column and come first. Laptops get their own layout on
key screens: the claim steps are two panels (navy invitation, white action), and Leads
and day-one matches are a ranked list beside the selected company in full.

**ComDash.** The home screen follows the 2026-11-11 redesign
([spec](../specs/2026-11-11-comdash-redesign.md)). It has a header with the company name,
industry, city and chamber, a "View as" switcher, and five tabs with their own addresses:
Overview, Interest Signals, AI Lead Agent, Connections and Profile. The tabs are links in
one row that scrolls sideways on phones.

- **Overview**: top numbers, visibility chart, interest funnel, the interested companies
  table (Hot, then Warm, then New), alerts, "Found you as a…", interest by industry,
  search terms with profile gaps, Next action and summary cards. On phones Next action
  comes first, the table becomes stacked cards and the chart shows one series.
- **Interest Signals**: each interested company with its Interest Level as a text tag,
  a one-line summary, repeat interest on separate days in blue, a dated timeline that
  opens in place, and Connect and Message.
- **Connections**: Manage connections beside the main column on laptops, then
  Invitations, Companies in your chamber, Buyers of what you sell, and "From your
  connections" (asks, Success Wall wins and profile updates, each with a reply box that
  sends only on Send).
- **"View as"**: Free, Growth and Pro chips with the note "Possible future pricing. Not
  in the MVP." Free is the default and hides nothing. Growth adds an intent score and
  Pro adds interest from other chambers. There is never blur or an upgrade prompt.

The Network Ring and the rank line no longer appear on ComDash. Every panel has a calm
empty state that says what will appear.

**Containers.** One raised white panel per column, with a very soft navy-tinted shadow
on the cool off-white page. Lists sit inside it with hairline dividers. Never a card
per row and never a card inside a card. On phones, panels run edge to edge with no
shadow. Space is tight within a group and clearly larger between sections.

**Colour and status.** One accent, no new hues.

| Meaning                               | Treatment                              |
| ------------------------------------- | -------------------------------------- |
| The one main action on a screen       | Solid navy (`action-primary`) button   |
| Active or selected                    | Blue plus a second cue: bold or a tint |
| Good ("On track", "Connected")        | Blue tint, check icon and label        |
| Needs attention ("Behind", "Flagged") | `error` tint, alert icon and label     |
| Everything else, including Fit Scores | Ink or muted                           |

**Controls.** Controls are at least 44px tall on phones and 40px on laptops. Buttons
have 10px corners, matching inputs, and run full width on phones only. Each screen has
one solid button; the rest are outline or quiet. Tags and count badges cannot be tapped
and stay as small tinted pills, so shape shows what is clickable.

**Components.**

- **App bar** and **bottom tabs**: the navigation above.
- **Rank line**: rank figure, category and Activity Score on one line, with no dark
  card and no row of stats.
- **Active panel**: the single item to act on now, on a blue tint with no border.
- **Lead row**: selected (the only one with buttons), waiting (name, city, Fit Score and
  one line on why to meet; select it to act), done (collapsed to a one-line result).
  Highest Fit Score first. Finishing a Lead opens the next one.
- **Selected company**: why to meet, why it fits in plain words, then the actions. To
  the right of the list on a laptop, opened in place on a phone.
- **Fit Score**: a number with a small "Fit" label, in ink. Point values appear only on
  the Engine screen.
- **Company mark**: pale square with navy initials.
- **Tally**: one mark per item in a short daily task, such as 2 of 5 done.
- **Section**: an 18px title, then its list or content, with no container.
- **List row**: initials, name, details, optional plain value at the end.
- **Button**: primary, outline, quiet.
- **Status label**, **tag**, **count badge**, **toast**, **empty state**.

**Copy.** Name the screen plainly: "Wins", not a tagline. Do not explain the product
inside the product. In the mockup, one "Example data" tag sits beside the logo on every
screen, so a screenshot is never mistaken for real activity.

**Motion.** 150–250ms, for state changes only. Respect reduced motion.

**Before keeping any element,** say what job it does. If removing it loses nothing,
remove it. A choice that could be pasted into an unrelated product unchanged needs a
reason to stay.

---

## Fonts

From Google Fonts (loaded by `components/bundle.css`):

- **Everything:** `Nunito Sans`: 800 for headlines and figures, 400–700 for
  text, labels and buttons. (Rounded Nunito was tried for headlines and dropped:
  it read too soft at display sizes for a B2B audience.)
- **App Mode titles:** `Source Serif 4` at 500, for page titles and the rank figure
  only.

The `--font-mono` family now points to Nunito Sans, so older component code keeps
working without monospace.

---

## Components

Reusable React primitives on `window.ComLinkedDesignSystem_55a2d4`. All read the CSS
custom properties; none carry their own colours.

- **Label** / **RailLabel**: sentence-case kicker led by the logo ring, and its vertical rail variant.
- **Headline** / **Accent**: Nunito Sans ExtraBold headline + upright logo-blue key phrase.
- **Tag**: pill status tag (outline / accent / ghost): Free, Premium, Verified.
- **Card**: rounded hairline panel (paper / dark / recommended).
- **Stat**: oversized blue figure with a caption + optional superscript unit.
- **PlusList** / **NumberedList**: ring-led list and blue 2-digit numbered list.
- **Avatar**: initials chip (dark) or oversized monogram (`color`: ink / accent / steel).
- **Button**: pill-shaped CTA (primary blue / secondary outline / ghost).
- **Logotype** and **Signature** (brand cards): the logo file on paper and dark; the footer signature.

API change from Arcbound: colour props named `'red'` are now `'accent'`, and the
Avatar's `'blue'` is now `'steel'`.

---

## File index

```
styles.css              → entry point (imports only)
tokens.json             → every token: grounds, logo blue + grey, accent, neutral ramp, ring hues · families, scales, tracking · space, radii, minimal shadows
components/bundle.css   → Google Fonts @import · logo rings, motion · reset + signature utility classes (.cl-label, .cl-headline, .cl-accent, .cl-ring …)
components/bundle.js    → compiled components (window.ComLinkedDesignSystem_55a2d4)
components/<Comp>/      → Label, RailLabel, Headline, Accent, Tag, Card, Stat, PlusList, NumberedList, Avatar, Button · Logotype, Signature
components/src/         → component sources
guidelines/             → foundation specimen cards (type, labels, logo rings)
assets/Logos/           → comlinked-logo.png
```

## Caveats

- `cl-blue` is a deepened logo blue, chosen for legibility; the exact logo blue is `cl-sky`.
- The ring motif is drawn in CSS for now; a vector version of the logo mark would make it exact.
- No slide-deck kit yet; one can be built on these components.
