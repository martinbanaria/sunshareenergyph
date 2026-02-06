const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateVisuallyAccuratePDF() {
  console.log('🎨 Starting visually accurate PDF generation for SunShare Philippines...\n');
  
  let browser;
  let page;
  
  try {
    browser = await chromium.launch({
      headless: true,
      timeout: 120000,
      args: [
        '--no-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--font-render-hinting=none',
        '--enable-font-antialiasing',
        '--force-color-profile=srgb'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2, // High DPI for crisp output
      colorScheme: 'light' // Ensure consistent rendering
    });

    page = await context.newPage();
    page.setDefaultTimeout(60000); // Longer timeout for complex pages

    const baseUrl = 'http://localhost:3000';
    const outputDir = path.join(__dirname, '..', 'pdf-output-enhanced');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pages = [
      { 
        url: '/', 
        name: 'Home', 
        title: 'SunShare Philippines - Home',
        description: 'Complete homepage with hero, about, solutions sections',
        waitElements: ['.hero-section', 'h1', 'img[alt*="SunShare"]']
      },
      { 
        url: '/about', 
        name: 'About', 
        title: 'About SunShare Philippines',
        description: 'Company information and mission',
        waitElements: ['h1', 'main']
      },
      { 
        url: '/solutions', 
        name: 'Solutions', 
        title: 'Solar Solutions & Services',
        description: 'Solar solutions and energy services',
        waitElements: ['h1', 'main']
      },
      { 
        url: '/how-it-works', 
        name: 'How-It-Works', 
        title: 'How SunShare Works',
        description: 'Process explanation and steps',
        waitElements: ['h1', 'main']
      },
      { 
        url: '/contact', 
        name: 'Contact', 
        title: 'Contact SunShare Philippines',
        description: 'Contact information and forms',
        waitElements: ['h1', 'main']
      }
    ];

    // Enhanced PDF options for visual preservation
    const pdfOptions = {
      format: 'A4',
      printBackground: true, // Critical for colors and backgrounds
      preferCSSPageSize: false,
      margin: { top: '0.75in', right: '0.6in', bottom: '0.75in', left: '0.6in' },
      scale: 0.75, // Optimized for A4 format
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
          font-family: 'Be Vietnam Pro', Arial, sans-serif; 
          font-size: 11px; 
          color: #00242E; 
          font-weight: 600;
          width: 100%; 
          text-align: center; 
          margin: 0; 
          padding: 8px 0;
          background: linear-gradient(135deg, #F3F6E4 0%, #ffffff 100%);
          border-bottom: 2px solid #D1EB0C;
        ">
          SunShare Philippines • Solar Energy Solutions
        </div>
      `,
      footerTemplate: `
        <div style="
          font-family: 'Be Vietnam Pro', Arial, sans-serif; 
          font-size: 10px; 
          color: #657376; 
          width: 100%; 
          text-align: center; 
          margin: 0; 
          padding: 8px 0;
          background: #F3F6E4;
          border-top: 1px solid #D1EB0C;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 40px;
          padding-right: 40px;
        ">
          <span>www.sunshareenergyph.com</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          <span>Generated ${new Date().toLocaleDateString()}</span>
        </div>
      `
    };

    // Process each page with enhanced visual preservation
    for (let i = 0; i < pages.length; i++) {
      const pageInfo = pages[i];
      console.log(`📄 Processing ${i + 1}/${pages.length}: ${pageInfo.name}`);
      console.log(`   URL: ${baseUrl}${pageInfo.url}`);
      console.log(`   Description: ${pageInfo.description}`);

      try {
        // Navigate with extended timeout for heavy pages
        await page.goto(`${baseUrl}${pageInfo.url}`, { 
          waitUntil: 'networkidle',
          timeout: 45000 
        });

        // Enhanced font loading verification
        console.log('   ⏳ Ensuring custom fonts are loaded...');
        const fontPromise = page.waitForFunction(() => {
          const testFonts = ['Be Vietnam Pro', 'Libre Baskerville'];
          return testFonts.every(font => {
            try {
              return document.fonts.check(`16px "${font}"`);
            } catch (e) {
              return false;
            }
          });
        }, { timeout: 20000 });

        // Enhanced image loading verification  
        console.log('   🖼️  Ensuring all images are loaded...');
        const imagePromise = page.waitForFunction(() => {
          const images = Array.from(document.querySelectorAll('img'));
          const backgrounds = Array.from(document.querySelectorAll('[style*="background-image"]'));
          
          const imagesLoaded = images.every(img => {
            return img.complete && img.naturalWidth > 0;
          });
          
          return imagesLoaded && images.length > 0;
        }, { timeout: 30000 });

        // Wait for specific key elements
        console.log('   🎯 Waiting for key page elements...');
        const elementPromises = pageInfo.waitElements.map(async (selector) => {
          try {
            await page.waitForSelector(selector, { timeout: 10000 });
            return true;
          } catch (e) {
            console.log(`     ⚠️  Warning: ${selector} not found, continuing...`);
            return false;
          }
        });

        // Execute all waits in parallel with fallbacks
        await Promise.allSettled([fontPromise, imagePromise, ...elementPromises]);

        // Extra stabilization time for animations to settle
        console.log('   ⏱️  Stabilizing page content...');
        await page.waitForTimeout(5000);

        // Inject enhanced CSS for better PDF rendering
        await page.addStyleTag({
          content: `
            @media print {
              /* Force exact color reproduction */
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Ensure fonts are properly embedded */
              body, * {
                font-family: 'Be Vietnam Pro', 'Arial', sans-serif !important;
              }
              
              h1, h2, h3, .h1, .h2, .h3 {
                font-family: 'Be Vietnam Pro', 'Arial', sans-serif !important;
                font-weight: 700 !important;
              }
              
              /* Fix background colors and gradients */
              body {
                background: white !important;
              }
              
              .section-light {
                background: #F3F6E4 !important;
              }
              
              .section-accent-teal {
                background: linear-gradient(135deg, #20B2AA 0%, #004F64 100%) !important;
                color: white !important;
              }
              
              /* Preserve brand colors explicitly */
              .text-sunshare-deep { color: #00242E !important; }
              .text-sunshare-navy { color: #004F64 !important; }
              .text-sunshare-lime { color: #D1EB0C !important; }
              .text-sunshare-gray { color: #657376 !important; }
              .text-white { color: white !important; }
              
              .bg-sunshare-deep { background-color: #00242E !important; }
              .bg-sunshare-navy { background-color: #004F64 !important; }
              .bg-sunshare-lime { background-color: #D1EB0C !important; }
              .bg-sunshare-cream { background-color: #F3F6E4 !important; }
              
              /* Fix glassmorphism effects for print */
              .backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg, .backdrop-blur-xl {
                backdrop-filter: none !important;
                background: rgba(255, 255, 255, 0.95) !important;
                border: 1px solid rgba(0, 36, 46, 0.1) !important;
              }
              
              /* Improve card visibility */
              .card, .card-light, .card-dark {
                background: white !important;
                border: 1px solid rgba(0, 36, 46, 0.12) !important;
                box-shadow: 0 4px 6px rgba(0, 36, 46, 0.1) !important;
              }
              
              /* Freeze animations for static output */
              *, *::before, *::after {
                animation-duration: 0s !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
              }
              
              /* Fix fixed/sticky positioning for print */
              .fixed, .sticky {
                position: relative !important;
              }
              
              /* Ensure proper text contrast */
              .text-white {
                color: white !important;
              }
              
              .text-gray-600, .text-gray-700 {
                color: #657376 !important;
              }
              
              /* Handle gradients properly */
              .text-gradient {
                background: linear-gradient(135deg, #D1EB0C 0%, #20B2AA 100%) !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
              }
              
              /* Improve button styling */
              button, .btn {
                background-color: #D1EB0C !important;
                color: #00242E !important;
                border: none !important;
              }
            }
          `
        });

        // Generate individual page PDF with enhanced settings
        const individualPath = path.join(outputDir, `${String(i + 1).padStart(2, '0')}-${pageInfo.name.toLowerCase()}.pdf`);
        
        await page.pdf({
          ...pdfOptions,
          path: individualPath,
          headerTemplate: pdfOptions.headerTemplate.replace('Solar Energy Solutions', pageInfo.title),
          footerTemplate: pdfOptions.footerTemplate
        });

        // Verify PDF was created and get size
        const stats = fs.statSync(individualPath);
        const sizeKB = Math.round(stats.size / 1024);
        
        console.log(`   ✅ Generated: ${path.basename(individualPath)} (${sizeKB} KB)`);
        console.log('');

      } catch (error) {
        console.log(`   ❌ Error processing ${pageInfo.name}: ${error.message}`);
        console.log(`   📋 Continuing with next page...\n`);
        continue;
      }
    }

    console.log('🎉 Enhanced PDF generation completed!');
    console.log(`📁 Output directory: ${path.relative(process.cwd(), outputDir)}`);
    
    // List all generated files with details
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
    console.log(`\n📊 Generated ${files.length} PDF files:`);
    
    let totalSize = 0;
    files.forEach((file, index) => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      totalSize += stats.size;
      
      console.log(`   ${index + 1}. ${file} (${sizeKB} KB)`);
    });
    
    console.log(`\n📊 Total size: ${Math.round(totalSize / 1024)} KB`);
    console.log(`\n🎨 Enhanced features applied:`);
    console.log(`   ✅ High DPI rendering (2x device pixel ratio)`);
    console.log(`   ✅ Custom font loading verification`);
    console.log(`   ✅ Image loading verification`);
    console.log(`   ✅ Brand color preservation`);
    console.log(`   ✅ Glassmorphism effect optimization`);
    console.log(`   ✅ Extended stabilization time`);
    console.log(`   ✅ Professional headers and footers`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  } finally {
    if (page) {
      try { await page.close(); } catch (e) {}
    }
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
  }
}

async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000', { 
      signal: AbortSignal.timeout(10000) 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying server status...');
  
  if (!await checkServer()) {
    console.log('❌ Server not running at http://localhost:3000');
    console.log('\n🚀 Please start your Next.js server:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   npm run build && npm run start');
    return process.exit(1);
  }

  console.log('✅ Server is running and responding\n');
  
  try {
    await generateVisuallyAccuratePDF();
    console.log('\n🎊 Success! Enhanced PDFs generated with full visual preservation.');
  } catch (error) {
    console.error('\n💥 Generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateVisuallyAccuratePDF };