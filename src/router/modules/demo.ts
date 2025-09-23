import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: 'Demo',
    component: Layout,
    meta: {
      title: 'Demo',
    },
    children: [
      {
        path: 'low-code-table',
        name: 'LowCodeTableDemo',
        meta: {
          title: 'Low Code Table',
        },
        component: () => import('@/views/demo/low-code-table/index.vue'),
      },
    ],
  },
];

export default routes;
