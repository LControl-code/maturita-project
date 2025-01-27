export const revalidate = 0 // Set to 0 for on-demand revalidation
import SSEClient from '@/components/SSEClient';

import ProductionStatus from '@/components/dashboard/ProductionStatus';
import Notifications from '@/components/dashboard/Notifications';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

import FailedTestsGraph from '@/components/dashboard/FailedTestsGraph'
import TodaysMostFails from '@/components/dashboard/TodaysMostFails'
import LiveErrors from '@/components/dashboard/LiveErrors';
import DashboardOverview from '@/components/dashboard/DashboardOverview';


export default function DashboardPage() {

    return (
        <>
            {/* SSE subscription that triggers router.refresh() on DB changes */}
            <SSEClient />
            <div className="container mx-auto p-4 space-y-6">
                <WelcomeMessage />

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <DashboardOverview />
                    <ProductionStatus />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LiveErrors />
                    <TodaysMostFails />
                    <Notifications />
                </div>

                <FailedTestsGraph />
            </div>
        </>
    );
}