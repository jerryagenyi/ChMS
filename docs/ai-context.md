# AI Development Context - ChMS Africa

## Project Overview

ChMS Africa is a church management system designed specifically for African churches, with a focus on accessibility, affordability, and practical functionality. The system begins with an attendance management module and will expand to include comprehensive church management features.

## Development Context

- Primary Framework: Next.js with TypeScript
- Database: PostgreSQL with Prisma ORM
- Deployment: Docker + Oracle Cloud (Ubuntu 22.04)
- Styling: Tailwind CSS
- Development Approach: Mobile-first, Progressive Enhancement
- Target Environment: African context (considering internet reliability, device access)

## Deployment Architecture

```yaml
Infrastructure:
  Host: Oracle Cloud Free Tier
  OS: Ubuntu 24.04.1 LTS (Noble)
  Container: Docker (to be installed)

Initial Server Setup:
  System:
    - Update system packages
    - Configure UFW firewall
    - Set up SSH hardening
    - Configure timezone

  Basic Tools:
    - nginx
    - docker
    - docker-compose
    - certbot (Let's Encrypt)
    - fail2ban

Services (to be deployed):
  Web:
    - Next.js application
    - Nginx reverse proxy
    - SSL termination

  Database:
    - PostgreSQL container
    - Persistent volume
    - Automated backups

  Cache:
    - Redis container
    - Session management
    - Real-time updates

Security:
  - UFW firewall rules:
      - SSH (22)
      - HTTP (80)
      - HTTPS (443)
  - Let's Encrypt SSL
  - Docker network isolation
  - Regular security updates

Monitoring:
  - Docker container logs
  - Nginx access/error logs
  - System resource monitoring
  - Error tracking
```

## Server Setup Steps

1. **Initial Security Setup**:

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban -y
```

2. **Install Nginx**:

```bash
# Install nginx
sudo apt install nginx -y

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify status
sudo systemctl status nginx
```

3. **Install Docker** (Next Step):

```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

4. **SSL Setup** (After domain configuration):

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Current Phase

Building the Attendance Management System MVP:

- Service-based QR code check-in with geofencing
- SSO Authentication (NextAuth.js)
- Real-time attendance tracking
- Offline-first mobile app
- Basic admin dashboard

## Key Technical Decisions

1. **Authentication**:

   - NextAuth.js for SSO
   - JWT with secure session management
   - Role-based access control

2. **Database**:

   - Prisma ORM for type safety
   - CUID for IDs (better for web)
   - Relational schema design

3. **Frontend**:

   - Tailwind CSS for styling
   - Framer Motion for animations
   - SWR for real-time updates

4. **Mobile & Location**:
   - PWA with offline support
   - Service worker implementation
   - Geofencing implementation:
     - Browser geolocation API
     - Distance calculation
     - Location verification
     - Fallback mechanisms

## AI Prompt Template

When working on this project, use this template to structure your prompts:

```yaml
Context: ChMS Africa - Church Management System
Component: [Specific component or feature]
Phase: [Current development phase]
Task: [Specific task or requirement]

Requirements:
  - Mobile-first design
  - Offline capability consideration
  - Resource-efficient implementation
  - [Additional specific requirements]

Technical Stack:
  - Next.js + TypeScript
  - Prisma + PostgreSQL
  - NextAuth.js
  - [Additional technologies]

Expected Output:
  - [Desired output format]
  - [Specific requirements]

Additional Considerations:
  - African context adaptation
  - Performance optimization
  - Security requirements
```

## Development Guidelines

1. Always consider offline-first functionality
2. Prioritize mobile performance
3. Implement progressive enhancement
4. Focus on essential features first
5. Consider resource constraints
6. Plan for scalability
7. Maintain security best practices

## Performance Targets

- First contentful paint < 1.5s
- Time to interactive < 2s
- Animation frame rate > 55fps
- Offline capability
- Low data usage

## Testing Requirements

1. **Functional Testing**:

   - Mobile device testing
   - Offline functionality
   - QR code scanning
   - Authentication flows

2. **Performance Testing**:

   - Load testing
   - Animation performance
   - Database query optimization
   - Network resilience

3. **Security Testing**:
   - OWASP compliance
   - Authentication security
   - Data encryption
   - API security

## Documentation Requirements

1. **Technical Documentation**:

   - API documentation
   - Component documentation
   - Database schema
   - Deployment guides

2. **User Documentation**:
   - Admin user guide
   - Mobile app guide
   - Troubleshooting guide
   - FAQ
