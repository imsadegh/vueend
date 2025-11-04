#!/bin/bash

#############################################
# Vue.js Frontend Deployment Script
# VPS: 5.182.44.108:3031
# Domain: ithdp.ir
#############################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOCAL_DIR="/Users/sadeghmbp/Downloads/myDocuments/_develop/_fs_dev/hakimyarFusion/vueend"
REMOTE_USER="deploy"
REMOTE_HOST="5.182.44.108"
REMOTE_PORT="3031"
REMOTE_DIR="/var/www/vueend"

# Functions
print_header() {
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Main deployment
print_header "Vue.js Frontend Deployment"

print_info "Local directory: $LOCAL_DIR"
print_info "Remote host: $REMOTE_HOST:$REMOTE_PORT"
print_info "Remote directory: $REMOTE_DIR"
echo ""

# Step 1: Test SSH connection
print_info "Testing SSH connection..."
if ssh -p "$REMOTE_PORT" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    print_success "SSH connection successful"
else
    print_error "Failed to connect to VPS. Please check your SSH credentials."
    exit 1
fi

# Step 2: Create remote directory if it doesn't exist
print_info "Ensuring remote directory exists..."
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_DIR"
print_success "Remote directory ready"

# Step 3: Upload files
print_header "Uploading Files to VPS"
rsync -avz --progress \
    --exclude='node_modules/' \
    --exclude='.git/' \
    --exclude='dist/' \
    --exclude='.env.local' \
    --exclude='.env.development' \
    --exclude='test-results/' \
    --exclude='tests/' \
    --exclude='.DS_Store' \
    --exclude='*.log' \
    --exclude='.cursor/' \
    --exclude='.vscode/' \
    --exclude='deploy.sh' \
    -e "ssh -p $REMOTE_PORT" \
    "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

print_success "Files uploaded successfully"

# Step 4: Build and deploy on server
print_header "Building on VPS"

ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" bash -l << 'ENDSSH'
set -e

# Load environment variables (Node.js paths, etc.)
export PATH="$HOME/.local/share/fnm:$PATH"
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi
if [ -f "$HOME/.profile" ]; then
    source "$HOME/.profile"
fi

# Initialize fnm if available
if command -v fnm &> /dev/null; then
    eval "$(fnm env --use-on-cd)"
fi

# Colors for remote output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/var/www/vueend"
BACKUP_DIR="/home/deploy/backups/frontend"
DATE=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}📁 Working in: $APP_DIR${NC}"

# Verify Node.js and pnpm are available
echo -e "${BLUE}🔍 Checking environment...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found in PATH${NC}"
    echo -e "${YELLOW}PATH: $PATH${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found, installing...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}✅ Node.js: $(node -v)${NC}"
echo -e "${GREEN}✅ npm: $(npm -v)${NC}"
echo -e "${GREEN}✅ pnpm: $(pnpm -v)${NC}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup of existing dist if it exists
if [ -d "$APP_DIR/dist" ]; then
    echo -e "${YELLOW}📦 Creating backup of existing build...${NC}"
    tar -czf "$BACKUP_DIR/frontend-${DATE}.tar.gz" -C "$APP_DIR" dist/ 2>/dev/null || true
    echo -e "${GREEN}✅ Backup created: frontend-${DATE}.tar.gz${NC}"
fi

# Navigate to app directory
cd "$APP_DIR"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies with pnpm...${NC}"
pnpm install --frozen-lockfile

# Build for production
echo -e "${BLUE}🔨 Building for production...${NC}"
pnpm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Set correct permissions
echo -e "${BLUE}🔐 Setting permissions...${NC}"
sudo chown -R deploy:www-data dist/
sudo chmod -R 755 dist/

# Test Nginx configuration
echo -e "${BLUE}🔍 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    # Reload Nginx
    echo -e "${BLUE}🔄 Reloading Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx configuration test had warnings, but continuing...${NC}"
    sudo systemctl reload nginx
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📦 Backup: $BACKUP_DIR/frontend-${DATE}.tar.gz${NC}"

ENDSSH

# Step 5: Final message
echo ""
print_header "Deployment Complete"
print_success "Your Vue.js frontend has been deployed successfully!"
print_info "🌐 Frontend URL: https://ithdp.ir"
print_info "🔗 Backend API: https://api.ithdp.ir"
echo ""
print_warning "Remember to test your application:"
echo "  1. Visit https://ithdp.ir"
echo "  2. Check browser console for errors"
echo "  3. Test API connectivity"
echo "  4. Test SPA routing (refresh on different routes)"
echo ""

