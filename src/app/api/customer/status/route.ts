import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { purchases } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userId = session.user.id;

    // Query purchases table to count user's purchases
    const result = await db
      .select({ count: count() })
      .from(purchases)
      .where(eq(purchases.userId, userId));

    const purchaseCount = result[0]?.count || 0;
    const isCustomer = purchaseCount > 0;

    return NextResponse.json({
      isCustomer,
      purchaseCount
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}