import { PageContainer } from '@ant-design/pro-components';
import ProSkeleton from '@ant-design/pro-skeleton';
import React, { Suspense } from 'react';
const UsersList = React.lazy(() => import('./UserList'));

const Dashboard = () => {
  return (
    <PageContainer>
      <Suspense fallback={<ProSkeleton type="list" />}>
        <UsersList />
      </Suspense>
    </PageContainer>
  );
};

export default Dashboard;
