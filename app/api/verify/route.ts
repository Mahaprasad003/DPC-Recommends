import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test connection
    const { data, error } = await supabase
      .from('technical_content')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'Could not connect to database. Please check your environment variables and RLS policies.',
        },
        { status: 500 }
      );
    }

    // Get sample data to check schema
    const { data: sampleData } = await supabase
      .from('technical_content')
      .select('*')
      .limit(1);

    const columnCount = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]).length : 0;

    // Get row count
    const { count } = await supabase
      .from('technical_content')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connected: true,
        tableExists: true,
        columnCount,
        rowCount: count || 0,
        sampleColumns: sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

