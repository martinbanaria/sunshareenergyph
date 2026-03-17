# SunShare C&I Onboarding — Customer Journey Map

**Version:** 1.0
**Date:** March 17, 2026

---

## Journey Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        C&I CUSTOMER ONBOARDING JOURNEY                         │
│                                                                                 │
│  AWARENESS    INTEREST     QUALIFICATION   ENGAGEMENT    CONVERSION   ONSITE   │
│  ─────────   ─────────    ──────────────  ───────────   ──────────   ──────── │
│  LinkedIn    Website      Onboarding      Pain Points   Savings      Energy   │
│  Events      C&I Page     Steps 1-3A      Step 3C       Estimate     Audit    │
│  Referral    ROI Calc     Facility Data   Solutions      Audit Req    PSA      │
│              (landing)    Step 3B         Matching       Scheduling   Signing  │
│                                                                                 │
│  ◄── Marketing ──►  ◄────── Product (This Spec) ──────►  ◄── Sales ──►       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Awareness (Pre-Onboarding)

**Touchpoints:** LinkedIn, industry events, warm network referrals, SEO

| Moment | Customer Thinking | SunShare Action | Channel |
|--------|------------------|-----------------|---------|
| Sees LinkedIn post about RCOA savings | "We're overpaying for electricity" | Publish weekly content on RCOA, efficiency | LinkedIn |
| Attends industry event | "Is switching suppliers actually worth it?" | Live Smappee dashboard demo, case studies | Events |
| Receives referral from partner network | "Our EPC mentioned SunShare" | Partner-led introduction | Warm network |
| Searches "lower electricity cost C&I Philippines" | "What are my options?" | SEO-optimized landing page | Google |

**Emotion:** Curious but skeptical
**Barrier:** "Switching sounds complicated and risky"
**Enabler:** Proof points (14% savings data, case studies)

---

## Phase 2: Interest (Landing → Onboarding Entry)

**Touchpoints:** Website C&I landing page, ROI calculator, "Get Started" CTA

| Moment | Customer Thinking | SunShare Action | Channel |
|--------|------------------|-----------------|---------|
| Lands on C&I page | "Show me what you actually offer" | Clear value prop: "We don't just sell electricity — we make it work harder" | Website |
| Uses ROI calculator | "How much would I actually save?" | Interactive calculator with real PEMC data | Website |
| Clicks "Get Started" / "Schedule Free Audit" | "Let me see if we qualify" | Routes to onboarding Step 1 | Website |

**Emotion:** Interested, wants validation
**Barrier:** "I need to know the numbers before I invest time"
**Enabler:** ROI calculator shows immediate, tangible savings range

---

## Phase 3: Qualification (Onboarding Steps 1–3A)

### Step 1: Authentication

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Sign up / Sign in | 30 sec | SSO (Google/Facebook) or email | Create account, session token |

**Emotion:** Neutral (low friction)
**Drop-off Risk:** Low (SSO is fast)

---

### Step 2: Welcome — Intent Selection

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Choose path | 10 sec | Selects "For My Facility (C&I)" | Routes to C&I qualification flow |

**Emotion:** Confident ("this is for businesses like mine")
**Drop-off Risk:** Low
**Design Note:** C&I card shows "Commercial & Industrial" subtitle and factory icon to clearly differentiate from SME "For Business" option

---

### Step 3A: C&I Qualification

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Enter company details | 60 sec | Company name, industry, spend, demand, provider | Auto-qualify contestability |

**Decision Tree:**

```
Peak Demand ≥ 500 kW?
├── YES → "You're eligible. Let's continue." (proceed)
├── 100-500 kW → "You'll be eligible from June 2026. Let's audit now." (proceed with note)
└── < 100 kW → "Check our SME solutions" (redirect to business flow)

"I don't know" → "No worries, the audit will determine this." (proceed)
```

**Emotion:** Validating ("are we big enough?")
**Drop-off Risk:** Medium — prospects unsure of their kW may hesitate
**Mitigation:** "I don't know" option with reassuring copy; energy audit as the answer

---

## Phase 4: Engagement (Steps 3B–3C)

### Step 3B: Facility Profile

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Describe facility | 90 sec | Address, type, area, hours, rooftop, multi-site | Store facility data, flag solar opportunity |

**Emotion:** Engaged ("they're asking the right questions")
**Drop-off Risk:** Low-Medium
**Design Note:** Non-required fields (floor area) reduce friction. "Not sure" for rooftop keeps users moving.

---

### Step 3C: Energy Pain Points

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Select pain points | 30 sec | Multi-select from 6 options | Map to bundle components, personalize estimate |

**Pain Point → Solution Mapping (shown to user):**

```
"High electricity costs"          →  Retail Supply (PSA) — switch and save 14%
"Power quality issues"            →  Harmonics & PF Correction — eliminate penalties
"No visibility into consumption"  →  Smappee Monitoring — see where every kWh goes
"Want to generate own power"      →  Embedded Solar — rooftop/carport PV
"Unreliable metering"             →  SparkMeter AMI — revenue-grade accuracy
"ESG / sustainability goals"      →  Verified RECs + carbon tracking
```

**Emotion:** Relieved ("they understand my problems")
**Drop-off Risk:** Low (multi-select is fast and engaging)
**Key Insight:** This is where the prospect first sees SunShare's differentiation — it's not just cheaper electricity, it's a full efficiency ecosystem

---

## Phase 5: Conversion (Steps 4–5)

### Step 4: Savings Estimate

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| View savings | 30 sec | Reviews estimated savings range | Animated display with breakdown by component |

**Display Logic:**

```
Monthly spend: ₱500K–₱1M

Base RCOA savings (14%):          ₱70K – ₱140K / month
+ PF Correction (if selected):   ₱25K – ₱50K / month
+ Monitoring savings (if sel.):   ₱15K – ₱30K / month
+ Solar offset (if sel.):         ₱40K – ₱80K / month
────────────────────────────────────────────────────────
Estimated total savings:          ₱150K – ₱300K / month
                                  ₱1.8M – ₱3.6M / year
```

**Emotion:** Excited ("this is real money")
**Drop-off Risk:** Very low (this is the "aha moment")
**Trust Signal:** "Based on PEMC 2024 data" + disclaimer about audit providing exact numbers

---

### Step 5: Review + Audit Request

| Moment | Duration | Customer Action | System Response |
|--------|----------|-----------------|-----------------|
| Review summary | 60 sec | Confirms details, adds contact info | Display full summary |
| Schedule audit | 30 sec | Clicks "Schedule Free Energy Audit" | Create audit request, send email confirmation |

**Post-Submission Flow:**

```
1. Confirmation screen: "Your energy audit request has been submitted"
2. Email to prospect: Summary + "what to expect" guide
3. Internal alert: Sales team notified with full prospect profile
4. CRM: Record created with segment, pain points, savings estimate
5. Follow-up: Energy advisor contacts within 24 hours
```

**Emotion:** Committed, expectant
**Drop-off Risk:** Very low (already invested 5 minutes, savings are tangible)

---

## Phase 6: Post-Onboarding (Sales-Led — Out of Product Scope)

| Day | Action | Owner |
|-----|--------|-------|
| Day 1 | Energy advisor calls prospect | Sales |
| Day 3-7 | On-site energy audit conducted | Engineering + Sales |
| Day 14 | Efficiency diagnosis + proposal presented | Sales |
| Day 21-30 | MOU/MOA signed | Sales + Legal |
| Day 30-45 | Smappee monitoring deployed (baseline) | Engineering |
| Day 60-90 | Full PSA executed, PF correction installed | Operations |
| Day 90+ | Solar deployment (if applicable) | EPC partner |

---

## Journey Emotion Map

```
Excitement
    │
    │                                              ★ Savings
    │                                             Estimate
    │                                            ╱
    │                                           ╱
    │              Qualification    Facility   ╱    Audit
    │  Welcome      ╱    OK       Profile   ╱    Request
    │    ╱         ╱              ╱         ╱        ╱
────┼───●────────●──────────────●─────────●────────●──────►
    │  Auth                                              Time
    │
    │
    │        ╲
    │         ╲ "Am I eligible?"
    │          (brief dip if unsure
    │           about kW demand)
Anxiety
```

---

## Key Design Principles

1. **Lead with savings, not technology** — The customer cares about ₱, not kW or THD
2. **"I don't know" is always valid** — Never dead-end a prospect who lacks technical data
3. **The audit is the product** — Onboarding's job is to get the audit scheduled, not to close a deal
4. **Show, don't tell** — Savings estimate with real numbers > marketing copy about "efficiency"
5. **Respect their time** — 5 minutes max. Every field must earn its place.
6. **Filipino business culture** — Relationship-first. Warm, consultative tone. Not corporate-formal.

---

## Conversion Funnel Targets (6-Month)

```
Website C&I Visitors:        2,000+ / month
    │
    ▼  (15% click-through)
Onboarding Started:           300 / month
    │
    ▼  (70% completion)
Onboarding Completed:         210 / month
    │
    ▼  (40% request audit)
Audit Requests:               84 / month
    │
    ▼  (50% qualify)
Qualified Prospects:          42 / month
    │
    ▼  (25% convert to MOU)
MOUs Signed:                  ~10 / month
    │
    ▼  (60% convert to PSA)
PSA Conversions:              ~6 / month
```
