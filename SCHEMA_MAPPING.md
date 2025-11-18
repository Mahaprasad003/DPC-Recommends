# Schema Mapping Guide

If your existing database has a different table name or column names, this guide will help you map it to work with DPC Recommends.

## Table Name Mapping

The app is configured to use the `technical_content` table. If your table has a different name, you need to update the code:

### Option 1: Update the Code (Recommended)

1. **Update `lib/hooks/useResources.ts`**:

Find and replace all instances of `'technical_content'` with your table name:

```typescript
// Change from:
let query = supabase.from('technical_content').select('*');

// To:
let query = supabase.from('your_table_name').select('*');
```

Do this in both the `useResources` and `useResourceOptions` functions.

2. **Update `app/api/verify/route.ts`** (if using the verification API):

```typescript
// Change from:
.from('resources')

// To:
.from('your_table_name')
```

3. **Update `scripts/verify-schema.ts`** (if using the verification script):

```typescript
// Change from:
.from('resources')

// To:
.from('your_table_name')
```

### Option 2: Create a Database View (Alternative)

If you can't modify the code, create a view in your database:

```sql
CREATE VIEW technical_content AS
SELECT 
  id,
  title,
  url,
  -- Map your columns to expected names
  your_author_column AS author,
  your_source_column AS source,
  -- ... etc
FROM your_actual_table_name;
```

## Column Name Mapping

If your columns have different names, you have two options:

### Option 1: Update the TypeScript Types and Code

1. **Update `types/database.ts`**:

```typescript
export interface Resource {
  id: string;
  title: string;
  url: string;
  author: string | null;        // Change if your column is named differently
  source: string | null;        // Change if your column is named differently
  topics: string[] | null;      // Change if your column is named differently
  // ... etc
}
```

2. **Update `lib/hooks/useResources.ts`**:

Update the select query to use your column names, or use aliases:

```typescript
// If your columns are named differently, you can use aliases in the select
let query = supabase
  .from('your_table')
  .select(`
    id,
    title,
    url,
    your_author_column:author,
    your_source_column:source,
    your_topics_column:topics
    -- ... etc
  `);
```

3. **Update `components/features/ResourceCard.tsx`**:

Update references to use your column names:

```typescript
// Change from:
{resource.author && (
  <div>{resource.author}</div>
)}

// To match your column name if different
{resource.your_author_column && (
  <div>{resource.your_author_column}</div>
)}
```

### Option 2: Use Database Views or Functions

Create a view that maps your columns:

```sql
CREATE VIEW resources AS
SELECT 
  id,
  title,
  url,
  your_author_column AS author,
  your_source_column AS source,
  your_topics_array AS topics,
  your_difficulty_column AS difficulty,
  your_rating_column AS rating,
  your_key_takeaways_array AS key_takeaways,
  your_date_column AS date_added,
  your_publisher_column AS publisher
FROM your_actual_table;
```

## Common Column Name Variations

Here are some common variations and how to handle them:

### Author Column
- `author` ✅ (matches)
- `authors` → Update code or create alias
- `author_name` → Update code or create alias
- `creator` → Update code or create alias

### Source Column
- `source` ✅ (matches)
- `sources` → Update code or create alias
- `publication` → Update code or create alias
- `origin` → Update code or create alias

### Topics Column
- `topics` ✅ (matches)
- `tags` → Update code or create alias
- `categories` → Update code or create alias
- `subject` → Update code or create alias

### Difficulty Column
- `difficulty` ✅ (matches)
- `level` → Update code or create alias
- `difficulty_level` → Update code or create alias
- `skill_level` → Update code or create alias

### Rating Column
- `rating` ✅ (matches)
- `score` → Update code or create alias
- `stars` → Update code or create alias
- `rating_value` → Update code or create alias

### Date Column
- `date_added` ✅ (matches)
- `created_at` → Update code or create alias
- `added_at` → Update code or create alias
- `date_created` → Update code or create alias

## Data Type Mapping

### Arrays (Topics, Key Takeaways)

If your topics or key_takeaways are stored as:
- **JSON/JSONB**: Convert to TEXT[] in a view or update code to parse JSON
- **Comma-separated string**: Convert to array using `string_to_array()` in a view
- **Separate table**: Use a JOIN in a view or modify the query

**Example for comma-separated string:**
```sql
CREATE VIEW technical_content AS
SELECT 
  id,
  title,
  url,
  string_to_array(topics_csv, ',') AS topics,
  -- ... etc
FROM your_table;
```

**Example for JSON:**
```sql
CREATE VIEW technical_content AS
SELECT 
  id,
  title,
  url,
  ARRAY(SELECT jsonb_array_elements_text(topics_json)) AS topics,
  -- ... etc
FROM your_table;
```

### Rating/Numeric Fields

If your rating is stored as:
- **Integer (1-5)**: The app expects NUMERIC, but integers work fine
- **String ("4.5")**: Convert to NUMERIC in a view: `CAST(rating_str AS NUMERIC)`
- **Percentage (0-100)**: Convert in a view: `rating_percent / 20.0` (to convert to 0-5 scale)

### Date Fields

If your date is stored as:
- **TIMESTAMP**: Works as-is
- **DATE**: Convert to TIMESTAMP: `your_date_column::TIMESTAMP`
- **String**: Parse to TIMESTAMP: `to_timestamp(your_date_str, 'YYYY-MM-DD')`
- **Unix timestamp**: Convert: `to_timestamp(unix_timestamp)`

## Missing Columns

If you're missing optional columns, the app will still work:

### Topics Missing
- Filters for topics won't work
- Hide topic filter in `components/features/FilterPanel.tsx`
- Remove topic display from `components/features/ResourceCard.tsx`

### Difficulty Missing
- Difficulty filter won't work
- Hide difficulty filter in `components/features/FilterPanel.tsx`
- Remove difficulty badge from `components/features/ResourceCard.tsx`

### Rating Missing
- Rating filter won't work
- Hide rating filter in `components/features/FilterPanel.tsx`
- Remove rating display from `components/features/ResourceCard.tsx`

### Key Takeaways Missing
- Key takeaways won't display
- Remove key takeaways section from `components/features/ResourceCard.tsx`

## Example: Mapping a Different Schema

Let's say your table is named `recommendations` with these columns:
- `id`, `name`, `link`, `writer`, `publication`, `tags`, `level`, `score`, `notes`, `added_date`, `publisher_name`

**Option 1: Create a view**
```sql
CREATE VIEW technical_content AS
SELECT 
  id,
  name AS title,
  link AS url,
  writer AS author,
  publication AS source,
  tags AS topics,
  level AS difficulty,
  score AS rating,
  string_to_array(notes, '|') AS key_takeaways,
  added_date AS date_added,
  publisher_name AS publisher
FROM recommendations;
```

**Option 2: Update the code**
1. Update `lib/hooks/useResources.ts` to use `recommendations` table
2. Update column references throughout the codebase
3. Update `types/database.ts` to match your schema

## Testing Your Mapping

After making changes:

1. **Run the verification script:**
   ```bash
   npx tsx scripts/verify-schema.ts
   ```

2. **Or test the API:**
   ```bash
   curl http://localhost:3000/api/verify
   ```

3. **Check the browser console** for any errors

4. **Test search and filters** to ensure everything works

## Need Help?

If you're having trouble mapping your schema:
1. Check your database schema in Supabase
2. Compare it with the expected schema in `QUICK_START.md`
3. Use the verification script to see what's different
4. Create a view if you can't modify the code
5. Update the code if you can modify it

