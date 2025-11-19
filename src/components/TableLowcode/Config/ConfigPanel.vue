<template>
  <n-drawer :show="true" @update:show="emit('update:show', $event)" :width="800" placement="right" :z-index="1000">
    <n-drawer-content closable :body-content-style="{ padding: '0' }">
      <template #header>
        <div class="drawer-header">
          <div class="title-section">
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
              <span v-else>配置面板 - {{ props.currentViewName || '默认视图' }}</span>
            </div>
            <div class="view-info">
              <n-text depth="3" style="font-size: 11px;">
                视图ID: 
                <span @dblclick="startEditViewKey" style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                  <n-input
                    v-if="editingViewKey"
                    v-model:value="tempViewKey"
                    size="tiny"
                    @blur="finishEditViewKey"
                    @keyup.enter="finishEditViewKey"
                    @click.stop
                    autofocus
                    style="width: 180px;"
                  />
                  <template v-else>
                    {{ props.viewKey || props.viewConfig.key }}
                    <n-icon size="12" style="opacity: 0.6;">
                      <EditIcon />
                    </n-icon>
                  </template>
                </span>
              </n-text>
            </div>
          </div>
          <n-button size="small" @click="showConfigModal = true" type="primary" ghost>
            查看配置
          </n-button>
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
            <component 
              :is="components[activeMenu] || BasicSettingsForm" 
              :initial-config="getCurrentConfig()"
              :columns="props.viewConfig?.columns || []"
              @config-change="handleConfigChange"
            />
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

  <!-- 配置描述弹窗 -->
  <n-modal v-model:show="showConfigModal" preset="dialog" title="完整配置描述" style="width: 600px;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span>完整配置描述</span>
        <n-button size="small" @click="copyConfigDescription">复制描述</n-button>
      </div>
    </template>
    <div class="config-modal-content">
      <n-text style="font-size: 13px; line-height: 1.6; color: #555;">
        {{ getConfigDescription() }}
      </n-text>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, toRaw } from 'vue';
import { useMessage } from 'naive-ui';
import type { 
  BasicConfig,
  PaginationConfig, 
  FilterListConfig,
  DataFilterConfig,
  ConfigPanelProps,
  ExternalConfig
} from '../types';
import BasicSettingsForm from './forms/BasicSettingsForm.vue';
import PaginationSettingsForm from './forms/PaginationSettingsForm.vue';
import FilterListSettingsForm from './forms/FilterListSettingsForm.vue';
import SortSettingsForm from './forms/SortSettingsForm.vue';
import FieldSettingsForm from './forms/FieldSettingsForm.vue';
import DataFilterForm from './forms/DataFilterForm.vue';
import { 
  EditOutlined as EditIcon
} from '@vicons/antd'

const props = defineProps<ConfigPanelProps>();

const emit = defineEmits(['update:show', 'config-updated']);

/** 消息提示实例 */
const message = useMessage();

/** 当前激活的菜单项 */
const activeMenu = ref('basic');
/** 是否正在编辑标题 */
const editingTitle = ref(false);
/** 是否正在编辑视图键名 */
const editingViewKey = ref(false);
/** 临时标题文本 */
const tempTitle = ref('');
/** 临时视图键名文本 */
const tempViewKey = ref('');
/** 是否显示配置查看弹窗 */
const showConfigModal = ref(false);
/** 是否显示导入配置弹窗 */
const showImportModal = ref(false);
/** 导入配置的文本内容 */
const importConfigText = ref('');

/** 菜单分组配置 - 定义左侧菜单的结构和层次 */
const menuGroups = [
  {
    key: 'basic-settings',
    title: '基础设置',
    items: [
      { key: 'basic', label: '表格视图' },
      { key: 'pagination', label: '分页' },
    ]
  },
  {
    key: 'structure',
    title: '结构分组',
    items: [
      { key: 'columns', label: '列配置' },
    ]
  },
  {
    key: 'data-processing',
    title: '数据处理',
    items: [
      { key: 'sort-filter', label: '排序' },
      { key: 'data-filter', label: '数据过滤' },
      { key: 'data', label: '筛选设置' },
    ]
  }
];

/** 组件映射表 - 菜单项对应的配置表单组件 */
const components = {
  basic: BasicSettingsForm,
  pagination: PaginationSettingsForm,
  columns: FieldSettingsForm,
  'sort-filter': SortSettingsForm,
  'data-filter': DataFilterForm,
  data: FilterListSettingsForm
};

/** 获取配置描述 - 生成当前视图配置的JSON字符串 */
const getConfigDescription = () => {
  const config = props.viewConfig;
  if (!config) return '视图配置为空';
  return JSON.stringify(config, null, 2);
};

/** 开始编辑标题 - 进入标题编辑模式 */
const startEditTitle = () => {
  editingTitle.value = true;
  tempTitle.value = props.currentViewName || '';
};

/** 完成编辑标题 - 退出标题编辑模式 */
const finishEditTitle = () => {
  editingTitle.value = false;
  // 这里可以添加更新视图标题的逻辑
};

/** 开始编辑视图键名 - 进入视图键名编辑模式 */
const startEditViewKey = () => {
  editingViewKey.value = true;
  tempViewKey.value = props.viewKey || props.viewConfig.key;
};

/** 完成编辑视图键名 - 退出视图键名编辑模式 */
const finishEditViewKey = () => {
  editingViewKey.value = false;
  // 这里可以添加更新视图key的逻辑
};

/** 获取当前配置 - 根据激活的菜单项返回对应的配置 */
const getCurrentConfig = () => {
  const config = props.viewConfig;
  if (!config) return {};
  
  switch (activeMenu.value) {
    case 'basic':
      return config.basic || {};
    case 'pagination':
      return config.pagination || {};
    case 'columns':
      return { fields: props.viewConfig?.columns || [], visibility: config.columnVisibility || {} };
    case 'sort-filter':
      return config.sort || {};
    case 'data-filter':
      return config.dataFilter || {};
    case 'data':
      return config.filterList || {};
    default:
      return {};
  }
};

/** 处理配置变更 - 接收表单组件的配置变更事件 */
const handleConfigChange = (newConfig: any) => {
  // 根据当前激活的菜单项更新对应的配置
  const updatedViewConfig = { ...toRaw(props.viewConfig) };

  switch (activeMenu.value) {
    case 'basic':
      updatedViewConfig.basic = newConfig;
      break;
    case 'pagination':
      updatedViewConfig.pagination = newConfig;
      break;
    case 'columns':
      updatedViewConfig.columns = newConfig.fields;
      updatedViewConfig.columnVisibility = newConfig.visibility;
      break;
    case 'sort-filter':
      updatedViewConfig.sort = newConfig;
      break;
    case 'data-filter':
      updatedViewConfig.dataFilter = newConfig;
      break;
    case 'data':
      updatedViewConfig.filterList = newConfig;
      break;
  }
  
  // 发射配置更新事件
  emit('config-updated', updatedViewConfig);
};

/** 导出配置 - 将当前视图配置导出为JSON文件 */
const exportConfig = () => {
  const config = props.viewConfig?.config;
  if (!config) {
    message.warning('当前视图配置为空');
    return;
  }
  
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `view-config-${props.viewConfig.key}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  message.success('视图配置已导出');
};

/** 处理导入配置 - 解析并应用导入的JSON配置 */
const handleImportConfig = () => {
  try {
    const config = JSON.parse(importConfigText.value);
    
    if (props.viewConfig?.config) {
      Object.assign(props.viewConfig.config, config);
      message.success('配置导入成功');
      showImportModal.value = false;
      importConfigText.value = '';
      emit('config-updated');
    } else {
      message.error('视图配置不存在');
    }
  } catch (error) {
    message.error('配置格式错误，请检查JSON格式');
  }
};

/** 复制配置描述 - 将配置描述文本复制到剪贴板 */
const copyConfigDescription = () => {
  navigator.clipboard.writeText(getConfigDescription()).then(() => {
    message.success('配置描述已复制');
  }).catch(() => {
    message.error('复制失败');
  });
};
</script>

<style lang="scss" scoped>
@use '../styles/utilities.scss' as *;

.config-panel {
  display: flex;
  height: 100%;
  
  .menu-sidebar {
    width: 160px;
    background: #f8f9fa;
    border-right: 1px solid $color-border;
    display: flex;
    flex-direction: column;
    
    .menu-groups {
      flex: 1;
      
      .menu-group {
        .group-title {
          padding: $spacing-sm $spacing-md;
          font-size: 11px;
          font-weight: 600;
          color: $color-text-muted;
          text-transform: uppercase;
          background: #e9ecef;
          border-bottom: 1px solid $color-border;
        }
        
        .menu-items {
          .menu-item {
            padding: $spacing-md $spacing-lg;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid $color-border;
            
            &:hover {
              background: #e9ecef;
            }
            
            &.active {
              background: white;
              color: $color-primary;
              border-right: 2px solid $color-primary;
            }
          }
        }
      }
    }
  }
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .content-body {
      flex: 1;
      padding: $spacing-xl;
      overflow-y: auto;
      
      .form-section {
        margin-bottom: $spacing-2xl;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    .content-footer {
      padding: $spacing-lg;
      border-top: 1px solid $color-border;
      background: #f8f9fa;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}

// 响应式设计
@media (max-width: $breakpoint-tablet) {
  .config-panel {
    flex-direction: column;
    
    .sidebar {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      
      .nav-item {
        white-space: nowrap;
        border-right: 1px solid $color-border;
        border-bottom: none;
        
        &.active {
          border-right: 1px solid $color-border;
          border-bottom: 2px solid $color-primary;
        }
      }
    }
    
    .content {
      padding: $spacing-lg;
    }
  }
}
</style>