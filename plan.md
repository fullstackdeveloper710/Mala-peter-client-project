# Responsive Scaling Plan

## Approach: JavaScript-driven CSS `zoom`

CSS `zoom` scales everything (text, images, spacing, borders) proportionally without needing to change any existing component code. This is the cleanest approach since the codebase uses fixed `px` values and inline styles throughout.

## Changes

### 1. Create `components/ResponsiveZoom.tsx` (new file)
A client component that:
- Calculates viewport width (accounting for current zoom to avoid feedback loop)
- Determines breakpoint: PC (≥1024px), Tablet (640-1023px), Smartphone (<640px)
- Sets `document.documentElement.style.zoom` to `viewport / base`:
  - PC: `width / 1440`
  - Tablet: `width / 768`
  - Smartphone: `width / 375`
- Listens to `resize` events
- Renders nothing (returns `null`)

### 2. Update `app/layout.tsx`
- Import and add `<ResponsiveZoom />` inside `<body>`

### 3. Update `app/globals.css`
- Add `body { overflow-x: hidden; }` to prevent horizontal scroll from zoom rounding

## Files touched
- `components/ResponsiveZoom.tsx` (new)
- `app/layout.tsx` (minor edit)
- `app/globals.css` (minor edit)

No changes needed to any page or component files.
