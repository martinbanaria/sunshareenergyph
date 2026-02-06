const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function diagnosePDFContent() {
  console.log('🔍 Diagnosing PDF content capture issues...\n');
  
  let browser;
  let page;
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    page = await context.newPage();

    const baseUrl = 'http://localhost:3000';
    
    console.log('📏 Checking page dimensions and content...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    
    // Get actual page dimensions
    const dimensions = await page.evaluate(() => {
      return {
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        fullPageHeight: document.body.scrollHeight,
        fullPageWidth: document.body.scrollWidth,
        contentHeight: document.documentElement.scrollHeight
      };
    });
    
    console.log('📊 Page Dimensions:');
    console.log(`   Viewport: ${dimensions.viewportWidth}x${dimensions.viewportHeight}`);
    console.log(`   Full page height: ${dimensions.fullPageHeight}px`);
    console.log(`   Content height: ${dimensions.contentHeight}px`);
    
    // Check for main content elements
    const contentAnalysis = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const main = document.querySelector('main');
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      
      return {
        sectionsCount: sections.length,
        sectionsInfo: Array.from(sections).map((section, i) => ({
          index: i,
          id: section.id || 'no-id',
          offsetTop: section.offsetTop,
          height: section.offsetHeight,
          visible: section.offsetTop < window.innerHeight
        })),
        mainExists: !!main,
        mainHeight: main ? main.offsetHeight : 0,
        headerHeight: header ? header.offsetHeight : 0,
        footerExists: !!footer
      };
    });
    
    console.log('\n📋 Content Analysis:');
    console.log(`   Sections found: ${contentAnalysis.sectionsCount}`);
    console.log(`   Main content height: ${contentAnalysis.mainHeight}px`);
    console.log(`   Header height: ${contentAnalysis.headerHeight}px`);
    
    console.log('\n📍 Section Positions:');
    contentAnalysis.sectionsInfo.forEach(section => {
      const visibility = section.visible ? '👁️  VISIBLE' : '📍 BELOW FOLD';
      console.log(`   ${section.index + 1}. ${section.id}: ${section.offsetTop}px (${section.height}px) ${visibility}`);
    });
    
    // Now test different PDF capture methods
    const outputDir = path.join(__dirname, '..', 'pdf-diagnosis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log('\n🧪 Testing different capture methods...\n');
    
    // Method 1: Default PDF (what I was doing)
    console.log('1️⃣ Testing default PDF capture...');
    await page.pdf({
      path: path.join(outputDir, 'test-default.pdf'),
      format: 'A4',
      printBackground: true
    });
    console.log('   ✅ Generated test-default.pdf');
    
    // Method 2: Full page height PDF
    console.log('2️⃣ Testing full page PDF capture...');
    await page.pdf({
      path: path.join(outputDir, 'test-fullpage.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      scale: 0.6, // Smaller scale to fit more content
      preferCSSPageSize: false
    });
    console.log('   ✅ Generated test-fullpage.pdf');
    
    // Method 3: Add CSS to ensure full content visibility
    console.log('3️⃣ Testing with print CSS modifications...');
    await page.addStyleTag({
      content: `
        @media print {
          body { height: auto !important; }
          main { height: auto !important; }
          section { page-break-inside: avoid !important; }
          .fixed, .sticky { position: relative !important; }
          * { overflow: visible !important; }
        }
      `
    });
    
    await page.pdf({
      path: path.join(outputDir, 'test-print-css.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      scale: 0.7
    });
    console.log('   ✅ Generated test-print-css.pdf');
    
    // Method 4: Screenshot comparison
    console.log('4️⃣ Taking full page screenshot for comparison...');
    await page.screenshot({
      path: path.join(outputDir, 'fullpage-screenshot.png'),
      fullPage: true
    });
    console.log('   ✅ Generated fullpage-screenshot.png');
    
    console.log('\n📁 Diagnosis files saved to:', path.relative(process.cwd(), outputDir));
    console.log('\n🔍 Analysis Complete. Check the files to see:');
    console.log('   • test-default.pdf - What your current PDFs look like');
    console.log('   • test-fullpage.pdf - Attempt at full page capture');  
    console.log('   • test-print-css.pdf - With CSS fixes');
    console.log('   • fullpage-screenshot.png - What the full page should look like');
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  await diagnosePDFContent();
}

if (require.main === module) {
  main();
}

module.exports = { diagnosePDFContent };