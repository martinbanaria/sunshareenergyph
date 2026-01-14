# SunShare Website — Developer Image Update Handoff

**Document Version:** 1.0  
**Created:** January 14, 2026  
**Purpose:** Instructions for developer to replace images after marketing specialist downloads them  
**Prerequisites:** New images downloaded to `/public/images/sections/`

---

## Quick Reference: Image Mapping

| New Image Filename | Target Component | Line to Update |
|-------------------|------------------|----------------|
| `about-community.jpg` | `src/components/sections/About.tsx` | Line 58 |
| `how-it-works-consultation.jpg` | `src/components/sections/HowItWorks.tsx` | Line 48 |
| `how-it-works-eligibility.jpg` | `src/app/how-it-works/page.tsx` | Line 28 |
| `how-it-works-application.jpg` | `src/app/how-it-works/page.tsx` | Line 42 |
| `how-it-works-savings.jpg` | `src/app/how-it-works/page.tsx` | Line 56 |
| `solutions-cost-savings.jpg` | `src/components/sections/Solutions.tsx` | Line 13 |
| `solutions-dashboard.jpg` | `src/components/sections/Solutions.tsx` | Line 34 |
| `whyus-solar-rooftop.jpg` | `src/components/sections/WhyUs.tsx` | Line 60 |
| `testimonials-partnership.jpg` | `src/components/sections/Testimonials.tsx` | Line 28 |

---

## Detailed Update Instructions

### 1. About Section (Homepage)
**File:** `src/components/sections/About.tsx`

```tsx
// FIND (around line 58):
src="/images/sections/community.jpg"

// REPLACE WITH:
src="/images/sections/about-community.jpg"

// ALSO UPDATE alt text:
alt="Filipino neighborhood adopting clean energy solutions"
// TO:
alt="Filipino community members discussing clean energy adoption"
```

---

### 2. How It Works Section (Homepage)
**File:** `src/components/sections/HowItWorks.tsx`

```tsx
// FIND (around line 48):
src="/images/sections/step-application.jpg"

// REPLACE WITH:
src="/images/sections/how-it-works-consultation.jpg"

// ALSO UPDATE alt text:
alt="Energy consultation and application process"
// TO:
alt="SunShare energy consultant helping Filipino customer with assessment"
```

---

### 3. Why Us Section (Homepage)
**File:** `src/components/sections/WhyUs.tsx`

```tsx
// FIND (around line 60):
src="/images/sections/solar-rooftop-new.jpg"

// REPLACE WITH:
src="/images/sections/whyus-solar-rooftop.jpg"

// ALSO UPDATE alt text:
alt="Solar technician working on a Filipino rooftop"
// TO:
alt="Professional solar installation on a Filipino home rooftop"
```

---

### 4. Testimonials Section (Homepage)
**File:** `src/components/sections/Testimonials.tsx`

```tsx
// FIND (around line 28):
src="/images/sections/solar-installation.jpg"

// REPLACE WITH:
src="/images/sections/testimonials-partnership.jpg"

// ALSO UPDATE alt text:
alt="SunShare team installing solar panels for a community"
// TO:
alt="SunShare team partnering with Filipino community leaders"
```

---

### 5. Solutions Section - Card 1 (Homepage)
**File:** `src/components/sections/Solutions.tsx`

```tsx
// FIND (around line 13):
imageSrc: '/images/sections/cost-savings.jpg',
imageAlt: 'Saving money on electricity bills',

// REPLACE WITH:
imageSrc: '/images/sections/solutions-cost-savings.jpg',
imageAlt: 'Filipino homeowner celebrating lower electricity bills',
```

---

### 6. Solutions Section - Card 4 (Homepage)
**File:** `src/components/sections/Solutions.tsx`

```tsx
// FIND (around line 34):
imageSrc: '/images/sections/energy-dashboard-new.jpg',
imageAlt: 'Digital energy management dashboard',

// REPLACE WITH:
imageSrc: '/images/sections/solutions-dashboard.jpg',
imageAlt: 'Smart energy monitoring dashboard showing real-time savings',
```

---

### 7. How It Works Page - Step 1
**File:** `src/app/how-it-works/page.tsx`

```tsx
// FIND (around line 28):
image: '/images/sections/step-eligibility.jpg',
imageAlt: 'Energy consultant helping customer assess eligibility',

// REPLACE WITH:
image: '/images/sections/how-it-works-eligibility.jpg',
imageAlt: 'Filipino homeowner reviewing electricity bills for eligibility assessment',
```

---

### 8. How It Works Page - Step 2
**File:** `src/app/how-it-works/page.tsx`

```tsx
// FIND (around line 42):
image: '/images/sections/step-application.jpg',
imageAlt: 'Customer signing application documents',

// REPLACE WITH:
image: '/images/sections/how-it-works-application.jpg',
imageAlt: 'SunShare consultant guiding customer through application process',
```

---

### 9. How It Works Page - Step 3
**File:** `src/app/how-it-works/page.tsx`

```tsx
// FIND (around line 56):
image: '/images/sections/step-savings.jpg',
imageAlt: 'Happy family enjoying energy savings at home',

// REPLACE WITH:
image: '/images/sections/how-it-works-savings.jpg',
imageAlt: 'Happy Filipino family enjoying lower electricity bills at home',
```

---

## Post-Update Checklist

After making all changes:

- [ ] Run `npm run dev` to verify no broken images
- [ ] Check each page visually:
  - [ ] Homepage (all sections)
  - [ ] How It Works page
  - [ ] Solutions page
  - [ ] About page
- [ ] Verify images load on mobile viewport
- [ ] Check alt text appears correctly (inspect element)
- [ ] Run `npm run build` to ensure no build errors

---

## Cleanup: Remove Old Images

After verifying all new images work, delete these old files from `/public/images/sections/`:

```bash
# Files safe to delete after update:
rm public/images/sections/community-new.jpg
rm public/images/sections/energy-dashboard.jpg
rm public/images/sections/step-eligibility.jpg
rm public/images/sections/step-application.jpg
rm public/images/sections/step-savings.jpg
rm public/images/sections/cost-savings.jpg

# Keep these (still in use or as backup):
# - community.jpg (keep as fallback)
# - solar-installation.jpg
# - home-battery.jpg
# - solar-rooftop.jpg
# - solar-rooftop-new.jpg
```

---

## Git Commit Message Template

```
feat: replace stock images with Filipino-representative imagery

- Update About section with authentic Filipino community photo
- Replace How It Works images with Filipino-specific visuals
- Update Solutions cards with relevant energy imagery
- Improve Why Us and Testimonials sections
- Update all alt text for better accessibility and SEO

Images sourced from [Unsplash/Pexels/etc.] with proper licensing.
```

---

## Notes for Developer

1. **Image Optimization:** If images are over 500KB, run through TinyPNG or Squoosh before deploying
2. **Next.js Image Component:** Most images already use `OptimizedImage` component which handles lazy loading
3. **Aspect Ratios:** Verify new images match expected aspect ratios (16:9, 4:3, 3:2) or adjust component styles
4. **Mobile Testing:** Pay special attention to image cropping on mobile viewports

---

**Ready for developer execution after images are downloaded.**
