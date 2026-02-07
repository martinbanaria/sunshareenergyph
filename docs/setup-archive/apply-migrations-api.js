const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function applyMigrations() {
  console.log('🚀 Applying Supabase Migrations via REST API...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const migrations = [
    '001_initial_schema.sql',
    '002_rls_policies.sql', 
    '003_triggers_functions.sql',
    '004_storage_bucket_policies.sql'
  ];
  
  for (const migration of migrations) {
    console.log(`\n📝 Applying ${migration}...`);
    
    try {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);
      const sqlContent = fs.readFileSync(migrationPath, 'utf8');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        },
        body: JSON.stringify({ query: sqlContent })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${migration} applied successfully`);
      } else {
        const error = await response.text();
        console.log(`❌ ${migration} failed: ${error}`);
      }
      
    } catch (err) {
      console.error(`❌ Error applying ${migration}:`, err.message);
    }
  }
  
  console.log('\n🎉 Migration process completed!');
}

applyMigrations();