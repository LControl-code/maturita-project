import { NextResponse } from 'next/server'
import { getTopFailsData } from '@/lib/pocketbase_connect';

export async function GET() {
  try {
    const data = await getTopFailsData();

    const issueCountData = {
      'Issue Count': {
        'S02': {
          material: 20,
          tester: 15,
        },
        'A20': {
          material: 10,
          tester: 8,
        },
        'A25': {
          material: 5,
          tester: 3,
        },
      },
    };

    const mergedData = {
      ...data,
      ...issueCountData
    };

    return NextResponse.json(mergedData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch top fails data', message: error.message });
    } else {
      return NextResponse.json({ error: 'Failed to fetch top fails data', message: 'Unknown error' });
    }
  }
}