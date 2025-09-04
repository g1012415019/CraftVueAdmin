import type { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from '../constant';

const demoTableLowcode: RouteRecordRaw = {
  path: '/demo/table-lowcode',
  name: 'DemoTableLowcode',
  component: LAYOUT,
  meta: {
    title: '低代码表格演示',
    icon: 'ant-design:table-outlined',
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
