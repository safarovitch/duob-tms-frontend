#!/bin/bash

# DuobTMS Frontend Deployment Script for Hetzner
# Usage: ./deploy-hetzner.sh [environment]

set -e  # Exit on any error

# Configuration
PROJECT_NAME="duobtms"
COMPOSE_FILE="docker-compose.frontend-only.yml"
BACKUP_DIR="/opt/duobtms/backups"
LOG_FILE="/var/log/duobtms-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
}

# Install Docker and Docker Compose if not present
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl enable docker
        systemctl start docker
        rm get-docker.sh
    else
        log "Docker is already installed"
    fi

    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    else
        log "Docker Compose is already installed"
    fi
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    mkdir -p "$BACKUP_DIR"
    mkdir -p "/opt/duobtms/logs"
    mkdir -p "/var/log"
}

# Backup current deployment
backup_current() {
    if docker ps -q -f name="duob-tms-frontend" | grep -q .; then
        log "Creating backup of current deployment..."
        BACKUP_NAME="duobtms-backup-$(date +%Y%m%d-%H%M%S)"
        docker save duob-tms-frontend:latest > "$BACKUP_DIR/$BACKUP_NAME.tar" || warning "Backup failed"
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    apt-get update -qq
    apt-get upgrade -y -qq
    apt-get install -y curl wget git unzip
}

# Configure firewall
setup_firewall() {
    log "Configuring firewall..."
    ufw --force enable
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    # ufw allow 8081/tcp  # Uncomment if using alternative port
    ufw reload
}

# Deploy application
deploy_app() {
    log "Deploying DuobTMS Frontend..."
    
    # Stop existing containers
    docker-compose -f "$COMPOSE_FILE" down || true
    
    # Remove old images (optional)
    docker image prune -f
    
    # Build and start new containers
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    # Wait for container to be healthy
    log "Waiting for application to start..."
    sleep 30
    
    # Check if container is running
    if docker ps -q -f name="duob-tms-frontend" | grep -q .; then
        log "✅ Application deployed successfully!"
        log "🌐 Access your application at: http://$(curl -s ifconfig.me):80"
    else
        error "❌ Deployment failed - container is not running"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check container status
    if ! docker ps -q -f name="duob-tms-frontend" | grep -q .; then
        error "Container is not running"
    fi
    
    # Check HTTP response
    if curl -f -s http://localhost:80 > /dev/null; then
        log "✅ Health check passed"
    else
        warning "⚠️  Health check failed - application may not be ready yet"
    fi
}

# Setup log rotation
setup_logging() {
    log "Setting up log rotation..."
    cat > /etc/logrotate.d/duobtms << EOF
/var/log/duobtms-deploy.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
}

# Main deployment function
main() {
    log "🚀 Starting DuobTMS deployment on Hetzner..."
    
    check_permissions
    setup_directories
    update_system
    install_docker
    setup_firewall
    backup_current
    deploy_app
    health_check
    setup_logging
    
    log "🎉 Deployment completed successfully!"
    log "📊 Container status:"
    docker ps -f name="duob-tms"
    
    log "📝 Useful commands:"
    log "  View logs: docker logs -f duob-tms-frontend"
    log "  Restart:   docker-compose -f $COMPOSE_FILE restart"
    log "  Stop:      docker-compose -f $COMPOSE_FILE down"
    log "  Update:    ./deploy-hetzner.sh"
}

# Run main function
main "$@"

