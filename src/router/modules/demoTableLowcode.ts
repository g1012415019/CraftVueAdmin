import type { RouteRecordRaw } from 'vue-router';
import { Layout } from '../constant';

const demoTableLowcode: RouteRecordRaw = {
  path: '/demo/table-lowcode',
  name: 'DemoTableLowcode',
  component: Layout,
  meta: {
    title: '低代码表格演示',
    icon: '',
    orderNo: 100,
  },
  children: [
    {
      path: 'index',
      name: 'TableLowcodeDemoPage',
      component: () => import('@/views/demo/TableLowcodeDemo.vue'),
      meta: {
        title: '低代码表格',
      },
    },
  ],
};

export default demoTableLowcode;
