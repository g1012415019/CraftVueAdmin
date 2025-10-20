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
              <n-button size="small" @click="exportConfig">导出配置</n-button>
              <n-button size="small" @click="showImportModal = true">导入配置</n-button>
            </n-space>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- 导入配置弹窗 -->
  <n-modal v-model:show="showImportModal" preset="dialog" title="导入配置">
    <template #header>
      <div>导入表格配置</div>
    </template>
    <n-space vertical>
      <n-alert type="info" :show-icon="false">
        粘贴 JSON 配置文件内容，将会覆盖当前所有配置
      </n-alert>
      <n-input
        v-model:value="importConfigText"
        type="textarea"
        placeholder="请粘贴 JSON 配置..."
        :rows="10"
        :resizable="false"
      />
    </n-space>
    <template #action>
      <n-space>
        <n-button @click="showImportModal = false">取消</n-button>
        <n-button type="primary" @click="handleImportConfig">导入</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, type Ref } from 'vue';
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
  'config-change': [config: any];
}>();

// 监听配置变化，实时更新表格
watch(
  () => config.value,
  (newConfig) => {
    if (newConfig) {
      emit('config-change', newConfig);
    }
  },
  { deep: true }
);

const show = computed({
  get: () => props.show,
  set: (value) => {
    emit('update:show', value);
  },
});

const activeMenu = ref('basic');

// 导入导出功能
const showImportModal = ref(false);
const importConfigText = ref('');

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

// 导出配置
const exportConfig = () => {
  const configData = JSON.stringify(config.value, null, 2);
  const blob = new Blob([configData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `table-config-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.$message?.success('配置已导出');
};

// 导入配置
const handleImportConfig = () => {
  try {
    const newConfig = JSON.parse(importConfigText.value);
    Object.assign(config.value, newConfig);
    showImportModal.value = false;
    importConfigText.value = '';
    window.$message?.success('配置导入成功');
  } catch (error) {
    window.$message?.error('JSON 格式错误，请检查配置文件');
  }
};
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
