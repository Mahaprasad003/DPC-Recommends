/**
 * Schema Verification Script
 * 
 * This script verifies that your Supabase database schema matches
 * the expected structure for DPC Recommends.
 * 
 * Run with: npx tsx scripts/verify-schema.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ExpectedColumn {
  name: string;
  type: string;
  nullable: boolean;
  isArray?: boolean;
}

const expectedColumns: ExpectedColumn[] = [
  { name: 'id', type: 'uuid', nullable: false },
  { name: 'title', type: 'text', nullable: false },
  { name: 'url', type: 'text', nullable: false },
  { name: 'author', type: 'text', nullable: true },
  { name: 'source', type: 'text', nullable: true },
  { name: 'topics', type: 'text', nullable: true, isArray: true },
  { name: 'difficulty', type: 'text', nullable: true },
  { name: 'rating', type: 'numeric', nullable: true },
  { name: 'key_takeaways', type: 'text', nullable: true, isArray: true },
  { name: 'date_added', type: 'timestamptz', nullable: true },
  { name: 'publisher', type: 'text', nullable: true },
];

async function verifySchema() {
  console.log('🔍 Verifying database schema...\n');

  try {
    // Test connection by fetching one row
    const { data, error } = await supabase
      .from('technical_content')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error connecting to database:');
      console.error(error.message);
      
      if (error.message.includes('relation "technical_content" does not exist')) {
        console.error('\n💡 The "technical_content" table does not exist.');
        console.error('   Please check your table name or create the table using the SQL in SETUP.md');
      } else if (error.message.includes('permission denied')) {
        console.error('\n💡 Permission denied. Please check:');
        console.error('   1. Row Level Security (RLS) is enabled');
        console.error('   2. A public read policy exists for the technical_content table');
        console.error('   3. Your anon key has the correct permissions');
      }
      process.exit(1);
    }

    console.log('✅ Successfully connected to database');
    console.log(`✅ Found "technical_content" table\n`);

    // Get sample data to verify columns
    const { data: sampleData, error: sampleError } = await supabase
      .from('technical_content')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ Error fetching sample data:', sampleError.message);
      process.exit(1);
    }

    if (!sampleData || sampleData.length === 0) {
      console.log('⚠️  Table exists but contains no data');
      console.log('   This is okay - you can add data later\n');
    } else {
      console.log('✅ Table contains data');
      const sample = sampleData[0];
      console.log(`   Found ${Object.keys(sample).length} columns in sample row\n`);
    }

    // Verify column structure
    console.log('📋 Verifying column structure...\n');
    const { data: columns, error: columnsError } = await supabase
      .from('resources')
      .select('*')
      .limit(0);

    if (sampleData && sampleData.length > 0) {
      const actualColumns = Object.keys(sampleData[0]);
      const expectedColumnNames = expectedColumns.map((col) => col.name);

      console.log('Expected columns:', expectedColumnNames.join(', '));
      console.log('Actual columns:', actualColumns.join(', '));
      console.log('');

      // Check for missing columns
      const missingColumns = expectedColumnNames.filter(
        (col) => !actualColumns.includes(col)
      );

      if (missingColumns.length > 0) {
        console.log('⚠️  Missing columns:', missingColumns.join(', '));
        console.log('   The app may not work correctly without these columns\n');
      } else {
        console.log('✅ All expected columns are present\n');
      }

      // Check for extra columns
      const extraColumns = actualColumns.filter(
        (col) => !expectedColumnNames.includes(col) && col !== 'created_at' && col !== 'updated_at'
      );

      if (extraColumns.length > 0) {
        console.log('ℹ️  Extra columns found:', extraColumns.join(', '));
        console.log('   These will be ignored by the app (this is okay)\n');
      }

      // Verify data types for key columns
      const sample = sampleData[0];
      console.log('🔍 Verifying data types...\n');

      // Check topics (should be array)
      if ('topics' in sample) {
        const topicsType = Array.isArray(sample.topics) ? 'array' : typeof sample.topics;
        if (topicsType === 'array') {
          console.log('✅ topics: array (correct)');
        } else {
          console.log(`⚠️  topics: ${topicsType} (expected array)`);
        }
      }

      // Check key_takeaways (should be array)
      if ('key_takeaways' in sample) {
        const takeawaysType = Array.isArray(sample.key_takeaways) ? 'array' : typeof sample.key_takeaways;
        if (takeawaysType === 'array') {
          console.log('✅ key_takeaways: array (correct)');
        } else {
          console.log(`⚠️  key_takeaways: ${takeawaysType} (expected array)`);
        }
      }

      // Check rating (should be number)
      if ('rating' in sample) {
        const ratingType = typeof sample.rating;
        if (ratingType === 'number') {
          console.log('✅ rating: number (correct)');
        } else {
          console.log(`⚠️  rating: ${ratingType} (expected number)`);
        }
      }

      console.log('');
    }

    // Check RLS policies
    console.log('🔒 Checking Row Level Security...\n');
    const { data: rlsData, error: rlsError } = await supabase
      .from('technical_content')
      .select('id')
      .limit(1);

    if (rlsError && rlsError.message.includes('permission denied')) {
      console.log('❌ RLS policy may be blocking access');
      console.log('   Please ensure a public read policy exists:\n');
      console.log('   CREATE POLICY "Public can view all technical_content"');
      console.log('   ON technical_content FOR SELECT');
      console.log('   USING (true);\n');
    } else {
      console.log('✅ RLS allows public read access\n');
    }

    // Get row count
    const { count, error: countError } = await supabase
      .from('technical_content')
      .select('*', { count: 'exact', head: true });

    if (!countError && count !== null) {
      console.log(`📊 Total resources: ${count}\n`);
    }

    console.log('✅ Schema verification complete!');
    console.log('   Your database is ready to use with DPC Recommends.\n');

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

verifySchema();

