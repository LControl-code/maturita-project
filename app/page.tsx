import DashboardOverviewServerPage from '@/components/dashboard/server/DashboardOverviewServerPage';
import ProductionStatus from '@/components/dashboard/ProductionStatus';
import LiveErrorsServerPage from '@/components/dashboard/server/LiveErrorsServerPage';
import Notifications from '@/components/dashboard/Notifications';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

import FailedTestsGraph from '@/components/dashboard/FailedTestsGraph'
import TodaysMostFails from '@/components/dashboard/TodaysMostFails'
import LiveErrors from '@/components/dashboard/LiveErrors';


export default function DashboardPage() {

    return (
        <div className="container mx-auto p-4 space-y-6">
            <WelcomeMessage />

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <DashboardOverviewServerPage />
                <ProductionStatus />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LiveErrors />
                <TodaysMostFails />
                <Notifications />
            </div>

            <FailedTestsGraph />
        </div>
    );
}