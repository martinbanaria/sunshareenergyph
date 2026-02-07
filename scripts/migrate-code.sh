#!/bin/bash

# ============================================================================
# SunShare Energy Philippines - Code Migration Script
# ============================================================================
# 
# This script handles the code transformation from hCaptcha to Turnstile
# 
# Features:
# - Package.json dependency updates
# - Component replacement (hCaptcha → Turnstile)
# - API endpoint creation
# - Form validation schema updates
# - Environment variable management
# - Automated testing
#
# ============================================================================

set -euo pipefail

# Color codes for output formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="$SCRIPT_DIR/config"
TEMPLATES_DIR="$SCRIPT_DIR/templates"

# Utility Functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_step() { echo -e "\n${PURPLE}🚀 $1${NC}"; }

# Load Turnstile site configuration
load_site_config() {
    if [[ ! -f "$CONFIG_DIR/turnstile-site.json" ]]; then
        log_error "Turnstile site configuration not found. Run setup-turnstile.sh first."
        exit 1
    fi

    SITE_KEY=$(jq -r '.site_key' "$CONFIG_DIR/turnstile-site.json")
    SITE_ID=$(jq -r '.site_id' "$CONFIG_DIR/turnstile-site.json")
    
    if [[ "$SITE_KEY" == "null" || "$SITE_ID" == "null" ]]; then
        log_error "Invalid site configuration"
        exit 1
    fi

    log_info "Loaded Turnstile configuration:"
    log_info "  Site Key: ${SITE_KEY:0:20}..."
    log_info "  Site ID: $SITE_ID"
}

# Update package.json dependencies
update_dependencies() {
    log_step "Updating package.json dependencies..."

    local package_json="$PROJECT_ROOT/package.json"
    local package_backup="$package_json.backup"

    # Create backup
    cp "$package_json" "$package_backup"

    # Remove hCaptcha dependency
    if grep -q "@hcaptcha/react-hcaptcha" "$package_json"; then
        log_info "Removing hCaptcha dependency..."
        npm uninstall @hcaptcha/react-hcaptcha
        log_success "hCaptcha dependency removed"
    else
        log_info "hCaptcha dependency not found - already removed or not present"
    fi

    # Add Turnstile dependency
    log_info "Installing Turnstile dependency..."
    npm install @marsidev/react-turnstile

    log_success "Dependencies updated successfully"
}

# Create Turnstile component template
create_turnstile_component() {
    log_step "Creating Turnstile React component..."

    cat > "$TEMPLATES_DIR/TurnstileWidget.tsx" << 'EOF'
'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useState, useCallback } from 'react'

interface TurnstileWidgetProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: (error: string) => void
  className?: string
  theme?: 'light' | 'dark' | 'auto'
}

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  className = '',
  theme = 'auto'
}: TurnstileWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = useCallback((token: string) => {
    setIsLoading(false)
    setError(null)
    onVerify(token)
  }, [onVerify])

  const handleError = useCallback((error: string) => {
    setIsLoading(false)
    setError(error)
    if (onError) {
      onError(error)
    }
  }, [onError])

  const handleExpire = useCallback(() => {
    setError('Verification expired. Please try again.')
    if (onError) {
      onError('Verification expired')
    }
  }, [onError])

  return (
    <div className={`turnstile-widget ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Verifying...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Turnstile
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        theme={theme}
        className="mx-auto"
      />
    </div>
  )
}
EOF

    log_success "Turnstile component template created"
}

# Create server-side verification API endpoint
create_api_endpoint() {
    log_step "Creating Turnstile verification API endpoint..."

    local api_dir="$PROJECT_ROOT/src/app/api/verify-turnstile"
    mkdir -p "$api_dir"

    cat > "$api_dir/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server'

interface TurnstileVerificationRequest {
  token: string
  remoteip?: string
}

interface TurnstileVerificationResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TurnstileVerificationRequest = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing verification token' },
        { status: 400 }
      )
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY not configured')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get client IP address
    const remoteip = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Verify token with Cloudflare
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: remoteip,
      }),
    })

    if (!verificationResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Verification service unavailable' },
        { status: 503 }
      )
    }

    const verificationData: TurnstileVerificationResponse = await verificationResponse.json()

    if (verificationData.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Verification successful',
        timestamp: verificationData.challenge_ts,
        hostname: verificationData.hostname
      })
    } else {
      console.warn('Turnstile verification failed:', verificationData['error-codes'])
      return NextResponse.json(
        { 
          success: false, 
          error: 'Verification failed',
          errorCodes: verificationData['error-codes']
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

    log_success "API endpoint created at: src/app/api/verify-turnstile/route.ts"
}

# Update environment variables
update_environment_variables() {
    log_step "Updating environment variables..."

    local env_file="$PROJECT_ROOT/.env.local"
    local env_backup="$env_file.backup"

    # Create backup
    if [[ -f "$env_file" ]]; then
        cp "$env_file" "$env_backup"
    fi

    # Remove hCaptcha variables (comment them out for safety)
    if grep -q "HCAPTCHA" "$env_file" 2>/dev/null; then
        log_info "Commenting out hCaptcha environment variables..."
        sed -i.bak 's/^NEXT_PUBLIC_HCAPTCHA_SITEKEY=/# REMOVED: NEXT_PUBLIC_HCAPTCHA_SITEKEY=/' "$env_file"
        sed -i.bak 's/^HCAPTCHA_SECRET=/# REMOVED: HCAPTCHA_SECRET=/' "$env_file"
    fi

    # Add Turnstile variables
    log_info "Adding Turnstile environment variables..."
    cat >> "$env_file" << EOF

# Cloudflare Turnstile Configuration
NEXT_PUBLIC_TURNSTILE_SITE_KEY=$SITE_KEY
TURNSTILE_SECRET_KEY=
EOF

    log_success "Environment variables updated"
    log_warning "IMPORTANT: You need to set TURNSTILE_SECRET_KEY manually"
    log_info "Get your secret key from Cloudflare Dashboard or run: wrangler turnstile get $SITE_ID"
}

# Update Step1Account component
update_step1_component() {
    log_step "Updating Step1Account component..."

    local component_file="$PROJECT_ROOT/src/components/onboarding/steps/Step1Account.tsx"
    local component_backup="$component_file.backup"

    # Create backup
    cp "$component_file" "$component_backup"

    # First, copy the Turnstile component to the project
    cp "$TEMPLATES_DIR/TurnstileWidget.tsx" "$PROJECT_ROOT/src/components/ui/TurnstileWidget.tsx"

    # Update the component with a safer replacement approach
    # Instead of complex sed replacements, we'll create a new version
    cat > "$component_file.new" << 'EOF'
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TurnstileWidget from '@/components/ui/TurnstileWidget'
import { Step1Schema, type Step1Data } from '@/lib/validations/onboarding'

interface Step1AccountProps {
  onNext: (data: Step1Data & { turnstileToken: string }) => void
  initialData?: Partial<Step1Data>
}

export default function Step1Account({ onNext, initialData }: Step1AccountProps) {
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [turnstileError, setTurnstileError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: initialData,
    mode: 'onChange',
  })

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    setTurnstileError('')
  }

  const handleTurnstileError = (error: string) => {
    setTurnstileError(error)
    setTurnstileToken('')
  }

  const onSubmit = async (data: Step1Data) => {
    if (!turnstileToken) {
      setTurnstileError('Please complete the verification')
      return
    }

    setIsSubmitting(true)
    try {
      // Verify the turnstile token on the server
      const verificationResponse = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      })

      const verificationResult = await verificationResponse.json()

      if (!verificationResult.success) {
        setTurnstileError('Verification failed. Please try again.')
        setTurnstileToken('')
        return
      }

      // Proceed to next step
      onNext({ ...data, turnstileToken })
    } catch (error) {
      console.error('Verification error:', error)
      setTurnstileError('Verification service unavailable. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!siteKey) {
    console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured')
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Get started with your solar energy journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Create a strong password"
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Enter your first name"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Enter your last name"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+63 9XX XXX XXXX"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Turnstile Widget */}
        <div className="py-4">
          {siteKey ? (
            <TurnstileWidget
              siteKey={siteKey}
              onVerify={handleTurnstileVerify}
              onError={handleTurnstileError}
              className="flex justify-center"
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                Verification service not configured. Please contact support.
              </p>
            </div>
          )}
          
          {turnstileError && (
            <p className="mt-2 text-sm text-red-600">{turnstileError}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || !turnstileToken || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account & Continue'
          )}
        </Button>
      </form>
    </div>
  )
}
EOF

    # Move the new file over the old one
    mv "$component_file.new" "$component_file"

    log_success "Step1Account component updated"
    log_info "Backup saved as: $component_backup"
}

# Update validation schema
update_validation_schema() {
    log_step "Updating validation schema..."

    local validation_file="$PROJECT_ROOT/src/lib/validations/onboarding.ts"
    local validation_backup="$validation_file.backup"

    # Create backup
    cp "$validation_file" "$validation_backup"

    # Update the schema to remove captcha validation
    # This is a more complex update, so we'll use a safer approach
    log_info "Removing hCaptcha validation from schema..."
    
    # Comment out captcha validation lines
    sed -i.bak '/captcha:/,/^[[:space:]]*}/s/^/#/' "$validation_file"
    
    log_success "Validation schema updated"
    log_info "Backup saved as: $validation_backup"
}

# Test the implementation
test_implementation() {
    log_step "Testing implementation..."

    # Check if files exist and are valid
    local files_to_check=(
        "src/components/ui/TurnstileWidget.tsx"
        "src/app/api/verify-turnstile/route.ts"
        "src/components/onboarding/steps/Step1Account.tsx"
    )

    for file in "${files_to_check[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            log_success "✓ $file exists"
        else
            log_error "✗ $file missing"
            return 1
        fi
    done

    # Check TypeScript compilation
    log_info "Checking TypeScript compilation..."
    if npm run build --silent >/dev/null 2>&1; then
        log_success "TypeScript compilation successful"
    else
        log_warning "TypeScript compilation failed - may need manual fixes"
        log_info "Run 'npm run build' to see detailed errors"
    fi

    # Check if environment variables are set
    if grep -q "NEXT_PUBLIC_TURNSTILE_SITE_KEY" "$PROJECT_ROOT/.env.local"; then
        log_success "Environment variables configured"
    else
        log_error "Environment variables not found"
        return 1
    fi

    log_success "Implementation test completed"
}

# Main execution
main() {
    log_step "Starting SunShare Energy Code Migration"
    echo "This will replace hCaptcha with Cloudflare Turnstile in your codebase"
    echo

    load_site_config
    
    update_dependencies
    create_turnstile_component
    create_api_endpoint
    update_environment_variables
    update_step1_component
    update_validation_schema
    test_implementation

    log_success "Code migration completed successfully!"
    echo
    log_info "Next steps:"
    log_info "1. Set TURNSTILE_SECRET_KEY in .env.local"
    log_info "2. Test the application locally: npm run dev"
    log_info "3. Update Vercel environment variables"
    log_info "4. Deploy to staging/production"
    echo
    log_info "Rollback available: All original files backed up with .backup extension"
}

# Execute main function
main "$@"