<template>
  <n-drawer v-model:show="show" :width="800" placement="right">
    <n-drawer-content title="表格配置" closable :body-content-style="{ padding: '0' }">
      <div class="config-panel flex h-full bg-white">
        <!-- 左侧菜单 -->
        <div class="w-44 bg-gray-50 border-r border-gray-200">
          <div class="p-4">
            <div class="space-y-1">
              <div
                v-for="menu in menuItems"
                :key="menu.key"
                @click="activeMenu = menu.key"
                :class="[
                  'px-3 py-2 text-sm cursor-pointer rounded',
                  activeMenu === menu.key
                    ? 'text-blue-500 bg-blue-50 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                {{ menu.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1 flex flex-col">
          <!-- 动态内容 -->
          <div class="flex-1 p-6">
            <component :is="currentComponent" />
          </div>

          <!-- 底部按钮 -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <n-button>重置</n-button>
            <n-button type="primary">保存设置</n-button>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { NButton, NDrawer, NDrawerContent } from 'naive-ui';
  import GroupConfigForm from './forms/GroupConfigForm.vue';
  import TableGeneralSettingsForm from './forms/TableGeneralSettingsForm.vue';
  import FilterConfigForm from './forms/FilterConfigForm.vue';
  import SortConfigForm from './forms/SortConfigForm.vue';
  import ColorConfigForm from './forms/ColorConfigForm.vue';
  import ColumnConfigForm from './forms/ColumnConfigForm.vue';
  import ActionColumnConfigForm from './forms/ActionColumnConfigForm.vue';
  import QuickFilterForm from './forms/QuickFilterForm.vue';

  const props = defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    'update:show': [value: boolean];
  }>();

  const show = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value),
  });

  const activeMenu = ref('group');

  const menuItems = [
    { key: 'group', label: '分组', component: GroupConfigForm },
    { key: 'record', label: '记录设置', component: TableGeneralSettingsForm },
    { key: 'filter', label: '过滤', component: FilterConfigForm },
    { key: 'sort', label: '排序', component: SortConfigForm },
    { key: 'color', label: '颜色', component: ColorConfigForm },
    { key: 'field', label: '字段', component: ColumnConfigForm },
    { key: 'userAction', label: '用户操作', component: ActionColumnConfigForm },
    { key: 'recordAction', label: '记录操作', component: ActionColumnConfigForm },
    { key: 'quickFilter', label: '快速筛选', component: QuickFilterForm },
  ];

  const currentComponent = computed(() => {
    const menu = menuItems.find((m) => m.key === activeMenu.value);
    return menu?.component || GroupConfigForm;
  });
</script>

<style scoped>
  .config-panel {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .n-drawer-body-content-wrapper {
    padding: 0;
  }
</style>
