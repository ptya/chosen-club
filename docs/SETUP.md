# Setup and Deployment Documentation

## Overview
This document describes how to set up, develop, and deploy the Chosen Club application.

## Technology Stack

- **Frontend/Backend**: SvelteKit 2.x with Svelte 5
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Internationalization**: Paraglide (Hungarian primary, English secondary)
- **Hosting**: Netlify (frontend/serverless functions)
- **Database Hosting**: To be determined (see Database Hosting Options below)
- **Email Service**: To be configured (for invitations)

## Local Development Setup

### Prerequisites

- Node.js 22+ (latest LTS recommended) and pnpm installed
- Docker and Docker Compose (for local database)
- Git

### Initial Setup

1. **Clone and Install Dependencies**
   ```bash
   cd chosen-club
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://root:mysecretpassword@localhost:5432/local
   # Add other environment variables as needed
   ```

3. **Start Local Database**
   ```bash
   pnpm db:start
   ```
   This starts a PostgreSQL container using Docker Compose.

4. **Run Database Migrations**
   ```bash
   pnpm db:push
   ```
   Or for production-style migrations:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Seed Initial Data** (if needed)
   - Create a seed script to populate initial names
   - Run: `pnpm db:seed` (to be created)

6. **Internationalization Setup**
   - Paraglide is already configured with Hungarian as the base locale
   - Translation files are in `/messages/` directory (hu.json, en.json)
   - Paraglide middleware is configured in `src/hooks.server.ts`
   - Use `m.messageKey()` from `$lib/paraglide/messages.js` in components
   - Language can be switched using `setLocale('hu')` or `setLocale('en')`

7. **Start Development Server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:5173`

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Type check with svelte-check
- `pnpm lint` - Run linter
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Database Hosting Options

### Option 1: Netlify Postgres (Recommended if Available)
If Netlify offers PostgreSQL hosting:
- Use Netlify's managed PostgreSQL service
- Configure through Netlify dashboard
- Use environment variables for connection string

### Option 2: Supabase (Recommended - Free Tier Available)
- **Pros**: Free tier, PostgreSQL, built-in auth options, good performance
- **Setup**:
  1. Create account at supabase.com
  2. Create new project
  3. Get connection string from project settings
  4. Use connection string in Netlify environment variables
- **Cost**: Free tier includes 500MB database, 2GB bandwidth

### Option 3: Railway
- **Pros**: Easy setup, PostgreSQL, Docker support
- **Setup**:
  1. Create account at railway.app
  2. Create PostgreSQL service
  3. Get connection string
  4. Use in Netlify environment variables
- **Cost**: $5/month for starter plan

### Option 4: Neon
- **Pros**: Serverless PostgreSQL, generous free tier
- **Setup**:
  1. Create account at neon.tech
  2. Create project
  3. Get connection string
  4. Use in Netlify environment variables
- **Cost**: Free tier includes 3GB storage

### Option 5: Docker on Netlify (If Supported)
If Netlify supports Docker containers:
- Use Docker Compose file
- Deploy database container alongside app
- **Note**: This may not be available on Netlify's free tier

### Recommended Choice: Supabase or Neon
Both offer excellent free tiers and are well-suited for this application. Supabase provides additional features like built-in authentication that might be useful later.

## Netlify Deployment

### Prerequisites
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)
- Database hosting set up (see above)

### Deployment Steps

1. **Connect Repository to Netlify**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect SvelteKit

2. **Configure Build Settings**
   - **Build command**: `pnpm build`
   - **Publish directory**: `.svelte-kit/netlify` (auto-detected by adapter)
   - **Node version**: 22 or latest LTS (check [nodejs.org](https://nodejs.org) for current LTS)

3. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   # Add other required environment variables
   ```

4. **Deploy**
   - Push to your main branch
   - Netlify will automatically deploy
   - Or trigger manual deploy from dashboard

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "pnpm build"
  publish = ".svelte-kit/netlify"

[build.environment]
  NODE_VERSION = "22"

[[plugins]]
  package = "@sveltejs/adapter-netlify"

# Redirect rules for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Email Service Configuration

### Option 1: Netlify Functions + SendGrid
- Use Netlify Functions for serverless email sending
- Sign up for SendGrid (free tier: 100 emails/day)
- Configure SendGrid API key in Netlify environment variables

### Option 2: Resend
- Modern email API, developer-friendly
- Free tier: 3,000 emails/month
- Easy integration with SvelteKit

### Option 3: AWS SES (via Netlify Functions)
- Very cheap, but requires AWS account setup
- Good for high volume

### Recommended: Resend
Easiest to set up and has a generous free tier.

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Email Service (if using Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Application
APP_URL=https://your-app.netlify.app
```

### Optional Variables

```env
# Feature flags
ENABLE_ANALYTICS=false
ENABLE_LEAGUE_STATS=true

# Configuration
MAX_PHASE1_APPEARANCES=3
CHOSEN_ONE_THRESHOLD=6
```

## Database Migrations in Production

### Approach 1: Manual Migration
1. Generate migration locally: `pnpm db:generate`
2. Review migration files
3. Apply via Drizzle Studio or migration script
4. Or use database provider's migration tool

### Approach 2: Automated Migration
Create a Netlify Function that runs migrations:
- Secure with authentication
- Trigger manually or on deploy
- Log all migration results

## Monitoring and Logging

### Netlify Analytics
- Enable in Netlify dashboard
- Track page views, performance

### Error Tracking
Consider integrating:
- Sentry (error tracking)
- LogRocket (session replay)
- Or Netlify's built-in error logs

## Backup Strategy

### Database Backups
- Use database provider's automated backups
- Supabase/Neon provide automatic daily backups on paid tiers
- For free tiers, set up manual backup script

### Backup Script Example
```bash
# Backup script (run via cron or Netlify scheduled function)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Credentials**: Use strong passwords, rotate regularly
3. **Email Tokens**: Secure invitation tokens, set expiration
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **CORS**: Configure CORS properly for API routes
6. **SQL Injection**: Use Drizzle ORM (parameterized queries)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database provider's connection limits
- Ensure IP whitelisting if required

### Build Failures
- Check Node version matches Netlify's version
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `pnpm check`

### Migration Issues
- Always test migrations locally first
- Backup database before running migrations
- Use transactions for migrations when possible

## Cost Estimation

### Free Tier (Initial)
- **Netlify**: Free (100GB bandwidth, 300 build minutes)
- **Database (Supabase/Neon)**: Free tier
- **Email (Resend)**: Free (3,000 emails/month)
- **Total**: $0/month

### Growth Tier (1000+ users)
- **Netlify**: $19/month (Pro plan)
- **Database**: $10-25/month
- **Email**: $20/month (if needed)
- **Total**: ~$50-65/month

## Next Steps

1. Choose database hosting provider
2. Set up email service
3. Configure Netlify deployment
4. Set up monitoring and error tracking
5. Create backup strategy
6. Test deployment pipeline

