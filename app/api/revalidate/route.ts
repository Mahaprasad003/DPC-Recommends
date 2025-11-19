import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * API route to manually revalidate cache when database is updated
 * 
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET&tags=resources,resource-options,sneak-peek-content
 * 
 * Set REVALIDATE_SECRET in your environment variables for security
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const tags = searchParams.get('tags');

  // Check for secret to confirm this is a valid request
  const validSecret = process.env.REVALIDATE_SECRET;
  
  if (!validSecret) {
    return NextResponse.json(
      { error: 'Revalidation not configured. Set REVALIDATE_SECRET in environment variables.' },
      { status: 500 }
    );
  }

  if (secret !== validSecret) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!tags) {
    return NextResponse.json(
      { error: 'No tags provided. Use ?tags=resources,resource-options,sneak-peek-content' },
      { status: 400 }
    );
  }

  try {
    const tagList = tags.split(',').map(tag => tag.trim());
    
    for (const tag of tagList) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      tags: tagList,
      now: Date.now(),
    });
  } catch (err: any) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { error: 'Error revalidating: ' + err.message },
      { status: 500 }
    );
  }
}
