---
name: SMS Guardian
description: Instant, transparent SMS & chat message spam classifier with signal intelligence
colors:
  primary: "#ff5c1a"
  primary-hover: "#e84a10"
  ink: "#121410"
  paper: "#f3efe4"
  card: "#fffdf6"
  muted: "#e8e2d4"
  muted-foreground: "#5f5d52"
  border: "#d9d2c1"
  accent: "#168a52"
  success: "#127a49"
  success-bg: "#e7f4ec"
  danger: "#cf2f1f"
  danger-bg: "#fbe9e4"
  warning: "#9a5b06"
  warning-bg: "#fbf1d9"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(44px, 8vw, 88px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(26px, 4vw, 38px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-console:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: SMS Guardian

## Overview

**Creative North Star: "The Tactical Signal Desk"**

SMS Guardian combines the tactile confidence of an industrial dispatch terminal with the warm, authoritative legibility of editorial broadsheets. The aesthetic rejects generic sterile corporate SaaS and dark-mode cyberpunk clichés. Instead, it positions message verification as a deliberate, reliable diagnostic tool — physical, grounded, and alert.

The interface lives in a daylight state on warm, unbleached parchment (`#f3efe4`), anchored by solid 2px ink borders and hard, un-blurred block drop shadows. Against this tactile paper background, high-contrast obsidian console panels (`#080a08`) host live scanning telemetry, laser sweeps, and luminous signal lights. The resulting atmosphere feels like operating an analog radar console in an intelligence reading room.

**Key Characteristics:**
- **Tactile Neo-Brutalism with Restraint:** Thick 2px structural ink strokes paired with crisp hard offset drop shadows (`4px` to `8px`), softened by organic corner radiuses (8px to 16px).
- **Paper & Phosphor Contrast:** Warm daytime editorial paper for reading and inputs, juxtaposed against deep void black for machine telemetry and dark-room radar sweeps.
- **Micro-Telemetry Typographic Hierarchy:** Compressed, personality-rich variable display type juxtaposed with ultra-legible utilitarian body copy and disciplined monospace telemetry stamps.

## Colors

The palette balances warm organic substrate tones with high-visibility emergency alert accents and deep obsidian ink.

### Primary
- **Signal Vermilion** (`#ff5c1a`): High-alert beacon color. Reserved strictly for primary action triggers, the scan line emitter, warning highlights, and the brand mark shield.
- **Signal Vermilion Hover** (`#e84a10`): Deepened burn for interactive hover states.

### Secondary
- **Terminal Ink** (`#121410`): Charred volcanic black used for structural 2px borders, dense header bars, hero surfaces, and hard offset drop shadows.

### Tertiary
- **Telemetry Emerald** (`#168a52`): Verification indicator color used for the live health monitor ping, clean verification badges, and secure status stamps.

### Neutral
- **Warm Editorial Parchment** (`#f3efe4`): The foundational canvas substrate. Prevents digital eye fatigue and provides an analog paper feel.
- **Card Chalk** (`#fffdf6`): Crisp, elevated container surface providing clean contrast against the parchment background.
- **Faded Graphite** (`#5f5d52`): Low-glare secondary text for metadata, character counts, and helper explanations.
- **Parchment Border** (`#d9d2c1`): Subtle structural dividing rule for non-critical internal splits.

### Status Tones
- **Danger Crimson** (`#cf2f1f`) / **Danger Wash** (`#fbe9e4`): Definite spam verdicts and active security warnings.
- **Success Forest** (`#127a49`) / **Success Wash** (`#e7f4ec`): Legitimate "clean/ham" messages.
- **Warning Ochre** (`#9a5b06`) / **Warning Wash** (`#fbf1d9`): Borderline confidence scores requiring manual scrutiny.

### Named Rules
**The High-Alert Restraint Rule.** Signal Vermilion (`#ff5c1a`) must never be used as a general background or decorative flood. It is reserved strictly for singular calls-to-action, scan sweeps, and alert badges. When everything shouts, nothing warns.

**The Paper-and-Phosphor Rule.** High-level content, explanation, and form input remain in the warm paper realm (`#f3efe4`). Real-time automated data streams (the live demo feed, splash boot loader) exist in dark phosphor chambers (`#080a08` / `#121410`).

## Typography

**Display Font:** Bricolage Grotesque (variable font via `next/font/google`, fallback `system-ui, sans-serif`)  
**Body Font:** IBM Plex Sans (variable font via `next/font/google`, fallback `system-ui, sans-serif`)  
**Label/Mono Font:** JetBrains Mono (variable font via `next/font/google`, fallback `ui-monospace, monospace`)

**Character:** Bricolage Grotesque delivers architectural punch with distinctive ink traps and condensed energy; IBM Plex Sans grounds the interface in objective clarity; JetBrains Mono lends clinical precision to all machine status and telemetry indicators.

### Hierarchy
- **Display** (Bold 700, `clamp(44px, 8vw, 88px)`, line-height `0.9`, tracking `-0.045em`): Hero questions and definitive section milestones.
- **Headline** (Semi-Bold 600, `clamp(26px, 4vw, 38px)`, line-height `1.0`, tracking `-0.03em`): Feature group headlines and prominent category titles.
- **Title** (Semi-Bold 600, `1.5rem` (24px), line-height `1.2`, tracking `-0.02em`): Console card titles and modal headers.
- **Body** (Regular 400, `0.9375rem` (15px), line-height `1.6`, tracking `0em`, max line length ~65ch): Explanations, disclaimer copy, and instructions.
- **Label** (Semi-Bold 600, `0.625rem` (10px), line-height `1.0`, tracking `0.18em`, uppercase): API endpoints, status indicators, index kickers (`01 / LINKS`), and metadata chips.

### Named Rules
**The Telemetry Stamp Rule.** All timestamps, endpoints, status states, character counts, and index markers must be formatted in uppercase `JetBrains Mono` with wide tracking (`0.14em`–`0.2em`).

## Layout

- **Container Model:** Centered container with a maximum width of `72rem` (`1152px`, `max-w-6xl`), padded with responsive horizontal insets (`px-5 sm:px-8`).
- **Spatial Rhythm:** Built on an 8px base grid (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Asymmetric Tension:** The primary scan interface utilizes an offset 2-column layout (`1.08fr` input form / `0.92fr` output card) on desktop viewports, stacking neatly on tablets and mobile devices.
- **Substrate Grid:** The paper canvas is textured with a subtle 22px dot matrix (`radial-gradient(rgba(18,20,16,0.09) 1px, transparent 1px)`), while dark panels host a faint 48px linear grid overlay.

## Elevation & Depth

SMS Guardian rejects ambient blurred drop shadows on paper surfaces in favor of hard-edged, ink-blocked physical offsets inspired by Swiss poster design and tactical equipment.

### Shadow Vocabulary
- **Hard Block Large** (`box-shadow: 8px 8px 0 0 #121410`): Applied to primary interactable form consoles.
- **Hard Block Medium** (`box-shadow: 5px 5px 0 0 #121410`): Applied to signal intelligence cards.
- **Hard Block Button** (`box-shadow: 4px 4px 0 0 #121410`): Interactive button elevation; expands to `6px 6px` on hover and collapses to `0 0` on active press.
- **Console Radar Glow** (`box-shadow: 0 40px 90px -45px rgba(0,0,0,0.9)`): Ambient dark-room blur reserved exclusively for elevated dark terminal consoles.

### Named Rules
**The Zero-Fuzz Elevation Rule.** No Gaussian blurred shadows may be used on light card surfaces. Elevation on paper is strictly communicated through solid `2px #121410` outlines and discrete coordinate translations (`translate(x, y)`).

## Shapes

- **Corner Radiuses:**
  - `sm` (`4px`): Micro badges, step markers, and status chips.
  - `md` (`8px`): Interactive buttons, sample pill selectors, and form textareas.
  - `lg` (`12px`): Main interactive cards, alert banners, and input containers.
  - `xl` (`16px`): Dark radar consoles and hero status panels.
  - `full` (`9999px`): Status dot indicators and round telemetry pills.
- **Strokes & Outlines:** Consistent `2px solid #121410` borders create unmistakable object boundaries across all interactive modules.

## Components

### Buttons
- **Shape:** Rounded rectangle (`rounded-lg`, `8px` radius).
- **Primary:** Background `Signal Vermilion` (`#ff5c1a`), text `Terminal Ink` (`#121410`), border `2px solid #121410`, shadow `4px 4px 0 0 #121410`, min-height `48px`.
- **Hover / Active:** Hover expands shadow to `6px 6px 0 0 #121410` and brightens vermilion; active press translates `2px 2px` and removes shadow.
- **Secondary / Clear:** Background `Card Chalk` (`#fffdf6`), text `Terminal Ink`, border `2px solid rgba(18,20,16,0.25)`.

### Scan Console
- **Structure:** Dark terminal chamber (`#080a08`) featuring a live glowing scan sweep beam (`rgba(255,92,26,0.55)`), simulated real-time incoming SMS feed, and categorical badge stamps (`SPAM` vs `CLEAN`).

### Result Card
- **Structure:** Dynamic state-driven feedback module (`border-2 rounded-xl p-5`).
- **Verdicts:**
  - *Spam:* `#fbe9e4` wash, `#cf2f1f` stroke, ShieldAlert icon, red meter bar.
  - *Safe:* `#e7f4ec` wash, `#127a49` stroke, ShieldCheck icon, emerald meter bar.
  - *Uncertain:* `#fbf1d9` wash, `#9a5b06` stroke, ShieldQuestion icon, ochre meter bar.
- **Telemetry:** Tabular large-scale percentage readout accompanied by an animated progress fill bar.

### Message Input
- **Structure:** Large `min-h-[150px]` textarea with warm tint (`bg-paper/60`), solid `2px` border, dynamic character counter (`{count} / 5,000`), and zero-persistence privacy notice.

### Signal Library Cards
- **Structure:** 3-column tactical grid with custom icon badges (`LinkIcon`, `ClockIcon`, `GiftIcon`), uppercase index markers (`01 / LINKS`), bold titles, and hard `5px 5px` block shadows.

## Do's and Don'ts

### Do:
- **Do** preserve 2px solid ink strokes around primary modules and cards.
- **Do** use uppercase monospace (`JetBrains Mono`) with wide tracking for telemetry and status labels.
- **Do** provide instant visual feedback on interactive button presses using coordinate translation and shadow collapse.
- **Do** respect user preferences for reduced motion by immediately showing resolved UI states.

### Don't:
- **Don't** use soft, fuzzy CSS box-shadows on daylight parchment cards.
- **Don't** flood large background areas with primary orange (`#ff5c1a`).
- **Don't** use decorative generic stock photography or illustrative cartoons; maintain the authentic signal intelligence instrument aesthetic.
- **Don't** omit confidence percentages or replace probabilistic machine verdicts with false claims of absolute certainty.

