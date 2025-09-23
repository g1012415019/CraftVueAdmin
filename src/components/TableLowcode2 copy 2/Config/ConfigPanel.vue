<template>
  <n-drawer v-model:show="show" :width="800" placement="right">
    <n-drawer-content title="表格配置" closable :body-content-style="{ padding: '0' }">
      <div class="config-panel flex h-full bg-white">
        <!-- 左侧菜单 -->
        <div class="w-48 bg-gray-50 border-r border-gray-200 p-2">
          <div class="space-y-3">
            <!-- 基础设置 -->
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">基础设置</div>
              <div class="space-y-1">
                <div
                  @click="activeMenu = 'basic'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'basic'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  基础
                </div>
                <div
                  @click="activeMenu = 'view'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'view'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  视图设置
                </div>
              </div>
            </div>

            <!-- 数据展示 -->
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">数据展示</div>
              <div class="space-y-1">
                <div
                  @click="activeMenu = 'columns'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'columns'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  显示列
                </div>
                <div
                  @click="activeMenu = 'group'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'group'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  分组
                </div>
                <div
                  @click="activeMenu = 'records'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'records'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  记录设置
                </div>
              </div>
            </div>

            <!-- 数据处理 -->
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">数据处理</div>
              <div class="space-y-1">
                <div
                  @click="activeMenu = 'filter'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'filter'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  过滤
                </div>
                <div
                  @click="activeMenu = 'sort'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'sort'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  排序
                </div>
                <div
                  @click="activeMenu = 'quick-filter'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'quick-filter'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  快速筛选
                </div>
              </div>
            </div>

            <!-- 用户交互 -->
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">用户交互</div>
              <div class="space-y-1">
                <div
                  @click="activeMenu = 'fields'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'fields'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  字段
                </div>
                <div
                  @click="activeMenu = 'operations'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'operations'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  用户操作
                </div>
                <div
                  @click="activeMenu = 'filter-list'"
                  :class="[
                    'px-3 py-2 text-sm font-medium cursor-pointer rounded-md',
                    activeMenu === 'filter-list'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  筛选列表
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- 动态内容 -->
          <div class="flex-1 p-6 overflow-y-auto">
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
  // 导入新的表单组件
  import BasicSettingsForm from './forms/BasicSettingsForm.vue';
  import SelectionSettingsForm from './forms/SelectionSettingsForm.vue';
  import SortFilterSettingsForm from './forms/SortFilterSettingsForm.vue';
  import PaginationSettingsForm from './forms/PaginationSettingsForm.vue';
  import ActionSettingsForm from './forms/ActionSettingsForm.vue';
  import ColumnSettingsForm from './forms/ColumnSettingsForm.vue';
  import DataSettingsForm from './forms/DataSettingsForm.vue';
  import InteractionSettingsForm from './forms/InteractionSettingsForm.vue';
  import FilterListSettingsForm from './forms/FilterListSettingsForm.vue';
  import SortSettingsForm from './forms/SortSettingsForm.vue';
  import FieldSettingsForm from './forms/FieldSettingsForm.vue';

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

  const activeMenu = ref('basic');

  const menuItems = [
    { key: 'basic', label: '基础', component: BasicSettingsForm },
    { key: 'view', label: '视图设置', component: SelectionSettingsForm },
    { key: 'columns', label: '显示列', component: ColumnSettingsForm },
    { key: 'group', label: '分组', component: SortFilterSettingsForm },
    { key: 'records', label: '记录设置', component: PaginationSettingsForm },
    { key: 'filter', label: '过滤', component: ActionSettingsForm },
    { key: 'sort', label: '排序', component: SortSettingsForm },
    { key: 'fields', label: '字段', component: FieldSettingsForm },
    { key: 'operations', label: '用户操作', component: BasicSettingsForm },
    { key: 'filter-list', label: '筛选列表', component: FilterListSettingsForm },
    { key: 'quick-filter', label: '快速筛选', component: BasicSettingsForm },
  ];

  const currentComponent = computed(() => {
    const menu = menuItems.find((m) => m.key === activeMenu.value);
    return menu?.component;
  });
</script>

<style scoped>
  .config-panel {
    height: 100%;
  }
</style>
