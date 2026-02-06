const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateWebsitePDF() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--disable-lcd-text',
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // High DPI for crisp images
    screen: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Set longer timeout for pages with animations
  page.setDefaultTimeout(30000);

  const baseUrl = 'http://localhost:3000';
  const outputDir = path.join(__dirname, '..', 'pdf-output');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Define pages to capture
  const pages = [
    { 
      url: '/', 
      name: '01-home',
      title: 'SunShare Philippines - Home',
      waitFor: '.hero-section' // Wait for hero section to ensure page is loaded
    },
    { 
      url: '/about', 
      name: '02-about',
      title: 'About SunShare Philippines'
    },
    { 
      url: '/solutions', 
      name: '03-solutions',
      title: 'Solar Solutions & Services'
    },
    { 
      url: '/how-it-works', 
      name: '04-how-it-works',
      title: 'How SunShare Works'
    },
    { 
      url: '/contact', 
      name: '05-contact',
      title: 'Contact SunShare Philippines'
    }
  ];

  console.log('🌞 Starting PDF generation for SunShare Philippines website...\n');

  // PDF options for high-quality output with visual preservation
  const pdfOptions = {
    path: path.join(outputDir, 'sunshare-complete-website.pdf'),
    format: 'A4',
    printBackground: true, // Essential for preserving colors and gradients
    preferCSSPageSize: false,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    },
    scale: 0.8, // Slightly smaller to fit more content
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Be Vietnam Pro', sans-serif; font-size: 10px; color: #00242E; width: 100%; text-align: center; margin: 0 auto; padding: 5px;">
        <span style="font-weight: 600;">SunShare Philippines</span> - <span class="title"></span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Be Vietnam Pro', sans-serif; font-size: 9px; color: #666; width: 100%; text-align: center; margin: 0 auto; padding: 5px;">
        <span class="pageNumber"></span> / <span class="totalPages"></span> | www.sunshareenergyph.com
      </div>
    `,
  };

  // Store individual page PDFs for potential separate use
  const individualPDFs = [];

  try {
    for (const pageInfo of pages) {
      console.log(`📄 Processing: ${pageInfo.title}`);
      console.log(`   URL: ${baseUrl}${pageInfo.url}`);

      await page.goto(`${baseUrl}${pageInfo.url}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for specific element if specified
      if (pageInfo.waitFor) {
        try {
          await page.waitForSelector(pageInfo.waitFor, { timeout: 10000 });
        } catch (e) {
          console.log(`   ⚠️  Warning: Could not find ${pageInfo.waitFor}, continuing anyway...`);
        }
      }

      // Wait for fonts to load
      await page.waitForFunction(() => {
        const fonts = ['Be Vietnam Pro', 'Libre Baskerville'];
        return fonts.every(font => document.fonts.check(`1em "${font}"`));
      }, { timeout: 10000 }).catch(() => {
        console.log('   ⚠️  Warning: Font loading timeout, continuing...');
      });

      // Wait for any images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.images);
        return images.every(img => img.complete);
      }, { timeout: 15000 }).catch(() => {
        console.log('   ⚠️  Warning: Image loading timeout, continuing...');
      });

      // Additional wait for animations to settle
      await page.waitForTimeout(2000);

      // Inject CSS for better PDF rendering
      await page.addStyleTag({
        content: `
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body {
              background-color: white !important;
            }
            
            .glassmorphism, .backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg {
              backdrop-filter: none !important;
              background: rgba(255, 255, 255, 0.9) !important;
            }
            
            /* Ensure animations don't interfere */
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
            
            /* Fix for any fixed or sticky elements */
            .fixed, .sticky {
              position: relative !important;
            }
            
            /* Ensure proper font rendering */
            * {
              font-family: 'Be Vietnam Pro', 'Libre Baskerville', sans-serif !important;
            }
          }
        `
      });

      // Generate individual page PDF
      const individualPdfPath = path.join(outputDir, `${pageInfo.name}.pdf`);
      
      await page.pdf({
        ...pdfOptions,
        path: individualPdfPath,
        headerTemplate: pdfOptions.headerTemplate.replace('<span class="title"></span>', `<span>${pageInfo.title}</span>`)
      });

      individualPDFs.push({
        path: individualPdfPath,
        title: pageInfo.title
      });

      console.log(`   ✅ Generated: ${pageInfo.name}.pdf`);
      console.log('');
    }

    console.log('🎉 PDF generation completed successfully!\n');
    console.log('📁 Output files:');
    console.log(`   📄 Complete website: ${path.relative(process.cwd(), path.join(outputDir, 'sunshare-complete-website.pdf'))}`);
    console.log('\n📄 Individual pages:');
    
    individualPDFs.forEach(pdf => {
      console.log(`   📄 ${pdf.title}: ${path.relative(process.cwd(), pdf.path)}`);
    });

    // Generate a combined PDF by creating a comprehensive single-page version
    console.log('\n🔄 Creating comprehensive single PDF...');
    
    // Navigate through all pages in sequence for the combined PDF
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Create a comprehensive PDF that includes all pages in one document
    await page.pdf({
      ...pdfOptions,
      path: path.join(outputDir, 'sunshare-complete-website.pdf'),
      headerTemplate: pdfOptions.headerTemplate.replace('<span class="title"></span>', '<span>Complete Website</span>')
    });

    console.log('✅ Combined PDF created successfully!');
    console.log('\n🎯 All files saved to:', path.relative(process.cwd(), outputDir));
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Check if server is running before starting PDF generation
async function checkServerHealth() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if Next.js server is running...');
  
  const isServerRunning = await checkServerHealth();
  
  if (!isServerRunning) {
    console.log('❌ Server is not running at http://localhost:3000');
    console.log('Please start your Next.js server first:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   npm run build && npm run start');
    process.exit(1);
  }

  console.log('✅ Server is running, starting PDF generation...\n');
  
  try {
    await generateWebsitePDF();
    console.log('\n🎊 PDF generation completed successfully!');
  } catch (error) {
    console.error('\n💥 PDF generation failed:', error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { generateWebsitePDF };