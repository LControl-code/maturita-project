import { getStatsRecord } from '@/lib/pocketbase_connect';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

async function getStatsRecordData() {
    const statsData = await getStatsRecord();

    return statsData;
}

export default async function FailedTestsGraphServerPage() {
    const initialData = await getStatsRecordData();

    return <DashboardOverview initialData={initialData} />;
}