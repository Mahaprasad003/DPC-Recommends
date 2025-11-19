# Admin Panel Setup

## Quick Setup

1. **Set your admin email** in `.env.local`:
   ```bash
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
   ```

2. **Restart your dev server** after adding the environment variable

3. **Sign in** with that email address on the website

4. **Admin panel will appear** in the bottom-right corner with a "Refresh Cache" button

## Features

- ✅ Only visible to the specified admin email
- ✅ Floating panel in bottom-right corner
- ✅ One-click cache refresh
- ✅ Success/error feedback messages
- ✅ Auto-hides for non-admin users

## Usage

After making changes in your Supabase database:

1. Click the **"Refresh Cache"** button in the admin panel
2. Wait for the success message
3. Your changes will now be visible on the website

## Cache Tags Being Refreshed

- `resources` - Main resources list
- `resource-options` - Resource filter options
- `sneak-peek-content` - Preview content

## Security Note

The admin email check happens on the client side. This is fine for cache invalidation since it's not a destructive operation. The server action itself doesn't modify data, only clears cache.
