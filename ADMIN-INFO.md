# Admin Login Instructions

## Default Admin Password

The default admin password is: **`admin123`**

## Changing the Admin Password

### For Production Use:

1. **Using Environment Variable (Recommended)**:
   
   In `src/App.jsx`, change line 27 to use an environment variable:
   ```javascript
   const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
   ```

2. **Add to Vercel Environment Variables**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add: `VITE_ADMIN_PASSWORD` = `your-secure-password`
   - Redeploy

### Quick Change (Development):

In `src/App.jsx`, find line 27 and change:
```javascript
const ADMIN_PASSWORD = 'admin123'
```
to
```javascript
const ADMIN_PASSWORD = 'YourNewPassword123'
```

## How Admin Mode Works

**Viewer Mode (Default)**:
- Can view all parts
- Can search parts
- Cannot add/edit/delete
- Cannot see total inventory value

**Admin Mode (After Login)**:
- All viewer features PLUS:
- Add new parts
- Edit existing parts
- Delete parts
- See total inventory value
- "Call for Price" option when adding parts

## Login Flow

1. Click "Admin Login" button in header
2. Enter password
3. Click "Login"
4. You're now in admin mode with full access
5. Click "Logout" to return to viewer mode

## Security Notes

⚠️ **Important for Production**:
- Change the default password immediately
- Use environment variables (not hardcoded)
- Admin status resets on page refresh (session-based)
- Consider adding Supabase Auth for proper user management

## Features by Mode

| Feature | Viewer | Admin |
|---------|--------|-------|
| View Parts | ✅ | ✅ |
| Search | ✅ | ✅ |
| See Total Parts Count | ✅ | ✅ |
| See Excellent Condition Count | ✅ | ✅ |
| See Total Value | ❌ | ✅ |
| Add Parts | ❌ | ✅ |
| Edit Parts | ❌ | ✅ |
| Delete Parts | ❌ | ✅ |
| Actions Column | ❌ | ✅ |
