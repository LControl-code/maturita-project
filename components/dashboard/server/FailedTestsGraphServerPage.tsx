import { getFailedTestsGraphData } from '@/lib/pocketbase_connect';
import FailedTestsGraphOld from '@/components/dashboard/FailedTestsGraphOld';
import { FailsData } from '@/types/api';

async function getFailedTestsGraph(): Promise<FailsData> {
  const failsDataFailedTestsGraphData = await getFailedTestsGraphData();

  return failsDataFailedTestsGraphData;
}


export default async function FailedTestsGraphServerPage() {
  const initialData = await getFailedTestsGraph();

  return <FailedTestsGraphOld initialData={initialData} />;
}