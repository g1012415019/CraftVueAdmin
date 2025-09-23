import type { RouteRecordRaw } from 'vue-router';
import { Layout } from '../constant';

const tableLowcode2Route: RouteRecordRaw = {
  path: '/demo',
  name: 'Demo',
  component: Layout,
  meta: {
    title: '演示',
    icon: '',
    orderNo: 100,
  },
  children: [
    {
      path: 'table-lowcode',
      name: 'TableLowcodeDemoPage',
      component: () => import('@/views/demo/TableLowcode2Demo.vue'),
      meta: {
        title: '低代码表格',
      },
    },
  ],
};

export default tableLowcode2Route;
