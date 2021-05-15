import { defineConfig } from 'umi';

export default defineConfig({
  history: {
    type: 'hash'
  },
  base: './',
  publicPath: './',
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/editTask', component: '@/pages/edit/editTask' },
    { path: '/editGoal', component: '@/pages/edit/editGoal' },
    { path: '/alldata', component: '@/pages/setting/alldata' },
  ],
});
