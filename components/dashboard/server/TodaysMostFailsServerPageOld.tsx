import { getTopFailsData } from '@/lib/pocketbase_connect';
import TodaysMostFailsOld from '@/components/dashboard/TodaysMostFailsOld';
import { FailsData } from '@/types';

async function getTodaysMostFailsData(): Promise<FailsData> {
  const todaysMostFailsData = await getTopFailsData();
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

  return {
    ...todaysMostFailsData,
    ...issueCountData
  };
}

export default async function TodaysMostFailsServerPageOld() {
  const initialData = await getTodaysMostFailsData();

  return <TodaysMostFailsOld initialData={initialData} />;
}