import { NextResponse } from 'next/server'
import { getLiveErrorsData } from '@/lib/pocketbase_connect';

export async function GET() {
  try {
    const data = await getLiveErrorsData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch failed tests graph data', message: error.message });
    } else {
      return NextResponse.json({ error: 'Failed to fetch failed tests graph data', message: 'Unknown error' });
    }
  }
}