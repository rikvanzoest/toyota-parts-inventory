# VERCEL ENVIRONMENT VARIABLES FIX

## Error: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"

This error means your Vercel deployment can't find the Supabase environment variables.

## Solution: Add Environment Variables to Vercel

### Step-by-Step Fix:

1. **Go to your Vercel Project Dashboard**
   - Visit https://vercel.com
   - Click on your `toyota-parts-inventory` project

2. **Navigate to Settings**
   - Click on "Settings" tab at the top
   - Click on "Environment Variables" in the left sidebar

3. **Add BOTH Variables** (you need both!)

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (e.g., `https://abcdefghijk.supabase.co`)
   - Environment: Check all three boxes (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon/public key (long string starting with `eyJ...`)
   - Environment: Check all three boxes (Production, Preview, Development)
   - Click "Save"

4. **Get Your Supabase Credentials** (if you don't have them):
   - Go to https://supabase.com
   - Open your project
   - Click "Settings" (gear icon)
   - Click "API"
   - Copy:
     - **Project URL** → use for `VITE_SUPABASE_URL`
     - **anon public** key → use for `VITE_SUPABASE_ANON_KEY`

5. **CRITICAL: Redeploy Your Application**
   - Go to "Deployments" tab
   - Click the "..." menu on your latest deployment
   - Click "Redeploy"
   - OR simply push a new commit to GitHub

   **Important:** Just adding environment variables is NOT enough - you MUST redeploy!

### Verify Environment Variables

After adding them, you should see something like:

```
VITE_SUPABASE_URL          Production, Preview, Development    (Encrypted)
VITE_SUPABASE_ANON_KEY     Production, Preview, Development    (Encrypted)
```

### Common Mistakes

❌ **Wrong variable names** - Must be exactly:
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL` or `VITE_SUPABASE_API_URL`)
   - `VITE_SUPABASE_ANON_KEY` (not `SUPABASE_KEY` or `VITE_SUPABASE_KEY`)

❌ **Missing `VITE_` prefix** - Vite requires the `VITE_` prefix for client-side variables

❌ **Not redeploying** - Environment variables only take effect on new builds

❌ **Wrong Supabase URL format** - Must include `https://` at the start

❌ **Wrong key** - Make sure you're using the `anon/public` key, NOT the `service_role` secret key

### Alternative: Local Testing

If you want to test locally first:

1. Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Visit http://localhost:3000

### Quick Test Checklist

After redeploying, your app should:
- ✅ Load without errors
- ✅ Show the dashboard with statistics
- ✅ Display 15 sample parts in the table
- ✅ Allow you to add new parts
- ✅ Allow you to search for parts

### Still Having Issues?

Check browser console (F12) for more detailed error messages:
- "Missing Supabase credentials" = Variables not set correctly
- "Invalid URL" = URL format is wrong (needs https://)
- "Invalid API key" = Wrong key or key not set

### Video Walkthrough Locations

**Vercel:**
Settings → Environment Variables → Add variable → Name & Value → Save → Redeploy

**Supabase:**
Project Dashboard → Settings → API → Copy Project URL & anon key

---

Need more help? The error message in your browser console will now tell you exactly which variable is missing!
