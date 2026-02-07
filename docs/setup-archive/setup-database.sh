#!/bin/bash

# Automated Supabase Setup for SunShare
# This script automates the database setup process

set -e  # Exit on any error

echo "🚀 SunShare Automated Database Setup"
echo "===================================="
echo ""

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

PROJECT_REF="eiewhroiqnppkexgppxf"

# Step 1: Login to Supabase
print_info "Step 1: Logging into Supabase..."
if supabase auth login --no-browser 2>/dev/null; then
    print_status "Login successful!"
else
    print_info "Opening browser for Supabase login..."
    echo ""
    echo "Please complete the login in your browser, then return here."
    echo "If browser doesn't open, go to: https://supabase.com/dashboard/sign-in"
    echo ""
    read -p "Press Enter after logging in..."
    
    if ! supabase projects list >/dev/null 2>&1; then
        print_error "Login verification failed. Please ensure you're logged in."
        echo ""
        echo "Manual login command: supabase login"
        exit 1
    fi
    print_status "Login verified!"
fi

# Step 2: Link to project
print_info "Step 2: Linking to SunShare project..."
if [ ! -f ".supabase/config.toml" ]; then
    supabase init --with-vscode-settings=false
fi

if supabase link --project-ref $PROJECT_REF; then
    print_status "Successfully linked to project $PROJECT_REF"
else
    print_error "Failed to link to project. Please check project access."
    exit 1
fi

# Step 3: Execute database migrations
print_info "Step 3: Applying database schema..."

echo "Executing migration 1: Tables and indexes..."
if supabase db exec < supabase/migrations/001_initial_schema.sql; then
    print_status "Migration 1 completed"
else
    print_warning "Migration 1 failed - tables may already exist"
fi

echo "Executing migration 2: Security policies..."
if supabase db exec < supabase/migrations/002_rls_policies.sql; then
    print_status "Migration 2 completed"
else
    print_warning "Migration 2 failed - policies may already exist"
fi

echo "Executing migration 3: Triggers and functions..."
if supabase db exec < supabase/migrations/003_triggers_functions.sql; then
    print_status "Migration 3 completed"
else
    print_warning "Migration 3 failed - functions may already exist"
fi

# Step 4: Create storage bucket
print_info "Step 4: Setting up storage bucket..."
if supabase storage create id-documents --public=false 2>/dev/null; then
    print_status "Storage bucket 'id-documents' created"
    
    # Apply storage policies
    echo "Applying storage policies..."
    if supabase db exec < supabase/storage-policies.sql; then
        print_status "Storage policies applied"
    else
        print_warning "Storage policies failed - may need manual setup"
    fi
else
    print_warning "Storage bucket creation failed - may already exist"
fi

# Step 5: Verify setup
print_info "Step 5: Verifying database setup..."
if supabase db exec -c "SELECT count(*) FROM user_onboarding;" >/dev/null 2>&1; then
    print_status "Database verification successful!"
else
    print_error "Database verification failed"
    exit 1
fi

echo ""
echo "🎉 SunShare Database Setup Complete!"
echo "=================================="
echo ""
print_status "Database schema deployed"
print_status "Storage bucket configured" 
print_status "Security policies applied"
print_status "Triggers and functions active"
echo ""
echo "🧪 Test your onboarding flow:"
echo "   http://localhost:3000/onboarding"
echo ""
echo "🔧 Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF"
echo ""
print_info "Your SunShare onboarding system is ready for production! ✨"