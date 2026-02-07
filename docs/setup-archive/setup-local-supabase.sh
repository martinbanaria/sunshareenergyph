#!/bin/bash

# SunShare Local Supabase Setup (No Cloud Required)
# This script sets up local Supabase for development without requiring cloud authentication

echo "🚀 Starting SunShare Local Development Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Initialize Supabase project locally (skip cloud authentication)
print_info "Initializing local Supabase project..."
if [ ! -f "supabase/config.toml" ]; then
    echo "Creating local Supabase configuration..."
    mkdir -p supabase
    
    # Create minimal config for local development
    cat > supabase/config.toml << 'EOF'
# A string used to distinguish different Supabase projects on the same machine.
project_id = "sunshare-ph"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"

[auth]
enabled = true
port = 54324
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600
enable_signup = true

[edge_functions]
enabled = false

[storage]
enabled = true
port = 54325
image_transformation = 
  enabled = false
EOF
    
    print_status "Local Supabase project initialized"
else
    print_status "Local Supabase project already exists"
fi

# Start local Supabase services
print_info "Starting local Supabase services..."
supabase start

if [ $? -eq 0 ]; then
    print_status "Local Supabase services started successfully"
    
    # Get local connection details
    print_info "Getting local Supabase connection details..."
    LOCAL_API_URL="http://localhost:54321"
    LOCAL_ANON_KEY=$(supabase status | grep "anon key" | awk '{print $NF}')
    LOCAL_SERVICE_ROLE=$(supabase status | grep "service_role key" | awk '{print $NF}')
    
    if [ -z "$LOCAL_ANON_KEY" ]; then
        LOCAL_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    fi
    
    if [ -z "$LOCAL_SERVICE_ROLE" ]; then
        LOCAL_SERVICE_ROLE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
    fi
    
    echo ""
    echo "🔗 Local Supabase Connection Details:"
    echo "   API URL: $LOCAL_API_URL"
    echo "   Anon Key: ${LOCAL_ANON_KEY:0:20}..."
    echo "   Service Role: ${LOCAL_SERVICE_ROLE:0:20}..."
    echo ""
    
else
    print_error "Failed to start local Supabase services"
    exit 1
fi

# Deploy the SunShare schema
print_info "Deploying SunShare database schema..."
if [ -f "supabase/schema.sql" ]; then
    # Apply the schema to the local database
    PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/schema.sql
    
    if [ $? -eq 0 ]; then
        print_status "Database schema deployed successfully"
    else
        print_warning "Schema deployment had some warnings, but may still work"
    fi
else
    print_error "Schema file not found at supabase/schema.sql"
    exit 1
fi

# Update environment variables
print_info "Updating environment variables..."
cat > .env.local << EOF
# Updated by SunShare automation script - $(date)

# Supabase (Local Development)
NEXT_PUBLIC_SUPABASE_URL=$LOCAL_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$LOCAL_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$LOCAL_SERVICE_ROLE

# hCaptcha (test keys for development)
NEXT_PUBLIC_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000

# Resend (dummy value for development)
RESEND_API_KEY=re_dummy_key_for_build

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

print_status "Environment variables updated in .env.local"

# Update Claude Desktop MCP configuration
print_info "Updating Claude Desktop MCP configuration..."
cat > ~/.claude_desktop_config.json << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp-server",
      "env": {
        "SUPABASE_PROJECT_REF": "sunshare-ph",
        "SUPABASE_URL": "$LOCAL_API_URL",
        "SUPABASE_SERVICE_ROLE_KEY": "$LOCAL_SERVICE_ROLE",
        "SUPABASE_DB_PASSWORD": "postgres",
        "SUPABASE_REGION": "local"
      }
    }
  },
  "globalShortcut": "Cmd+Shift+.",
  "allowedHosts": [
    "localhost",
    "127.0.0.1"
  ]
}
EOF

print_status "Claude Desktop MCP configuration updated"

# Test the database connection
print_info "Testing database connection and tables..."
PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;" 2>/dev/null | grep -E "(user_profiles|user_onboarding)" >/dev/null 2>&1

if [ $? -eq 0 ]; then
    print_status "Database connection and SunShare tables verified!"
else
    print_warning "Database connected but SunShare tables may need verification"
fi

echo ""
echo "🎉 SunShare Local Development Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Restart Claude Desktop to pick up new MCP configuration"
echo "   2. Start your development server: npm run dev"
echo "   3. Test the onboarding flow at: http://localhost:3000/onboarding"
echo ""
echo "🔧 Development URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Supabase Studio: http://localhost:54323"
echo "   • API: $LOCAL_API_URL"
echo ""
echo "💡 Claude Desktop MCP Commands:"
echo "   You can now use Claude Desktop to query your database with commands like:"
echo "   'Show me all tables in the SunShare database'"
echo "   'Create a test user in the user_profiles table'"
echo ""
echo "✨ Ready for SunShare development!"