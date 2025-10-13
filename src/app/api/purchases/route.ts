import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { purchases } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const requestBody = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { watchName, watchReference, purchaseAmount, purchaseDate, notes } = requestBody;

    // Validate required fields
    if (!watchName || typeof watchName !== 'string' || watchName.trim() === '') {
      return NextResponse.json({ 
        error: "Watch name is required and must be a non-empty string",
        code: "MISSING_WATCH_NAME" 
      }, { status: 400 });
    }

    if (!watchReference || typeof watchReference !== 'string' || watchReference.trim() === '') {
      return NextResponse.json({ 
        error: "Watch reference is required and must be a non-empty string",
        code: "MISSING_WATCH_REFERENCE" 
      }, { status: 400 });
    }

    if (purchaseAmount === undefined || purchaseAmount === null) {
      return NextResponse.json({ 
        error: "Purchase amount is required",
        code: "MISSING_PURCHASE_AMOUNT" 
      }, { status: 400 });
    }

    if (typeof purchaseAmount !== 'number' || isNaN(purchaseAmount)) {
      return NextResponse.json({ 
        error: "Purchase amount must be a valid number",
        code: "INVALID_PURCHASE_AMOUNT" 
      }, { status: 400 });
    }

    if (purchaseAmount < 0) {
      return NextResponse.json({ 
        error: "Purchase amount cannot be negative",
        code: "NEGATIVE_PURCHASE_AMOUNT" 
      }, { status: 400 });
    }

    if (!purchaseDate) {
      return NextResponse.json({ 
        error: "Purchase date is required",
        code: "MISSING_PURCHASE_DATE" 
      }, { status: 400 });
    }

    // Validate and convert purchaseDate to Date object
    let parsedPurchaseDate: Date;
    try {
      parsedPurchaseDate = new Date(purchaseDate);
      if (isNaN(parsedPurchaseDate.getTime())) {
        return NextResponse.json({ 
          error: "Purchase date must be a valid ISO date string",
          code: "INVALID_PURCHASE_DATE" 
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ 
        error: "Purchase date must be a valid ISO date string",
        code: "INVALID_PURCHASE_DATE" 
      }, { status: 400 });
    }

    // Validate notes if provided
    if (notes !== undefined && notes !== null && typeof notes !== 'string') {
      return NextResponse.json({ 
        error: "Notes must be a string",
        code: "INVALID_NOTES" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      userId: session.user.id,
      watchName: watchName.trim(),
      watchReference: watchReference.trim(),
      purchaseAmount,
      purchaseDate: parsedPurchaseDate,
      notes: notes ? notes.trim() : null,
      createdAt: new Date()
    };

    // Insert into database
    const newPurchase = await db.insert(purchases)
      .values(insertData)
      .returning();

    return NextResponse.json(newPurchase[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}