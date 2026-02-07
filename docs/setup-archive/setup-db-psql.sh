#!/bin/bash
set -e

echo "🚀 Connecting to Supabase database with psql..."

# Extract project ID from URL
SUPABASE_URL="https://eiewhroiqnppkexgppxf.supabase.co"
PROJECT_ID="eiewhroiqnppkexgppxf"

# Construct connection string - try multiple formats
# Format: postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
DB_HOST1="db.${PROJECT_ID}.supabase.co"
DB_HOST2="${PROJECT_ID}.supabase.co"
DB_HOST3="aws-0-us-west-1.pooler.supabase.com"

echo "📍 Project ID: $PROJECT_ID"
echo "🔗 Will try multiple connection formats..."
echo ""
echo "⚠️  You need to replace [YOUR_DB_PASSWORD] with your actual database password from:"
echo "   Supabase Dashboard > Settings > Database > Connection string"
echo ""

# Check if password is provided as argument
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <database_password>"
    echo "Get your password from: https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf/settings/database"
    exit 1
fi

DB_PASSWORD="$1"

echo "🔐 Using provided password..."
echo "📁 Executing COMPLETE_SETUP.sql..."

# Try different connection formats
CONNECTION_STRINGS=(
    "postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_ID}.supabase.co:5432/postgres"
    "postgresql://postgres:${DB_PASSWORD}@${PROJECT_ID}.supabase.co:5432/postgres"
    "postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_ID}.supabase.co:6543/postgres"
)

for i in "${!CONNECTION_STRINGS[@]}"; do
    echo "🔗 Attempt $((i+1)): Testing connection..."
    if psql "${CONNECTION_STRINGS[$i]}" -c "SELECT 1;" 2>/dev/null; then
        echo "✅ Connection successful! Executing setup..."
        psql "${CONNECTION_STRINGS[$i]}" -f COMPLETE_SETUP.sql
        if [ $? -eq 0 ]; then
            echo "✅ Database setup completed successfully!"
            echo "🎯 Next: Create storage bucket and test the application"
            exit 0
        else
            echo "❌ SQL execution failed"
            exit 1
        fi
    else
        echo "❌ Connection attempt $((i+1)) failed"
    fi
done

echo "❌ All connection attempts failed"
echo "💡 You may need to check:"
echo "   1. Database password is correct"
echo "   2. IP is whitelisted in Network Restrictions"
echo "   3. Database is running and accessible"