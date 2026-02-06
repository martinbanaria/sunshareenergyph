const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateWebsitePDF() {
  console.log('🌞 Starting SunShare Philippines PDF generation...\n');
  
  let browser;
  let page;
  
  try {
    browser = await chromium.launch({
      headless: true,
      timeout: 60000,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
    });

    page = await context.newPage();
    page.setDefaultTimeout(20000);

    const baseUrl = 'http://localhost:3000';
    const outputDir = path.join(__dirname, '..', 'pdf-output');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pages = [
      { url: '/', name: 'Home', title: 'SunShare Philippines - Home' },
      { url: '/about', name: 'About', title: 'About SunShare Philippines' },
      { url: '/solutions', name: 'Solutions', title: 'Solar Solutions & Services' },
      { url: '/how-it-works', name: 'How-It-Works', title: 'How SunShare Works' },
      { url: '/contact', name: 'Contact', title: 'Contact SunShare Philippines' }
    ];

    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '1in', right: '0.8in', bottom: '1in', left: '0.8in' },
      scale: 0.85,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: Arial, sans-serif; font-size: 11px; color: #333; width: 100%; text-align: center; margin: 0; padding: 5px;">
          <strong>SunShare Philippines</strong> - Solar Energy Solutions
        </div>
      `,
      footerTemplate: `
        <div style="font-family: Arial, sans-serif; font-size: 10px; color: #666; width: 100%; text-align: center; margin: 0; padding: 5px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span> | www.sunshareenergyph.com
        </div>
      `
    };

    // Generate individual PDFs for each page
    for (let i = 0; i < pages.length; i++) {
      const pageInfo = pages[i];
      console.log(`📄 Processing ${i + 1}/${pages.length}: ${pageInfo.name}`);

      try {
        await page.goto(`${baseUrl}${pageInfo.url}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });

        // Simple wait for content to stabilize
        await page.waitForTimeout(3000);

        // Add print styles
        await page.addStyleTag({
          content: `
            @media print {
              * { -webkit-print-color-adjust: exact !important; }
              .fixed, .sticky { position: relative !important; }
              body { background: white !important; }
              *, *::before, *::after {
                animation-duration: 0s !important;
                transition-duration: 0s !important;
              }
            }
          `
        });

        const individualPath = path.join(outputDir, `${String(i + 1).padStart(2, '0')}-${pageInfo.name.toLowerCase()}.pdf`);
        
        await page.pdf({
          ...pdfOptions,
          path: individualPath,
          headerTemplate: pdfOptions.headerTemplate.replace('Solar Energy Solutions', pageInfo.title)
        });

        console.log(`   ✅ Generated: ${path.basename(individualPath)}`);

      } catch (error) {
        console.log(`   ❌ Error processing ${pageInfo.name}: ${error.message}`);
        continue; // Continue with next page
      }
    }

    // Generate combined PDF - just use the home page as main content
    console.log('\n🔄 Generating combined website overview...');
    
    try {
      await page.goto(`${baseUrl}/`, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });

      await page.waitForTimeout(2000);

      const combinedPath = path.join(outputDir, 'sunshare-philippines-complete.pdf');
      
      await page.pdf({
        ...pdfOptions,
        path: combinedPath,
        headerTemplate: pdfOptions.headerTemplate
      });

      console.log(`   ✅ Generated: ${path.basename(combinedPath)}`);

    } catch (error) {
      console.log(`   ❌ Error generating combined PDF: ${error.message}`);
    }

    console.log('\n🎉 PDF generation completed!');
    console.log(`📁 Output directory: ${path.relative(process.cwd(), outputDir)}`);
    
    // List generated files
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
    console.log('\n📄 Generated files:');
    files.forEach(file => {
      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   • ${file} (${sizeKB} KB)`);
    });

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
  console.log('🔍 Checking server...');
  
  if (!await checkServer()) {
    console.log('❌ Server not running at http://localhost:3000');
    console.log('Start with: npm run dev');
    return process.exit(1);
  }

  console.log('✅ Server is running\n');
  
  try {
    await generateWebsitePDF();
    console.log('\n🎊 Success! PDFs generated successfully.');
  } catch (error) {
    console.error('\n💥 Failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateWebsitePDF };