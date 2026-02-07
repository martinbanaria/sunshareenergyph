#!/bin/bash

# SunShare Supabase Setup Script
# This script sets up the database schema and storage for the remote Supabase project

echo "🚀 Setting up SunShare Supabase project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Project configuration
PROJECT_REF="eiewhroiqnppkexgppxf"

# Check if user is logged into Supabase
print_info "Checking Supabase authentication..."
if ! supabase projects list >/dev/null 2>&1; then
    print_warning "Not logged into Supabase. Initiating login..."
    echo "This will open your browser for Supabase authentication..."
    echo "Please log in with your Supabase account that has access to project $PROJECT_REF"
    read -p "Press Enter to continue..."
    supabase login
    
    if [ $? -eq 0 ]; then
        print_status "Supabase login successful!"
    else
        print_error "Supabase login failed. Please try again."
        exit 1
    fi
else
    print_status "Already authenticated with Supabase"
fi

# Link to the remote project
print_info "Linking to remote Supabase project $PROJECT_REF..."
if [ ! -f ".supabase/config.toml" ]; then
    supabase init
fi

supabase link --project-ref $PROJECT_REF

if [ $? -eq 0 ]; then
    print_status "Successfully linked to remote project!"
else
    print_error "Failed to link to project. Please check your access permissions."
    exit 1
fi

# Deploy the database schema
print_info "Deploying database schema to remote project..."
if [ -f "supabase/schema.sql" ]; then
    # Create migration from schema file
    supabase db diff --local --file=initial_schema
    
    # Push to remote
    print_info "Pushing schema to remote database..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        print_status "Database schema deployed successfully!"
    else
        print_error "Failed to deploy schema. Trying alternative method..."
        # Alternative: Use SQL execution
        print_info "Attempting direct SQL execution..."
        cat supabase/schema.sql | supabase db exec
    fi
else
    print_error "Schema file not found at supabase/schema.sql"
    exit 1
fi

# Set up storage bucket
print_info "Setting up storage bucket 'id-documents'..."
echo "Creating storage bucket via CLI..."

# Create bucket using CLI
supabase storage create id-documents --public=false

if [ $? -eq 0 ]; then
    print_status "Storage bucket created successfully!"
    
    # Apply storage policies
    if [ -f "supabase/storage-policies.sql" ]; then
        print_info "Applying storage policies..."
        cat supabase/storage-policies.sql | supabase db exec
        
        if [ $? -eq 0 ]; then
            print_status "Storage policies applied successfully!"
        else
            print_warning "Storage policies may need to be applied manually"
        fi
    fi
else
    print_warning "Storage bucket creation failed or bucket already exists"
fi

echo ""
echo "🎉 SunShare Supabase setup complete!"
echo ""
echo "📋 What was configured:"
echo "   ✅ Database schema (tables, policies, triggers)"
echo "   ✅ Storage bucket 'id-documents' (private)"
echo "   ✅ Row Level Security policies"
echo "   ✅ Storage access policies"
echo ""
echo "🧪 Test your onboarding flow at: http://localhost:3000/onboarding"
echo ""
echo "🔧 If any step failed, you can set up manually:"
echo "   1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "   2. SQL Editor > New Query > Paste contents of supabase/schema.sql > Run"
echo "   3. Storage > New Bucket > Name: 'id-documents', Private, 10MB limit"
echo "   4. SQL Editor > New Query > Paste contents of supabase/storage-policies.sql > Run"
echo ""
echo "✨ Your SunShare onboarding system is now ready!"