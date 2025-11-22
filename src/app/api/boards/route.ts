import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Board from '@/models/Board';

export async function GET() {
  await dbConnect();
  try {
    const boards = await Board.find({}).sort({ createdAt: -1 });
    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const board = await Board.create(body);
    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
  }
}

