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
short caption and an optional superscript unit (`/mo`). App Mode figures are plain:
the sans face at 28px in ink.

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
mark is a square that shows whether the Company has claimed (see
[Controls and small parts](#controls-and-small-parts)). Squares mean companies;
circles would read as people.

**App Mode controls use Lucide** at a 2px stroke, in ink or muted. Blue appears only
on the active item. Never put an icon on a tinted tile.

---

## App Mode

The rules for signed-in screens, the claim steps and the Pilot Preview. The job of every screen
is to make the next action obvious, so one thing leads and the rest stays quiet. How these
screens look was set by the premium pass of 2026-11-18
([spec](../specs/2026-11-18-demo-premium-pass.md)): quiet and exact.

**The feeling.** "This is serious, and I was invited." Calm and precise, closer to a private
bank than a consumer app.

**Theme.** Light only for the MVP. Dark sections and rings stay on public pages, with one
exception: the two-panel screens are doorways into the app, so they use a navy panel with the
rings (see [Two-panel screens](#two-panel-screens)).

### The scale

Every font size, corner radius, space and colour on an App Mode screen is a named value from one
scale. The scale is defined once, in `src/app/demo-scale.css`, and the App Mode stylesheet
(`src/app/app/product.css`) uses those names and writes no font size, corner radius or colour of
its own. Changing a step changes one value, and every screen follows.

**Type.** Nine sizes, and nothing between them.

| Size | Used for                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------- |
| 12   | Count badges, tags, chart axes, initials in a mark                                             |
| 13   | Notes, captions, labels above figures, details in the compact density                          |
| 14   | Details such as city or time, body text in the compact density, compact buttons, the Story Bar |
| 16   | Body text, company names, navigation, tabs, buttons, inputs                                    |
| 18   | Section and panel titles                                                                       |
| 22   | The Focus panel's serif line on phones                                                         |
| 28   | Figures. The Focus panel's serif line on laptops, and the page title on phones                 |
| 36   | Page titles on laptops. The two-panel headline on phones                                       |
| 44   | Only the two-panel headline on laptops and the chamber screens' claimed figure                 |

- **Faces and weights.** Source Serif 4 at 500 for the page title, the Focus panel's one formal
  line and the two-panel headline, and nothing else. Nunito Sans at 400 and 600 for everything
  else. 700 and heavier are not used, so emphasis is 600.
- **Figures.** Nunito Sans 600 at 28 in ink, with the label above in 13 and any note below in 13.
- **No capitals.** No heading, label or table header is set in capitals.

**Radii.** Three, plus pills: 6 for company marks and small inner shapes, 10 for controls, 14
for panels. Tags, count badges and chips are pills.

**Space.** Multiples of 4. Space is tight inside a group and clearly larger between sections.
Hairlines, strokes of 2 and 3px, the logo rings' geometry and a few one-off offsets sit outside
the steps.

**Two densities.** Standard for most screens. Compact for data panels wherever they appear:
number tiles, tables, charts, side rails, the Interest Signals tab, the chamber screens and the
Team Dashboard. A density is set once, on the panel or the screen that holds the data
(`data-density="compact"`), never per element.

| Value              | Standard | Compact                     |
| ------------------ | -------- | --------------------------- |
| Body text          | 16       | 14                          |
| Details            | 14       | 13                          |
| Panel padding      | 24       | 16 on phones, 20 on laptops |
| Gap between panels | 20       | 12                          |
| Company mark       | 40       | 32                          |

**Colour.** One accent and no new hue. App Mode adds one neutral: a quieter grey for third-level
text (`cl-quiet`, #62676C), which holds 5.23:1 on the page and 5.71:1 on a panel.

### Panels and the Focus panel

- **Panel.** Flat white, a 1px hairline border, the panel radius, no shadow. Lists sit inside it
  on hairline dividers. Never a card per row, and never a card inside a card.
- **Focus panel.** The one panel on a screen that holds the thing to act on now. At most one per
  screen. White, no border, raised on a soft navy-tinted shadow, with 28px of padding. Where it
  holds a line to act on, that line is the screen's one serif line below the title. A screen with
  nothing to act on ("You’re all caught up") still shows its Focus panel, holding that line. A number tile that is the Focus panel keeps the
  tiles' padding, so its figure stays in line with the others.
- **One solid button.** The screen's main action is its only solid navy button. Every other
  button is outline or quiet. The Story Bar's Next is outlined, so it never competes.
- **Phones.** One column. Panels stay inset by a 16px gutter and keep their hairline, and the
  Focus panel keeps its raise.

| Screen                                               | Focus panel                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| Opening, the ask                                     | The navy panel                                              |
| Claim message and claim steps                        | The claim message, then the action panel of the claim steps |
| Day-one Matches, Leads                               | The selected Company                                        |
| Morning Digest                                       | The rank line and "Open today’s lead list"                  |
| ComDash Overview                                     | Next action                                                 |
| Interest Signals                                     | The Messages tile                                           |
| Connections tab                                      | Invitations                                                 |
| Profile tab                                          | Profile strength                                            |
| ComMail                                              | The open conversation and its reply box                     |
| Asks                                                 | The box for posting an Ask                                  |
| Wins                                                 | The testimonial that is owed, or else the card for sharing  |
| Chamber screens, both Seats                          | The claimed figure with its split                           |
| Engine                                               | The network map                                             |
| AI Lead Agent preview                                | The Mandate form                                            |
| Search, Notifications, Team Dashboard, After the MVP | None: the page title leads                                  |

The Focus panel carries one marker in the page, `data-focus-panel`, written by `focusPanel()`.
The styles and the browser checks both find it by that marker.

### Navigation

Five places, in this order: ComDash, Leads, ComMail, Asks, Wins.

- **Top bar.** White with a hairline under it and no shadow, 60px tall on laptops and 56px on
  phones. From 900px the places are words: the active one is ink at 600 on a navy underline.
  Count badges are small tinted pills with navy figures. On phones the top bar holds a bell with
  its count, search and the company's own mark.
- **Bottom tabs.** On phones, with Lucide icons. The active tab has a tinted icon and a label at 600.
- **Tabs inside a screen** (ComDash, the Team Dashboard, the handoff package) read as the places
  in the top bar do. The chosen tab's underline moves to it.
- Community Manager and ComLinked Staff tools use their own simple header.

**Story Bar.** On every Stop of the Pilot Preview, a slim second row of the white header, about
48px tall on laptops, closed by a hairline and not fixed to the screen. Left to right: six step
dots (done, current, to come), the day and what is happening at 600, whose Seat in the quieter
grey, then the Stop count, Back as a quiet button and Next as an outlined button. A Stop's side
step is a quiet button before the count. Its text is 14. On phones the step dots share the first
row with the count, Back and Next; the day and title follow, then the Seat line; a side step
takes its own row; and Next is at least 44px tall.

### Controls and small parts

- **Controls.** Standard controls are 40px tall on laptops and 44px on phones. Compact controls
  (chips, table actions, the Story Bar's buttons) are 32px on laptops and 44px on phones. Buttons
  have 10px corners, matching inputs, and run full width on phones only.
- **Button**: solid, outline, quiet.
- **Tag** and **count badge**: small pills that cannot be tapped. A tag is 20px tall at 12px.
- **Chip**: a pill with a border, which can be tapped. The chosen one is tinted. Shape shows what
  is clickable.
- **Company mark**: a square with initials at 12px, on the mark radius. It is one part, used
  wherever a Company is listed.
  - A Company that has claimed: pale blue ground, navy initials.
  - A Company that has not: no ground, a dashed outline, initials in the quieter grey. "Not yet
    claimed" still shows as a tag wherever it does, so the shape is never the only cue.
  - Your own Company, where a screen shows it as yours: solid navy.
  - A Company the network holds no claim for, and a row a "View as" tier hides: plain grey. A
    hidden row's mark carries no initials.
- **Fit Score**: a number with a small "Fit" label, in ink. Point values appear only on the
  Engine screen.
- **Lead row**: selected (the Focus panel, and the only one with buttons), waiting (name, city,
  Fit Score and one line on why to meet; select it to act), done (collapsed to a one-line
  result). Highest Fit Score first. Finishing a Lead opens the next one.
- **Tally**: one mark per item in a short daily task, such as 2 of 5 done.
- **List row**: mark, name, details, optional plain value at the end.
- **Toast** and **empty state**. Every panel has a calm empty state that says what will appear.

**Colour and status.** Status is always text, never colour alone.

| Meaning                                   | Treatment                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| The one main action on a screen           | Solid navy (`action-primary`) button                                                              |
| Active or selected                        | Blue plus a second cue: weight 600 or a tint                                                      |
| Good ("On track", "Connected", "Cleared") | Blue tint, check icon and label                                                                   |
| Needs attention ("Behind", "Flagged")     | `error` tint, alert icon and label                                                                |
| Interest Level                            | Hot solid navy, Warm in the blue tint, New outlined                                               |
| Member status                             | Active in the blue tint, Quiet grey, Needs an intro in the `error` tint, Not yet claimed outlined |
| Everything else, including Fit Scores     | Ink or muted                                                                                      |

Inside a group already headed by its status, rows carry no status tag.

### Charts

Daily counts are drawn as bars, by one shared part (`DayBars`). A quiet day must not look like a
fault.

- **Small chart, ComDash Overview.** One bar per day. A day with nothing shows a short tick on
  the baseline. "Day 1" and the last day label the ends, and a sentence under the chart says what
  it shows.
- **Large chart, Interest Signals.** One bar per day, with search appearances in navy and
  recommendations stacked above in light blue. It has an axis grid, a tick label every other day,
  a hover label on each segment, a legend that gives the latest day's values, and a text list of
  each day's values for screen readers. There is no series toggle: both fit on a phone.
- **Empty.** A new Company with no visibility sees the calm empty state and no bars.
- **The Team Dashboard's trend** is the one line chart: weekly active companies against the
  target. It is drawn at the width it is given, so its axis reads at 12.

### Two-panel screens

The Opening, the ask and the claim steps share one form (`TwoPanel`): two panels in one frame on
the panel radius, navy with the logo rings beside white. The headline is the serif at 44 on
laptops and 36 on phones. On phones the navy panel stacks above the white one.

- **The Opening.** Navy: the title, the one-line description, and the invented-data line at the
  foot above a rule. White: "The 6 stops" as a timeline with the day beside each Stop, then Start
  as the solid button.
- **The ask.** Navy: the title, the two things ECCP gives as a numbered pair, and "The pilot is
  free for ECCP and its members." at the foot in the serif. White: what ComLinked does and what
  members get as plain lists, then Email Richard as the solid button and Explore on your own as
  outline.
- **The claim steps.** Navy invitation, white action panel. Here the white panel is the Focus
  panel.

### Screens

**Layout.** Phones are single-column and come first. Laptops get their own layout on key
screens: the two-panel screens, and Leads and day-one Matches as a ranked list beside the
selected company in full.

**ComDash.** The home screen follows the 2026-11-11 redesign
([spec](../specs/2026-11-11-comdash-redesign.md)) for what it holds. It has a header with the
company name, industry, city and chamber, a "View as" switcher, and five tabs with their own
addresses: Overview, Interest Signals, AI Lead Agent, Connections and Profile. The tabs are links
in one row that scrolls sideways on phones.

- **Overview**: Next action spans the width as the Focus panel. Below it, two columns on
  laptops: Interest Signals in the wide one, with three figures, the day bars and the Hot
  companies, each opening its timeline; Connections and Profile stacked in the narrow one, each
  as tall as its content. When the presenter shows the later items, the AI Lead Agent card,
  labelled "Preview: after the MVP", joins the narrow stack. One column on phones.
- **Interest Signals**: in the compact density. Six number tiles with Messages as the Focus
  panel, the stacked day bars beside the interest funnel, then the interested companies table
  (Hot, then Warm, then New, with All, Hot, Warm and New filter chips showing counts) beside a
  rail of alerts, "Found you as a…", interest by industry and search terms with profile gaps.
  Table headers are sentence case. A row opens a side drawer with the company's mark, its dated
  timeline, "You see the company, not the person.", and Connect and Message. On phones the table
  becomes stacked cards and the drawer is full width.
- **Connections**: Invitations lead as the Focus panel, with Accept as the one solid button.
  Manage connections sits beside the main column on laptops, then Companies in your chamber,
  Buyers of what you sell, and "From your connections" (asks, Success Wall wins and profile
  updates, each with a reply box that sends only on Send).
- **Profile**: Profile strength leads, with whatever is still missing as its one solid button.
- **"View as"**: Free member, Growth and Pro chips with the note "Possible future pricing. Not in
  the MVP." The tiers are a labelled demo of possible future pricing, as the user decided on
  2026-11-18. They are off in the Pilot Preview, where ComDash shows everything the MVP does with
  no tier, and on in the full Demo, which opens on Free member.
  - **Free member** lists six interested companies with names, Interest Levels and signals
    blurred, a "See who" button on each, an upgrade box, weekly alerts without names and five
    search terms.
  - **Growth** names the Company's own chamber with intent scores, highest first, hides other
    chambers behind "Unlock on Pro", and adds "Send my agent" and a "Compare Pro" box.
  - **Pro** names every chamber.
  - The tier elements keep to the scale. The tab still has at most one solid button with the
    tier's buttons counted: the upgrade box's button on Free member, while "Send my agent" is
    outlined. What a tier shows or hides is set by the ComDash spec, not here. Richard must agree
    before ECCP sees the tiers.

The Network Ring and the rank line no longer appear on ComDash.

**Chamber screens, both Seats.** One Focus panel leads: the claimed figure ("40 of 100") at 44
over a bar split in proportion into Active, Quiet, Needs an intro and Not yet claimed, with deals
confirmed and wins posted beside it. Active is navy, Quiet the light logo blue, Needs an intro
the `error` red and Not yet claimed the sunken grey; a status with no members draws no segment.
The status filter under the bar is its key: five chips, each status with its colour and its
count, so the counts are always in text. Below, members are grouped under the four status
headings, six per group in two columns on laptops, with a control that shows the whole group,
beside the side column (the Community Manager's tools, or the Success Wall and Monthly Top
Companies).

**The later screens.** Search leads with its field under the title, over a flat list of marked
results. Notifications is a flat list with new items marked. Engine raises the network map and
keeps its notes flat. The AI Lead Agent preview raises the Mandate form; during a run nothing is
raised, a gate sits between two hairlines in the conversation, and its Approve is the one solid
button. After the MVP is flat lists. The Team
Dashboard is compact, with "On track" and "Behind" as tags with their icons. None of Search,
Notifications, After the MVP or the Team Dashboard raises a panel.

**Presenter Guide.** Opens with G. Its links, switches and figures use the same scale, and its
buttons are outline or quiet, so it never adds a solid button to the screen behind it.

### Copy

Name the screen plainly: "Wins", not a tagline. Do not explain the product inside the product. In
the Demo, one "Example data" tag sits beside the logo on every screen, so a screenshot is never
mistaken for real activity.

### Motion

- **State changes.** 150 to 250ms, on things the viewer triggers: the timeline drawer sliding in
  when a row opens it, a tab's underline moving, a status fading in where a button was after
  Connect or Send, a chip being chosen.
- **One staged moment.** After the claim finishes on Stop 2, the three day-one Matches arrive one
  after another: each fades in and rises 8px over 400ms, 300ms after the one before, about a
  second in all. It runs once, on arrival from the claim, and any tap or key press ends it.
- **Nothing else is staged.** No screen animates on load, and no figure counts up.
- **Reduced motion.** Every transition and the staged moment are off, and the finished state
  shows at once.

### Keeping to it

- **The checks.** `e2e/demo-rules.spec.ts` opens every address under `/app` that `src/paths.ts`
  names or that has a page file, at laptop and phone width,
  and checks that every text size and weight is on the scale, nothing is in capitals, at
  most one panel is the Focus panel, at most one button outside the Story Bar is solid, and
  nothing scrolls sideways at 360, 390, 1280 or 1440 pixels. A new screen joins by joining its
  list of screens, and a test fails, naming the address, if it is left off.
- **The website's two example panels** picture these screens, and read the same named values
  from `src/app/demo-scale.css`.
- **Before keeping any element,** say what job it does. If removing it loses nothing, remove it.
  A choice that could be pasted into an unrelated product unchanged needs a reason to stay.

---

## Fonts

From Google Fonts (loaded by `components/bundle.css`):

- **Everything:** `Nunito Sans`: 800 for headlines and figures, 400–700 for
  text, labels and buttons. (Rounded Nunito was tried for headlines and dropped:
  it read too soft at display sizes for a B2B audience.)
- **App Mode:** `Source Serif 4` at 500 for the page title, the Focus panel's one
  formal line and the two-panel headline only. `Nunito Sans` at 400 and 600 for
  everything else.

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
tokens.json             → every token: grounds, logo blue + grey, accent, neutral ramp, ring hues · families, scales, tracking · space, radii, minimal shadows · the App Mode scale
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
