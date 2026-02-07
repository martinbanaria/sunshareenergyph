const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🚀 Applying Supabase Migrations...');
  
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
      
      // Split SQL content by semicolons and execute each statement
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            const { data, error } = await supabase.rpc('sql_query', { 
              query: statement + ';' 
            });
            
            if (error) {
              console.log(`  ⚠️ Statement ${i + 1}: ${error.message}`);
            } else {
              console.log(`  ✅ Statement ${i + 1}: Success`);
            }
          } catch (err) {
            console.log(`  ❌ Statement ${i + 1}: ${err.message}`);
          }
        }
      }
      
      console.log(`✅ ${migration} completed`);
      
    } catch (err) {
      console.error(`❌ Error reading ${migration}:`, err.message);
    }
  }
  
  console.log('\n🎉 Migration process completed!');
}

applyMigrations();