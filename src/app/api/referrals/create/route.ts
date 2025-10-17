import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { referrals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

async function isCodeUnique(code: string): Promise<boolean> {
  const existing = await db.select()
    .from(referrals)
    .where(eq(referrals.code, code))
    .limit(1);
  return existing.length === 0;
}

async function generateUniqueCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const code = generateReferralCode();
    if (await isCodeUnique(code)) {
      return code;
    }
    attempts++;
  }
  
  throw new Error('Failed to generate unique referral code after maximum attempts');
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check using better-auth
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Security check: reject if userId provided in body
    const body = await request.json().catch(() => ({}));
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { 
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED' 
        },
        { status: 400 }
      );
    }

    // Check if user already has a referral code
    const existingReferral = await db.select()
      .from(referrals)
      .where(eq(referrals.userId, userId))
      .limit(1);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If code exists, return existing code with shareUrl
    if (existingReferral.length > 0) {
      const code = existingReferral[0].code;
      return NextResponse.json({
        code,
        shareUrl: `${appUrl}/catalog?ref=${code}`
      }, { status: 200 });
    }

    // Generate unique referral code
    const code = await generateUniqueCode();

    // Insert new referral record
    const newReferral = await db.insert(referrals)
      .values({
        userId,
        code,
        createdAt: new Date()
      })
      .returning();

    if (newReferral.length === 0) {
      throw new Error('Failed to create referral code');
    }

    // Return response with code and shareUrl
    return NextResponse.json({
      code: newReferral[0].code,
      shareUrl: `${appUrl}/catalog?ref=${newReferral[0].code}`
    }, { status: 201 });

  } catch (error) {
    console.error('POST referral error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}