# Deployment & Operations Manual - ChMS

## 1. Overview

This document provides instructions for deploying and maintaining the ChMS application.

## 2. Prerequisites

- Access to hosting provider (e.g., Vercel, AWS, Google Cloud)
- Access to database instance (PostgreSQL)
- Configured environment variables
- GitHub repository access
- Docker (optional, for local testing/consistent builds)

## 3. Environment Variables

_(List all required environment variables)_

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_ID` (if using GitHub provider)
- `GITHUB_SECRET` (if using GitHub provider)
- ...(other provider secrets)
- ...(any other application-specific secrets or config)

**Note:** Never commit secrets directly to the repository. Use provider-specific secret management.

## 4. Deployment Process

_(Detail the steps for each environment - Dev, Staging, Production)_

**Recommended (Vercel Example):**

1.  **Connect Repository:** Link the GitHub repository to a Vercel project.
2.  **Configure Build Settings:**
    - Framework Preset: Next.js
    - Build Command: `npm run build` (or `yarn build`)
    - Output Directory: `.next`
    - Install Command: `npm install` (or `yarn install`)
3.  **Set Environment Variables:** Configure all required environment variables in the Vercel project settings (see Section 3).
4.  **Trigger Deployment:** Push changes to the configured branch (e.g., `main` for production, `develop` for staging). Vercel will automatically build and deploy.
5.  **Database Migrations:** Apply necessary database migrations _before_ or _immediately after_ deployment (strategy depends on migration complexity and hosting setup).
    - Command: `npx prisma migrate deploy`
    - _(How/where is this run? Manually via SSH? As a build step? Needs definition)_

**(Alternative Docker Example - High Level):**

1.  Build Docker image using `Dockerfile`.
2.  Push image to a container registry (e.g., Docker Hub, AWS ECR).
3.  Deploy container to hosting platform (e.g., Kubernetes, AWS ECS, Google Cloud Run).
4.  Manage environment variables via platform secrets.
5.  Run database migrations as a separate step/job.

## 5. Database Management

- **Migrations:** Use `npx prisma migrate dev` during development and `npx prisma migrate deploy` for production deployments. Refer to Prisma documentation for migration strategies.
- **Backups:** Configure regular automated backups for the PostgreSQL database.
- **Restoration:** Document the process for restoring the database from a backup.

## 6. Monitoring & Logging

- **Application Monitoring:** Configure Vercel Analytics/Monitoring or integrate a third-party service (e.g., Sentry, Datadog).
- **Logging:** Utilize Vercel's logging or configure external logging aggregation (e.g., Logtail, Papertrail).
- **Alerting:** Set up alerts for critical errors, performance degradation, and security events.

## 7. Rollback Procedure

- **Vercel:** Vercel deployments are immutable. Rollback involves redeploying a previous successful deployment via the Vercel dashboard.
- **(Docker):** Deploy the previous stable Docker image version.
- **Database:** Reversing migrations requires careful planning. Consider backup/restore or writing specific down-migration scripts.

## 8. Maintenance Tasks

- Regularly update dependencies (`npm update` / `yarn upgrade`).
- Apply security patches promptly.
- Review logs and monitoring dashboards.
- Perform database maintenance (e.g., vacuuming, index checks).
