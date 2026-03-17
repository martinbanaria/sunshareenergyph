# SunShare C&I Onboarding — Wireframes

**Version:** 1.0
**Date:** March 17, 2026
**Design System:** SunShare (dark theme, glassmorphism, lime accent)

---

## Screen 1: Welcome — Updated with C&I Option

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│           (step indicators)                   │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  Let's get you started.                 │  │
│  │  Choose the option that fits you best.  │  │
│  │                                         │  │
│  │  ┌───────────┐ ┌───────────┐            │  │
│  │  │           │ │           │            │  │
│  │  │    🏠     │ │    🏢     │            │  │
│  │  │           │ │           │            │  │
│  │  │  For My   │ │  For My   │            │  │
│  │  │   Home    │ │ Business  │            │  │
│  │  │           │ │           │            │  │
│  │  │Residential│ │   SME     │            │  │
│  │  └───────────┘ └───────────┘            │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │                                  │   │  │
│  │  │           🏭                     │   │  │
│  │  │                                  │   │  │
│  │  │     For My Facility              │   │  │
│  │  │     Commercial & Industrial      │   │  │
│  │  │                                  │   │  │
│  │  │  ┌────────────────────────────┐  │   │  │
│  │  │  │ 500 kW+ peak demand?      │  │   │  │
│  │  │  │ Get a free energy audit    │  │   │  │
│  │  │  └────────────────────────────┘  │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │             ▲ lime accent border        │  │
│  │                                         │  │
│  │  Not sure which? Take the 30-sec quiz → │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

**Notes:**
- C&I card spans full width below the 2-column home/business grid
- Subtle lime (#D1EB0C) border on C&I card to differentiate
- Sub-label "500 kW+ peak demand? Get a free energy audit" qualifies at a glance
- "Take the 30-sec quiz" link below for unsure visitors

---

## Screen 2: C&I Qualification (Step 3A)

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  Tell us about your organization.       │  │
│  │  We'll check your eligibility and       │  │
│  │  estimate your savings.                 │  │
│  │                                         │  │
│  │  Company / Organization Name            │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ e.g. ABC Manufacturing Corp.    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  Industry Segment                       │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ Manufacturing              ▼    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  Approximate Monthly Electricity Spend  │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ₱500K – ₱1M                ▼    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  Approximate Peak Demand (kW)           │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ 500 kW – 1 MW              ▼    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  Current Electricity Provider           │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ Meralco                     ▼    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │  │
│  │  │ ✓ You're eligible for RCOA     │    │  │
│  │  │   retail electricity supply.   │    │  │
│  │  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │  │
│  │        ▲ green success banner           │  │
│  │                                         │  │
│  │  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │   Back   │  │      Next        │     │  │
│  │  │  (ghost) │  │  (lime solid)    │     │  │
│  │  └──────────┘  └──────────────────┘     │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

**Conditional Banners:**

```
If 100–500 kW:
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│ ℹ  You'll be fully eligible from June 2026    │
│    when the threshold drops to 100 kW.         │
│    We can still do a free energy audit today.  │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

If "I don't know" for peak demand:
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│ ℹ  No worries — our free energy audit will     │
│    determine your exact demand. Let's continue.│
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

If < 100 kW:
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│ ⚠  For businesses under 100 kW, check out     │
│    our SME solutions. [Go to SME →]            │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

---

## Screen 3: Facility Profile (Step 3B)

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  Your Facility                          │  │
│  │  Help us scope your energy audit.       │  │
│  │                                         │  │
│  │  Facility Name / Location               │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ e.g. Main Plant — Laguna        │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  Facility Address                       │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │                                 │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  City / Municipality                    │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ Pasig City                  ▼    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────┐ ┌───────────────┐  │  │
│  │  │ Facility Type ▼ │ │ Floor Area    │  │  │
│  │  │ Owned           │ │ sqm (optional)│  │  │
│  │  └─────────────────┘ └───────────────┘  │  │
│  │                                         │  │
│  │  Rooftop available for solar?           │  │
│  │  ┌──────┐  ┌──────┐  ┌──────────┐      │  │
│  │  │ Yes  │  │  No  │  │ Not sure │      │  │
│  │  └──────┘  └──────┘  └──────────┘      │  │
│  │                                         │  │
│  │  Operating hours per day                │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │  │
│  │  │ 8 hr │ │12 hr │ │16 hr │ │ 24/7 │   │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘   │  │
│  │                                         │  │
│  │  Do you have multiple facilities?       │  │
│  │  ○ Yes   ○ No                           │  │
│  │                                         │  │
│  │  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │   Back   │  │      Next        │     │  │
│  │  └──────────┘  └──────────────────┘     │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

**Notes:**
- Rooftop and operating hours use pill-style selectors (same as existing toggle pattern)
- Floor area is optional to reduce friction
- "Multiple facilities?" shows inline note if Yes: "Start with your primary. Add more from your dashboard."

---

## Screen 4: Energy Pain Points (Step 3C)

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  What challenges do you face?           │  │
│  │  Select all that apply.                 │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ○  High electricity costs       │    │  │
│  │  │    Our bill is too high relative │    │  │
│  │  │    to our output                 │    │  │
│  │  │                     → PSA Supply │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ◉  Power quality issues    ✓    │    │  │
│  │  │    Voltage fluctuations,         │    │  │
│  │  │    equipment damage, PF penalty  │    │  │
│  │  │               → PF Correction    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │     ▲ selected state: lime border +     │  │
│  │       lime bg tint + filled radio       │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ○  No visibility into usage     │    │  │
│  │  │    Don't know where electricity  │    │  │
│  │  │    is being wasted               │    │  │
│  │  │              → Smappee Monitor   │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ○  Want to generate own power   │    │  │
│  │  │    Have rooftop space, want      │    │  │
│  │  │    solar PV                      │    │  │
│  │  │              → Embedded Solar    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ○  Unreliable metering          │    │  │
│  │  │    Suspect errors, want interval │    │  │
│  │  │    data                          │    │  │
│  │  │              → SparkMeter AMI    │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ ○  ESG / sustainability goals   │    │  │
│  │  │    Need verified clean energy    │    │  │
│  │  │    for compliance                │    │  │
│  │  │              → RECs + Solar      │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │   Back   │  │      Next        │     │  │
│  │  └──────────┘  └──────────────────┘     │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

**Notes:**
- Reuses the existing `Step4Preferences.tsx` toggle card pattern
- Solution tag (→ PSA Supply) shown in muted lime text, right-aligned
- Selected cards: lime border, lime-tinted background, filled radio indicator
- Must select at least 1 to enable Next button

---

## Screen 5: Savings Estimate (Step 4)

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  Your Estimated Savings                 │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │                                 │    │  │
│  │  │      ₱150,000 – ₱300,000       │    │  │
│  │  │         per month               │    │  │
│  │  │                                 │    │  │
│  │  │      Up to ₱3.6M per year      │    │  │
│  │  │                                 │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │     ▲ large lime text, animated         │  │
│  │       count-up on mount                 │  │
│  │                                         │  │
│  │  How you'll save:                       │  │
│  │                                         │  │
│  │  ┌────────────────┐ ┌────────────────┐  │  │
│  │  │ Retail Supply  │ │ PF Correction  │  │  │
│  │  │ (PSA)          │ │                │  │  │
│  │  │                │ │                │  │  │
│  │  │ ₱70K–₱140K/mo │ │ ₱25K–₱50K/mo  │  │  │
│  │  │                │ │                │  │  │
│  │  │ Switch from    │ │ Eliminate      │  │  │
│  │  │ Meralco to     │ │ reactive power │  │  │
│  │  │ competitive    │ │ penalties      │  │  │
│  │  │ supply         │ │                │  │  │
│  │  └────────────────┘ └────────────────┘  │  │
│  │                                         │  │
│  │  ┌────────────────┐ ┌────────────────┐  │  │
│  │  │ Energy         │ │ Embedded       │  │  │
│  │  │ Monitoring     │ │ Solar          │  │  │
│  │  │                │ │                │  │  │
│  │  │ ₱15K–₱30K/mo  │ │ ₱40K–₱80K/mo  │  │  │
│  │  │                │ │                │  │  │
│  │  │ Identify and   │ │ Generate your  │  │  │
│  │  │ eliminate      │ │ own clean      │  │  │
│  │  │ waste          │ │ power          │  │  │
│  │  └────────────────┘ └────────────────┘  │  │
│  │                                         │  │
│  │  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │  │
│  │  │ Based on PEMC 2024: contestable │    │  │
│  │  │ customers save 14% on average   │    │  │
│  │  │ vs. distribution utility rates. │    │  │
│  │  │                                 │    │  │
│  │  │ This is an estimate. Your free  │    │  │
│  │  │ energy audit will provide exact │    │  │
│  │  │ numbers for your facility.      │    │  │
│  │  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │  │
│  │     ▲ subtle info box                   │  │
│  │                                         │  │
│  │  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │   Back   │  │  Continue        │     │  │
│  │  └──────────┘  └──────────────────┘     │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

**Notes:**
- Primary savings number is large (2rem+), lime-colored, with animated count-up
- Only shows breakdown cards for pain points the user selected
- 2-column grid for breakdown cards (glassmorphism style)
- Trust signal + disclaimer in muted info box at bottom

---

## Screen 6: Review + Audit Request (Step 5)

```
┌──────────────────────────────────────────────┐
│              ● ● ● ● ●                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │  Review & Schedule Your Audit           │  │
│  │                                         │  │
│  │  ── Company ──────────────────────────  │  │
│  │  ABC Manufacturing Corp.                │  │
│  │  Manufacturing · Meralco · ₱500K–₱1M   │  │
│  │                                 [Edit]  │  │
│  │                                         │  │
│  │  ── Facility ─────────────────────────  │  │
│  │  Main Plant — Laguna                    │  │
│  │  Owned · 2,500 sqm · 24/7 operations   │  │
│  │  Rooftop: Available                     │  │
│  │                                 [Edit]  │  │
│  │                                         │  │
│  │  ── Challenges & Solutions ───────────  │  │
│  │  ✓ High costs → Retail Supply (PSA)     │  │
│  │  ✓ Power quality → PF Correction        │  │
│  │  ✓ No visibility → Smappee Monitoring   │  │
│  │  ✓ Want solar → Embedded Solar          │  │
│  │                                 [Edit]  │  │
│  │                                         │  │
│  │  ── Estimated Savings ────────────────  │  │
│  │  ₱150K – ₱300K / month                 │  │
│  │  ₱1.8M – ₱3.6M / year                  │  │
│  │                                         │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │                                         │  │
│  │  Schedule Your Free Energy Audit        │  │
│  │                                         │  │
│  │  Contact Person                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ Martin Banaria (pre-filled)     │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌─────────────────┐ ┌───────────────┐  │  │
│  │  │ Role (optional) │ │ Phone Number  │  │  │
│  │  │ CEO             │ │ +63 9XX XXX   │  │  │
│  │  └─────────────────┘ └───────────────┘  │  │
│  │                                         │  │
│  │  ┌─────────────────┐ ┌───────────────┐  │  │
│  │  │ Preferred Date  │ │ Preferred     │  │  │
│  │  │ (optional)      │ │ Time          │  │  │
│  │  │ 📅 Mar 24, 2026 │ │ Flexible   ▼  │  │  │
│  │  └─────────────────┘ └───────────────┘  │  │
│  │                                         │  │
│  │  Additional Notes (optional)            │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │                                 │    │  │
│  │  │                                 │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  What happens next:                     │  │
│  │  1. An energy advisor contacts you      │  │
│  │     within 24 hours                     │  │
│  │  2. We schedule a free on-site audit    │  │
│  │  3. You receive a detailed savings      │  │
│  │     proposal                            │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │  Schedule Free Energy Audit      │   │  │
│  │  │        (lime, full-width)        │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │                                         │  │
│  │  ┌──────────┐   Save & Continue Later   │  │
│  │  │   Back   │                           │  │
│  │  └──────────┘                           │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

---

## Screen 7: Success Confirmation

```
┌──────────────────────────────────────────────┐
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │              ✓                           │  │
│  │       (large lime checkmark)            │  │
│  │                                         │  │
│  │  Your Energy Audit is Requested         │  │
│  │                                         │  │
│  │  A SunShare energy advisor will         │  │
│  │  contact you within 24 hours to         │  │
│  │  schedule your free on-site audit.      │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │ Confirmation sent to:           │    │  │
│  │  │ martin@sunshare.ph              │    │  │
│  │  └─────────────────────────────────┘    │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │  Go to Dashboard                 │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │  Add Another Facility            │   │  │
│  │  │       (ghost button)             │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

---

## Mobile Responsive Notes

All screens follow the same responsive behavior:

```
Desktop (>768px):          Mobile (<768px):
┌────────────────────┐     ┌──────────────┐
│  2-col grid for    │     │  Full-width   │
│  breakdown cards   │     │  stacked      │
│  ┌──────┐┌──────┐  │     │  cards        │
│  │      ││      │  │     │  ┌──────────┐ │
│  └──────┘└──────┘  │     │  │          │ │
│  Max-width: 500px  │     │  └──────────┘ │
│  (centered)        │     │  ┌──────────┐ │
└────────────────────┘     │  │          │ │
                           │  └──────────┘ │
                           │  Full bleed   │
                           │  padding: 1rem│
                           └──────────────┘
```

- Touch targets: minimum 44px height
- Input fields: full-width on mobile
- Buttons: full-width stacked on mobile (CTA on top, Back below)
- Step indicators: smaller dots on mobile (8px vs 10px)
