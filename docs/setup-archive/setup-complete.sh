#!/bin/bash
set -e

echo "🚀 SunShare Complete Database & Storage Setup Automation"
echo "=========================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase@latest
fi

# Check environment variables
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing required environment variables in .env.local"
    echo "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"

# Extract project ref from URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')
echo "📍 Project Reference: $PROJECT_REF"

# Initialize supabase project if needed
if [ ! -d "supabase" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
fi

# Link to remote project
echo "🔗 Linking to remote Supabase project..."
supabase link --project-ref $PROJECT_REF

# Create migration from our setup SQL
echo "📝 Creating database migration..."
mkdir -p supabase/migrations
cp COMPLETE_SETUP.sql supabase/migrations/$(date +%Y%m%d%H%M%S)_initial_setup.sql

# Push database changes
echo "⚡ Pushing database migration..."
supabase db push

# Create storage bucket and policies via CLI
echo "📁 Setting up storage bucket..."
supabase storage bucket create id-documents --public false --file-size-limit 10485760

# Apply storage policies
echo "🔒 Applying storage policies..."
cat > supabase/migrations/$(date +%Y%m%d%H%M%S)_storage_policies.sql << 'EOF'
-- Storage policies for id-documents bucket
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'id-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
EOF

supabase db push

echo "✅ Database and storage setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Visit http://localhost:3000/onboarding to test"
echo "   2. Complete onboarding flow end-to-end"
echo "   3. Deploy to production when ready"
echo ""
echo "📚 For future deployments, just run: ./setup-complete.sh"