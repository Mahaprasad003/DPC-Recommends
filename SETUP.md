# Setup Guide

This guide will help you set up the DPC Recommends application.

> **Note:** If you already have a database with content, see [QUICK_START.md](./QUICK_START.md) for a faster setup process.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned

### Get Your API Keys

1. Go to Project Settings → API
2. Copy your Project URL and anon public key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set up Database

### Option A: New Database (No Existing Data)

If you're starting fresh, use the SQL below to create the table.

### Option B: Existing Database (You Already Have Data)

If you already have a database with content, see [QUICK_START.md](./QUICK_START.md) for setup instructions.

The app expects a table named `technical_content` with these columns:
- **Required:** `id` (UUID), `title` (TEXT), `url` (TEXT)
- **Optional:** `author`, `source`, `topics` (TEXT[]), `difficulty`, `rating` (NUMERIC), `key_takeaways` (TEXT[]), `date_added`, `publisher`

You may need to:
1. Verify your table name matches `technical_content` (or update the code)
2. Verify your column names match (or update the code)
3. Set up RLS policies for public read access
4. Run the verification script to check compatibility

### Create the Technical Content Table (New Database Only)

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL:

```sql
-- Create technical_content table
CREATE TABLE technical_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  source TEXT,
  topics TEXT[],
  difficulty TEXT,
  rating NUMERIC(3,2),
  key_takeaways TEXT[],
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  publisher TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enable Row Level Security

```sql
-- Enable RLS
ALTER TABLE technical_content ENABLE ROW LEVEL SECURITY;

-- Create public read-only policy
CREATE POLICY "Public can view all technical_content"
  ON technical_content FOR SELECT
  USING (true);
```

### Create Indexes for Performance

```sql
-- Create indexes
CREATE INDEX idx_technical_content_title ON technical_content(title);
CREATE INDEX idx_technical_content_topics ON technical_content USING GIN(topics);
CREATE INDEX idx_technical_content_difficulty ON technical_content(difficulty);
CREATE INDEX idx_technical_content_source ON technical_content(source);
CREATE INDEX idx_technical_content_publisher ON technical_content(publisher);
CREATE INDEX idx_technical_content_date_added ON technical_content(date_added DESC);
CREATE INDEX idx_technical_content_rating ON technical_content(rating DESC);
```

## Step 4: Add Sample Data (Optional)

You can add sample data to test the application:

```sql
INSERT INTO technical_content (title, url, author, source, topics, difficulty, rating, key_takeaways, publisher)
VALUES (
  'Introduction to React',
  'https://react.dev',
  'Facebook',
  'React Documentation',
  ARRAY['React', 'JavaScript', 'Frontend'],
  'Beginner',
  4.5,
  ARRAY['React is a JavaScript library', 'Component-based architecture', 'Virtual DOM'],
  'Meta'
),
(
  'Advanced TypeScript Patterns',
  'https://typescript-handbook.com',
  'Microsoft',
  'TypeScript Handbook',
  ARRAY['TypeScript', 'Programming', 'Advanced'],
  'Advanced',
  4.8,
  ARRAY['Advanced type patterns', 'Generic constraints', 'Conditional types'],
  'Microsoft'
);
```

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Resources not showing up

- Check that your `.env.local` file has the correct Supabase URL and anon key
- Verify that RLS policies are enabled and the public read policy is created
- Check the browser console for any errors
- Verify that data exists in your `technical_content` table
- Verify the table name is exactly `technical_content` (case-sensitive)

### Filters not working

- Ensure your database columns match the expected schema
- Check that array fields (topics, key_takeaways) are properly formatted as PostgreSQL arrays
- Verify that indexes are created for performance

### Build errors

- Make sure all dependencies are installed: `npm install`
- Clear the `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Restart the dev server

## Next Steps

- Customize the card display fields in `components/features/ResourceCard.tsx`
- Adjust filtering options in `components/features/FilterPanel.tsx`
- Modify the search functionality in `lib/hooks/useResources.ts`
- Add your own styling in `app/globals.css`

