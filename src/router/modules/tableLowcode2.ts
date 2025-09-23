import type { RouteRecordRaw } from 'vue-router';
import { Layout } from '../constant';

const tableLowcode2Route: RouteRecordRaw = {
  path: '/demo/table-lowcode2',
  name: 'DemoTableLowcode2',
  component: Layout,
  meta: {
    title: '低代码表格演示2',
    icon: '', // 可以根据需要更换图标
    orderNo: 101, // 确保排序在其他演示路由之后
  },
  children: [
    {
      path: 'index',
      name: 'TableLowcode2DemoPage',
      component: () => import('@/views/demo/TableLowcode2Demo.vue'),
      meta: {
        title: '低代码表格2',
      },
    },
  ],
};

export default tableLowcode2Route;
