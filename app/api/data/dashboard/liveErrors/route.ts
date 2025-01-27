import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:8090/api/liveErrorsNew', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch external data (status: ${res.status}).`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
