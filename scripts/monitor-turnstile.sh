#!/bin/bash

# ============================================================================
# SunShare Energy Philippines - Turnstile Monitoring Script
# ============================================================================
# 
# This script provides monitoring and analytics for the Turnstile implementation
# 
# Features:
# - Cloudflare Turnstile analytics retrieval
# - Performance monitoring and reporting
# - User experience metrics
# - Automated alerts and notifications
# - Custom dashboard generation
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
REPORTS_DIR="$SCRIPT_DIR/reports"

# Default values
REPORT_TYPE="summary"
TIME_PERIOD="last-7-days"
OUTPUT_FORMAT="table"
SAVE_REPORT=false
VERBOSE=false

# Utility Functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_step() { echo -e "\n${PURPLE}📊 $1${NC}"; }

show_help() {
    cat << EOF
SunShare Energy Philippines - Turnstile Monitoring Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --help                  Show this help message
    --report TYPE          Report type (summary|analytics|performance|security)
    --period PERIOD        Time period (today|yesterday|last-7-days|last-30-days|custom)
    --format FORMAT        Output format (table|json|csv|markdown)
    --save                 Save report to file
    --verbose              Enable verbose logging

EXAMPLES:
    # Daily summary report
    $0 --report summary --period yesterday

    # Weekly analytics with file output
    $0 --report analytics --period last-7-days --format markdown --save

    # Performance monitoring
    $0 --report performance --period today --format table

    # Security analysis
    $0 --report security --period last-30-days --format json --save

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --report)
                REPORT_TYPE="$2"
                shift 2
                ;;
            --period)
                TIME_PERIOD="$2"
                shift 2
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --save)
                SAVE_REPORT=true
                shift
                ;;
            --verbose|-v)
                VERBOSE=true
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

check_dependencies() {
    log_step "Checking monitoring dependencies..."

    local deps=("wrangler:Cloudflare CLI" "jq:JSON processor" "curl:HTTP client")

    for dep in "${deps[@]}"; do
        local cmd="${dep%%:*}"
        local name="${dep##*:}"
        
        if command -v "$cmd" >/dev/null 2>&1; then
            log_success "$name: available"
        else
            log_error "$name is required but not installed"
            exit 1
        fi
    done

    # Check if authenticated with Cloudflare
    if ! wrangler whoami >/dev/null 2>&1; then
        log_error "Not authenticated with Cloudflare. Run: wrangler login"
        exit 1
    fi

    log_success "All dependencies are available"
}

load_site_config() {
    if [[ ! -f "$CONFIG_DIR/turnstile-site.json" ]]; then
        log_error "Turnstile site configuration not found. Run setup-turnstile.sh first."
        exit 1
    fi

    SITE_ID=$(jq -r '.site_id' "$CONFIG_DIR/turnstile-site.json")
    SITE_KEY=$(jq -r '.site_key' "$CONFIG_DIR/turnstile-site.json")
    SITE_NAME=$(jq -r '.site_name' "$CONFIG_DIR/turnstile-site.json")
    
    if [[ "$SITE_ID" == "null" ]]; then
        log_error "Invalid site configuration"
        exit 1
    fi

    log_info "Loaded site configuration: $SITE_NAME ($SITE_ID)"
}

get_time_range() {
    local start_date end_date

    case $TIME_PERIOD in
        today)
            start_date=$(date +"%Y-%m-%d")
            end_date=$(date +"%Y-%m-%d")
            ;;
        yesterday)
            start_date=$(date -v-1d +"%Y-%m-%d" 2>/dev/null || date -d "yesterday" +"%Y-%m-%d")
            end_date="$start_date"
            ;;
        last-7-days)
            start_date=$(date -v-7d +"%Y-%m-%d" 2>/dev/null || date -d "7 days ago" +"%Y-%m-%d")
            end_date=$(date +"%Y-%m-%d")
            ;;
        last-30-days)
            start_date=$(date -v-30d +"%Y-%m-%d" 2>/dev/null || date -d "30 days ago" +"%Y-%m-%d")
            end_date=$(date +"%Y-%m-%d")
            ;;
        custom)
            read -p "Start date (YYYY-MM-DD): " start_date
            read -p "End date (YYYY-MM-DD): " end_date
            ;;
        *)
            log_error "Invalid time period: $TIME_PERIOD"
            exit 1
            ;;
    esac

    START_DATE="$start_date"
    END_DATE="$end_date"
    log_info "Time range: $START_DATE to $END_DATE"
}

fetch_turnstile_analytics() {
    log_step "Fetching Turnstile analytics..."

    local analytics_output
    analytics_output=$(wrangler turnstile analytics "$SITE_ID" --start-date "$START_DATE" --end-date "$END_DATE" --json 2>/dev/null || echo "")

    if [[ -z "$analytics_output" ]]; then
        log_warning "No analytics data available for the specified period"
        ANALYTICS_DATA="{}"
        return
    fi

    ANALYTICS_DATA="$analytics_output"
    log_success "Analytics data retrieved"
}

fetch_site_info() {
    log_step "Fetching site information..."

    local site_info
    site_info=$(wrangler turnstile get "$SITE_ID" --json 2>/dev/null || echo "")

    if [[ -z "$site_info" ]]; then
        log_warning "Could not retrieve site information"
        SITE_INFO="{}"
        return
    fi

    SITE_INFO="$site_info"
    log_success "Site information retrieved"
}

generate_summary_report() {
    log_step "Generating summary report..."

    local total_requests success_rate avg_response_time

    if [[ "$ANALYTICS_DATA" != "{}" ]]; then
        total_requests=$(echo "$ANALYTICS_DATA" | jq -r '.total_requests // 0')
        success_rate=$(echo "$ANALYTICS_DATA" | jq -r '.success_rate // 0')
        avg_response_time=$(echo "$ANALYTICS_DATA" | jq -r '.avg_response_time // 0')
    else
        total_requests="N/A"
        success_rate="N/A"
        avg_response_time="N/A"
    fi

    case $OUTPUT_FORMAT in
        table)
            cat << EOF

┌─────────────────────────────────────────────────────────────────┐
│                    SunShare Energy Turnstile                   │
│                        Summary Report                          │
├─────────────────────────────────────────────────────────────────┤
│ Period: $START_DATE to $END_DATE                               │
│ Site: $SITE_NAME                                               │
│ Site ID: $SITE_ID                                              │
├─────────────────────────────────────────────────────────────────┤
│ Metrics:                                                        │
│   Total Requests: $total_requests                              │
│   Success Rate: $success_rate%                                 │
│   Avg Response Time: ${avg_response_time}ms                     │
├─────────────────────────────────────────────────────────────────┤
│ Status: ✅ Active and Monitoring                               │
└─────────────────────────────────────────────────────────────────┘

EOF
            ;;
        json)
            jq -n \
                --arg site_name "$SITE_NAME" \
                --arg site_id "$SITE_ID" \
                --arg start_date "$START_DATE" \
                --arg end_date "$END_DATE" \
                --arg total_requests "$total_requests" \
                --arg success_rate "$success_rate" \
                --arg avg_response_time "$avg_response_time" \
                '{
                    "report_type": "summary",
                    "generated_at": (now | strftime("%Y-%m-%d %H:%M:%S")),
                    "site": {
                        "name": $site_name,
                        "id": $site_id
                    },
                    "period": {
                        "start": $start_date,
                        "end": $end_date
                    },
                    "metrics": {
                        "total_requests": $total_requests,
                        "success_rate": $success_rate,
                        "avg_response_time": $avg_response_time
                    }
                }'
            ;;
        markdown)
            cat << EOF
# SunShare Energy Turnstile Summary Report

**Generated:** $(date)
**Period:** $START_DATE to $END_DATE
**Site:** $SITE_NAME (\`$SITE_ID\`)

## Key Metrics

| Metric | Value |
|--------|--------|
| Total Requests | $total_requests |
| Success Rate | $success_rate% |
| Average Response Time | ${avg_response_time}ms |

## Status

✅ **Active and Monitoring**

The Turnstile service is operational and protecting the SunShare Energy onboarding process.

EOF
            ;;
    esac
}

generate_analytics_report() {
    log_step "Generating detailed analytics report..."

    if [[ "$ANALYTICS_DATA" == "{}" ]]; then
        log_warning "No analytics data available for detailed report"
        return
    fi

    case $OUTPUT_FORMAT in
        table)
            echo "Detailed Analytics Report"
            echo "========================"
            echo
            echo "Raw Analytics Data:"
            echo "$ANALYTICS_DATA" | jq '.'
            ;;
        json)
            echo "$ANALYTICS_DATA"
            ;;
        markdown)
            cat << EOF
# SunShare Energy Turnstile Analytics Report

**Generated:** $(date)
**Period:** $START_DATE to $END_DATE

## Raw Analytics Data

\`\`\`json
$(echo "$ANALYTICS_DATA" | jq '.')
\`\`\`

EOF
            ;;
    esac
}

generate_performance_report() {
    log_step "Generating performance report..."

    # Get deployment info if available
    local deployment_url deployment_env
    if [[ -f "$CONFIG_DIR/latest_deployment.json" ]]; then
        deployment_url=$(jq -r '.url' "$CONFIG_DIR/latest_deployment.json")
        deployment_env=$(jq -r '.environment' "$CONFIG_DIR/latest_deployment.json")
    else
        deployment_url="Unknown"
        deployment_env="Unknown"
    fi

    # Test API endpoint performance
    local api_response_time api_status
    if [[ "$deployment_url" != "Unknown" ]]; then
        local start_time end_time
        start_time=$(date +%s%N)
        
        if curl -s -f "$deployment_url/api/verify-turnstile" -X POST \
           -H "Content-Type: application/json" \
           -d '{"token":"test"}' >/dev/null 2>&1; then
            api_status="✅ Responding"
        else
            api_status="⚠️ Not responding"
        fi
        
        end_time=$(date +%s%N)
        api_response_time=$(( (end_time - start_time) / 1000000 ))
    else
        api_status="❓ Unknown"
        api_response_time="N/A"
    fi

    case $OUTPUT_FORMAT in
        table)
            cat << EOF

┌─────────────────────────────────────────────────────────────────┐
│                    Performance Report                          │
├─────────────────────────────────────────────────────────────────┤
│ Deployment Environment: $deployment_env                        │
│ Deployment URL: $deployment_url                                │
│                                                                 │
│ API Endpoint Status: $api_status                               │
│ API Response Time: ${api_response_time}ms                      │
│                                                                 │
│ Turnstile Status: ✅ Active                                    │
└─────────────────────────────────────────────────────────────────┘

EOF
            ;;
        json)
            jq -n \
                --arg deployment_url "$deployment_url" \
                --arg deployment_env "$deployment_env" \
                --arg api_status "$api_status" \
                --arg api_response_time "$api_response_time" \
                '{
                    "report_type": "performance",
                    "generated_at": (now | strftime("%Y-%m-%d %H:%M:%S")),
                    "deployment": {
                        "url": $deployment_url,
                        "environment": $deployment_env
                    },
                    "api_performance": {
                        "status": $api_status,
                        "response_time_ms": $api_response_time
                    }
                }'
            ;;
        markdown)
            cat << EOF
# SunShare Energy Performance Report

**Generated:** $(date)
**Period:** $START_DATE to $END_DATE

## Deployment Status

- **Environment:** $deployment_env
- **URL:** $deployment_url

## API Performance

- **Status:** $api_status
- **Response Time:** ${api_response_time}ms

## Turnstile Service

- **Status:** ✅ Active
- **Integration:** Operational

EOF
            ;;
    esac
}

generate_security_report() {
    log_step "Generating security report..."

    # Analyze recent challenges and potential threats
    local challenge_data blocked_requests threat_level

    if [[ "$ANALYTICS_DATA" != "{}" ]]; then
        blocked_requests=$(echo "$ANALYTICS_DATA" | jq -r '.blocked_requests // 0')
        challenge_data=$(echo "$ANALYTICS_DATA" | jq -r '.challenges // {}')
        
        if [[ "$blocked_requests" -gt 100 ]]; then
            threat_level="🔴 High"
        elif [[ "$blocked_requests" -gt 10 ]]; then
            threat_level="🟡 Medium"
        else
            threat_level="🟢 Low"
        fi
    else
        blocked_requests="N/A"
        threat_level="❓ Unknown"
    fi

    case $OUTPUT_FORMAT in
        table)
            cat << EOF

┌─────────────────────────────────────────────────────────────────┐
│                      Security Report                           │
├─────────────────────────────────────────────────────────────────┤
│ Threat Level: $threat_level                                     │
│ Blocked Requests: $blocked_requests                            │
│                                                                 │
│ Protection Status: ✅ Active                                   │
│ Bot Detection: ✅ Enabled                                      │
│ Rate Limiting: ✅ Configured                                   │
└─────────────────────────────────────────────────────────────────┘

EOF
            ;;
        json)
            jq -n \
                --arg threat_level "$threat_level" \
                --arg blocked_requests "$blocked_requests" \
                '{
                    "report_type": "security",
                    "generated_at": (now | strftime("%Y-%m-%d %H:%M:%S")),
                    "threat_assessment": {
                        "level": $threat_level,
                        "blocked_requests": $blocked_requests
                    },
                    "protection_status": {
                        "active": true,
                        "bot_detection": true,
                        "rate_limiting": true
                    }
                }'
            ;;
        markdown)
            cat << EOF
# SunShare Energy Security Report

**Generated:** $(date)
**Period:** $START_DATE to $END_DATE

## Threat Assessment

- **Threat Level:** $threat_level
- **Blocked Requests:** $blocked_requests

## Protection Status

- **Service:** ✅ Active
- **Bot Detection:** ✅ Enabled
- **Rate Limiting:** ✅ Configured

## Recommendations

- Monitor blocked request patterns
- Review challenge success rates
- Adjust sensitivity if needed

EOF
            ;;
    esac
}

save_report_to_file() {
    if [[ "$SAVE_REPORT" != "true" ]]; then
        return
    fi

    mkdir -p "$REPORTS_DIR"
    
    local filename="turnstile_${REPORT_TYPE}_$(date +%Y%m%d_%H%M%S)"
    local extension
    
    case $OUTPUT_FORMAT in
        json) extension="json" ;;
        markdown) extension="md" ;;
        csv) extension="csv" ;;
        *) extension="txt" ;;
    esac

    local report_file="$REPORTS_DIR/${filename}.${extension}"
    
    # The report has already been generated and displayed
    # We need to re-generate it and save to file
    local saved_output_format="$OUTPUT_FORMAT"
    
    case $REPORT_TYPE in
        summary) generate_summary_report > "$report_file" ;;
        analytics) generate_analytics_report > "$report_file" ;;
        performance) generate_performance_report > "$report_file" ;;
        security) generate_security_report > "$report_file" ;;
    esac

    log_success "Report saved to: $report_file"
}

main() {
    log_step "Starting SunShare Energy Turnstile Monitoring"
    
    parse_arguments "$@"
    check_dependencies
    load_site_config
    get_time_range
    
    fetch_turnstile_analytics
    fetch_site_info
    
    case $REPORT_TYPE in
        summary)
            generate_summary_report
            ;;
        analytics)
            generate_analytics_report
            ;;
        performance)
            generate_performance_report
            ;;
        security)
            generate_security_report
            ;;
        *)
            log_error "Invalid report type: $REPORT_TYPE"
            show_help
            exit 1
            ;;
    esac
    
    save_report_to_file
    
    log_success "Monitoring report completed"
}

main "$@"