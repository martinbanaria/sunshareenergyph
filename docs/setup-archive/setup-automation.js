const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

class SupabaseAutomation {
  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.projectRef = this.supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    
    console.log('🚀 SunShare Automated Setup');
    console.log('==========================');
    console.log(`📍 Project: ${this.projectRef}`);
    console.log(`🔗 URL: ${this.supabaseUrl}`);
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.supabaseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'apikey': this.serviceRoleKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    return response.json();
  }

  async createStorageBucket() {
    console.log('📁 Creating storage bucket...');
    
    try {
      // Create bucket via REST API
      const bucket = await this.makeRequest('/rest/v1/rpc/storage_create_bucket', {
        method: 'POST',
        body: JSON.stringify({
          bucket_id: 'id-documents',
          bucket_name: 'id-documents',
          public: false,
          file_size_limit: 10485760,
          allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
        })
      });
      
      console.log('✅ Storage bucket created successfully');
      return true;
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log('ℹ️  Storage bucket already exists');
        return true;
      }
      console.log('⚠️  Bucket creation failed:', error.message);
      return false;
    }
  }

  async setupStoragePolicies() {
    console.log('🔒 Setting up storage policies...');
    
    const policies = `
      -- Storage policies for id-documents bucket
      DO $$ 
      BEGIN
        -- Users can upload own documents
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' 
          AND policyname = 'Users can upload own documents'
        ) THEN
          CREATE POLICY "Users can upload own documents" ON storage.objects
            FOR INSERT WITH CHECK (
              bucket_id = 'id-documents' AND
              auth.uid()::text = (storage.foldername(name))[1]
            );
        END IF;

        -- Users can view own documents  
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' 
          AND policyname = 'Users can view own documents'
        ) THEN
          CREATE POLICY "Users can view own documents" ON storage.objects
            FOR SELECT USING (
              bucket_id = 'id-documents' AND
              auth.uid()::text = (storage.foldername(name))[1]
            );
        END IF;

        -- Users can delete own documents
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' 
          AND policyname = 'Users can delete own documents'
        ) THEN
          CREATE POLICY "Users can delete own documents" ON storage.objects
            FOR DELETE USING (
              bucket_id = 'id-documents' AND
              auth.uid()::text = (storage.foldername(name))[1]
            );
        END IF;
      END $$;
    `;

    // Write policies to a temp file and execute via Management API
    try {
      // Try using Management API if available
      const response = await fetch(`https://api.supabase.com/v1/projects/${this.projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: policies
        })
      });

      if (response.ok) {
        console.log('✅ Storage policies applied successfully');
        return true;
      } else {
        console.log('⚠️  Storage policies need manual setup');
        console.log('📋 Run this SQL in Supabase Dashboard:');
        console.log(policies);
        return false;
      }
    } catch (error) {
      console.log('⚠️  Storage policies need manual setup');
      console.log('📋 Copy this SQL to Supabase SQL Editor:');
      console.log(policies);
      return false;
    }
  }

  async verifySetup() {
    console.log('🔍 Verifying setup...');
    
    try {
      // Check database table
      const tableCheck = await this.makeRequest('/rest/v1/user_onboarding?select=count', {
        method: 'GET'
      });
      console.log('✅ Database table accessible');

      // Check storage bucket
      const bucketCheck = await this.makeRequest('/storage/v1/bucket/id-documents', {
        method: 'GET'
      });
      console.log('✅ Storage bucket accessible');
      
      return true;
    } catch (error) {
      console.log('⚠️  Verification failed:', error.message);
      return false;
    }
  }

  async run() {
    console.log('\n🎯 Starting automated setup...\n');
    
    try {
      // Create storage bucket
      await this.createStorageBucket();
      
      // Setup storage policies
      await this.setupStoragePolicies();
      
      // Verify everything works
      const verified = await this.verifySetup();
      
      console.log('\n' + '='.repeat(50));
      if (verified) {
        console.log('🎉 SETUP COMPLETE!');
        console.log('');
        console.log('🎯 Ready to test:');
        console.log('   👉 Visit: http://localhost:3000/onboarding');
        console.log('   👉 Complete the 5-step registration flow');
        console.log('   👉 Test ID upload and OCR functionality');
      } else {
        console.log('⚠️  Setup partially complete');
        console.log('   Some manual steps may be required');
      }
      
      console.log('');
      console.log('📚 For future deployments:');
      console.log('   👉 Run: node setup-automation.js');
      console.log('   👉 Or: ./setup-complete.sh');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Create deployment documentation
function createDeploymentDocs() {
  const docs = `# SunShare Automated Deployment

## Quick Setup (Future Deployments)

\`\`\`bash
# Option 1: Node.js automation
node setup-automation.js

# Option 2: Bash script with CLI
./setup-complete.sh
\`\`\`

## Manual Setup (Backup)

If automation fails, execute these in Supabase SQL Editor:

### 1. Database Tables
\`\`\`sql
${fs.readFileSync('COMPLETE_SETUP.sql', 'utf8')}
\`\`\`

### 2. Storage Bucket
- Go to Storage → Create bucket "id-documents" (Private)
- Apply storage policies from storage-policies.sql

## Environment Variables Required

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

## Testing

1. Start dev server: \`npm run dev\`
2. Visit: http://localhost:3000/onboarding
3. Complete 5-step registration flow
4. Verify data in Supabase dashboard

## Production Deployment

1. Set environment variables in hosting platform
2. Run setup automation script
3. Deploy application
4. Test onboarding flow on live site
`;

  fs.writeFileSync('DEPLOYMENT_GUIDE.md', docs);
  console.log('📚 Created DEPLOYMENT_GUIDE.md');
}

// Run if called directly
if (require.main === module) {
  const automation = new SupabaseAutomation();
  automation.run().then(() => {
    createDeploymentDocs();
  });
}

module.exports = SupabaseAutomation;