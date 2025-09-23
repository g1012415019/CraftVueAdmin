/**
 * 全局注册自定义组件 待完善
 * @param app
 */
import LowCodeTable from '@/components/LowCodeTable/index.vue';

export function setupCustomComponents(app) {
  app.component('LowCodeTable', LowCodeTable);
}
