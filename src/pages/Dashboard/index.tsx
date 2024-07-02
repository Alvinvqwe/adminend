import { PageContainer } from '@ant-design/pro-components';
import ProSkeleton from '@ant-design/pro-skeleton';
import React, { Suspense } from 'react';
const UsersGA = React.lazy(() => import('./users'));
const AnalyticsChart = React.lazy(() => import('./ga4'));

const Dashboard = () => {
  return (
    <PageContainer>
      <Suspense fallback={<ProSkeleton type="descriptions" />}>
        <UsersGA />
        <AnalyticsChart />
      </Suspense>
    </PageContainer>
  );
};

export default Dashboard;
