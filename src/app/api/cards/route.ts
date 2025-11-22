import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Card } from '@/models/List';

// POST new card
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const card = await Card.create(body);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('POST /api/cards failed', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

