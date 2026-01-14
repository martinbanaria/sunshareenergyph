# SunShare Website — Design Improvement Plan

**Document Version:** 1.0  
**Created:** January 14, 2026  
**Author:** Martin Banaria (via Claude Agent Architect)  
**Target Executor:** Senior Frontend Developer (20yr experience)  
**Priority:** HIGH — Execute Immediately

---

## Executive Summary

### The Problem
The current SunShare website suffers from **visual monotony**:
- All sections have dark backgrounds with transparent glassmorphism cards
- No visual breaks or rhythm — everything blends together
- Limited imagery makes the site feel cold and impersonal
- Hard to read and doesn't capture interest of target audience (homeowners, business owners)

### The Solution
Transform the website from a monotonous dark theme to a **rhythmic, engaging design** that:
1. **Alternates between dark and light (cream) sections** for visual contrast
2. **Adds compelling imagery** throughout every section
3. **Implements logo scroll-to-top behavior** for better UX
4. **Maintains brand identity** while feeling lighter, more approachable, and professional

### Design References
- **Primary Reference:** https://sunshare.webflow.io (same content, better visual rhythm)
- **Brand Reference:** SunShare-Philippines-Turning-Every-Roof-into-a-Bankable-Climate-Asset.pdf (investor deck)
- **Audience:** Filipino homeowners, business owners, community leaders

---

## Part 1: Section Contrast Strategy

### Current State (PROBLEM)
```
Hero        → Dark (sunshare-deep) + transparent card
About       → Dark + gradient + transparent card
HowItWorks  → Dark + transparent cards
Solutions   → Dark + gradient + transparent cards
WhyUs       → Dark + transparent card
Testimonials→ Dark + gradient + transparent card
CTA         → Dark + transparent card
Footer      → Dark
```
**Result:** Monotonous, hard to read, loses reader interest

### Target State (SOLUTION)
```
Hero        → Dark (sunshare-deep) + hero image + decorative SVGs
Partners    → Light (cream) [NEW SECTION]
About       → Light (cream) + solid cards + image on right
HowItWorks  → Light (cream) + image on left + solid step cards
Solutions   → Dark (teal accent) + image cards
WhyUs       → Light (cream) + image on right + checkmarks
Testimonials→ Light (cream) + image carousel
CTA         → Dark (lime accent gradient)
Footer      → Dark
```
**Result:** Visual rhythm, easy to read, captures interest

---

## Part 2: Color System Updates

### New CSS Variables (globals.css)

```css
:root {
  /* Existing colors (keep) */
  --sunshare-cream: #F3F6E4;
  --sunshare-gray: #657376;
  --sunshare-navy: #004F64;
  --sunshare-deep: #00242E;
  --sunshare-lime: #D1EB0C;
  --radiant-teal: #20B2AA;
  
  /* NEW: Light section semantics */
  --background-light: #F3F6E4;
  --text-on-light: #00242E;
  --text-muted-on-light: #657376;
  --border-on-light: rgba(0, 36, 46, 0.12);
  
  /* NEW: Card variants */
  --card-light-bg: rgba(255, 255, 255, 0.85);
  --card-light-border: rgba(0, 36, 46, 0.08);
  --card-dark-bg: rgba(255, 255, 255, 0.06);
  --card-dark-border: rgba(255, 255, 255, 0.15);
}
```

### New Section Classes

```css
/* Light sections */
.section-light {
  background: var(--background-light);
  color: var(--text-on-light);
}

.section-light .kicker {
  color: var(--sunshare-navy);
  opacity: 1;
}

.section-light .h2,
.section-light .h3 {
  color: var(--sunshare-deep);
}

.section-light .body-text,
.section-light .body-large {
  color: var(--text-muted-on-light);
}

/* Dark sections (default - keep existing) */
.section-dark {
  background: var(--sunshare-deep);
  color: var(--foreground);
}

/* Teal accent section (for Solutions) */
.section-accent-teal {
  background: linear-gradient(135deg, var(--sunshare-deep) 0%, #003d4f 50%, var(--sunshare-navy) 100%);
}
```

### Card Variants

```css
/* Light card (for light backgrounds) */
.card-light {
  background: var(--card-light-bg);
  border: 1px solid var(--card-light-border);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 36, 46, 0.06);
}

.card-light:hover {
  border-color: var(--sunshare-navy);
  box-shadow: 0 8px 30px rgba(0, 36, 46, 0.1);
}

/* Secondary card (cream with subtle border) */
.card-secondary {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--border-on-light);
  border-radius: 1rem;
}
```

---

## Part 3: Component Updates

### 3.1 Section.tsx — Add Theme Prop

```typescript
type SectionTheme = 'dark' | 'light' | 'accent-teal';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: SectionTheme;  // NEW
  spacing?: SectionSpacing;
}

const themeStyles: Record<SectionTheme, string> = {
  dark: 'bg-sunshare-deep text-white',
  light: 'section-light',
  'accent-teal': 'section-accent-teal text-white',
};
```

### 3.2 Card.tsx — Add Light Variant

```typescript
type CardTheme = 'dark' | 'light';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: CardTheme;  // NEW
  hover?: boolean;
}

// Use 'card' class for dark, 'card-light' for light
```

### 3.3 SectionHeader — Theme-Aware Text

```typescript
interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  theme?: 'dark' | 'light';  // NEW
}

// Conditionally apply text colors based on theme
```

### 3.4 Header.tsx — Logo Scroll-to-Top

```typescript
// Replace Logo Link behavior:
const handleLogoClick = (e: React.MouseEvent) => {
  if (pathname === '/') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Otherwise, Link navigates to '/'
};
```

---

## Part 4: Section-by-Section Redesign

### 4.1 Hero Section

**Current:** Dark background, text only, decorative blurs  
**Target:** Dark background with hero image + decorative SVG shapes

**Changes:**
- Add large hero image (solar panels on rooftop)
- Add decorative SVG shapes (like Webflow reference)
- Keep parallax effects on decorative elements
- Image on left, text on right (2-column layout)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│ [HERO IMAGE]              │  KICKER                │
│ + decorative SVG          │  HEADLINE              │
│ overlays                  │  SUBHEADLINE           │
│                           │  [CTA] [CTA]           │
└────────────────────────────────────────────────────┘
```

**Image Needed:** `hero-solar-panels.jpg` (large, high-quality solar panel installation)

---

### 4.2 Partners Section (NEW)

**Current:** Does not exist  
**Target:** Light (cream) background with partner logos

**Purpose:** Build trust, show industry credibility

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  SUBHEADING: "We work with leading industry..."   │
│  [LOGO] [LOGO] [LOGO] [LOGO]                      │
└────────────────────────────────────────────────────┘
```

**Theme:** Light  
**Note:** If no partner logos available, skip this section or use placeholder text

---

### 4.3 About Section

**Current:** Dark + gradient, stats card overlapping image  
**Target:** Light (cream) background, 2-column layout

**Changes:**
- Switch to light background
- Keep kicker/title/paragraph on left
- Image on right (Filipino community, rooftops, or neighborhood)
- Remove stats card (move to different section or keep minimal)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  KICKER                   │                        │
│  HEADLINE                 │  [IMAGE]               │
│  PARAGRAPH                │  community/rooftop     │
│  PARAGRAPH                │  3:2 aspect ratio      │
│  [Learn More Button]      │                        │
└────────────────────────────────────────────────────┘
```

**Theme:** Light  
**Image Needed:** `about-community.jpg` (Filipino neighborhood with solar panels)

---

### 4.4 How It Works Section

**Current:** Dark, 3 step cards in row, benefits bar at bottom  
**Target:** Light background, image on left, content + step cards on right

**Changes:**
- Switch to light background
- Add image on left side showing energy consultation or application process
- 3-column step cards with solid light backgrounds
- Bullet points with checkmarks for benefits

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  [IMAGE]                  │  KICKER                │
│  consultation/process     │  HEADLINE              │
│  3:2 aspect ratio         │  ✓ Benefit ✓ Benefit   │
│                           │  ✓ Benefit ✓ Benefit   │
│                           │  PARAGRAPH             │
├───────────────────────────┴────────────────────────┤
│  [STEP 1 CARD]  [STEP 2 CARD]  [STEP 3 CARD]      │
└────────────────────────────────────────────────────┘
```

**Theme:** Light  
**Cards:** Light variant  
**Image Needed:** `how-it-works.jpg` (energy consultant with customer or application process)

---

### 4.5 Solutions Section

**Current:** Dark + gradient, 4 service cards with icons only  
**Target:** Dark (teal accent), 4 cards WITH images

**Changes:**
- Keep dark background but add teal gradient accent
- Each solution card gets a 3:2 image at top
- Cards use dark glassmorphism but with images
- Add decorative SVG accent (like Webflow reference)

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  KICKER (inverse/lime)                             │
│  HEADLINE                                          │
│  SUBTITLE                                          │
├────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ [IMAGE]  │ │ [IMAGE]  │ │ [IMAGE]  │ │ [IMAGE]  ││
│ │ TITLE    │ │ TITLE    │ │ TITLE    │ │ TITLE    ││
│ │ DESC     │ │ DESC     │ │ DESC     │ │ DESC     ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
└────────────────────────────────────────────────────┘
```

**Theme:** Dark (accent-teal)  
**Cards:** Dark with images  
**Images Needed:**
- `solution-1-savings.jpg` (electricity bill or savings visualization)
- `solution-2-solar.jpg` (rooftop solar installation)
- `solution-3-battery.jpg` (battery storage system)
- `solution-4-dashboard.jpg` (energy monitoring dashboard)

---

### 4.6 Why Us Section

**Current:** Dark, card visual on left, content on right  
**Target:** Light background, content on left, image on right

**Changes:**
- Switch to light background
- Keep checkmark bullet points
- Add real image on right (solar technician, community meeting, or dashboard)
- Remove the card visual, use actual photograph

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  KICKER                   │                        │
│  HEADLINE                 │  [IMAGE]               │
│  PARAGRAPH                │  professional/         │
│  ✓ Feature 1              │  community photo       │
│  ✓ Feature 2              │  3:2 aspect ratio      │
│  ✓ Feature 3              │                        │
│  ✓ Feature 4              │                        │
└────────────────────────────────────────────────────┘
```

**Theme:** Light  
**Image Needed:** `why-us.jpg` (solar technician at work or community gathering)

---

### 4.7 Testimonials Section

**Current:** Dark + gradient, single testimonial card  
**Target:** Light background, 2-column with image

**Changes:**
- Switch to light background
- Add image on left (SunShare team or community photo)
- Testimonial content on right
- Prepare structure for future testimonial carousel

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  [IMAGE]                  │  KICKER                │
│  team photo or            │  "Quote text..."       │
│  community                │                        │
│  4:3 aspect ratio         │  AUTHOR                │
│                           │  ROLE                  │
└────────────────────────────────────────────────────┘
```

**Theme:** Light  
**Image Needed:** `testimonial.jpg` (SunShare team or Filipino community event)

---

### 4.8 CTA Section

**Current:** Dark, gradient background, card wrapper  
**Target:** Dark with lime accent, stronger gradient, decorative shapes

**Changes:**
- Keep dark background
- Add stronger lime gradient accent
- Add decorative SVG shapes (like Webflow reference)
- Remove card wrapper, let content breathe

**Layout:**
```
┌────────────────────────────────────────────────────┐
│  [DECORATIVE SVG]                                  │
│  KICKER                                            │
│  HEADLINE                                          │
│  SUBTITLE                                          │
│  [CTA BUTTON]  [SECONDARY]                         │
│  [DECORATIVE SVG]                                  │
└────────────────────────────────────────────────────┘
```

**Theme:** Dark (lime accent)

---

## Part 5: Image Requirements

### Required Images (Download from Unsplash/Pexels)

| Filename | Description | Search Terms | Size | Priority |
|----------|-------------|--------------|------|----------|
| `hero-solar-panels.jpg` | Large hero image, solar panels on rooftop | "solar panels rooftop philippines", "solar installation aerial" | 1920x1080 | HIGH |
| `about-community.jpg` | Filipino neighborhood/community | "philippines neighborhood", "asian community homes" | 1200x800 | HIGH |
| `how-it-works.jpg` | Energy consultation or process | "energy consultant", "solar consultation" | 1200x800 | HIGH |
| `solution-1-savings.jpg` | Savings/lower costs visualization | "electricity savings", "lower energy bills" | 600x400 | HIGH |
| `solution-2-solar.jpg` | Solar panel installation | "rooftop solar installation" | 600x400 | HIGH |
| `solution-3-battery.jpg` | Battery storage system | "home battery storage", "energy storage" | 600x400 | HIGH |
| `solution-4-dashboard.jpg` | Energy monitoring dashboard | "energy dashboard", "smart home energy" | 600x400 | HIGH |
| `why-us.jpg` | Solar technician or community | "solar technician", "energy community" | 1200x800 | MEDIUM |
| `testimonial.jpg` | Team or community event | "team meeting", "community gathering" | 800x600 | MEDIUM |

### Image Optimization Requirements
- Use Next.js `Image` component for all images
- Provide WebP format where possible
- Include `alt` text for accessibility
- Use `loading="lazy"` for below-fold images
- Hero image should use `priority` prop

---

## Part 6: Decorative Elements

### SVG Shapes (From Webflow Reference)
The Webflow reference uses decorative SVG shapes to add visual interest:
- Curved corner accents
- Dot patterns
- Abstract geometric shapes
- Gradient overlays

**Recommendation:** Create 2-3 simple SVG decorations:
1. Top-right corner curve (for Hero)
2. Bottom-left accent (for CTA)
3. Floating geometric shapes (optional)

---

## Part 7: Files to Modify

### High Priority (Core Changes)

| File | Changes |
|------|---------|
| `globals.css` | Add light section styles, card variants, new CSS variables |
| `Section.tsx` | Add `theme` prop for light/dark/accent-teal |
| `SectionHeader.tsx` | Add theme-aware text colors |
| `Card.tsx` | Add light variant |
| `Header.tsx` | Implement logo scroll-to-top behavior |

### Section Components

| File | Changes |
|------|---------|
| `Hero.tsx` | Add hero image, 2-column layout, decorative SVGs |
| `About.tsx` | Light theme, updated layout, new image |
| `HowItWorks.tsx` | Light theme, add image, light cards |
| `Solutions.tsx` | Accent-teal theme, add images to cards |
| `WhyUs.tsx` | Light theme, real image instead of card visual |
| `Testimonials.tsx` | Light theme, add image |
| `CTA.tsx` | Enhanced gradient, decorative elements |

### New Files (Optional)

| File | Purpose |
|------|---------|
| `Partners.tsx` | New partners/trust section |
| `decorations.tsx` | SVG decorative components |

---

## Part 8: Execution Checklist

### Phase 1: Foundation (30 min)
- [ ] Update `globals.css` with new variables and classes
- [ ] Update `Section.tsx` with theme prop
- [ ] Update `Card.tsx` with light variant
- [ ] Update `SectionHeader.tsx` with theme awareness

### Phase 2: Header Update (15 min)
- [ ] Implement logo scroll-to-top in `Header.tsx`
- [ ] Test on home page and inner pages

### Phase 3: Download Images (30 min)
- [ ] Download all required images from Unsplash/Pexels
- [ ] Optimize and save to `/public/images/sections/`
- [ ] Ensure proper naming convention

### Phase 4: Section Updates (2-3 hours)
- [ ] Update `Hero.tsx` — add image, 2-column layout
- [ ] Update `About.tsx` — light theme, new layout
- [ ] Update `HowItWorks.tsx` — light theme, add image
- [ ] Update `Solutions.tsx` — accent theme, image cards
- [ ] Update `WhyUs.tsx` — light theme, real image
- [ ] Update `Testimonials.tsx` — light theme, add image
- [ ] Update `CTA.tsx` — enhanced gradient

### Phase 5: Testing & QA (30 min)
- [ ] Test all sections on desktop
- [ ] Test all sections on mobile
- [ ] Verify color contrast accessibility
- [ ] Check image loading performance
- [ ] Verify animations still work

### Phase 6: Commit & Deploy
- [ ] Commit with descriptive message
- [ ] Push to main branch
- [ ] Verify Vercel deployment

---

## Part 9: Design Principles to Maintain

### Brand Consistency
- **Colors:** Only use brand palette (deep, cream, lime, teal, navy, gray)
- **Typography:** Be Vietnam Pro for all text, Libre Baskerville for quotes
- **Spacing:** Maintain existing responsive spacing scale

### Accessibility
- Light sections: Ensure WCAG 2.1 AA contrast (4.5:1 minimum)
- Dark sections: Maintain existing contrast ratios
- All images must have descriptive alt text

### Performance
- Lazy load below-fold images
- Use Next.js Image component
- Optimize image file sizes
- Keep animations smooth (use `will-change` sparingly)

### Mobile-First
- All layouts must be responsive
- Images should scale appropriately
- Touch targets remain 44px minimum

---

## Summary

This plan transforms the SunShare website from a monotonous dark design to an engaging, visually rhythmic experience that:

1. **Creates visual breaks** with alternating light/dark sections
2. **Adds compelling imagery** that connects with Filipino homeowners and business owners
3. **Improves readability** with proper contrast on light backgrounds
4. **Maintains brand identity** while feeling more approachable and professional
5. **Implements better UX** with logo scroll-to-top behavior

The target audience (homeowners, business owners, community leaders) will find the site:
- **Lighter** — not oppressive or hard to read
- **Tech-forward** — modern animations and imagery
- **Professional** — clean design with clear information hierarchy
- **Trustworthy** — real images and clear value propositions

---

**Ready for execution by Senior Frontend Developer.**

*Document created by Agent Architect based on Webflow reference analysis and brand guidelines.*
