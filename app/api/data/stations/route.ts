import { NextResponse } from 'next/server'
import { getLimitsForMotorType } from '@/lib/pocketbase_connect';

export async function GET() {
  try {
    const data = await getLimitsForMotorType();
    return NextResponse.json(data)
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch S02 limits', message: error.message });
    } else {
      return NextResponse.json({ error: 'Failed to fetch S02 limits', message: 'Unknown error' });
    }
  }
}