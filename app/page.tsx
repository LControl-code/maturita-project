import React from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProductionStatus from '@/components/dashboard/ProductionStatus';
import LiveErrorsServerPage from '@/components/dashboard/server/LiveErrorsServerPage';
import TodaysMostFailsServerPage from '@/components/dashboard/server/TodaysMostFailsServerPage';
import Notifications from '@/components/dashboard/Notifications';
import FailedTestsGraphServerPage from '@/components/dashboard/server/FailedTestsGraphServerPage';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

export default function DashboardPage() {

  return (
    <div className="container mx-auto p-4 space-y-6">
      <WelcomeMessage />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <DashboardOverview />
        <ProductionStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LiveErrorsServerPage />
        <TodaysMostFailsServerPage />
        <Notifications />
      </div>

      <FailedTestsGraphServerPage />
    </div>
  );
}