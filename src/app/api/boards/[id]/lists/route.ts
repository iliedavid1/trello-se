import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { List, Card } from '@/models/List';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET lists for a board
export async function GET(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const lists = await List.find({ boardId: params.id })
      .populate('cards')
      .sort({ createdAt: 1 });
    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// POST new list to a board
export async function POST(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const body = await request.json();
    const list = await List.create({
      ...body,
      boardId: params.id,
    });
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}

