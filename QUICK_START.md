# Quick Start Guide

Since you already have a database with content, follow these steps to get started quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project:
1. Go to Project Settings → API
2. Copy your Project URL and anon public key

## Step 3: Verify Your Database Schema

The app expects a table named `technical_content` with the following columns:

### Required Columns:
- `id` (UUID, primary key)
- `title` (TEXT, required)
- `url` (TEXT, required)

### Optional Columns (recommended):
- `author` (TEXT)
- `source` (TEXT)
- `topics` (TEXT[] - array of strings)
- `difficulty` (TEXT)
- `rating` (NUMERIC)
- `key_takeaways` (TEXT[] - array of strings)
- `date_added` (TIMESTAMP WITH TIME ZONE)
- `publisher` (TEXT)

### Verify Schema (Optional)

You can verify your database connection in two ways:

**Option 1: Using the API route (easiest)**

1. Start the dev server: `npm run dev`
2. Open: http://localhost:3000/api/verify
3. You should see a JSON response with connection status

**Option 2: Using the verification script**

1. Install dependencies: `npm install` (includes tsx)
2. Run: `npx tsx scripts/verify-schema.ts`

This will check:
- ✅ Database connection
- ✅ Table existence
- ✅ Column structure
- ✅ Data types
- ✅ Row Level Security (RLS) policies
- ✅ Row count

## Step 4: Set Up Row Level Security (RLS)

If RLS is not already configured, run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS (if not already enabled)
ALTER TABLE technical_content ENABLE ROW LEVEL SECURITY;

-- Create public read-only policy (if it doesn't exist)
CREATE POLICY "Public can view all technical_content"
  ON technical_content FOR SELECT
  USING (true);
```

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Table Name is Different

If your table has a different name, see [SCHEMA_MAPPING.md](./SCHEMA_MAPPING.md) for detailed instructions.

**Note:** The app is configured to use the `technical_content` table. This has already been set up for you. If you need to change it in the future, see [SCHEMA_MAPPING.md](./SCHEMA_MAPPING.md) for instructions.

### Column Names are Different

If your columns have different names, see [SCHEMA_MAPPING.md](./SCHEMA_MAPPING.md) for detailed mapping instructions.

**Quick options:**

**Option 1: Create a database view** (recommended if you can modify the database)
- Create a view that maps your column names to the expected names
- See SCHEMA_MAPPING.md for examples

**Option 2: Update the code** (if you can't modify the database)
- Update `types/database.ts` to match your schema
- Update `lib/hooks/useResources.ts` to use your column names
- Update `components/features/ResourceCard.tsx` to display your columns
- See SCHEMA_MAPPING.md for detailed instructions

### Missing Columns

If you're missing optional columns (topics, difficulty, rating, etc.):
- The app will still work, but those features won't be available
- You can hide filter options in `components/features/FilterPanel.tsx`
- You can remove references to missing fields in `components/features/ResourceCard.tsx`

### RLS Policy Issues

If you get permission errors:
1. Check that RLS is enabled on your table
2. Verify the public read policy exists
3. Check that your anon key is correct
4. Verify the policy is active (not disabled)

### Data Not Showing

1. Check the browser console for errors
2. Verify your environment variables are correct
3. Run the verification script to check the connection
4. Check that RLS policies allow public read access
5. Verify your data exists in the `technical_content` table
6. Verify the table name is exactly `technical_content` (case-sensitive)

## Next Steps

Once everything is working:
1. Customize the card display in `components/features/ResourceCard.tsx`
2. Adjust filter options in `components/features/FilterPanel.tsx`
3. Modify styling in `app/globals.css`
4. Add any additional features you need

## Need Help?

- Check `SETUP.md` for detailed database setup instructions
- Review `README.md` for general project information
- See `PROJECT_PLAN.md` for the full project plan

