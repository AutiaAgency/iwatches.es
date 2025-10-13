import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { purchases } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Extract pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter',
        code: 'INVALID_LIMIT' 
      }, { status: 400 });
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter',
        code: 'INVALID_OFFSET' 
      }, { status: 400 });
    }

    // Query purchases filtered by authenticated user and ordered by purchase date
    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, session.user.id))
      .orderBy(desc(purchases.purchaseDate))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(userPurchases, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}