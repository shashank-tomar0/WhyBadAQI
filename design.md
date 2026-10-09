# WhyBadAQI — Design System Specification (Design.md)

> **Design Archetype:** Brutalist Monospace Precision Instrument (Inspired by Nothing OS, Teenage Engineering, and Braun / Dieter Rams industrial design).
> **Aesthetic Philosophy:** Ultra-high clarity, zero-bloat, monochromatic data-density. Makes WhyBadAQI feel like a military-grade or scientific atmospheric sensor station rather than a generic consumer toy app.

---

## 1. Color Palette

| Token | Light Mode (Default) | Dark Mode | Usage |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Primary app canvas |
| `surface` | `#FAFAFA` | `#0A0A0A` | Card & tile backgrounds |
| `surfaceSubtle` | `#F3F4F6` | `#171717` | Hover / pressed / active states |
| `border` | `#E5E7EB` | `#262626` | Hairline grid borders (1px) |
| `borderStrong` | `#000000` | `#FFFFFF` | Focus rings, key outlines |
| `textPrimary` | `#000000` | `#FFFFFF` | Bold labels, hero numbers, titles |
| `textSecondary`| `#4B5563` | `#A3A3A3` | Body text, explanations |
| `textMuted` | `#9CA3AF` | `#737373` | Sub-labels, timestamps, out-of counters |

### Source Attribution Semantic Accents (Used sparingly on dots/bars)
* **Stubble Burning:** `#EA580C` (Rust Orange) or pure ASCII `[STUBBLE]`
* **Vehicular Exhaust:** `#2563EB` (Cobalt Blue) or pure ASCII `[TRAFFIC]`
* **Construction Dust:** `#D97706` (Amber Ochre) or pure ASCII `[DUST]`
* **Industrial Emissions:** `#9333EA` (Deep Violet) or pure ASCII `[INDUSTRY]`

---

## 2. Typography

* **Font Family:** Platform Monospace (`Courier New`, `Menlo`, `Monaco`, `monospace`, or digital dot-matrix).
* **Hero Display:**
  * Size: `72px` – `88px`
  * Weight: `900` / `800`
  * Letter-spacing: `-2px`
  * Tabular numbers: `fontVariant: ['tabular-nums']`
* **Section Headers:**
  * Uppercase, spaced: `fontSize: 11px`, `fontWeight: '700'`, `letterSpacing: 2px`
  * Example: `CURRENT LOCATION`, `SOURCE ATTRIBUTION`, `HOURLY PROJECTION`
* **Metric Readouts:**
  * Value: `fontSize: 16px` – `20px`, `fontWeight: '700'`
  * Label: `fontSize: 10px`, `fontWeight: '600'`, `letterSpacing: 1.2px`, `color: textMuted`

---

## 3. UI Components & Patterns

### A. Action Buttons (ASCII Bracket Style)
Buttons do not use rounded jelly pills. They use bracketed uppercase ASCII:
* `[+] ADD CITY`
* `[>] SWITCH TO HOURLY`
* `[ENABLE]`
* `[X]` (Close)
* `[SHARE TO WHATSAPP]`
* `[REPORT INCIDENT]`

### B. High-Density 2-Column Grid (Metric Tiles)
Grid tiles are separated by crisp 1px hairline borders without drop shadows:
```
+---------------------------+---------------------------+
| PRIMARY SOURCE            | WIND VECTOR               |
| STUBBLE BURNING 52%       | 14.5 KM/H  301° NW        |
+---------------------------+---------------------------+
| 6-HR TREND                | PERSONAL EXPOSURE         |
| RISING (+18%)             | 78 / 100 [HIGH RISK]      |
+---------------------------+---------------------------+
```

### C. Bar & Timeline Renderers
Progress ranges and bar meters use clean hairline bars:
* Inactive track: `#E5E7EB` (light) / `#262626` (dark), height `3px`
* Active fill: `#000000` (light) / `#FFFFFF` (dark) or source accent
* Range notation: `L:140 [======|    ] H:340`

### D. Digital Dot Matrix Header
* Dot indicator: `• NEW DELHI  6:11 PM`
* Large hero number: `312`
* Status readout: `SEVERE • STUBBLE SMOKE INFLOW`
* Min/Max bar: `L:185°  H:340°  FEELS HAZARDOUS`
