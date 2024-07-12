import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {
    '/api': {
      target: 'http://www.baisehub.com:7720',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  layout: {
    title: 'BaiseHub',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/auth',
      component: './Login',
      layout: false,
    },
    {
      name: '系统统计',
      path: '/home',
      component: './Dashboard',
    },
    {
      name: '用户管理板块',
      path: '/users',
      component: './Users',
    },
    {
      name: '视频管理',
      path: '/videos',
      component: './Videos',
    },
    // {
    //   name: '广告管理',
    //   path: '/ads',
    //   component: './Ads',
    // },
  ],
  npmClient: 'npm',
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
});
