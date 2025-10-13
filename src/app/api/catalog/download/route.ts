import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { catalogDownloads } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { catalogType, email } = body;

    // Validate catalogType is present
    if (!catalogType) {
      return NextResponse.json(
        { 
          error: 'catalogType is required',
          code: 'MISSING_CATALOG_TYPE' 
        },
        { status: 400 }
      );
    }

    // Validate catalogType is either "public" or "premium"
    if (catalogType !== 'public' && catalogType !== 'premium') {
      return NextResponse.json(
        { 
          error: 'catalogType must be either "public" or "premium"',
          code: 'INVALID_CATALOG_TYPE' 
        },
        { status: 400 }
      );
    }

    // Get session for authentication check
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    let userId: string | null = null;
    let downloadEmail: string | null = null;

    // Handle premium catalog - requires authentication
    if (catalogType === 'premium') {
      if (!session || !session.user) {
        return NextResponse.json(
          { 
            error: 'Premium catalog requires authentication',
            code: 'AUTHENTICATION_REQUIRED' 
          },
          { status: 401 }
        );
      }
      userId = session.user.id;
      downloadEmail = null;
    }

    // Handle public catalog - authentication optional
    if (catalogType === 'public') {
      if (session && session.user) {
        // User is authenticated - use their userId
        userId = session.user.id;
        downloadEmail = null;
      } else {
        // User is not authenticated - require email
        if (!email || email.trim() === '') {
          return NextResponse.json(
            { 
              error: 'Email is required for public catalog download',
              code: 'EMAIL_REQUIRED' 
            },
            { status: 400 }
          );
        }
        userId = null;
        downloadEmail = email.trim().toLowerCase();
      }
    }

    // Create download record
    const newDownload = await db.insert(catalogDownloads)
      .values({
        userId,
        email: downloadEmail,
        catalogType,
        downloadedAt: new Date()
      })
      .returning();

    return NextResponse.json(newDownload[0], { status: 201 });

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