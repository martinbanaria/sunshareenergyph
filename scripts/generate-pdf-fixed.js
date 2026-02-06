const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateFullContentPDF() {
  console.log('📄 Generating FULL CONTENT PDF for SunShare Philippines...\n');
  
  let browser;
  let page;
  
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5
    });

    page = await context.newPage();
    page.setDefaultTimeout(30000);

    const baseUrl = 'http://localhost:3000';
    const outputDir = path.join(__dirname, '..', 'pdf-output-fixed');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pages = [
      { url: '/', name: 'Home', title: 'SunShare Philippines - Complete Homepage' },
      { url: '/about', name: 'About', title: 'About SunShare Philippines' },
      { url: '/solutions', name: 'Solutions', title: 'Solar Solutions & Services' },
      { url: '/how-it-works', name: 'How-It-Works', title: 'How SunShare Works' },
      { url: '/contact', name: 'Contact', title: 'Contact SunShare Philippines' }
    ];

    for (let i = 0; i < pages.length; i++) {
      const pageInfo = pages[i];
      console.log(`📄 Processing ${i + 1}/${pages.length}: ${pageInfo.name}`);

      try {
        await page.goto(`${baseUrl}${pageInfo.url}`, { 
          waitUntil: 'networkidle',
          timeout: 20000 
        });

        // Wait for page to stabilize
        await page.waitForTimeout(3000);

        // Get actual page dimensions
        const dimensions = await page.evaluate(() => ({
          fullHeight: Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          ),
          sectionsCount: document.querySelectorAll('section').length
        }));

        console.log(`   📏 Full page height: ${dimensions.fullHeight}px`);
        console.log(`   📋 Sections found: ${dimensions.sectionsCount}`);

        // Add critical CSS to ensure all content is visible and printable
        await page.addStyleTag({
          content: `
            @media print {
              /* Critical: Make sure all content is visible */
              html, body {
                height: auto !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Ensure main content is fully visible */
              main {
                height: auto !important;
                overflow: visible !important;
                display: block !important;
              }
              
              /* Make sure all sections print */
              section {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: block !important;
                overflow: visible !important;
                height: auto !important;
              }
              
              /* Fix positioning issues */
              .fixed, .sticky {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                bottom: auto !important;
              }
              
              /* Ensure colors are preserved */
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Remove animations that might interfere */
              *, *::before, *::after {
                animation-duration: 0s !important;
                transition-duration: 0s !important;
                animation-play-state: paused !important;
              }
              
              /* Ensure backgrounds and colors show */
              .section-light {
                background: #F3F6E4 !important;
              }
              
              .section-accent-teal {
                background: #20B2AA !important;
                color: white !important;
              }
              
              .bg-sunshare-deep {
                background: #00242E !important;
                color: white !important;
              }
              
              /* Make sure text is readable */
              .text-white {
                color: white !important;
              }
              
              .text-sunshare-deep {
                color: #00242E !important;
              }
              
              .text-sunshare-navy {
                color: #004F64 !important;
              }
              
              /* Hide any overlay elements that might block content */
              .fixed-overlay, .modal, .popup {
                display: none !important;
              }
            }
          `
        });

        // Generate PDF with settings optimized for full content capture
        const pdfPath = path.join(outputDir, `${String(i + 1).padStart(2, '0')}-${pageInfo.name.toLowerCase()}.pdf`);
        
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
            top: '0.5in',
            right: '0.4in', 
            bottom: '0.5in',
            left: '0.4in'
          },
          scale: 0.65, // Smaller scale to fit more content per page
          displayHeaderFooter: true,
          headerTemplate: `
            <div style="
              font-size: 10px; 
              color: #00242E; 
              text-align: center; 
              width: 100%; 
              padding: 5px;
              font-family: Arial, sans-serif;
              font-weight: bold;
            ">
              ${pageInfo.title}
            </div>
          `,
          footerTemplate: `
            <div style="
              font-size: 9px; 
              color: #666; 
              text-align: center; 
              width: 100%; 
              padding: 5px;
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: space-between;
              padding-left: 30px;
              padding-right: 30px;
            ">
              <span>www.sunshareenergyph.com</span>
              <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
          `
        });

        const stats = fs.statSync(pdfPath);
        const sizeKB = Math.round(stats.size / 1024);
        
        console.log(`   ✅ Generated: ${path.basename(pdfPath)} (${sizeKB} KB)`);
        
        // Quick verification of PDF page count
        const { exec } = require('child_process');
        exec(`mdls -name kMDItemNumberOfPages "${pdfPath}" 2>/dev/null || echo "Pages: unknown"`, (error, stdout) => {
          if (!error) {
            console.log(`   📖 ${stdout.trim()}`);
          }
        });
        
        console.log('');

      } catch (error) {
        console.log(`   ❌ Error processing ${pageInfo.name}: ${error.message}`);
        continue;
      }
    }

    console.log('🎉 Fixed PDF generation completed!');
    console.log(`📁 Output directory: ${path.relative(process.cwd(), outputDir)}`);
    
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
    console.log(`\n📊 Generated ${files.length} complete PDFs:`);
    
    files.forEach((file, index) => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   ${index + 1}. ${file} (${sizeKB} KB)`);
    });

    console.log(`\n✅ These PDFs should now contain ALL page content, not just the top section!`);
    console.log(`✅ Each page should be multiple PDF pages showing the full website content.`);

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
      signal: AbortSignal.timeout(5000) 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking server status...');
  
  if (!await checkServer()) {
    console.log('❌ Server not running at http://localhost:3000');
    console.log('Please start with: npm run dev');
    return process.exit(1);
  }

  console.log('✅ Server is running\n');
  
  try {
    await generateFullContentPDF();
    console.log('\n🎊 Success! PDFs now contain full page content.');
  } catch (error) {
    console.error('\n💥 Failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateFullContentPDF };