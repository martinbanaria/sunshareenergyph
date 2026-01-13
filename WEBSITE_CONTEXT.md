# SunShare Philippines Website — Implementation Context

**Document Version:** 1.0  
**Last Updated:** January 13, 2026  
**Owner:** Martin Banaria

---

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Objective** | Build a professional company website for SunShare Philippines Inc. to support government licensing requirements (DOE, ERC) |
| **Domain** | sunshareenergy.ph |
| **Repository** | sunshareenergyph (GitHub personal account) |
| **Hosting** | Vercel |
| **Framework** | Next.js 14 (App Router, TypeScript, Tailwind CSS 4) |
| **Design Source** | Investor deck presentation (sunshare-presentation.vercel.app) |
| **Content Source** | Webflow site (sunshare.webflow.io) |
| **Timeline** | ASAP (1-2 days) |
| **Primary Purpose** | Government licensing credibility |

---

## Business Context

SunShare Philippines Inc. is a next-generation energy company with three core business lines:

### 1. SunShare Gen (Generation Development)
- Pipeline of power generation projects
- 263 MWp rooftop solar pipeline
- Solar farm origination
- Ready-to-build project development

### 2. SunShare RES (Retail Electricity Supplier)
- Licensed retail sale of electricity to end customers
- Residential communities (e.g., Valle Verde 5)
- Commercial/Industrial clients (e.g., CDO)
- **3-Phase Customer Journey:**
  - Phase 1 — Save Now: RES aggregation (7-12% savings)
  - Phase 2 — Save More: Subscription solar (~30% savings)
  - Phase 3 — Never Worry: Solar+BESS (~82% savings)

### 3. SunShare Digital (Digital Infrastructure)
- Blockchain-powered platform (Powerledger)
- Energy tracking and trading
- REC issuance and verification
- Embedded services (financing, insurance, loyalty)

---

## Design System

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `sunshare-cream` | #F3F6E4 | Light text, backgrounds |
| `sunshare-gray` | #657376 | Secondary text |
| `sunshare-navy` | #004F64 | Headers, accents |
| `sunshare-deep` | #00242E | Primary background |
| `sunshare-lime` | #D1EB0C | Primary accent, CTAs |
| `radiant-teal` | #20B2AA | Secondary accent (RADIANT branding) |

### Typography

| Element | Font | Weight | Size (Desktop) |
|---------|------|--------|----------------|
| **h1** | Be Vietnam Pro | 600 | 3.75rem |
| **h2** | Be Vietnam Pro | 600 | 2.25rem |
| **h3** | Be Vietnam Pro | 600 | 1.5rem |
| **kicker** | Be Vietnam Pro | 500 | 0.75rem (uppercase, tracking) |
| **body** | Be Vietnam Pro | 400 | 1rem |
| **metric** | Be Vietnam Pro | 600 | 3rem |

### Component Styles

#### Card (Glassmorphism)
```css
.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
}

.card:hover {
  border-color: rgba(209, 235, 12, 0.25); /* lime accent */
}
```

#### Text Gradient
```css
.text-gradient {
  background: linear-gradient(135deg, #D1EB0C 0%, #F3F6E4 55%, #20B2AA 110%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Theme
- **Default:** Dark mode
- **Background:** sunshare-deep (#00242E)
- **Text:** White with opacity variants

---

## Site Structure

```
sunshareenergyph/
├── app/
│   ├── layout.tsx              # Root layout with fonts, nav, footer
│   ├── page.tsx                # Home (landing page with sections)
│   ├── about/
│   │   └── page.tsx            # About Us
│   ├── solutions/
│   │   └── page.tsx            # Services/Solutions
│   ├── how-it-works/
│   │   └── page.tsx            # How It Works
│   └── contact/
│       └── page.tsx            # Contact
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation with login dropdown
│   │   └── Footer.tsx          # Company info, links, social
│   ├── ui/
│   │   ├── Button.tsx          # Primary, secondary, ghost variants
│   │   ├── Card.tsx            # Glassmorphism card
│   │   └── Section.tsx         # Page section wrapper
│   └── sections/
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── HowItWorks.tsx
│       ├── Solutions.tsx
│       ├── WhyUs.tsx
│       ├── Testimonials.tsx
│       └── CTA.tsx
├── public/
│   ├── brand/
│   │   ├── fonts/              # Be Vietnam Pro, Libre Baskerville
│   │   └── logos/              # sunshare.svg, radiant.svg
│   └── images/                 # Free stock images
└── styles/
    └── globals.css             # Global styles, CSS variables
```

---

## Page Content Plan

### 1. Home Page (`/`)

| Section | Content |
|---------|---------|
| **Hero** | "Powering Filipinos with Smarter, Cheaper, and Cleaner Energy" |
| **About Preview** | Brief company intro + "Learn More" link |
| **How It Works** | 3-step process cards |
| **Solutions Preview** | 4 service cards |
| **Why SunShare** | Key differentiators with checkmarks |
| **Testimonials** | SunShare Team placeholder |
| **CTA** | "Ready to Watch Your Savings Grow?" |

### 2. About Us (`/about`)

- Company overview and story
- Mission: Transform how Filipinos experience energy
- Vision: Clean, affordable, reliable energy for all
- 3 Business Lines overview
- Regulatory compliance statement (DOE/ERC)
- Team placeholder (for future)

### 3. Solutions (`/solutions`)

| Solution | Description | Key Benefit |
|----------|-------------|-------------|
| **Lower Electricity Cost Today** | Switch to SunShare for immediate savings | 7-12% savings via aggregation |
| **Solar Made Simple** | Rooftop assessment, installers, bundles | Zero upfront cost options |
| **Battery Storage** | BESS for reliability and outage protection | Energy independence |
| **Smarter Energy Management** | Digital dashboard for monitoring | Track usage and savings |

### 4. How It Works (`/how-it-works`)

| Step | Title | Description |
|------|-------|-------------|
| 1 | Join Us to Assess Your Eligibility | Review energy demand, confirm ERC requirements |
| 2 | Organize and Facilitate Your Application | Handle details, hassle-free process |
| 3 | Enjoy Lower, Predictable Monthly Bills | Switch and start saving |

**Benefits:**
- Empower users to choose
- Boost competition
- Ensure fair switching and billing
- Protect consumer rights
- Embrace new energy technologies

### 5. Contact (`/contact`)

| Field | Value |
|-------|-------|
| **Address** | Suite 1504, Tektite East Tower, Exchange Road, Ortigas Center, Pasig City, Philippines 1605 |
| **Phone** | [Placeholder] |
| **Email** | [Placeholder] |
| **Form** | Name, Email, Phone, Message, Submit |
| **Social** | LinkedIn, Facebook, X (placeholders) |

---

## Navigation Structure

### Header

```
[SunShare Logo]    [Home] [About] [Solutions] [How It Works] [Contact]    [Login ▼] [Join Us]
                                                                             └─ Customer
                                                                             └─ RES
                                                                             └─ SunShare
```

### External Portal URLs

| Portal | URL |
|--------|-----|
| **Customer Login** | https://studio--sunshare-registration-portal.us-central1.hosted.app/customer/login |
| **RES Login** | https://studio--sunshare-registration-portal.us-central1.hosted.app/res/login |
| **SunShare Login** | https://studio--sunshare-registration-portal.us-central1.hosted.app/employee/login |
| **Join Us (Signup)** | https://studio--sunshare-registration-portal.us-central1.hosted.app/signup-member |

### Footer

```
[SunShare Logo]

Suite 1504, Tektite East Tower
Exchange Road, Ortigas Center
Pasig City, Philippines 1605

[Phone Placeholder] | [Email Placeholder]

[Home] [About] [Solutions] [How It Works] [Contact]

[LinkedIn] [Facebook] [X]

Privacy | Terms

Copyright © 2025 Sunshare Philippines Inc - All Rights Reserved.
```

---

## Technical Decisions

### Framework & Libraries

| Technology | Choice | Rationale |
|------------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR/SSG, SEO-friendly, modern patterns |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS 4 | Utility-first, rapid development |
| **Animations** | Framer Motion | Smooth transitions |
| **Icons** | Lucide React | Consistent, accessible icons |
| **Fonts** | Be Vietnam Pro, Libre Baskerville | Brand consistency |

### Deployment

| Service | Purpose |
|---------|---------|
| **GitHub** | Version control (sunshareenergyph repo) |
| **Vercel** | Hosting, CI/CD, preview deployments |
| **GoDaddy** | Domain registrar for sunshareenergy.ph |

---

## Confirmed Decisions

| Decision | Value |
|----------|-------|
| **Contact Details** | Use placeholders (to be updated later) |
| **Partner Logos** | Remove — not showing |
| **Images** | Download free stock images |
| **Legal Entity** | Copyright © 2025 Sunshare Philippines Inc - All Rights Reserved. |
| **Testimonials** | Use SunShare Team placeholder only |
| **Domain Registrar** | GoDaddy |
| **Repository Name** | sunshareenergyph |
| **GitHub Account** | Personal account |

---

## GoDaddy DNS Configuration

When connecting sunshareenergy.ph to Vercel, add these DNS records in GoDaddy:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

**Steps:**
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add `sunshareenergy.ph`
3. Vercel will show required DNS records
4. Go to GoDaddy → DNS Management
5. Add A record and CNAME record
6. Wait for propagation (5-30 minutes)
7. Vercel auto-provisions SSL certificate

---

## SEO Metadata

### Root Metadata

```typescript
export const metadata: Metadata = {
  title: {
    default: 'SunShare Philippines | Smarter, Cheaper, Cleaner Energy',
    template: '%s | SunShare Philippines'
  },
  description: 'SunShare Philippines helps Filipino communities and businesses access affordable, reliable, and sustainable clean energy through demand aggregation, rooftop solar, and battery storage solutions.',
  keywords: ['solar energy', 'Philippines', 'retail electricity supplier', 'clean energy', 'rooftop solar', 'energy savings'],
  authors: [{ name: 'SunShare Philippines Inc.' }],
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://sunshareenergy.ph',
    siteName: 'SunShare Philippines',
    title: 'SunShare Philippines | Smarter, Cheaper, Cleaner Energy',
    description: 'Powering Filipinos with smarter, cheaper, and cleaner energy.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SunShare Philippines',
    description: 'Powering Filipinos with smarter, cheaper, and cleaner energy.'
  }
}
```

### Per-Page Titles

| Page | Title |
|------|-------|
| Home | SunShare Philippines \| Smarter, Cheaper, Cleaner Energy |
| About | About Us \| SunShare Philippines |
| Solutions | Our Solutions \| SunShare Philippines |
| How It Works | How It Works \| SunShare Philippines |
| Contact | Contact Us \| SunShare Philippines |

---

## Content Reference (From Webflow)

### Hero Section
- **Headline:** "Powering Filipinos with Smarter, Cheaper, and Cleaner Energy"
- **Subheadline:** "Access affordable, reliable, and sustainable clean energy—by sharing the power of community for a brighter, greener tomorrow."

### About Section
"Across the Philippines, families, condos, offices, buildings, and small businesses all face the same challenge: electricity that keeps getting more expensive, less reliable, and harder to manage. SunShare is changing that by bringing communities and enterprises a smarter, cleaner, and more affordable way to power everyday life and operations.

We make the shift simple. SunShare helps you lower your electricity costs right away and guides you toward even bigger savings through rooftop solar and battery storage. From switching, to rooftop assessment, to choosing the right solar or battery plan with subscription or financing options, we support you at every step of the journey.

This is not just about cutting costs. It is about giving Filipinos more control, more reliability during outages, and more confidence in a cleaner future."

### 3-Step Process
1. **Join Us to Assess Your Eligibility** — We'll review your energy demand and confirm you meet ERC requirements.
2. **Organize and Facilitate Your Application** — We'll handle all the details and guide you through a smooth, hassle-free application process.
3. **Enjoy Lower, Predictable Monthly Bills** — Make the switch and start saving with better rates.

### 4 Solutions
1. **Lower Electricity Cost Today** — Start saving right away by switching to SunShare.
2. **Solar Made Simple** — Map your rooftop, match with installers, access solar bundles.
3. **Future-Ready with Battery Storage** — Add battery storage for reliability and outage protection.
4. **Smarter Energy Management** — Track usage, monitor savings, manage bundles in one dashboard.

### Why Choose SunShare
- Competitive rates through aggregated demand
- Verified and traceable clean power
- Real-time dashboards for monitoring
- Easy access to trusted installation and financing partners

### Testimonial (Placeholder)
"Every community has a story, and we cannot wait to be part of yours. SunShare is on a mission to empower Filipino families, SMEs, condos, and villages with energy that is cheaper, cleaner, and smarter. As we launch SunShare, we are excited to create real impact and build a brighter energy future together."
— **SunShare Team**, Proudly Co-Creating With Filipino Communities

### CTA Section
- **Headline:** "Ready to Watch Your Savings Grow?"
- **Subheadline:** "Join the renewable revolution. Invest in solar, reduce your energy spending, and help build a sustainable future."

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `WEBSITE_ROADMAP.md` | Epic and user story roadmap |
| `SUNSHARE_STRUCTURE.md` | Business model reference |
| `SUNSHARE_FINANCIAL_MODEL.md` | Financial framework |
| `SESSION_LOG.md` | Session history |
| `PROJECT_STATUS.md` | Project status dashboard |

---

*This document serves as the primary reference for implementing the SunShare Philippines website.*
