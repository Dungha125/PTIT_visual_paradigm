import { NextRequest, NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET(request: NextRequest) {
  try {
    // This route is used to initialize the socket server
    // The actual socket connection is handled by the client
    return NextResponse.json({ message: 'Socket server ready' });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json({ error: 'Socket initialization failed' }, { status: 500 });
  }
}
