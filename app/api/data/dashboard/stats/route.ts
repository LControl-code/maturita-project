import { NextResponse } from 'next/server'
import { getStatsRecord  } from '@/lib/pocketbase_connect';

export async function GET() {
    try {
        const stats = await getStatsRecord();

        return NextResponse.json({
            totalTested: stats.totalTested ?? 0,
            activeStations: stats.activeStations ?? 0,
            todaysProduction: stats.todaysProduction ?? 0,
            overallEfficiency: stats.overallEfficiency ?? 0,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to stats data', message: error.message });
        } else {
            return NextResponse.json({ error: 'Failed to stats data', message: 'Unknown error' });
        }
    }
}