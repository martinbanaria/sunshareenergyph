const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function deployDatabase() {
  console.log('🚀 Deploying database schema via REST API...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ Missing Supabase credentials in .env.local');
    return;
  }
  
  console.log('✅ Credentials found');
  console.log('📍 URL:', supabaseUrl);
  
  // Read the SQL file
  const sqlPath = path.join(__dirname, 'COMPLETE_SETUP.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Split into individual statements (rough approach)
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
  
  console.log(`📝 Found ${statements.length} SQL statements to execute`);
  
  // Execute statements via REST API
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    if (statement.includes('SELECT') && statement.includes('status')) {
      // Skip verification queries
      continue;
    }
    
    try {
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        },
        body: JSON.stringify({
          query: statement
        })
      });
      
      if (response.ok) {
        successCount++;
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } else {
        const error = await response.text();
        console.log(`⚠️ Statement ${i + 1} failed: ${error}`);
        
        // Try alternative approach - direct query execution
        const altResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            sql: statement
          })
        });
        
        if (altResponse.ok) {
          successCount++;
          console.log(`✅ Statement ${i + 1} executed via alternative method`);
        } else {
          errorCount++;
          console.log(`❌ Statement ${i + 1} failed completely`);
        }
      }
    } catch (err) {
      errorCount++;
      console.log(`❌ Statement ${i + 1} error: ${err.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Deployment Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Database deployment completed successfully!');
  } else {
    console.log('\n⚠️ Some statements failed. This might be normal if tables already exist.');
  }
  
  // Test connection
  console.log('\n🔍 Testing database connection...');
  try {
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/user_onboarding?select=count`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });
    
    if (testResponse.ok) {
      console.log('✅ Database connection successful! Tables are accessible.');
    } else {
      console.log('⚠️ Could not verify table access');
    }
  } catch (err) {
    console.log('⚠️ Connection test failed:', err.message);
  }
}

deployDatabase().catch(console.error);