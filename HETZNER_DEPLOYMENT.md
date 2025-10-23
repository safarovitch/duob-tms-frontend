# DuobTMS Hetzner Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Hetzner server with Ubuntu 20.04+ 
- Docker and Docker Compose installed
- Root or sudo access

### Directory Structure
```
/opt/duobtms/
├── backend/
│   ├── Dockerfile
│   ├── target/app.jar (or your Spring Boot JAR)
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── nginx/
│   ├── src/
│   ├── package.json
│   └── docker-compose.integrated.yml
└── docker-compose.yml (main deployment file)
```

## 📋 Step-by-Step Deployment

### 1. Prepare Your Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
sudo mkdir -p /opt/duobtms
cd /opt/duobtms
```

### 2. Upload Your Code
```bash
# Upload your backend and frontend code to the server
# You can use git, scp, or any other method

# Example with git:
git clone <your-backend-repo> backend
git clone <your-frontend-repo> frontend
```

### 3. Configure Environment
```bash
# Copy the integrated Docker Compose file
cp frontend/docker-compose.integrated.yml docker-compose.yml

# Edit the docker-compose.yml file to adjust paths
nano docker-compose.yml
```

### 4. Deploy the Application
```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔧 Configuration Options

### Option 1: Integrated Setup (Recommended)
Use `docker-compose.integrated.yml` - runs both frontend and backend on the same server.

### Option 2: Frontend Only
Use `docker-compose.frontend-only.yml` - if your backend is running elsewhere.

### Option 3: Full Production Setup
Use `docker-compose.production.yml` - includes health checks, logging, and monitoring.

## 🌐 Access Your Application

After successful deployment:
- **Frontend**: http://your-hetzner-ip:80
- **Backend API**: http://your-hetzner-ip:8080/duobtms
- **Database**: localhost:5432 (internal access only)

## 🔒 Security Considerations

### 1. Firewall Configuration
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Don't expose database port externally
sudo ufw deny 5432
```

### 2. Environment Variables
Update these in your docker-compose.yml:
```yaml
environment:
  JWT_SECRET_KEY: "your-super-strong-secret-key-here"
  POSTGRES_PASSWORD: "your-secure-database-password"
```

### 3. SSL/HTTPS Setup
Add SSL certificates and update nginx configuration for HTTPS.

## 📊 Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f app
docker-compose logs -f postgres
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U duobuser duobtms > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T postgres psql -U duobuser duobtms < backup_20231002.sql
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   # Check what's using port 80
   sudo lsof -i :80
   
   # Stop Apache/Nginx if running
   sudo systemctl stop apache2
   sudo systemctl stop nginx
   ```

2. **Backend connection issues**
   - Check if containers are on the same network
   - Verify container names in nginx configuration
   - Check backend health: `curl http://localhost:8080/duobtms/actuator/health`

3. **Database connection issues**
   - Verify PostgreSQL is running: `docker-compose ps postgres`
   - Check database logs: `docker-compose logs postgres`

4. **Frontend not loading**
   - Check nginx logs: `docker-compose logs web`
   - Verify build completed successfully
   - Check if files are copied to nginx: `docker-compose exec web ls -la /usr/share/nginx/html`

### Health Checks
```bash
# Check all services status
docker-compose ps

# Test frontend
curl -I http://localhost:80

# Test backend
curl -I http://localhost:8080/duobtms

# Test database connection
docker-compose exec postgres psql -U duobuser -d duobtms -c "SELECT 1;"
```

## 📞 Support

If you encounter issues:
1. Check the logs first: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Check network connectivity between containers
4. Ensure all environment variables are set correctly

