#!/bin/bash

# ============================================================================
# SunShare Energy Philippines - Turnstile Rollback Script
# ============================================================================
# 
# This script provides emergency rollback capability to restore hCaptcha
# 
# Features:
# - Restore original hCaptcha implementation
# - Rollback environment variables
# - Restore package.json dependencies
# - Git rollback capabilities
# - Vercel deployment rollback
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
BACKUP_DIR="$PROJECT_ROOT/.turnstile-backup"

# Default values
IMMEDIATE_ROLLBACK=false
RESTORE_BACKUP_ID=""
DRY_RUN=false
VERBOSE=false
SKIP_DEPLOY=false

# Utility Functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_step() { echo -e "\n${PURPLE}🔄 $1${NC}"; }

show_help() {
    cat << EOF
SunShare Energy Philippines - Turnstile Rollback Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --help                  Show this help message
    --immediate             Perform immediate rollback without confirmation
    --backup-id ID          Restore specific backup by ID
    --dry-run               Show what would be done without making changes
    --verbose               Enable verbose logging
    --skip-deploy           Skip Vercel deployment after rollback

EXAMPLES:
    # Interactive rollback
    $0

    # Immediate rollback to latest backup
    $0 --immediate

    # Restore specific backup
    $0 --backup-id 20241207_143022

    # Dry run to see rollback plan
    $0 --dry-run

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --immediate)
                IMMEDIATE_ROLLBACK=true
                shift
                ;;
            --backup-id)
                RESTORE_BACKUP_ID="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --skip-deploy)
                SKIP_DEPLOY=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

check_backup_availability() {
    log_step "Checking backup availability..."

    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_error "No backup directory found at: $BACKUP_DIR"
        log_error "Cannot perform rollback without backups"
        exit 1
    fi

    local backup_count
    backup_count=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "202*" | wc -l)

    if [[ $backup_count -eq 0 ]]; then
        log_error "No backups found in backup directory"
        exit 1
    fi

    log_success "Found $backup_count backup(s) available"

    # List available backups
    log_info "Available backups:"
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "202*" | sort | while read -r backup_path; do
        local backup_id
        backup_id=$(basename "$backup_path")
        if [[ -f "$backup_path/backup_info.json" ]]; then
            local backup_reason
            backup_reason=$(jq -r '.backup_reason' "$backup_path/backup_info.json" 2>/dev/null || echo "Unknown")
            log_info "  $backup_id - $backup_reason"
        else
            log_info "  $backup_id"
        fi
    done
}

select_backup() {
    if [[ -n "$RESTORE_BACKUP_ID" ]]; then
        SELECTED_BACKUP="$BACKUP_DIR/$RESTORE_BACKUP_ID"
        if [[ ! -d "$SELECTED_BACKUP" ]]; then
            log_error "Backup not found: $RESTORE_BACKUP_ID"
            exit 1
        fi
        log_info "Using specified backup: $RESTORE_BACKUP_ID"
        return
    fi

    if [[ -f "$BACKUP_DIR/latest_backup.txt" ]]; then
        SELECTED_BACKUP=$(cat "$BACKUP_DIR/latest_backup.txt")
        log_info "Using latest backup: $(basename "$SELECTED_BACKUP")"
    else
        # Find the most recent backup
        SELECTED_BACKUP=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "202*" | sort | tail -1)
        if [[ -z "$SELECTED_BACKUP" ]]; then
            log_error "No suitable backup found"
            exit 1
        fi
        log_info "Using most recent backup: $(basename "$SELECTED_BACKUP")"
    fi

    if [[ ! -d "$SELECTED_BACKUP" ]]; then
        log_error "Selected backup directory not found: $SELECTED_BACKUP"
        exit 1
    fi
}

confirm_rollback() {
    if [[ "$IMMEDIATE_ROLLBACK" == "true" ]]; then
        return
    fi

    log_step "Rollback confirmation"
    echo
    log_warning "You are about to rollback from Cloudflare Turnstile to hCaptcha"
    log_info "This will:"
    log_info "  • Restore original hCaptcha components"
    log_info "  • Restore hCaptcha environment variables"
    log_info "  • Remove Turnstile dependencies"
    log_info "  • Revert package.json changes"
    log_info "  • Rollback Vercel deployment"
    echo
    log_info "Using backup: $(basename "$SELECTED_BACKUP")"
    
    if [[ -f "$SELECTED_BACKUP/backup_info.json" ]]; then
        local backup_timestamp backup_reason
        backup_timestamp=$(jq -r '.timestamp' "$SELECTED_BACKUP/backup_info.json" 2>/dev/null || echo "Unknown")
        backup_reason=$(jq -r '.backup_reason' "$SELECTED_BACKUP/backup_info.json" 2>/dev/null || echo "Unknown")
        log_info "Backup created: $backup_timestamp"
        log_info "Backup reason: $backup_reason"
    fi

    echo
    read -p "Do you want to proceed with the rollback? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Rollback cancelled by user"
        exit 0
    fi
}

restore_files() {
    log_step "Restoring files from backup..."

    local files_to_restore=(
        "package.json"
        "src/components/onboarding/steps/Step1Account.tsx"
        "src/lib/validations/onboarding.ts"
        ".env.local"
    )

    for file in "${files_to_restore[@]}"; do
        local source_file="$SELECTED_BACKUP/$file"
        local target_file="$PROJECT_ROOT/$file"

        if [[ -f "$source_file" ]]; then
            if [[ "$DRY_RUN" == "true" ]]; then
                log_info "[DRY RUN] Would restore: $file"
            else
                # Create backup of current state before restoring
                if [[ -f "$target_file" ]]; then
                    cp "$target_file" "$target_file.pre-rollback"
                fi
                
                # Restore the file
                mkdir -p "$(dirname "$target_file")"
                cp "$source_file" "$target_file"
                log_success "Restored: $file"
            fi
        else
            log_warning "Backup file not found: $file (skipping)"
        fi
    done
}

remove_turnstile_files() {
    log_step "Removing Turnstile-specific files..."

    local files_to_remove=(
        "src/components/ui/TurnstileWidget.tsx"
        "src/app/api/verify-turnstile"
        "scripts/config/turnstile-site.json"
    )

    for file in "${files_to_remove[@]}"; do
        local target_path="$PROJECT_ROOT/$file"
        
        if [[ -e "$target_path" ]]; then
            if [[ "$DRY_RUN" == "true" ]]; then
                log_info "[DRY RUN] Would remove: $file"
            else
                rm -rf "$target_path"
                log_success "Removed: $file"
            fi
        else
            log_info "File not found (already removed): $file"
        fi
    done
}

restore_dependencies() {
    log_step "Restoring package dependencies..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would restore hCaptcha and remove Turnstile dependencies"
        return
    fi

    # Remove Turnstile dependency
    if npm list @marsidev/react-turnstile >/dev/null 2>&1; then
        log_info "Removing Turnstile dependency..."
        npm uninstall @marsidev/react-turnstile
    fi

    # Restore hCaptcha dependency
    log_info "Restoring hCaptcha dependency..."
    npm install @hcaptcha/react-hcaptcha@^2.0.1

    log_success "Dependencies restored"
}

restore_environment_variables() {
    log_step "Restoring environment variables..."

    local env_file="$PROJECT_ROOT/.env.local"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would restore hCaptcha environment variables"
        return
    fi

    # Comment out Turnstile variables
    if grep -q "TURNSTILE" "$env_file" 2>/dev/null; then
        log_info "Commenting out Turnstile environment variables..."
        sed -i.rollback 's/^NEXT_PUBLIC_TURNSTILE_SITE_KEY=/# ROLLBACK: NEXT_PUBLIC_TURNSTILE_SITE_KEY=/' "$env_file"
        sed -i.rollback 's/^TURNSTILE_SECRET_KEY=/# ROLLBACK: TURNSTILE_SECRET_KEY=/' "$env_file"
    fi

    # Restore hCaptcha variables (uncomment if they were commented)
    if grep -q "# REMOVED: NEXT_PUBLIC_HCAPTCHA_SITEKEY=" "$env_file" 2>/dev/null; then
        log_info "Restoring hCaptcha environment variables..."
        sed -i.rollback 's/# REMOVED: NEXT_PUBLIC_HCAPTCHA_SITEKEY=/NEXT_PUBLIC_HCAPTCHA_SITEKEY=/' "$env_file"
        sed -i.rollback 's/# REMOVED: HCAPTCHA_SECRET=/HCAPTCHA_SECRET=/' "$env_file"
    fi

    log_success "Environment variables restored"
}

rollback_vercel_env_vars() {
    log_step "Rolling back Vercel environment variables..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would rollback Vercel environment variables"
        return
    fi

    if ! command -v vercel >/dev/null 2>&1; then
        log_warning "Vercel CLI not found - skipping Vercel environment rollback"
        log_info "Please manually restore hCaptcha variables in Vercel dashboard"
        return
    fi

    local environments=("development" "preview" "production")

    for env in "${environments[@]}"; do
        log_info "Rolling back $env environment variables..."
        
        # Remove Turnstile variables
        vercel env rm NEXT_PUBLIC_TURNSTILE_SITE_KEY "$env" --yes 2>/dev/null || true
        vercel env rm TURNSTILE_SECRET_KEY "$env" --yes 2>/dev/null || true
        
        log_success "Rolled back $env environment"
    done

    log_warning "Important: You need to manually restore hCaptcha environment variables in Vercel"
    log_info "Add these variables to Vercel:"
    log_info "  NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_hcaptcha_site_key"
    log_info "  HCAPTCHA_SECRET=your_hcaptcha_secret"
}

test_rollback() {
    log_step "Testing rollback..."

    # Test TypeScript compilation
    log_info "Testing TypeScript compilation..."
    if npm run build >/dev/null 2>&1; then
        log_success "TypeScript compilation successful"
    else
        log_error "TypeScript compilation failed"
        log_info "Run 'npm run build' to see detailed errors"
    fi

    # Check for hCaptcha dependency
    if npm list @hcaptcha/react-hcaptcha >/dev/null 2>&1; then
        log_success "hCaptcha dependency restored"
    else
        log_error "hCaptcha dependency not found"
    fi

    # Check for Turnstile dependency (should be removed)
    if npm list @marsidev/react-turnstile >/dev/null 2>&1; then
        log_warning "Turnstile dependency still present"
    else
        log_success "Turnstile dependency removed"
    fi

    log_success "Rollback testing completed"
}

deploy_rollback() {
    if [[ "$SKIP_DEPLOY" == "true" ]]; then
        log_info "Skipping deployment as requested"
        return
    fi

    log_step "Deploying rollback to Vercel..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy rollback to Vercel preview"
        return
    fi

    if ! command -v vercel >/dev/null 2>&1; then
        log_warning "Vercel CLI not found - skipping deployment"
        log_info "Please manually deploy the rollback"
        return
    fi

    # Deploy to preview first
    log_info "Deploying to preview environment..."
    vercel --target preview

    log_success "Rollback deployed to preview environment"
    log_warning "Review the preview deployment before deploying to production"
}

create_rollback_report() {
    log_step "Creating rollback report..."

    local report_file="$PROJECT_ROOT/rollback_report_$(date +%Y%m%d_%H%M%S).md"

    cat > "$report_file" << EOF
# SunShare Energy Philippines - Turnstile Rollback Report

## Rollback Summary

- **Date**: $(date)
- **Backup Used**: $(basename "$SELECTED_BACKUP")
- **Reason**: Emergency rollback from Turnstile to hCaptcha

## Actions Taken

### 🔄 Restored Components
- ✅ Step1Account component with hCaptcha
- ✅ Original validation schema
- ✅ Package.json dependencies
- ✅ Environment variables

### 🗑️ Removed Files
- ❌ TurnstileWidget component
- ❌ /api/verify-turnstile endpoint
- ❌ Turnstile configuration files

### 📦 Dependencies
- ✅ Restored: @hcaptcha/react-hcaptcha
- ❌ Removed: @marsidev/react-turnstile

### ⚠️ Manual Actions Required

1. **Vercel Environment Variables**
   - Add NEXT_PUBLIC_HCAPTCHA_SITEKEY
   - Add HCAPTCHA_SECRET
   - Remove NEXT_PUBLIC_TURNSTILE_SITE_KEY (if not already removed)
   - Remove TURNSTILE_SECRET_KEY (if not already removed)

2. **Production Deployment**
   - Review preview deployment
   - Deploy to production when ready

### 🔄 Re-migration Path

If you want to migrate back to Turnstile later:
\`\`\`bash
./scripts/setup-turnstile.sh
./scripts/migrate-code.sh
./scripts/deploy-turnstile.sh
\`\`\`

---
*Generated by SunShare Energy Turnstile Rollback Script*
EOF

    log_success "Rollback report generated: $report_file"
}

commit_rollback() {
    log_step "Committing rollback to Git..."

    # Check if there are changes to commit
    if git diff --quiet && git diff --staged --quiet; then
        log_info "No changes to commit"
        return
    fi

    local commit_message="revert: rollback from Cloudflare Turnstile to hCaptcha

- Restore original hCaptcha implementation
- Remove Turnstile dependencies and components
- Restore backup from $(basename "$SELECTED_BACKUP")
- Emergency rollback for stability

Rollback performed: $(date)
"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would commit rollback changes"
        return
    fi

    # Add all changes
    git add .

    # Commit
    git commit -m "$commit_message"

    log_success "Rollback committed to Git"
}

main() {
    log_step "Starting SunShare Energy Turnstile Rollback"
    echo "This script will rollback from Cloudflare Turnstile to hCaptcha"
    echo

    parse_arguments "$@"
    
    check_backup_availability
    select_backup
    confirm_rollback
    
    restore_files
    remove_turnstile_files
    restore_dependencies
    restore_environment_variables
    rollback_vercel_env_vars
    
    test_rollback
    deploy_rollback
    create_rollback_report
    commit_rollback

    log_success "🔄 Turnstile rollback completed successfully!"
    echo
    log_info "Your SunShare Energy application has been rolled back to hCaptcha"
    log_warning "Manual actions required:"
    log_info "  • Restore hCaptcha environment variables in Vercel"
    log_info "  • Deploy to production when ready"
    log_info "  • Update team about the rollback"
}

main "$@"