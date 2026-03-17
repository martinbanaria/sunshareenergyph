# SunShare C&I Onboarding — Product Specifications

**Version:** 1.0
**Date:** March 17, 2026
**Owner:** Martin Banaria
**Status:** Draft

---

## 1. Product Overview

### What We're Building

A **Commercial & Industrial (C&I) onboarding flow** integrated into the existing SunShare platform that qualifies C&I prospects, captures facility data, and converts them into energy audit requests — the primary sales conversion point for SunShare's Energy-as-a-Service (EaaS) offering.

### Why

The current onboarding only supports residential users (homeowners joining community solar). SunShare's C&I RES expansion targets businesses with 500 kW+ peak demand (100 kW from June 2026) with a bundled 5-component offering. The onboarding must qualify these prospects and route them to the sales team via energy audit requests.

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| C&I signup completion rate | 70%+ | Analytics (step drop-off) |
| Energy audit request conversion | 40%+ of completions | CRM tracking |
| Time to complete onboarding | < 5 minutes | Session duration |
| Mobile completion rate | 60%+ | Device analytics |
| Qualified lead accuracy | 80%+ meet contestability | Sales team validation |

---

## 2. User Segmentation

### C&I Customer Segments (Auto-Classified During Onboarding)

| Segment | Load Range | Key Pain Points | Priority |
|---------|-----------|-----------------|----------|
| Manufacturing & Industrial | 500 kW – 5 MW | Unmonitored motor loads, poor PF, no sub-metering | P0 |
| Hotels & Hospitality | 200 kW – 2 MW | Peak demand spikes, HVAC inefficiency | P0 |
| Retail & Malls | 1 – 10 MW | Shared metering, tenant billing disputes | P1 |
| Healthcare & Education | 100 kW – 1 MW | 24/7 critical loads, backup dependency | P1 |
| Cold Chain & Logistics | 300 kW – 3 MW | Compressor harmonics, 24/7 refrigeration | P2 |

### Decision-Maker Personas

| Persona | Role | Primary Concern | Message |
|---------|------|-----------------|---------|
| CFO / Finance Director | Budget approval | Cost reduction, ROI | "14% avg. savings, zero upfront" |
| Plant Engineer / Ops Manager | Technical validation | Power quality, reliability | "PF correction, harmonics filtering, monitoring" |
| Sustainability Officer | ESG compliance | Carbon tracking, RECs | "Verified clean energy + ESG reporting" |
| CEO / Owner | Strategic decision | Future-proof energy | "Phased roadmap: monitor → solar → storage" |

---

## 3. Onboarding Flow — Step-by-Step Specification

### Flow Architecture

```
Step 1: Auth (SSO / Email) ─── shared with residential
    │
Step 2: Welcome ─── "For My Home" | "For Business" | NEW: "For My Business (C&I)"
    │                                                          │
    │                                                          ▼
    │                                               Step 3A: C&I Qualification
    │                                                          │
    │                                                          ▼
    │                                               Step 3B: Facility Profile
    │                                                          │
    │                                                          ▼
    │                                               Step 3C: Energy Pain Points
    │                                                          │
    │                                                          ▼
    │                                               Step 4: Savings Estimate
    │                                                          │
    │                                                          ▼
    │                                               Step 5: Review + Audit Request
```

---

### Step 1: Authentication (Shared — No Changes)

**Component:** `Step1SSOSignup.tsx` (existing)
**Changes:** None. SSO-first auth (Google, Facebook, Apple) remains shared across all flows.

---

### Step 2: Welcome — Updated Branching

**Component:** `Step2Welcome.tsx` (modified)
**Changes:** Add a third option for C&I customers.

| Option | Label | Subtitle | Icon | Routes To |
|--------|-------|----------|------|-----------|
| Home | For My Home | Residential | House | Existing residential flow |
| Business | For My Business | SME / Small Business | Building | Existing business flow |
| **C&I** | **For My Facility** | **Commercial & Industrial** | **Factory** | **New C&I flow** |

**Behavior:**
- Selection stored as `intention: 'home' | 'business' | 'ci'`
- C&I option visually differentiated (subtle lime accent border) to signal premium offering
- Below the cards: "Not sure? [Take the 30-second quiz]" link for prospects who don't know their eligibility

---

### Step 3A: C&I Qualification

**Component:** `Step3CIQualification.tsx` (new)
**Purpose:** Determine if the prospect meets RCOA contestability requirements and auto-segment them.

| Field | Type | Options / Validation | Required |
|-------|------|---------------------|----------|
| Company / Organization Name | Text input | Min 2 chars | Yes |
| Industry Segment | Select dropdown | Manufacturing, Hotels & Hospitality, Retail & Malls, Healthcare, Education, Cold Chain & Logistics, Office / BPO, Other | Yes |
| Approximate Monthly Electricity Spend | Select dropdown | Below ₱200K, ₱200K–₱500K, ₱500K–₱1M, ₱1M–₱5M, Above ₱5M | Yes |
| Approximate Peak Demand (kW) | Select dropdown | Below 100 kW, 100–500 kW, 500 kW–1 MW, 1–5 MW, Above 5 MW, I don't know | Yes |
| Current Electricity Provider | Select dropdown | Meralco, Visayan Electric, Davao Light, CEPALCO, Other (text input) | Yes |

**Business Logic:**
- If peak demand < 500 kW AND segment ≠ "Below 100 kW": Show info banner — "Your facility may qualify starting June 2026 when the threshold drops to 100 kW. We can still do a free energy audit today."
- If peak demand < 100 kW: Show redirect — "For businesses under 100 kW, check out our [SME solutions]" → route to existing business flow
- If "I don't know" selected for peak demand: "No worries — our free energy audit will determine this. Let's continue."
- Auto-segment based on industry + spend into the 5 target categories for CRM tagging

---

### Step 3B: Facility Profile

**Component:** `Step3CIFacility.tsx` (new)
**Purpose:** Capture facility details needed for energy audit scoping.

| Field | Type | Options / Validation | Required |
|-------|------|---------------------|----------|
| Facility Name / Location | Text input | e.g. "Main Plant — Laguna" | Yes |
| Facility Address | Text input | Full address | Yes |
| City / Municipality | Text input with autocomplete | Philippine cities | Yes |
| Facility Type | Select | Owned, Leased, Managed | Yes |
| Approximate Floor Area (sqm) | Number input | Min 50 | No |
| Rooftop Available for Solar? | Radio | Yes / No / Not sure | Yes |
| Number of Operating Hours per Day | Select | 8 hrs, 12 hrs, 16 hrs, 24/7 | Yes |
| Multiple Facilities? | Radio | Yes / No | No |

**Conditional Logic:**
- If "Multiple Facilities" = Yes: Show note — "We'll start with your primary facility. You can add more from your dashboard after onboarding."
- If "Rooftop Available" = Yes: Flag for embedded solar opportunity in CRM

---

### Step 3C: Energy Pain Points

**Component:** `Step3CIPainPoints.tsx` (new)
**Purpose:** Identify which components of the 5-part bundle are most relevant. Drives personalized savings estimate and audit scope.

| Pain Point | Description | Maps To Component |
|------------|-------------|-------------------|
| High electricity costs | "Our electricity bill is too high relative to our output" | PSA (retail supply) |
| Power quality issues | "We experience voltage fluctuations, equipment damage, or reactive power penalties" | Harmonics & PF Correction |
| No visibility into consumption | "We don't know where our electricity is being wasted" | Smappee Monitoring |
| Want to generate own power | "We have rooftop space and want solar" | Embedded Solar |
| Unreliable metering / billing | "We suspect metering errors or want interval data" | SparkMeter AMI |
| ESG / sustainability goals | "We need verified clean energy for compliance or reporting" | RECs + Solar |

**UI:** Multi-select cards (same pattern as existing `Step4Preferences.tsx` toggle cards). User selects all that apply.

**Business Logic:**
- At least 1 must be selected to proceed
- Selections determine which bundle components are highlighted in the savings estimate
- Stored for CRM: sales team sees which pain points the prospect self-identified

---

### Step 4: Savings Estimate (Inline ROI Calculator)

**Component:** `Step4CISavingsEstimate.tsx` (new)
**Purpose:** Show an approximate savings range based on inputs from Steps 3A–3C. This is the "aha moment" that drives audit conversion.

**Calculation Logic:**

```
Base savings = Monthly spend × 0.14 (14% avg RCOA savings)

Adjustments:
+ If "Power quality issues" selected: +5% (PF correction savings)
+ If "No visibility" selected: +3% (monitoring-driven waste reduction)
+ If "Want solar" selected AND rooftop available: +8% (solar offset)

Total estimated monthly savings = Base + Adjustments
Annual savings = Monthly × 12
```

**Display:**

| Element | Content |
|---------|---------|
| Headline | "Your Estimated Savings" |
| Primary metric | "₱XX,XXX – ₱XX,XXX / month" (range: estimate ±20%) |
| Annual projection | "Up to ₱X.XM per year" |
| Breakdown cards | Show applicable components with individual savings contribution |
| Trust signal | "Based on PEMC 2024 data: contestable customers save an average of 14% vs. distribution utility rates" |
| Disclaimer | "This is an estimate. Your free energy audit will provide exact numbers based on your facility's actual consumption data." |

**Visual:** Large lime-colored savings number, animated count-up effect, glassmorphism breakdown cards below.

---

### Step 5: Review + Energy Audit Request

**Component:** `Step5CIReview.tsx` (new)
**Purpose:** Summarize everything and convert to energy audit request.

**Display Sections:**

1. **Company Summary** — Name, industry, provider, spend range
2. **Facility Summary** — Address, type, size, hours, rooftop
3. **Pain Points** — Selected issues with mapped solutions
4. **Savings Estimate** — Monthly/annual range
5. **What Happens Next** — 3-step process:
   - "A SunShare energy advisor will contact you within 24 hours"
   - "We'll schedule a free on-site energy audit at your convenience"
   - "You'll receive a detailed efficiency diagnosis and savings proposal"

**Actions:**

| Action | Type | Behavior |
|--------|------|----------|
| Schedule Energy Audit | Primary CTA (lime button) | Creates audit request in CRM, sends confirmation email, redirects to success page |
| Save & Continue Later | Secondary (ghost button) | Saves progress, user can return from dashboard |
| Add Another Facility | Tertiary link | Loops back to Step 3B (future: multi-facility support) |

**Form Fields (for audit scheduling):**

| Field | Type | Required |
|-------|------|----------|
| Preferred Contact Person | Text (pre-filled from auth) | Yes |
| Role / Title | Text | No |
| Phone Number | Tel input | Yes |
| Preferred Audit Date | Date picker (next 14 days) | No |
| Preferred Time | Select (Morning / Afternoon / Flexible) | No |
| Additional Notes | Textarea | No |

---

## 4. Data Model

### New Database Tables (Supabase)

#### `ci_prospects`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK → auth.users) | Linked user account |
| company_name | text | |
| industry_segment | text | Auto-segment category |
| monthly_spend_range | text | Dropdown selection |
| peak_demand_range | text | Dropdown selection |
| current_provider | text | DU name |
| contestability_status | text | 'eligible' / 'eligible_2026' / 'below_threshold' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `ci_facilities`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| prospect_id | uuid (FK → ci_prospects) | |
| facility_name | text | |
| address | text | |
| city | text | |
| facility_ownership | text | owned / leased / managed |
| floor_area_sqm | integer | Nullable |
| rooftop_available | text | yes / no / not_sure |
| operating_hours | text | 8h / 12h / 16h / 24-7 |
| has_multiple_facilities | boolean | |
| created_at | timestamptz | |

#### `ci_pain_points`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| prospect_id | uuid (FK → ci_prospects) | |
| pain_point_key | text | e.g. 'high_cost', 'power_quality', etc. |
| created_at | timestamptz | |

#### `ci_audit_requests`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| prospect_id | uuid (FK → ci_prospects) | |
| facility_id | uuid (FK → ci_facilities) | |
| contact_person | text | |
| contact_role | text | Nullable |
| phone_number | text | |
| preferred_date | date | Nullable |
| preferred_time | text | Nullable |
| notes | text | Nullable |
| estimated_monthly_savings_low | integer | Calculated estimate |
| estimated_monthly_savings_high | integer | Calculated estimate |
| status | text | 'pending' / 'contacted' / 'scheduled' / 'completed' / 'converted' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 5. Integration Points

| System | Integration | Priority |
|--------|-------------|----------|
| **Supabase Auth** | Shared SSO auth (existing) | P0 |
| **Supabase DB** | New ci_* tables | P0 |
| **Email (Resend)** | Audit request confirmation email to prospect + internal notification to sales | P0 |
| **CRM** | Prospect record with segment, pain points, savings estimate | P1 |
| **Analytics** | Step-by-step funnel tracking, drop-off analysis | P1 |
| **Smappee Dashboard** | Future: link to monitoring portal post-audit | P2 |
| **SparkMeter Koios** | Future: meter enrollment post-PSA signing | P2 |

---

## 6. Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **Performance** | Each step loads in < 2s on Philippine 4G (avg 20 Mbps) |
| **Mobile** | Fully responsive, thumb-friendly touch targets (min 44px) |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Browser Support** | Chrome, Safari, Firefox (latest 2 versions), Samsung Internet |
| **Data Persistence** | Auto-save on each step completion (user can resume later) |
| **Security** | All form data encrypted in transit (TLS), PII stored in Supabase with RLS |
| **Localization** | English (primary), Filipino (future P2) |

---

## 7. Out of Scope (v1)

- Multi-facility onboarding in a single flow (v2: add from dashboard)
- Direct Smappee/SparkMeter device provisioning
- Automated contestability verification via IEMOP
- PSA contract generation or e-signing
- Detailed load profile analysis (done in energy audit)
- Customer portal / dashboard for C&I (separate initiative)
- Filipino language localization
