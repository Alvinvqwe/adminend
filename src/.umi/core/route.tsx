// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import React from 'react';

export async function getRoutes() {
  const routes = {"1":{"path":"/","redirect":"/home","parentId":"ant-design-pro-layout","id":"1"},"2":{"path":"/auth","layout":false,"id":"2"},"3":{"name":"系统统计","path":"/home","parentId":"ant-design-pro-layout","id":"3"},"4":{"name":"用户管理板块","path":"/users","parentId":"ant-design-pro-layout","id":"4"},"5":{"name":"视频管理","path":"/videos","parentId":"ant-design-pro-layout","id":"5"},"6":{"name":"广告管理","path":"/ads","parentId":"ant-design-pro-layout","id":"6"},"ant-design-pro-layout":{"id":"ant-design-pro-layout","path":"/","isLayout":true}} as const;
  return {
    routes,
    routeComponents: {
'1': React.lazy(() => import('./EmptyRoute')),
'2': React.lazy(() => import(/* webpackChunkName: "p__Login__index" */'@/pages/Login/index.tsx')),
'3': React.lazy(() => import(/* webpackChunkName: "p__Dashboard__index" */'@/pages/Dashboard/index.tsx')),
'4': React.lazy(() => import(/* webpackChunkName: "p__Users__index" */'@/pages/Users/index.tsx')),
'5': React.lazy(() => import(/* webpackChunkName: "p__Videos__index" */'@/pages/Videos/index.tsx')),
'6': React.lazy(() => import(/* webpackChunkName: "p__Ads__index" */'@/pages/Ads/index.tsx')),
'ant-design-pro-layout': React.lazy(() => import(/* webpackChunkName: "umi__plugin-layout__Layout" */'/Users/mac/Documents/server/adminend_a/src/.umi/plugin-layout/Layout.tsx')),
},
  };
}