# PDF Generation for SunShare Philippines Website

This directory contains scripts to generate high-quality PDF versions of the SunShare Philippines website, preserving all visual elements including fonts, colors, animations, and design.

## Prerequisites

1. **Node.js and npm** - Already installed with your Next.js project
2. **Playwright** - Already installed in your project dependencies
3. **Running Next.js server** - The website must be running locally

## Quick Start

### Step 1: Start the Website

First, make sure your Next.js website is running:

```bash
# For development
npm run dev

# OR for production build
npm run build && npm run start
```

The website should be accessible at `http://localhost:3000`

### Step 2: Generate PDF

Choose one of the following options:

#### Option A: Individual Page PDFs + Combined PDF
```bash
npm run generate-pdf
```

This generates:
- Individual PDF for each page (home, about, solutions, how-it-works, contact)
- One combined comprehensive PDF with all pages
- Files saved to `pdf-output/` directory

#### Option B: Single Comprehensive PDF
```bash
npm run generate-pdf-comprehensive
```

This generates:
- One comprehensive PDF with all pages properly formatted
- Page breaks between sections
- Professional headers and footers
- Files saved to `pdf-output/` directory

## Output Files

After running the scripts, you'll find the generated PDFs in the `pdf-output/` directory:

```
pdf-output/
├── sunshare-complete-website.pdf          # Complete website (Option A)
├── sunshare-philippines-complete.pdf      # Complete website (Option B)
├── 01-home.pdf                           # Individual pages (Option A only)
├── 02-about.pdf
├── 03-solutions.pdf
├── 04-how-it-works.pdf
└── 05-contact.pdf
```

## Features Preserved

The PDF generation process preserves:

✅ **Visual Design**
- Custom fonts (Be Vietnam Pro, Libre Baskerville)
- Brand colors (#00242E, #004F64, #F3F6E4, #D1EB0C, #20B2AA)
- Glassmorphism effects and transparencies
- Custom typography scale
- Responsive layouts

✅ **Content Elements**
- All images and graphics
- Logo variations
- Icons from Lucide React
- Custom CSS styling
- Background colors and gradients

✅ **Professional Formatting**
- High-resolution output (2x device pixel ratio)
- A4 page format with proper margins
- Headers with website branding
- Footers with page numbers and URL
- Clean page breaks between sections

## Technical Details

### Scripts Overview

1. **`generate-pdf.js`**
   - Uses Playwright with Chromium
   - Captures each page individually
   - Creates both individual and combined PDFs
   - Better for reviewing individual pages

2. **`generate-comprehensive-pdf.js`**
   - Creates a unified multi-page document
   - Professional page breaks and formatting
   - Single comprehensive PDF output
   - Better for sharing complete website overview

### PDF Options

Both scripts use optimized settings:
- **Format**: A4 (210 × 297 mm)
- **Resolution**: High DPI (2x device pixel ratio)
- **Color**: Full color with exact color reproduction
- **Fonts**: Embedded custom fonts
- **Images**: High-quality image preservation
- **Margins**: Professional margins (20mm top/bottom, 15mm sides)

## Troubleshooting

### "Server is not running" Error

Make sure your Next.js server is running at `http://localhost:3000`:

```bash
# Check if server is running
curl http://localhost:3000

# Start development server
npm run dev

# OR start production server
npm run build && npm run start
```

### Font Loading Issues

If fonts appear incorrect in the PDF:

1. Ensure your local server is running properly
2. Check that font files exist in `/public` directory
3. Verify CSS font loading in your browser first
4. Try refreshing the page before PDF generation

### Large File Sizes

If PDF files are very large:

1. Check for large images that could be optimized
2. Consider using the comprehensive script for single PDF output
3. Reduce image quality in the website if needed

### Memory Issues

For large websites, you might need to:

1. Close other applications to free up memory
2. Use the individual page script instead of comprehensive
3. Generate PDFs one section at a time

## Customization

You can modify the PDF generation by editing the scripts:

- **Page margins**: Adjust `margin` object in PDF options
- **Output format**: Change `format` from 'A4' to other sizes
- **Header/Footer**: Modify `headerTemplate` and `footerTemplate`
- **Pages to include**: Edit the `pages` array in either script
- **Quality settings**: Adjust `deviceScaleFactor` and `scale` options

## Support

For issues or questions:

1. Check that all prerequisites are met
2. Verify your Next.js server is running properly
3. Review console output for specific error messages
4. Check the generated `pdf-output/` directory for partial results

The scripts include comprehensive error handling and will provide specific guidance if issues occur.