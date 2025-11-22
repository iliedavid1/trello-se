import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Board from '@/models/Board';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const board = await Board.findById(params.id);
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const body = await request.json();
    const board = await Board.findByIdAndUpdate(
      params.id,
      { name: body.name },
      { new: true }
    );
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const board = await Board.findByIdAndDelete(params.id);
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Board deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
  }
}

