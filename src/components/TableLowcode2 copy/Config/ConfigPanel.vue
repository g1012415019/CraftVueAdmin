<template>
  <n-drawer v-model:show="show" :width="800" placement="right">
    <n-drawer-content closable :body-content-style="{ padding: '0' }">
      <template #header>
        <div @dblclick="startEditTitle" style="cursor: pointer;">
          <n-input
            v-if="editingTitle"
            v-model:value="tempTitle"
            size="small"
            @blur="finishEditTitle"
            @keyup.enter="finishEditTitle"
            @click.stop
            autofocus
            style="width: 200px;"
          />
          <span v-else>{{ drawerTitle }}</span>
        </div>
      </template>
      <div class="config-panel">
        <!-- 左侧菜单 -->
        <div class="menu-sidebar">
          <div class="menu-groups">
            <div 
              v-for="group in menuGroups" 
              :key="group.key" 
              class="menu-group"
            >
              <div class="group-title">{{ group.title }}</div>
              <div class="menu-items">
                <div
                  v-for="item in group.items"
                  :key="item.key"
                  @click="activeMenu = item.key"
                  :class="['menu-item', { active: activeMenu === item.key }]"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="content-area">
          <div class="content-body">
            <component :is="currentComponent" />
          </div>
          
          <div class="content-footer">
            <n-space justify="end">
              <n-button>重置</n-button>
              <n-button type="primary">保存设置</n-button>
            </n-space>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import BasicSettingsForm from './forms/BasicSettingsForm.vue';
import PaginationSettingsForm from './forms/PaginationSettingsForm.vue';
import FilterListSettingsForm from './forms/FilterListSettingsForm.vue';
import SortSettingsForm from './forms/SortSettingsForm.vue';
import FieldSettingsForm from './forms/FieldSettingsForm.vue';

const props = defineProps<{
  show: boolean;
}>();

const config = inject('tableConfig') as Ref<any>;

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

const activeMenu = ref('basic');

const drawerTitle = computed(() => {
  return `${config.value?.basic?.title || '表格'} - 配置`
});

// 编辑标题
const editingTitle = ref(false);
const tempTitle = ref('');

const startEditTitle = () => {
  editingTitle.value = true;
  tempTitle.value = config.value?.basic?.title || '表格';
};

const finishEditTitle = () => {
  if (config.value?.basic) {
    config.value.basic.title = tempTitle.value;
  }
  editingTitle.value = false;
};

const menuGroups = [
  {
    key: 'basic-settings',
    title: '基础设置',
    items: [
      { key: 'basic', label: '表格视图', component: BasicSettingsForm },
      { key: 'pagination', label: '分页', component: PaginationSettingsForm },
    ]
  },
  {
    key: 'structure',
    title: '结构分组',
    items: [
      { key: 'columns', label: '列配置', component: FieldSettingsForm },
    ]
  },
  {
    key: 'data-processing',
    title: '数据处理',
    items: [
      { key: 'sort-filter', label: '排序', component: SortSettingsForm },
      { key: 'data', label: '筛选设置', component: FilterListSettingsForm },
    ]
  }
];

const allMenuItems = menuGroups.flatMap(group => group.items);

const currentComponent = computed(() => {
  const menu = allMenuItems.find((m) => m.key === activeMenu.value);
  return menu?.component;
});
</script>

<style scoped>
.config-panel {
  display: flex;
  height: 100%;
  background: white;
}

.menu-sidebar {
  width: 192px;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  padding: 16px;
}

.menu-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-title {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 12px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #e5e7eb;
}

.menu-item.active {
  color: #2563eb;
  background: #dbeafe;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.content-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fa;
}
</style>
