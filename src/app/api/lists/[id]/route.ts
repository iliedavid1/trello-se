import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { List, Card } from '@/models/List';

interface RouteParams {
  params: {
    id: string;
  };
}

// UPDATE list name
export async function PUT(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const body = await request.json();
    const list = await List.findByIdAndUpdate(
      params.id,
      { name: body.name },
      { new: true }
    ).populate('cards');
    
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
}

// DELETE list (and its cards)
export async function DELETE(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    // Delete all cards in this list first
    await Card.deleteMany({ listId: params.id });
    
    const list = await List.findByIdAndDelete(params.id);
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'List deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
}

