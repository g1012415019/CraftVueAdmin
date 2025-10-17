<template>
  <div class="basic-settings">
    <!-- 帮助开关 -->
    <div class="help-toggle">
      <n-switch v-model:value="showHelp" size="small" />
      <span>显示帮助</span>
    </div>
    
    <n-form label-placement="left" label-width="70px" size="small">
      
      <!-- 表格外观 -->
      <div class="config-section">
        <div class="section-title">表格外观</div>
        <div class="config-grid">
          <n-form-item label="行高密度">
            <n-button-group size="small">
              <n-button 
                :type="rowDensity === 'compact' ? 'primary' : 'default'"
                @click="rowDensity = 'compact'"
              >紧凑</n-button>
              <n-button 
                :type="rowDensity === 'medium' ? 'primary' : 'default'"
                @click="rowDensity = 'medium'"
              >中等</n-button>
              <n-button 
                :type="rowDensity === 'high' ? 'primary' : 'default'"
                @click="rowDensity = 'high'"
              >高</n-button>
              <n-button 
                :type="rowDensity === 'ultra' ? 'primary' : 'default'"
                @click="rowDensity = 'ultra'"
              >超高</n-button>
            </n-button-group>
          </n-form-item>
          
          <n-form-item label="自定义行高">
            <div class="input-with-unit">
              <n-input-number 
                v-model:value="customRowHeight" 
                :min="24" 
                :max="80" 
                :step="4"
                size="small" 
                style="width: 80px;"
              />
              <span>px</span>
            </div>
          </n-form-item>
          
          <n-form-item label="显示序号">
            <n-switch v-model:value="config.basic.showRowNumber" size="small" />
          </n-form-item>
          
          <n-form-item label="显示垂直线">
            <n-switch v-model:value="config.basic.bordered" size="small" />
          </n-form-item>
          
          <n-form-item label="交替行颜色">
            <n-switch v-model:value="config.basic.striped" size="small" />
          </n-form-item>
          
          <n-form-item label="标题行换行">
            <n-switch v-model:value="headerTextWrap" size="small" />
          </n-form-item>
          
          <n-form-item label="显示汇总行">
            <n-switch v-model:value="showSummaryRow" size="small" />
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>行高密度：</strong>控制表格行的高度，影响数据显示密度
          </div>
          <div class="help-item">
            <strong>自定义行高：</strong>精确设置行高像素值，覆盖密度设置
          </div>
          <div class="help-item">
            <strong>显示序号：</strong>在表格第一列显示行号
          </div>
          <div class="help-item">
            <strong>显示垂直线：</strong>在列之间显示分隔线
          </div>
          <div class="help-item">
            <strong>交替行颜色：</strong>奇偶行使用不同背景色，提高可读性
          </div>
        </div>
      </div>

      <!-- 交互方式 -->
      <div class="config-section">
        <div class="section-title">交互方式</div>
        <div class="config-grid">
          <n-form-item label="交互模式" class="full-width">
            <n-radio-group v-model:value="interactionMode" size="small">
              <n-space>
                <n-radio value="classic">经典模式</n-radio>
                <n-radio value="spreadsheet">电子表格模式</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          
          <n-form-item label="记录快捷方式">
            <n-switch v-model:value="showRecordShortcut" size="small" />
          </n-form-item>
          
          <n-form-item label="行内编辑">
            <n-switch v-model:value="allowInlineEdit" size="small" />
          </n-form-item>
          
          <n-form-item label="右键菜单">
            <n-switch v-model:value="enableContextMenu" size="small" />
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>经典模式：</strong>点击整行打开记录详情
          </div>
          <div class="help-item">
            <strong>电子表格模式：</strong>点击单元格选中，按空格键打开记录
          </div>
          <div class="help-item">
            <strong>记录快捷方式：</strong>在行首显示操作按钮，快速访问编辑、删除等功能
          </div>
          <div class="help-item">
            <strong>行内编辑：</strong>双击单元格直接编辑，无需打开详情页
          </div>
        </div>
      </div>

      <!-- 数据操作 -->
      <div class="config-section">
        <div class="section-title">数据操作</div>
        <div class="config-grid">
          <n-form-item label="显示创建按钮">
            <n-switch v-model:value="showCreateButton" size="small" />
          </n-form-item>
          
          <n-form-item label="Excel导入">
            <n-switch v-model:value="excelImport" size="small" />
          </n-form-item>
          
          <n-form-item label="回收站">
            <n-switch v-model:value="recycleBin" size="small" />
          </n-form-item>
          
          <n-form-item label="编辑">
            <n-switch v-model:value="allowEdit" size="small" />
          </n-form-item>
          
          <n-form-item label="复制">
            <n-switch v-model:value="allowCopy" size="small" />
          </n-form-item>
          
          <n-form-item label="批量操作">
            <n-switch v-model:value="batchOperations" size="small" />
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>显示创建按钮：</strong>在表格上方显示"新建"或"添加"按钮
          </div>
          <div class="help-item">
            <strong>Excel导入：</strong>支持上传Excel文件批量导入数据
          </div>
          <div class="help-item">
            <strong>回收站：</strong>删除的数据进入回收站，可恢复
          </div>
          <div class="help-item">
            <strong>批量操作：</strong>启用复选框，支持批量删除、导出等操作
          </div>
        </div>
      </div>

      <!-- 导出打印 -->
      <div class="config-section">
        <div class="section-title">导出打印</div>
        <div class="config-grid">
          <n-form-item label="系统打印">
            <n-switch v-model:value="systemPrint" size="small" />
          </n-form-item>
          
          <n-form-item label="数据导出">
            <n-switch v-model:value="allowExport" size="small" />
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>系统打印：</strong>使用浏览器打印功能打印当前表格视图
          </div>
          <div class="help-item">
            <strong>数据导出：</strong>将表格数据导出为Excel、PDF等格式文件
          </div>
        </div>
      </div>

      <!-- 自动刷新 -->
      <div class="config-section">
        <div class="section-title">自动刷新</div>
        <div class="config-grid">
          <n-form-item label="自动刷新">
            <n-switch v-model:value="autoRefresh" size="small" />
          </n-form-item>
          
          <n-form-item label="刷新间隔" v-if="autoRefresh">
            <div class="input-with-unit">
              <n-input-number v-model:value="refreshInterval" :min="10" :max="300" size="small" style="width: 80px;" />
              <span>秒</span>
            </div>
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>自动刷新：</strong>每隔指定时间自动重新加载表格数据
          </div>
          <div class="help-item">
            <strong>刷新间隔：</strong>自动刷新的时间间隔，单位为秒
          </div>
        </div>
      </div>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';

const config = inject('tableConfig') as Ref<any>;

// 帮助显示控制
const showHelp = ref(false);

// 表格外观
const rowDensity = ref('medium');
const customRowHeight = ref(36);
const headerTextWrap = ref(false);
const showSummaryRow = ref(false);

// 交互方式
const interactionMode = ref('classic');
const showRecordShortcut = ref(false);
const allowInlineEdit = ref(false);
const enableContextMenu = ref(true);

// 数据操作
const showCreateButton = ref(true);
const excelImport = ref(true);
const recycleBin = ref(true);
const allowEdit = ref(true);
const allowCopy = ref(true);
const batchOperations = ref(true);

// 导出打印
const systemPrint = ref(true);
const allowExport = ref(true);

// 自动刷新
const autoRefresh = ref(false);
const refreshInterval = ref(30);

// 监听行高密度变化
watch(rowDensity, (newDensity) => {
  const densityMap = {
    compact: { rowHeight: 28, compact: true },
    medium: { rowHeight: 36, compact: false },
    high: { rowHeight: 44, compact: false },
    ultra: { rowHeight: 56, compact: false }
  };
  
  if (densityMap[newDensity]) {
    Object.assign(config.value.basic, densityMap[newDensity]);
    customRowHeight.value = densityMap[newDensity].rowHeight;
  }
});

// 监听自定义行高变化
watch(customRowHeight, (newHeight) => {
  config.value.basic.rowHeight = newHeight;
});

// 初始化默认值
if (!config.value.basic.rowHeight) {
  config.value.basic.rowHeight = 36;
}
</script>

<style scoped>
.basic-settings {
  font-size: 13px;
  padding: 12px;
}

.config-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  align-items: center;
}

.config-grid .n-form-item {
  margin-bottom: 0;
}

.full-width {
  grid-column: 1 / -1;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-with-unit span {
  font-size: 12px;
  color: #666;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.help-section {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #18a058;
}

.help-item {
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 4px;
  color: #666;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-item strong {
  color: #333;
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
  padding: 0;
  min-height: 32px;
  height: 32px;
  align-items: center;
  display: flex;
}

:deep(.n-form-item-label) {
  font-size: 13px;
  min-width: 100px !important;
  width: 100px;
  white-space: nowrap;
  line-height: 1.4;
  padding: 0 12px 0 0;
  margin: 0;
  height: 32px;
  display: flex;
  align-items: center;
  color: #333;
}

:deep(.n-form-item-blank) {
  min-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
}

:deep(.n-input), :deep(.n-select), :deep(.n-input-number) {
  font-size: 13px;
  min-height: 28px;
  height: 28px;
}

:deep(.n-radio-group) {
  font-size: 13px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.n-radio) {
  font-size: 13px;
  margin-bottom: 4px;
}

:deep(.n-switch) {
  transform: scale(1);
}

:deep(.n-grid) {
  align-items: stretch;
}

:deep(.n-grid-item) {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-unit span {
  font-size: 12px;
  color: #666;
}
</style>
