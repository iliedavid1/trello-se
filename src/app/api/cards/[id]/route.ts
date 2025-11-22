import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Card } from '@/models/List';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single card
export async function GET(_request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const card = await Card.findById(params.id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    return NextResponse.json(card);
  } catch (error) {
    console.error('GET /api/cards/[id] failed', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

// UPDATE card (title, description)
export async function PUT(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const body = await request.json();
    const card = await Card.findByIdAndUpdate(
      params.id,
      { 
        title: body.title,
        description: body.description 
      },
      { new: true }
    );
    
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    return NextResponse.json(card);
  } catch (error) {
    console.error('PUT /api/cards/[id] failed', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE card
export async function DELETE(_request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const card = await Card.findByIdAndDelete(params.id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/cards/[id] failed', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

