import PocketbaseSubscriber from '@/components/PocketbaseSubscriber'
import DashboardOverviewServerPage from '@/components/dashboard/server/DashboardOverviewServerPage';
import ProductionStatus from '@/components/dashboard/ProductionStatus';
import LiveErrorsServerPage from '@/components/dashboard/server/LiveErrorsServerPage';
import Notifications from '@/components/dashboard/Notifications';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

import FailedTestsGraph from '@/components/dashboard/FailedTestsGraph'
import TodaysMostFails from '@/components/dashboard/TodaysMostFails'

export default function DashboardPage() {

    return (
        <>
            <PocketbaseSubscriber
                collection="test_data"
                revalidateTags={{
                    onFail: [
                        'live_errors_tag',      // For Live Errors component
                        'top_fails_tag',        // For Today's Most Top Fails
                        'failed_tests_tag',     // For Failed Tests by Station
                    ],
                    onPass: [
                        'production_stats_tag', // For Device Overview & Production Status
                    ],
                    always: [
                        'device_stats_tag',     // For overall device statistics
                    ]
                }}
            />

            <div className="container mx-auto p-4 space-y-6">
                <WelcomeMessage/>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <DashboardOverviewServerPage/>
                    <ProductionStatus/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LiveErrorsServerPage/>
                    {/*<TodaysMostFailsServerPageOld/>*/}
                    <TodaysMostFails />
                    <Notifications/>
                </div>

                <FailedTestsGraph />
            </div>
        </>
    );
}