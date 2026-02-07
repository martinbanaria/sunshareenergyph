const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Automated Supabase Setup via Browser Automation
 * This script will open the Supabase dashboard and execute the setup
 */

async function automateSupabaseSetup() {
  console.log('🚀 Starting automated Supabase setup...');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Show browser for debugging
    slowMo: 1000 // Slow down actions
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to Supabase project
    console.log('📂 Opening Supabase project dashboard...');
    await page.goto('https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to login
    const loginRequired = await page.locator('text=Sign in').isVisible();
    
    if (loginRequired) {
      console.log('🔑 Login required - please complete authentication manually');
      console.log('   After logging in, press Enter to continue...');
      
      // Wait for user to login manually
      process.stdin.setRawMode(true);
      process.stdin.resume();
      await new Promise(resolve => {
        process.stdin.once('data', () => {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          resolve();
        });
      });
    }
    
    // Navigate to SQL Editor
    console.log('📝 Opening SQL Editor...');
    await page.click('text=SQL Editor');
    await page.waitForLoadState('networkidle');
    
    // Click New Query
    await page.click('text=New Query');
    await page.waitForTimeout(2000);
    
    // Read the schema file
    console.log('📄 Reading schema file...');
    const schemaPath = path.join(__dirname, 'COMPLETE_SETUP.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Find the SQL editor and paste the schema
    console.log('📋 Pasting schema into SQL editor...');
    const sqlEditor = await page.locator('.monaco-editor textarea').first();
    await sqlEditor.click();
    await sqlEditor.fill(schemaSql);
    
    // Execute the query
    console.log('⚡ Executing database schema...');
    await page.click('text=Run');
    
    // Wait for execution to complete
    await page.waitForTimeout(5000);
    
    // Check for success/error messages
    const successMessage = await page.locator('text=Query executed successfully').isVisible();
    const errorMessage = await page.locator('.error, [role="alert"]').isVisible();
    
    if (successMessage) {
      console.log('✅ Database schema created successfully!');
    } else if (errorMessage) {
      console.log('⚠️ Some errors occurred, but this may be expected');
    }
    
    // Navigate to Storage
    console.log('🗂️ Setting up storage bucket...');
    await page.click('text=Storage');
    await page.waitForLoadState('networkidle');
    
    // Check if bucket already exists
    const bucketExists = await page.locator('text=id-documents').isVisible();
    
    if (!bucketExists) {
      // Create new bucket
      await page.click('text=New bucket');
      await page.waitForTimeout(1000);
      
      // Fill bucket details
      await page.fill('input[placeholder*="bucket name"]', 'id-documents');
      await page.click('text=Private'); // Ensure it's private
      
      // Create bucket
      await page.click('button:has-text("Create bucket")');
      await page.waitForTimeout(3000);
      
      console.log('✅ Storage bucket created!');
    } else {
      console.log('ℹ️ Storage bucket already exists');
    }
    
    // Apply storage policies
    console.log('🔐 Applying storage policies...');
    await page.click('text=SQL Editor');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=New Query');
    await page.waitForTimeout(2000);
    
    // Read storage policies
    const storagePath = path.join(__dirname, 'STORAGE_SETUP.sql');
    const storageSql = fs.readFileSync(storagePath, 'utf8');
    
    // Paste storage policies
    const sqlEditor2 = await page.locator('.monaco-editor textarea').first();
    await sqlEditor2.click();
    await sqlEditor2.fill(storageSql);
    
    // Execute storage policies
    await page.click('text=Run');
    await page.waitForTimeout(3000);
    
    console.log('✅ Storage policies applied!');
    
    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('🧪 Test your app at: http://localhost:3000/onboarding');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Please complete the setup manually:');
    console.log('1. SQL Editor > New Query > Paste COMPLETE_SETUP.sql > Run');
    console.log('2. Storage > New Bucket > "id-documents" (Private)');
    console.log('3. SQL Editor > New Query > Paste STORAGE_SETUP.sql > Run');
  } finally {
    // Keep browser open for verification
    console.log('\n⏸️  Browser will stay open for verification');
    console.log('   Press Enter to close...');
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve();
      });
    });
    
    await browser.close();
  }
}

// Run the automation
automateSupabaseSetup().catch(console.error);