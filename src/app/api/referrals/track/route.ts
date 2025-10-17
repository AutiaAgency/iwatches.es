import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referrals, catalogDownloads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, email, name } = body;

    // Validate required fields
    if (!referralCode || typeof referralCode !== 'string' || referralCode.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Referral code is required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Email is required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Name is required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedReferralCode = referralCode.trim();

    // Look up the referral code to find the referrer
    const referralRecord = await db.select()
      .from(referrals)
      .where(eq(referrals.code, sanitizedReferralCode))
      .limit(1);

    if (referralRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'Referral code not found',
          code: 'INVALID_REFERRAL_CODE'
        },
        { status: 404 }
      );
    }

    const referrerId = referralRecord[0].userId;

    // Check if this email has already been used with this referral code
    const existingDownload = await db.select()
      .from(catalogDownloads)
      .where(
        and(
          eq(catalogDownloads.email, sanitizedEmail),
          eq(catalogDownloads.referredBy, referrerId)
        )
      )
      .limit(1);

    if (existingDownload.length > 0) {
      return NextResponse.json(
        { 
          error: 'This email has already used this referral code',
          code: 'ALREADY_REFERRED'
        },
        { status: 409 }
      );
    }

    // Create new catalog_downloads record
    await db.insert(catalogDownloads).values({
      userId: null,
      email: sanitizedEmail,
      catalogType: 'public',
      downloadedAt: new Date(),
      referredBy: referrerId
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Referral tracked successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}