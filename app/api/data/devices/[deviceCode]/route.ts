import { NextResponse } from 'next/server';
import { getDeviceData } from '@/lib/pocketbase_connect';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const encodedDeviceCode = pathSegments[pathSegments.length - 1];
  const deviceCode = decodeURIComponent(encodedDeviceCode);

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