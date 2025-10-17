import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { catalogDownloads } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check using better-auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Extract userId from authenticated session
    const userId = session.user.id;

    // Query catalog_downloads to count referrals
    const result = await db
      .select({ count: count() })
      .from(catalogDownloads)
      .where(eq(catalogDownloads.referredBy, userId));

    const totalReferrals = result[0]?.count || 0;

    // Calculate premium unlock status
    const premiumUnlocked = totalReferrals >= 3;

    return NextResponse.json({
      totalReferrals,
      premiumUnlocked
    }, { status: 200 });

  } catch (error) {
    console.error('GET referral stats error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: Failed to retrieve referral statistics'
      },
      { status: 500 }
    );
  }
}