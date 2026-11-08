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
- Only each page's **main headline** carries a key phrase, set **upright in heavy
  logo blue**: "Your business connections should **stay with your business.**"
  Every other heading is one colour.
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

**Data.** The proof device is an **oversized blue figure** with a short caption
and an optional superscript unit (`/mo`).

**The ring.** The logo's concentric mark, small (`.cl-ring`), leads list rows
and "live" markers (never a label above a heading). It replaces dashes, dots and plus signs.

**Motion.** Restrained. Ease-out fades and short slides (`--ease-out`,
~260ms), no bounce. Hover = slight darken (`brightness(0.92)`); press = `scale(0.985)`.

---

## Iconography

No icon set. The **logo ring** (`.cl-ring`) is the only brand glyph: it leads
labels, list rows and live markers. Check marks may show included features.

Other companies are shown by **initials only** (no logos or photos): a dark chip
with 8px corners, or an oversized monogram (ink, accent or steel).

**If you need UI icons**, use a rounded stroke set such as **Lucide** at 2px, in ink
or muted; blue only when it carries brand meaning.

---

## Fonts

From Google Fonts (loaded by `components/bundle.css`):

- **Everything:** `Nunito Sans`: 800 for headlines and figures, 400–700 for
  text, labels and buttons. (Rounded Nunito was tried for headlines and dropped:
  it read too soft at display sizes for a B2B audience.)

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
