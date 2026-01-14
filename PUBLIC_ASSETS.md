# Public Assets Structure

Last Updated: January 14, 2026

## Directory Tree

```
public/
├── brand/
│   ├── fonts/
│   │   ├── BeVietnamPro-Bold.ttf
│   │   ├── BeVietnamPro-Medium.ttf
│   │   ├── BeVietnamPro-Regular.ttf
│   │   ├── BeVietnamPro-SemiBold.ttf
│   │   ├── LibreBaskerville-Italic.ttf
│   │   └── LibreBaskerville-Regular.ttf
│   └── logos/
│       ├── radiant-vertical.svg
│       ├── radiant.svg
│       ├── sunshare-interim.svg
│       ├── sunshare-pulsegrid-dark.png   <-- For dark backgrounds (light colored logo)
│       ├── sunshare-pulsegrid-light.png  <-- For light backgrounds (dark colored logo)
│       └── sunshare.svg
├── images/
│   └── sections/
│       ├── community-new.jpg        <-- Currently used in About, Testimonials, WhyUs
│       ├── cost-savings.jpg         <-- Currently used in Solutions
│       ├── energy-dashboard-new.jpg <-- Currently used in HowItWorks, Solutions
│       ├── home-battery.jpg         <-- Currently used in Solutions
│       ├── solar-installation.jpg   <-- Currently used in Solutions
│       ├── solar-rooftop-new.jpg    (Unused but available)
│       ├── community.jpg            (Old version)
│       ├── energy-dashboard.jpg     (Old version)
│       ├── solar-rooftop.jpg        (Old version)
│       ├── step-application.jpg     <-- How It Works page, Step 2
│       ├── step-eligibility.jpg     <-- How It Works page, Step 1
│       └── step-savings.jpg         <-- How It Works page, Step 3
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

## Image Usage Reference

### Section Images

| Image File | Used In | Description |
|------------|---------|-------------|
| `community-new.jpg` | About, Testimonials, WhyUs | Filipino community/people |
| `cost-savings.jpg` | Solutions | Cost/savings related |
| `energy-dashboard-new.jpg` | HowItWorks, Solutions | Energy monitoring dashboard |
| `home-battery.jpg` | Solutions | Home battery storage system |
| `solar-installation.jpg` | Solutions | Solar panel installation |
| `solar-rooftop-new.jpg` | (Available) | Solar panels on rooftop |
| `step-eligibility.jpg` | How It Works (Step 1) | Business consultation meeting |
| `step-application.jpg` | How It Works (Step 2) | Document signing |
| `step-savings.jpg` | How It Works (Step 3) | Happy family at home |

### Legacy Images (Old versions)

| Image File | Status |
|------------|--------|
| `community.jpg` | Replaced by `community-new.jpg` |
| `energy-dashboard.jpg` | Replaced by `energy-dashboard-new.jpg` |
| `solar-rooftop.jpg` | Replaced by `solar-rooftop-new.jpg` |

### Logo Files

| Logo File | Use Case |
|-----------|----------|
| `sunshare-pulsegrid-dark.png` | Header on dark backgrounds |
| `sunshare-pulsegrid-light.png` | Header on light backgrounds |
| `sunshare.svg` | General use |
| `sunshare-interim.svg` | Interim branding |
| `radiant.svg` | RADIANT platform branding |
| `radiant-vertical.svg` | RADIANT vertical layout |

### Fonts

| Font Family | Weights Available | Usage |
|-------------|-------------------|-------|
| Be Vietnam Pro | Regular, Medium, SemiBold, Bold | Body text, headings |
| Libre Baskerville | Regular, Italic | Accent text, quotes |
