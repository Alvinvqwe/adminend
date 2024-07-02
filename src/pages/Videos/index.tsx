import { PageContainer } from '@ant-design/pro-components';
import ProSkeleton from '@ant-design/pro-skeleton';
import React, { Suspense } from 'react';
const VideoManage = React.lazy(() => import('./VideoManage'));

const Dashboard = () => {
  return (
    <PageContainer>
      <Suspense fallback={<ProSkeleton type="list" />}>
        <VideoManage />
      </Suspense>
    </PageContainer>
  );
};

export default Dashboard;
