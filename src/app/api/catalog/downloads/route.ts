import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { catalogDownloads } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '50'),
      100
    );
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate pagination parameters
    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return NextResponse.json(
        { 
          error: 'Invalid pagination parameters',
          code: 'INVALID_PAGINATION' 
        },
        { status: 400 }
      );
    }

    // Query catalog downloads for the authenticated user
    const downloads = await db
      .select()
      .from(catalogDownloads)
      .where(eq(catalogDownloads.userId, userId))
      .orderBy(desc(catalogDownloads.downloadedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(downloads, { status: 200 });
  } catch (error) {
    console.error('GET catalog downloads error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}