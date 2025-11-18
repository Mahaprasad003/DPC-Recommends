# DPC Recommends

A sleek, minimal, and secure frontend application for displaying resources from a Supabase database. Features advanced search and filtering capabilities with a beautiful card-based UI.

## Features

- 🔍 **Advanced Search**: Search across multiple fields (title, author, source, publisher, topics, key takeaways)
- 🎯 **Smart Filtering**: Filter by topics, difficulty, source, publisher, author, rating, and date
- 🎴 **Card-Based Layout**: Clean, responsive card grid displaying resource information
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Optimized with React Query for efficient data fetching and caching
- 🔒 **Secure**: Public read-only access with Row Level Security (RLS) policies

## Prerequisites

- Node.js 18+ and npm
- A Supabase project with a `technical_content` table

## Setup

> **Already have a database?** See [QUICK_START.md](./QUICK_START.md) for faster setup instructions.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DPC-Recommends
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Set up Supabase database

Create the `technical_content` table in your Supabase database:

```sql
-- Create technical_content table
CREATE TABLE technical_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  source TEXT,
  topics TEXT[], -- Array of topics/tags
  difficulty TEXT, -- e.g., "Beginner", "Intermediate", "Advanced"
  rating NUMERIC(3,2), -- e.g., 4.5 (out of 5)
  key_takeaways TEXT[], -- Array of key takeaways
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  publisher TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE technical_content ENABLE ROW LEVEL SECURITY;

-- Create public read-only policy
CREATE POLICY "Public can view all technical_content"
  ON technical_content FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_technical_content_title ON technical_content(title);
CREATE INDEX idx_technical_content_topics ON technical_content USING GIN(topics);
CREATE INDEX idx_technical_content_difficulty ON technical_content(difficulty);
CREATE INDEX idx_technical_content_source ON technical_content(source);
CREATE INDEX idx_technical_content_publisher ON technical_content(publisher);
CREATE INDEX idx_technical_content_date_added ON technical_content(date_added DESC);
CREATE INDEX idx_technical_content_rating ON technical_content(rating DESC);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dpc-recommends/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with search, filters, and cards
│   ├── providers.tsx       # React Query provider
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tag.tsx
│   │   └── Select.tsx
│   ├── features/           # Feature components
│   │   ├── ResourceCard.tsx
│   │   ├── CardGrid.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   └── client.ts       # Supabase client configuration
│   ├── hooks/
│   │   └── useResources.ts # Data fetching hooks
│   └── utils/              # Utility functions
│       ├── validation.ts
│       ├── sanitize.ts
│       ├── format.ts
│       └── cn.ts
├── types/
│   └── database.ts         # TypeScript types
└── package.json
```

## Existing Database Setup

If you already have a database with content:

1. **Quick Start**: Follow [QUICK_START.md](./QUICK_START.md)
2. **Schema Mapping**: If your table/column names are different, see [SCHEMA_MAPPING.md](./SCHEMA_MAPPING.md)
3. **Verification**: Use the verification script or API to check your setup

## Usage

### Adding Content

Content can be added directly to the Supabase database through the Supabase dashboard or API. The `technical_content` table structure supports:

- **title** (required): Resource title
- **url** (required): Link to the resource
- **author**: Author name(s)
- **source**: Source/publication name
- **topics**: Array of topics/tags
- **difficulty**: Difficulty level (Beginner, Intermediate, Advanced)
- **rating**: Rating value (0-5)
- **key_takeaways**: Array of key takeaways
- **date_added**: When the resource was added
- **publisher**: Publisher name

### Searching

Users can search across multiple fields:
- Title
- Author
- Source
- Publisher
- Topics
- Key Takeaways

### Filtering

Users can filter resources by:
- Topics (multi-select)
- Difficulty level
- Source
- Publisher
- Author
- Rating range
- Date range

### Sorting

Resources can be sorted by:
- Date Added (default)
- Rating
- Title
- Difficulty

## Security

- **Row Level Security (RLS)**: Enabled on all tables with public read-only access
- **Input Validation**: All user inputs are validated and sanitized
- **XSS Protection**: Content is sanitized to prevent XSS attacks
- **Rate Limiting**: Recommended for production deployment
- **HTTPS Only**: All connections should use HTTPS in production

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Self-hosted with Node.js

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

## Troubleshooting

### No Data Showing (0 rows) but SQL works in Supabase

**This is almost always an RLS (Row Level Security) issue!**

When you run SQL in Supabase SQL Editor, it uses the service role key (full access).
Your app uses the anon key, which is restricted by RLS policies.

**Quick Fix:**
1. Run the SQL in `QUICK_FIX_RLS.sql` in your Supabase SQL Editor
2. Or see `TROUBLESHOOTING.md` for detailed step-by-step guide

**Common causes:**
- RLS is enabled but no SELECT policy exists
- Policy exists but doesn't allow public access
- Policy uses wrong conditions

### Resources not loading

- Check that your Supabase URL and anon key are correct in `.env.local`
- **Verify RLS policies allow public SELECT access** (most common issue!)
- Check the browser console for errors
- Visit `/test-db` to debug the connection
- Verify your data exists in the table
- See `TROUBLESHOOTING.md` for comprehensive debugging guide

### Filters not working

- Ensure your database columns match the expected types
- Check that array fields (topics, key_takeaways) are properly formatted
- Verify indexes are created for performance

### Styling issues

- Make sure Tailwind CSS is properly configured
- Clear `.next` folder and restart the dev server
- Check that `globals.css` is imported in `layout.tsx`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

