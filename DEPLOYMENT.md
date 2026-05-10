# Deployment Guide

## Step-by-Step Deployment to Vercel with Supabase

### Part 1: Set Up Supabase Database

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create a New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - Name: `toyota-parts-inventory`
     - Database Password: (save this securely)
     - Region: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Run the Database Schema**
   - In your Supabase dashboard, click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL editor
   - Click "Run" button
   - You should see "Success. No rows returned" message
   - Your database is now set up with the toyota_parts table and sample data!

4. **Get Your API Credentials**
   - Click on "Settings" (gear icon) in the left sidebar
   - Click on "API" under Project Settings
   - You'll see two important values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhbGci...` (long string)
   - Keep this tab open - you'll need these values soon!

### Part 2: Prepare Your Code

1. **Initialize Git Repository** (if not already done)
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: Toyota Parts Inventory"
   \`\`\`

2. **Create GitHub Repository**
   - Go to https://github.com
   - Click "New repository"
   - Name: `toyota-parts-inventory`
   - Keep it Public or Private
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push Your Code to GitHub**
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/toyota-parts-inventory.git
   git branch -M main
   git push -u origin main
   \`\`\`

### Part 3: Deploy to Vercel

1. **Create a Vercel Account**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with GitHub (recommended for easier deployment)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find `toyota-parts-inventory`
   - Click "Import"

3. **Configure Your Project**
   - **Framework Preset**: Should auto-detect as "Vite"
   - **Root Directory**: Leave as `./`
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)

4. **Add Environment Variables** ⚠️ IMPORTANT
   - Click "Environment Variables" section
   - Add two variables:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL from earlier |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from earlier |

   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - You'll see "Congratulations!" when done

6. **Access Your App**
   - Click "Visit" to see your live app
   - Your URL will be something like: `https://toyota-parts-inventory.vercel.app`

### Part 4: Verify Everything Works

1. **Test the Application**
   - Open your deployed URL
   - You should see the Toyota Parts Inventory dashboard
   - Check that the sample parts are loaded (15 parts should be visible)
   - Try adding a new part
   - Try editing a part
   - Try deleting a part
   - Try searching for parts

2. **Check for Errors**
   - Open browser console (F12)
   - Look for any error messages
   - If you see Supabase connection errors, double-check your environment variables

### Troubleshooting

#### Problem: "Failed to fetch parts" error

**Solution:**
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
3. Redeploy: Deployments → Click "..." → Redeploy

#### Problem: Parts table is empty

**Solution:**
1. Go to Supabase → SQL Editor
2. Re-run the INSERT statements from `supabase-schema.sql`
3. Refresh your app

#### Problem: CORS errors

**Solution:**
1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add your Vercel URL to "Redirect URLs"

### Custom Domain (Optional)

1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS
4. Wait for SSL certificate to provision

### Continuous Deployment

Every time you push to GitHub, Vercel will automatically:
- Build your application
- Run tests (if configured)
- Deploy to production
- Generate a preview URL for pull requests

To deploy changes:
\`\`\`bash
git add .
git commit -m "Your change description"
git push
\`\`\`

Vercel will automatically deploy within 1-2 minutes!

### Production Checklist

Before going live with real data:

- [ ] Set up proper Supabase Row Level Security (RLS) policies
- [ ] Add user authentication
- [ ] Configure backup strategy in Supabase
- [ ] Set up monitoring/analytics
- [ ] Add error tracking (e.g., Sentry)
- [ ] Review and adjust min_stock_level thresholds
- [ ] Add more part categories if needed
- [ ] Customize branding/colors if needed

### Monitoring Your App

**Vercel Analytics:**
- Go to your project → Analytics
- View page views, user metrics, performance

**Supabase Database:**
- Go to Supabase → Database → Tables
- View real-time data
- Check query performance

### Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

---

**Congratulations!** 🎉 Your Toyota Parts Inventory system is now live!
