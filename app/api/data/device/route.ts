import { NextResponse } from 'next/server';
import { getDeviceData } from '@/lib/pocketbase_connect'; // Assuming you have a function to get device data

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceCode = searchParams.get('deviceCode');

  if (!deviceCode) {
    return NextResponse.json({ error: 'Missing deviceCode parameter' }, { status: 400 });
  }

  try {
    const data = await getDeviceData(deviceCode);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch device data', message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch device data', message: 'Unknown error' }, { status: 500 });
    }
  }
}