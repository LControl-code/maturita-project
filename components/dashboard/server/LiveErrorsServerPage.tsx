import { getLiveErrorsData } from '@/lib/pocketbase_connect';
import LiveErrors from '@/components/dashboard/LiveErrors';
import { ErrorData } from '@/types/errors';

async function getLiveErrors(): Promise<ErrorData[]> {
  const LiveErrorsData = await getLiveErrorsData();

  return LiveErrorsData;
}


export default async function LiveErrorsServerPage() {
  const initialData = await getLiveErrors();

  return <LiveErrors initialData={initialData} />;
}