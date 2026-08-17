---
name: Kinetic Precision
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fd8b00'
  on-secondary-container: '#603100'
  tertiary: '#0a1526'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f2a3b'
  on-tertiary-container: '#8691a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  card-padding: 24px
---

## Brand & Style

The design system is engineered for the high-intensity, data-driven environment of automotive service management. It prioritizes **Technical Precision**, **Operational Clarity**, and **Institutional Trust**. 

The aesthetic is a hybrid of **Corporate Modern** and **Industrial Minimalism**. It utilizes a structured, grid-heavy layout that mirrors the organized nature of a high-end mechanical workshop. UI elements are purposeful and devoid of unnecessary decoration, ensuring that shop foremen and service advisors can process complex scheduling and diagnostic data without cognitive fatigue. The visual tone is "functional sophistication"—it feels like a professional tool that is as reliable as the vehicles it helps maintain.

## Colors

The palette is anchored by **Professional Navy**, providing a stable, authoritative foundation that evokes mechanical expertise. **Safety Orange** is used sparingly but decisively as a high-visibility accent for primary actions, critical alerts, and status indicators, mimicking the signage found in industrial workspaces.

- **Primary (Navy):** Used for navigation, headers, and primary branding elements.
- **Secondary (Orange):** Reserved for "Commit" actions, active states, and urgent notifications.
- **Backgrounds:** A tiered grayscale system uses Light Gray for the base canvas to reduce screen glare, with pure white reserved for elevated cards and data tables.
- **Typography:** Dark Gray provides high contrast against light backgrounds while appearing softer and more modern than pure black.

## Typography

This design system employs **Inter** for all UI and prose elements due to its exceptional legibility in data-dense interfaces. For technical specifications, VIN numbers, and timestamps, **JetBrains Mono** is introduced to provide a distinct "mechanical" feel that ensures characters remain distinguishable even at small sizes.

- **Headlines:** Set with tight tracking and bold weights to establish a clear information hierarchy.
- **Labels:** Small-caps mono fonts are used for metadata and table headers to differentiate system-generated labels from user-entered data.
- **Responsive Scaling:** On mobile devices, `display` and `headline-lg` styles should scale down by 20% to maintain readability without excessive wrapping.

## Layout & Spacing

The layout utilizes a **12-column fixed grid** for desktop environments, ensuring that complex dashboards remain aligned and scannable. A strict **8px spacing scale** governs all margins and padding, creating a rhythmic consistency that feels engineered.

- **Desktop:** 12 columns, 24px gutters, 32px outer margins.
- **Tablet:** 8 columns, 16px gutters, 24px outer margins.
- **Mobile:** 4 columns, 16px gutters, 16px outer margins.

The layout philosophy emphasizes horizontal density for data tables while providing generous vertical breathing room between distinct content modules (cards) to prevent the UI from feeling cluttered.

## Elevation & Depth

To maintain a clean, professional aesthetic, this design system uses **Tonal Layers** supplemented by **Ambient Shadows**.

1. **Level 0 (Surface):** The background (#F5F7F9) acts as the base canvas.
2. **Level 1 (Card):** White surfaces (#FFFFFF) with a subtle 1px border (#E2E8F0). A very soft, diffused shadow (Offset: 0, 4px; Blur: 12px; Opacity: 4%) is applied to denote interactable modules.
3. **Level 2 (Overlay/Modals):** These use a more pronounced shadow (Offset: 0, 8px; Blur: 24px; Opacity: 8%) to draw focus during critical tasks like "Add New Work Order."

Avoid heavy blurs or colorful glows. Depth should feel structural, not decorative.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the industrial aesthetic, making the professional environment feel modern and accessible.

- **Standard Elements:** Inputs, buttons, and small tags use a 4px (0.25rem) radius.
- **Containers:** Large cards and modals use 8px (0.5rem) to provide a softer frame for heavy data.
- **Progress Indicators:** Linear bars use a 2px radius to maintain a precise, technical appearance.

## Components

### Search & Global Inputs
Search bars are prominent, spanning the full width of the content area in headers. They feature a search icon prefix and a light gray background (#EDF2F7) that transitions to white with a Professional Navy border on focus.

### Buttons
- **Primary:** Solid Safety Orange with white text. High-contrast, used for "Complete Service" or "Generate Quote."
- **Secondary:** Outlined Professional Navy. Used for "Edit," "Print," or "Filter."
- **Ghost:** No background, Navy text. Used for low-priority actions like "Cancel."

### Status & Progress (Steppers)
Progress indicators use a vertical or horizontal stepper pattern. Completed steps are Navy; the current step is outlined in Orange; future steps are Light Gray. This provides an immediate visual "pulse" of a vehicle's journey through the shop.

### Cards
Cards are the primary container for vehicle details and work orders. They must include a clear header area with a `label-caps` category indicator and a primary title. Padding is consistent at 24px.

### Inputs & Selects
Inputs use a 1px border. Validation states are critical: Error states use a high-visibility Red (#E53E3E) with a subtle 2px glow on the border to ensure errors are caught immediately during data entry.