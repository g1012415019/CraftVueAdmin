<template>
  <div class="pagination-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 分页开关 -->
      <n-card title="分页开关" size="small" class="mb-1">
        <n-form-item label="启用分页">
          <n-switch v-model:value="config.pagination.enabled" size="small" />
        </n-form-item>
        <n-text depth="2" style="font-size: 12px;">
          关闭后将显示所有数据，不进行分页
        </n-text>
      </n-card>

      <!-- 基础设置 -->
      <n-card v-if="config.pagination.enabled" title="基础设置" size="small" class="mb-1">
        <n-alert type="info" :show-icon="false" style="margin-bottom: 12px; font-size: 12px;">
          配置分页器的基本显示和行为
        </n-alert>
        
        <n-grid :cols="2" :x-gap="12" :y-gap="8">
          <n-gi>
            <n-form-item label="每页条数" label-width="60px">
              <n-input-number
                v-model:value="config.pagination.pageSize"
                :min="1"
                :max="1000"
                size="small"
                placeholder="20"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="分页器大小" label-width="70px">
              <n-select
                v-model:value="config.pagination.size"
                :options="sizeOptions"
                size="small"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 显示设置 -->
      <n-card v-if="config.pagination.enabled" title="显示设置" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="12">
          <n-gi>
            <n-form-item label="分页器位置">
              <n-radio-group v-model:value="config.pagination.position" size="small">
                <n-radio-button
                  v-for="option in positionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </n-radio-button>
              </n-radio-group>
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="显示模式">
              <n-radio-group v-model:value="config.pagination.simple" size="small">
                <n-radio-button :value="false">完整模式</n-radio-button>
                <n-radio-button :value="true">简洁模式</n-radio-button>
              </n-radio-group>
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 功能开关 -->
      <n-card v-if="config.pagination.enabled" title="功能开关" size="small" class="mb-1">
        <!-- 帮助按钮 -->
        <div v-if="!showHelp" class="help-button-container">
          <n-button size="small" type="info" text @click="showHelp = true">
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </n-icon>
            </template>
            说明
          </n-button>
        </div>

        <!-- 帮助面板 -->
        <div v-if="showHelp" class="help-banner">
          <div class="help-header">
            <span>功能说明</span>
            <n-button size="tiny" text @click="showHelp = false">×</n-button>
          </div>
          <div class="help-content">
            <div><strong>每页条数选择器：</strong>允许用户切换每页显示条数</div>
            <div><strong>快速跳转：</strong>显示页码输入框，可直接跳转到指定页</div>
            <div><strong>禁用状态：</strong>禁用整个分页器的交互功能</div>
          </div>
        </div>

        <n-grid :cols="1" :y-gap="12">
          <n-gi>
            <n-form-item label="每页条数选择器">
              <n-switch v-model:value="config.pagination.showSizePicker" size="small" />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="快速跳转">
              <n-switch v-model:value="config.pagination.showQuickJumper" size="small" />
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <n-form-item label="禁用状态">
              <n-switch v-model:value="config.pagination.disabled" size="small" />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 每页条数选项 -->
      <n-card v-if="config.pagination.enabled && config.pagination.showSizePicker" title="每页条数选项" size="small" class="mb-1">
        <n-form-item label="可选条数">
          <n-dynamic-tags 
            v-model:value="config.pagination.pageSizes" 
            :render-tag="renderPageSizeTag"
            size="small"
          />
        </n-form-item>
        <n-text depth="2" style="font-size: 12px; margin-top: 8px; display: block;">
          提示：输入数字后按回车添加，点击标签可删除
        </n-text>
      </n-card>

      <!-- 自定义文本 -->
      <n-card v-if="config.pagination.enabled" title="自定义文本" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="8">
          <n-gi>
            <n-form-item label="前缀内容">
              <n-input 
                v-model:value="config.pagination.prefix" 
                placeholder="分页器前缀文本" 
                size="small"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="后缀内容">
              <n-input 
                v-model:value="config.pagination.suffix" 
                placeholder="分页器后缀文本" 
                size="small"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 分页预览 -->
      <n-card title="配置预览" size="small">
        <n-text depth="2" style="font-size: 12px;">
          {{ config.pagination.enabled ? getPaginationPreview() : '分页已关闭，将显示所有数据' }}
        </n-text>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
  import { inject, Ref, ref } from 'vue';
  
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;
  
  // 初始化默认值 - 按照 Naive UI 官方默认值
  if (!config.value.pagination) {
    config.value.pagination = {
      enabled: false, // 分页开关
      page: 1,
      pageCount: undefined,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      showSizePicker: false,
      showQuickJumper: false,
      size: 'medium',
      itemCount: undefined,
      simple: false,
      disabled: false,
      pageSlot: 9,
      selectProps: undefined,
      prev: undefined,
      next: undefined,
      goto: undefined,
      prefix: undefined,
      suffix: undefined,
      label: undefined,
      displayOrder: ['pages', 'size-picker', 'quick-jumper'],
      to: undefined,
      showQuickJumpDropdown: true
    };
  }

  const showHelp = ref(false);

  const positionOptions = [
    { label: '顶部', value: 'top' },
    { label: '底部', value: 'bottom' },
    { label: '上下', value: 'both' },
    { label: '隐藏', value: 'hidden' },
  ];

  const sizeOptions = [
    { label: '小', value: 'small' },
    { label: '中', value: 'medium' },
    { label: '大', value: 'large' },
  ];

  const displayOrderOptions = [
    { label: '页码', value: 'pages' },
    { label: '每页条数选择器', value: 'size-picker' },
    { label: '快速跳转', value: 'quick-jumper' },
  ];

  const renderPageSizeTag = (tag: string) => {
    return `${tag} 条/页`;
  };

  const getPaginationPreview = () => {
    const parts = [];
    
    parts.push(`每页 ${config.value.pagination.pageSize} 条`);
    parts.push(`大小: ${sizeOptions.find(s => s.value === config.value.pagination.size)?.label}`);
    
    if (config.value.pagination.simple) {
      parts.push('简洁模式');
    }
    
    if (config.value.pagination.showSizePicker) {
      parts.push(`可选条数: ${config.value.pagination.pageSizes.join(', ')}`);
    }
    
    if (config.value.pagination.showQuickJumper) {
      parts.push('支持快速跳转');
    }
    
    if (config.value.pagination.disabled) {
      parts.push('已禁用');
    }

    if (config.value.pagination.pageSlot !== 9) {
      parts.push(`页码槽位: ${config.value.pagination.pageSlot}`);
    }
    
    return parts.join(' | ');
  };
</script>

<style scoped>
.pagination-settings {
  font-size: 13px;
  padding: 4px;
}

.mb-1 {
  margin-bottom: 12px;
}

.help-banner {
  background: #f0f8ff;
  border: 1px solid #d4edda;
  border-radius: 6px;
  margin-bottom: 12px;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e6;
  font-weight: 500;
  font-size: 13px;
}

.help-content {
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.help-content div {
  margin-bottom: 4px;
  color: #666;
}

.help-button-container {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
}

:deep(.n-card) {
  border-radius: 6px;
  border: 1px solid #e0e0e6;
}

:deep(.n-card-header) {
  padding: 12px 16px 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e6;
}

:deep(.n-card__content) {
  padding: 16px;
  background: white;
}

:deep(.n-form-item) {
  margin: 0;
  min-height: 28px;
  align-items: center;
}

:deep(.n-form-item-label) {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
}

:deep(.n-input), :deep(.n-select) {
  font-size: 13px;
}
</style>
