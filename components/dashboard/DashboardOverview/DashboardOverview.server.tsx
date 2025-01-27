import { getStatsRecord } from '@/lib/pocketbase_connect';
import DashboardOverviewClient from './DashboardOverview.client';

export async function fetchDashboardOverviewData() {
  const statsData = await getStatsRecord();
  return statsData;
}

/**
 * Server component that fetches initial dashboard overview data and renders the client-side dashboard overview component.
 * 
 * @returns {Promise<JSX.Element>} A Promise that resolves to the DashboardOverviewClient component with fetched initial data.
 *
 * @example
 * // Usage in a parent component:
 * <DashboardOverview />
 */
export default async function DashboardOverview() {
  const initialData = await fetchDashboardOverviewData();
  return <DashboardOverviewClient initialData={initialData} />;
}
