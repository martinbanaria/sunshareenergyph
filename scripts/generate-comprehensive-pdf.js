const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateComprehensivePDF() {
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
    deviceScaleFactor: 2,
    screen: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  const baseUrl = 'http://localhost:3000';
  const outputDir = path.join(__dirname, '..', 'pdf-output');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pages = [
    { 
      url: '/', 
      name: 'Home',
      waitFor: '.hero-section',
      pageBreak: true
    },
    { 
      url: '/about', 
      name: 'About Us',
      pageBreak: true
    },
    { 
      url: '/solutions', 
      name: 'Solar Solutions',
      pageBreak: true
    },
    { 
      url: '/how-it-works', 
      name: 'How It Works',
      pageBreak: true
    },
    { 
      url: '/contact', 
      name: 'Contact Us',
      pageBreak: true
    }
  ];

  console.log('🌞 Generating comprehensive SunShare Philippines website PDF...\n');

  try {
    // Create a comprehensive HTML document that includes all pages
    let combinedHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SunShare Philippines - Complete Website</title>
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .page-title {
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #00242E;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            border-bottom: 3px solid #D1EB0C;
          }
          
          .page-content {
            width: 100%;
            height: auto;
            overflow: visible;
          }
          
          /* Ensure all visual elements are preserved */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Fix animations for static PDF */
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        </style>
      </head>
      <body>
    `;

    let pageCounter = 0;

    for (const pageInfo of pages) {
      console.log(`📄 Capturing: ${pageInfo.name} (${baseUrl}${pageInfo.url})`);

      await page.goto(`${baseUrl}${pageInfo.url}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for specific elements and content to load
      if (pageInfo.waitFor) {
        try {
          await page.waitForSelector(pageInfo.waitFor, { timeout: 10000 });
        } catch (e) {
          console.log(`   ⚠️  Warning: Could not find ${pageInfo.waitFor}`);
        }
      }

      // Wait for fonts and images
      await page.waitForFunction(() => {
        const fonts = ['Be Vietnam Pro', 'Libre Baskerville'];
        return fonts.every(font => document.fonts.check(`1em "${font}"`));
      }, { timeout: 10000 }).catch(() => {});

      await page.waitForFunction(() => {
        const images = Array.from(document.images);
        return images.every(img => img.complete);
      }, { timeout: 15000 }).catch(() => {});

      await page.waitForTimeout(3000);

      // Get the page content
      const pageContent = await page.evaluate(() => {
        // Remove header and footer for clean content
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const nav = document.querySelector('nav');
        
        const elementsToHide = [header, footer, nav].filter(Boolean);
        
        // Get the main content
        const main = document.querySelector('main') || document.body;
        return main ? main.outerHTML : document.body.outerHTML;
      });

      // Add page to combined HTML
      if (pageCounter > 0) {
        combinedHtml += `<div class="page-break"></div>`;
      }
      
      combinedHtml += `
        <div class="page-title">${pageInfo.name}</div>
        <div class="page-content">
          ${pageContent}
        </div>
      `;

      pageCounter++;
      console.log(`   ✅ Captured successfully`);
    }

    combinedHtml += `
      </body>
      </html>
    `;

    // Write the combined HTML to a temporary file
    const tempHtmlPath = path.join(outputDir, 'temp-combined.html');
    fs.writeFileSync(tempHtmlPath, combinedHtml);

    // Navigate to the combined HTML and generate PDF
    console.log('\n🔄 Generating final combined PDF...');
    
    await page.goto(`file://${tempHtmlPath}`, { 
      waitUntil: 'networkidle' 
    });

    await page.waitForTimeout(2000);

    // Generate the final PDF
    const finalPdfPath = path.join(outputDir, 'sunshare-philippines-complete.pdf');
    
    await page.pdf({
      path: finalPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; font-size: 12px; color: #00242E; width: 100%; text-align: center; margin: 0 auto; padding: 10px; font-weight: 600;">
          SunShare Philippines - Solar Energy Solutions
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Be Vietnam Pro', sans-serif; font-size: 10px; color: #666; width: 100%; text-align: center; margin: 0 auto; padding: 5px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span> | www.sunshareenergyph.com | Generated on ${new Date().toLocaleDateString()}
        </div>
      `,
    });

    // Clean up temporary file
    fs.unlinkSync(tempHtmlPath);

    console.log('\n🎉 PDF generation completed successfully!');
    console.log(`📄 Complete website PDF: ${path.relative(process.cwd(), finalPdfPath)}`);
    console.log(`📁 Output directory: ${path.relative(process.cwd(), outputDir)}`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch (error) {
    return false;
  }
}

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
    await generateComprehensivePDF();
    console.log('\n🎊 PDF generation completed successfully!');
  } catch (error) {
    console.error('\n💥 PDF generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateComprehensivePDF };