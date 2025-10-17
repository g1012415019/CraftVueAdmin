<template>
  <div class="pagination-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 分页配置 -->
      <div class="config-section">
        <div class="section-header">
          <div class="section-title">分页配置</div>
          <div class="help-toggle">
            <n-switch v-model:value="showHelp" size="small" />
            <span>显示帮助</span>
          </div>
        </div>
        <div class="config-grid">
          <n-form-item label="启用">
            <n-switch v-model:value="config.pagination.enabled" size="small" />
          </n-form-item>
          
          <template v-if="config.pagination.enabled">
            <n-form-item label="总数">
              <n-switch v-model:value="config.pagination.showTotal" size="small" />
            </n-form-item>
            
            <n-form-item label="大小">
              <n-button-group size="small">
                <n-button 
                  :type="config.pagination.size === 'small' ? 'primary' : 'default'"
                  @click="config.pagination.size = 'small'"
                >小</n-button>
                <n-button 
                  :type="config.pagination.size === 'medium' ? 'primary' : 'default'"
                  @click="config.pagination.size = 'medium'"
                >中</n-button>
                <n-button 
                  :type="config.pagination.size === 'large' ? 'primary' : 'default'"
                  @click="config.pagination.size = 'large'"
                >大</n-button>
              </n-button-group>
            </n-form-item>
            
            <n-form-item label="每页选项">
              <n-dynamic-tags 
                v-model:value="config.pagination.pageSizeOptions" 
                :max="6"
                size="small"
                type="primary"
              />
            </n-form-item>
            
            <n-form-item label="默认每页">
              <n-select
                v-model:value="config.pagination.defaultPageSize"
                :options="pageSizeSelectOptions"
                size="small"
                style="width: 100px"
              />
            </n-form-item>
          </template>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>启用：</strong>关闭后将隐藏整个分页器
          </div>
          <div class="help-item">
            <strong>总数：</strong>控制"共 X 条"文字的显示
          </div>
          <div class="help-item">
            <strong>大小：</strong>控制分页器组件的大小
          </div>
          <div class="help-item">
            <strong>每页选项：</strong>设置每页显示个数的选择器选项
          </div>
          <div class="help-item">
            <strong>默认每页：</strong>设置默认每页显示的条数
          </div>
        </div>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch, computed } from 'vue';

const config = inject('tableConfig') as Ref<any>;

// 帮助显示控制
const showHelp = ref(false);

// 计算每页选项的下拉选项
const pageSizeSelectOptions = computed(() => {
  return (config.value.pagination.pageSizeOptions || []).map(item => ({
    label: item,
    value: parseInt(item)
  }));
});

// 初始化配置对象结构
const initConfig = () => {
  if (!config.value.pagination) config.value.pagination = {};
  
  // 设置默认值 - 与 PaginationBar.vue 对应
  if (config.value.pagination.enabled === undefined) config.value.pagination.enabled = true;
  if (config.value.pagination.showTotal === undefined) config.value.pagination.showTotal = true;
  if (config.value.pagination.size === undefined) config.value.pagination.size = 'small';
  if (config.value.pagination.showQuickJumper === undefined) config.value.pagination.showQuickJumper = false;
  if (config.value.pagination.showSizeChanger === undefined) config.value.pagination.showSizeChanger = false;
  if (config.value.pagination.pageSizeOptions === undefined) config.value.pagination.pageSizeOptions = ['10', '20', '50', '100'];
  if (!Array.isArray(config.value.pagination.pageSizeOptions)) config.value.pagination.pageSizeOptions = ['10', '20', '50', '100'];
  if (config.value.pagination.defaultPageSize === undefined) config.value.pagination.defaultPageSize = 20;
};

// 初始化配置
initConfig();

// 监听配置变化
watch(() => config.value, initConfig, { deep: true });
</script>

<style scoped>
.pagination-settings {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.config-grid :deep(.n-form-item) {
  margin-bottom: 0;
}

.config-grid :deep(.n-form-item-feedback-wrapper) {
  min-height: 0;
}

.help-section {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.help-item {
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-item strong {
  color: #333;
}
</style>
