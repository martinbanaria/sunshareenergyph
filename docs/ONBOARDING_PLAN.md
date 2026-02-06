# Sunshare Onboarding Plan (B2C Customers)

> Living document for customer onboarding (B2C). Covers ID upload, multi-step wizard, backend stack, security, and roadmap. Mobile-first.

## 1) Goals & Scope
- Enable customers to sign up with basic details and **1 valid government ID** (mobile camera or upload)
- **Auto-approve basic account**; deeper verification only when a service request is raised
- **ID OCR extraction** to prefill name/address (Tesseract.js), with manual review fallback
- Anti-abuse protections (rate limiting, CAPTCHA, duplicate checks)
- Simple dashboard after signup; payments later phase

## 2) User Flow (Mobile-First)
**Step 1: Create Account**
- Full name, email, phone, password, CAPTCHA

**Step 2: ID Upload & OCR (New)**
- Capture via phone camera or upload file
- Accepts 1 valid government ID (PhilID, Driver’s License, Passport, SSS/UMID, Postal, PRC)
- OCR auto-fills name/address; user can edit
- Option: “Save & continue later” if ID not on hand (stores partial data)

**Step 3: Property Details**
- Property type (residential/commercial/industrial)
- Address (prefill from ID if possible): street, barangay, city, province, ZIP
- Ownership (owner/renter/manager)

**Step 4: Energy Preferences (Optional)**
- Interested services: Solar, Solar + BESS, Energy Monitoring
- Monthly bill range (optional), referral source (optional)

**Step 5: Review & Submit**
- Show summary, terms & privacy checkboxes, newsletter opt-in
- Submit → auto-approve basic account → redirect to dashboard

**Post-signup**
- Success screen → email welcome (Resend) → Dashboard (status: pending/basic)
- Full verification requested later when a service request is made

## 3) Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind 4, Framer Motion
- **Auth/DB/Storage**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Resend (welcome + notifications)
- **OCR**: Tesseract.js (client-side) for basic extraction; no third-party KYC for MVP
- **Validation**: React Hook Form + Zod
- **Security**: hCaptcha + rate limiting + duplicate checks

## 4) Data Model (Supabase)
### Table: customers
```
id UUID PK
auth_user_id UUID refs auth.users
email TEXT UNIQUE NOT NULL
full_name TEXT NOT NULL
phone TEXT NOT NULL
property_type TEXT NOT NULL ('residential','commercial','industrial')
property_ownership TEXT NOT NULL ('owner','renter','manager')
street_address TEXT NOT NULL
barangay TEXT
city TEXT NOT NULL
province TEXT NOT NULL
zip_code TEXT
interested_services TEXT[] -- e.g. ['solar','bess','monitoring']
monthly_bill_range TEXT
referral_source TEXT
newsletter_subscribed BOOLEAN DEFAULT false
onboarding_completed BOOLEAN DEFAULT false
status TEXT DEFAULT 'pending' ('pending','active','suspended','cancelled')
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
last_login_at TIMESTAMPTZ
```

### Table: onboarding_sessions (rate limit + resume)
```
id UUID PK
email TEXT NOT NULL
ip_address TEXT
user_agent TEXT
step_reached INT DEFAULT 1
completed BOOLEAN DEFAULT false
captcha_verified BOOLEAN DEFAULT false
created_at TIMESTAMPTZ DEFAULT now()
completed_at TIMESTAMPTZ
```

### Table: service_requests (future)
```
id UUID PK
customer_id UUID refs customers(id)
service_type TEXT NOT NULL -- 'solar','bess','assessment'
status TEXT DEFAULT 'pending'
request_details JSONB
assigned_to UUID
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
```

## 5) File Structure (proposed)
```
/src/app/api/
  auth/[...supabase]/route.ts          # Supabase auth callbacks (if needed)
  onboarding/
    create/route.ts                    # POST: finalize onboarding + create customer
    validate/route.ts                  # POST: per-step validation
    check-duplicate/route.ts           # POST: email/phone duplicate checks
  customers/
    me/route.ts                        # GET: current customer profile

/src/app/onboarding/
  page.tsx                             # Wizard container
  layout.tsx                           # Clean layout (minimal chrome)
  success/page.tsx                     # Success screen

/src/app/dashboard/
  page.tsx                             # Simple dashboard (status, next steps)
  profile/page.tsx                     # View/edit profile

/src/components/onboarding/
  OnboardingWizard.tsx
  StepIndicator.tsx
  steps/
    Step1Account.tsx
    Step2IDUpload.tsx                  # Camera/upload + OCR + review
    Step3Property.tsx
    Step4Preferences.tsx
    Step5Review.tsx
  FormField.tsx                        # Reusable field wrapper
  IDCapture.tsx                        # Camera/file input
  OCRResultReview.tsx                  # Show/edit extracted fields

/src/lib/
  supabase/{client.ts,server.ts}
  validations/{onboarding.ts,customer.ts}
  email/{resend.ts,templates/...}
  utils/{rate-limit.ts,philippines.ts}
  ocr/{tesseract.ts, parsers.ts}

/types/
  customer.ts
  onboarding.ts

/middleware.ts                         # Rate limiting + duplicate guard
```

## 6) Security & Anti-Abuse
- **hCaptcha** on Step 1 (account creation)
- **Rate limiting**: max 3 signups per email/hour; 5 per IP/hour (middleware + onboarding_sessions)
- **Duplicate checks**: email unique; phone warning; name+address flag
- **ID storage**: Supabase Storage, private bucket; signed URLs for access; encrypt at rest
- **PII handling**: Only store required fields; mask in logs; short-lived URLs
- **Email verification**: Supabase Auth email confirmation (block dashboard actions until verified)

## 7) ID Upload & OCR (MVP)
- **Capture**: HTML5 file input with `capture="environment"` for mobile cameras
- **Accepted IDs**: PhilID, Driver’s License, Passport, SSS/UMID, Postal, PRC
- **OCR**: Tesseract.js (client-side); extract name/address if possible
- **User review**: Show extracted fields, allow edits before submit
- **Fallback**: If OCR fails, allow manual entry; keep image for admin reference
- **Continue later**: Save progress (localStorage) if ID not available

## 8) Implementation Phases
**Phase 1 (Foundations)**
- Supabase setup (Auth, DB, Storage, RLS)
- Env vars, clients (client/server), types

**Phase 2 (Wizard UI)**
- Steps 1-5 with validation (React Hook Form + Zod)
- Step indicator, save/resume (localStorage)

**Phase 3 (ID Upload + OCR)**
- ID capture component (camera/upload)
- Tesseract.js integration + basic parsers
- Review/edit extracted data

**Phase 4 (APIs & Persistence)**
- /api/onboarding/validate, /create, /check-duplicate
- Rate limiting + duplicate checks
- Supabase inserts for customers & sessions

**Phase 5 (Email + Dashboard)**
- Resend welcome email
- Simple dashboard (status, profile view)
- Email verification gating

**Phase 6 (Testing & Polish)**
- Mobile QA, error states, loading
- OCR failure paths, retry, retake
- Accessibility and performance

## 9) Costs (expected)
- Supabase: free tier (DB+Auth+Storage) initially
- Resend: free tier (3k emails/mo)
- hCaptcha: free
- Tesseract.js: free
- Vercel: existing plan

## 10) Future Iterations
- Full KYC: integrate Jumio/Onfido if volume/fraud demands
- Liveness/selfie match when service is requested
- Admin review queue (flagged/low-confidence OCR)
- Service requests module + status tracking
- Payments/subscriptions later phase
- B2B supplier onboarding (parallel flow)

## 11) Open Items to Confirm
- Provide Terms & Privacy URLs for Step 5 checkboxes
- Any specific password policy beyond 8 chars, 1 upper, 1 number?
- Province/city lists: use dropdowns (I can include PH provinces/cities JSON)
- Newsletter list destination (store flag for now?)

---
**Status:** Draft saved. Ready to implement phases.
