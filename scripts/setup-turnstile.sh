#!/bin/bash

# ============================================================================
# SunShare Energy Philippines - Cloudflare Turnstile Migration Script
# ============================================================================
# 
# This script automates the complete migration from hCaptcha to Cloudflare Turnstile
# 
# Features:
# - Cloudflare account setup and authentication
# - Turnstile site creation and configuration
# - Environment variables management (local + Vercel)
# - Automatic code replacement (hCaptcha → Turnstile)
# - Testing and validation
# - Deployment automation
# - Rollback capabilities
#
# Usage:
#   ./scripts/setup-turnstile.sh                           # Interactive setup
#   ./scripts/setup-turnstile.sh --auto --env production   # Automated production
#   ./scripts/setup-turnstile.sh --help                    # Show help
#
# ============================================================================

set -euo pipefail  # Exit on any error, undefined variable, or pipe failure

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
UTILS_DIR="$SCRIPT_DIR/utils"
BACKUP_DIR="$PROJECT_ROOT/.turnstile-backup"

# Default values
ENVIRONMENT="development"
SITE_NAME="SunShare Energy Philippines"
AUTO_MODE=false
DRY_RUN=false
VERBOSE=false
SKIP_BACKUP=false
CLOUDFLARE_EMAIL=""
DOMAINS=""

# ============================================================================
# Utility Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_step() {
    echo -e "\n${PURPLE}🚀 $1${NC}"
}

log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}🔍${NC} $1"
    fi
}

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

cleanup() {
    log_info "Cleaning up temporary files..."
    # Add cleanup logic here if needed
}

trap cleanup EXIT

# ============================================================================
# Help and Usage
# ============================================================================

show_help() {
    cat << EOF
SunShare Energy Philippines - Cloudflare Turnstile Migration Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --help                  Show this help message
    --auto                  Run in automatic mode (non-interactive)
    --environment ENV       Set environment (development|staging|production)
    --email EMAIL           Cloudflare account email
    --domains DOMAINS       Comma-separated list of domains
    --site-name NAME        Turnstile site name (default: "$SITE_NAME")
    --dry-run              Show what would be done without making changes
    --verbose              Enable verbose logging
    --skip-backup          Skip backup creation (not recommended)

EXAMPLES:
    # Interactive setup
    $0

    # Automated production deployment
    $0 --auto --environment production --email admin@sunshareenergy.ph --domains "sunshareenergy.ph,www.sunshareenergy.ph"

    # Development setup with verbose logging
    $0 --environment development --verbose

    # Dry run to see what would be changed
    $0 --dry-run --environment staging

ENVIRONMENT VARIABLES:
    CLOUDFLARE_API_TOKEN    Cloudflare API token (optional, will prompt if not set)
    VERCEL_TOKEN           Vercel API token (optional, will prompt if not set)

EOF
}

# ============================================================================
# Command Line Argument Parsing
# ============================================================================

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --auto)
                AUTO_MODE=true
                shift
                ;;
            --environment|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --email)
                CLOUDFLARE_EMAIL="$2"
                shift 2
                ;;
            --domains)
                DOMAINS="$2"
                shift 2
                ;;
            --site-name)
                SITE_NAME="$2"
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
            --skip-backup)
                SKIP_BACKUP=true
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

# ============================================================================
# Pre-flight Checks
# ============================================================================

check_dependencies() {
    log_step "Checking dependencies..."

    local deps=(
        "node:Node.js"
        "npm:NPM"
        "git:Git"
        "curl:cURL"
        "jq:jq"
    )

    for dep in "${deps[@]}"; do
        local cmd="${dep%%:*}"
        local name="${dep##*:}"
        
        if command -v "$cmd" >/dev/null 2>&1; then
            log_verbose "$name: $(which $cmd)"
        else
            log_error "$name is required but not installed"
            exit 1
        fi
    done

    log_success "All dependencies are available"
}

check_project_structure() {
    log_step "Validating project structure..."

    local required_files=(
        "package.json"
        "src/components/onboarding/steps/Step1Account.tsx"
        "src/lib/validations/onboarding.ts"
        ".env.local"
    )

    for file in "${required_files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            log_verbose "Found: $file"
        else
            log_error "Required file not found: $file"
            exit 1
        fi
    done

    log_success "Project structure is valid"
}

check_current_captcha() {
    log_step "Analyzing current CAPTCHA implementation..."

    if grep -q "hcaptcha" "$PROJECT_ROOT/package.json"; then
        log_info "Found hCaptcha dependency in package.json"
    else
        log_warning "hCaptcha dependency not found - may already be removed"
    fi

    if grep -q "HCaptcha" "$PROJECT_ROOT/src/components/onboarding/steps/Step1Account.tsx"; then
        log_info "Found hCaptcha component usage"
    else
        log_warning "hCaptcha component not found - may already be replaced"
    fi

    if grep -q "HCAPTCHA" "$PROJECT_ROOT/.env.local"; then
        log_info "Found hCaptcha environment variables"
    else
        log_warning "hCaptcha environment variables not found"
    fi
}

# ============================================================================
# Interactive Configuration
# ============================================================================

interactive_config() {
    if [[ "$AUTO_MODE" == "true" ]]; then
        return
    fi

    log_step "Interactive Configuration"
    echo

    # Environment selection
    if [[ -z "$ENVIRONMENT" ]]; then
        echo "Select deployment environment:"
        echo "1) development (localhost + Vercel preview)"
        echo "2) staging (staging domain)"
        echo "3) production (live domain)"
        read -p "Choice [1]: " env_choice
        case ${env_choice:-1} in
            1) ENVIRONMENT="development" ;;
            2) ENVIRONMENT="staging" ;;
            3) ENVIRONMENT="production" ;;
            *) log_error "Invalid choice"; exit 1 ;;
        esac
    fi

    # Cloudflare email
    if [[ -z "$CLOUDFLARE_EMAIL" ]]; then
        read -p "Cloudflare account email: " CLOUDFLARE_EMAIL
        if [[ -z "$CLOUDFLARE_EMAIL" ]]; then
            log_error "Cloudflare email is required"
            exit 1
        fi
    fi

    # Domains configuration
    if [[ -z "$DOMAINS" ]]; then
        case $ENVIRONMENT in
            development)
                DOMAINS="localhost:3000"
                ;;
            staging)
                read -p "Staging domain (e.g., staging.sunshareenergy.ph): " staging_domain
                DOMAINS="$staging_domain"
                ;;
            production)
                read -p "Production domain (e.g., sunshareenergy.ph): " prod_domain
                DOMAINS="$prod_domain"
                ;;
        esac
    fi

    # Confirmation
    echo
    log_info "Configuration Summary:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Site Name: $SITE_NAME"
    echo "  Cloudflare Email: $CLOUDFLARE_EMAIL"
    echo "  Domains: $DOMAINS"
    echo
    read -p "Proceed with this configuration? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Migration cancelled by user"
        exit 0
    fi
}

# ============================================================================
# Backup Functions
# ============================================================================

create_backup() {
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        log_info "Skipping backup creation"
        return
    fi

    log_step "Creating backup of current implementation..."

    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/$timestamp"
    
    mkdir -p "$backup_path"

    # Backup critical files
    local files_to_backup=(
        "package.json"
        "src/components/onboarding/steps/Step1Account.tsx"
        "src/lib/validations/onboarding.ts"
        ".env.local"
    )

    for file in "${files_to_backup[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            local backup_file="$backup_path/$file"
            mkdir -p "$(dirname "$backup_file")"
            cp "$PROJECT_ROOT/$file" "$backup_file"
            log_verbose "Backed up: $file"
        fi
    done

    # Save current git state
    git rev-parse HEAD > "$backup_path/git_commit.txt" 2>/dev/null || echo "No git repository" > "$backup_path/git_commit.txt"

    # Save backup metadata
    cat > "$backup_path/backup_info.json" << EOF
{
    "timestamp": "$timestamp",
    "environment": "$ENVIRONMENT",
    "backup_reason": "Pre-Turnstile migration",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "script_version": "1.0.0"
}
EOF

    log_success "Backup created at: $backup_path"
    echo "$backup_path" > "$BACKUP_DIR/latest_backup.txt"
}

# ============================================================================
# Cloudflare Setup Functions
# ============================================================================

install_wrangler() {
    log_step "Installing/updating Cloudflare Wrangler CLI..."

    if command -v wrangler >/dev/null 2>&1; then
        log_info "Wrangler CLI already installed: $(wrangler --version)"
        read -p "Update to latest version? [y/N]: " update_wrangler
        if [[ "$update_wrangler" =~ ^[Yy]$ ]]; then
            npm install -g wrangler@latest
        fi
    else
        log_info "Installing Wrangler CLI..."
        npm install -g wrangler
    fi

    log_success "Wrangler CLI is ready"
}

authenticate_cloudflare() {
    log_step "Authenticating with Cloudflare..."

    # Check if already authenticated
    if wrangler whoami >/dev/null 2>&1; then
        local current_user=$(wrangler whoami | grep -o '[^ ]*@[^ ]*' | head -1)
        if [[ "$current_user" == "$CLOUDFLARE_EMAIL" ]]; then
            log_info "Already authenticated as: $current_user"
            return
        else
            log_warning "Currently authenticated as: $current_user"
            log_info "Need to re-authenticate as: $CLOUDFLARE_EMAIL"
        fi
    fi

    # Authentication process
    if [[ "$AUTO_MODE" == "true" ]]; then
        if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
            log_error "CLOUDFLARE_API_TOKEN environment variable required for auto mode"
            exit 1
        fi
        wrangler auth api-token "$CLOUDFLARE_API_TOKEN"
    else
        log_info "Opening Cloudflare authentication in browser..."
        wrangler login
    fi

    # Verify authentication
    local auth_user=$(wrangler whoami | grep -o '[^ ]*@[^ ]*' | head -1)
    if [[ "$auth_user" != "$CLOUDFLARE_EMAIL" ]]; then
        log_error "Authentication failed or wrong account. Expected: $CLOUDFLARE_EMAIL, Got: $auth_user"
        exit 1
    fi

    log_success "Authenticated with Cloudflare as: $auth_user"
}

create_turnstile_site() {
    log_step "Creating Cloudflare Turnstile site..."

    local domains_array
    IFS=',' read -ra domains_array <<< "$DOMAINS"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would create Turnstile site with:"
        log_info "  Name: $SITE_NAME"
        log_info "  Domains: ${domains_array[*]}"
        return
    fi

    # Create the site
    log_info "Creating site: $SITE_NAME"
    local create_output
    create_output=$(wrangler turnstile create --name "$SITE_NAME" --domain "${domains_array[0]}" --json 2>&1)
    
    if [[ $? -ne 0 ]]; then
        log_error "Failed to create Turnstile site: $create_output"
        exit 1
    fi

    # Parse the site information
    local site_id=$(echo "$create_output" | jq -r '.id')
    local site_key=$(echo "$create_output" | jq -r '.sitekey')

    if [[ "$site_id" == "null" || "$site_key" == "null" ]]; then
        log_error "Failed to parse site creation response"
        exit 1
    fi

    # Add additional domains if provided
    if [[ ${#domains_array[@]} -gt 1 ]]; then
        log_info "Adding additional domains..."
        for domain in "${domains_array[@]:1}"; do
            log_verbose "Adding domain: $domain"
            wrangler turnstile domain add "$site_id" "$domain"
        done
    fi

    # Save site configuration
    cat > "$CONFIG_DIR/turnstile-site.json" << EOF
{
    "site_id": "$site_id",
    "site_key": "$site_key",
    "site_name": "$SITE_NAME",
    "domains": [$(printf '"%s",' "${domains_array[@]}" | sed 's/,$//')]
}
EOF

    log_success "Turnstile site created successfully"
    log_info "Site ID: $site_id"
    log_info "Site Key: $site_key"
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    log_step "Starting SunShare Energy Turnstile Migration"
    echo "This script will migrate your application from hCaptcha to Cloudflare Turnstile"
    echo

    parse_arguments "$@"
    
    check_dependencies
    check_project_structure
    check_current_captcha
    
    interactive_config
    
    create_backup
    
    install_wrangler
    authenticate_cloudflare
    create_turnstile_site
    
    log_success "Phase 1 Complete: Cloudflare setup finished"
    log_info "Next: Run the code migration script"
    log_info "Command: $SCRIPT_DIR/migrate-code.sh"
}

# Execute main function with all arguments
main "$@"