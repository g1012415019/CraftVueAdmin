<template>
  <div class="basic-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 表格外观 -->
      <n-card title="表格外观" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="10">
          <n-gi>
            <n-form-item label="行高密度">
              <n-radio-group v-model:value="rowDensity" size="small">
                <n-radio-button value="compact">紧凑</n-radio-button>
                <n-radio-button value="medium">中等</n-radio-button>
                <n-radio-button value="high">高</n-radio-button>
                <n-radio-button value="ultra">超高</n-radio-button>
              </n-radio-group>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="自定义行高">
              <div class="input-with-unit">
                <n-input-number 
                  v-model:value="customRowHeight" 
                  :min="24" 
                  :max="80" 
                  :step="4"
                  size="small" 
                  style="width: 120px;"
                />
                <span>px</span>
              </div>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="显示序号">
              <n-switch v-model:value="config.basic.showRowNumber" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="显示垂直线">
              <n-switch v-model:value="config.basic.bordered" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="交替行颜色">
              <n-switch v-model:value="config.basic.striped" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="标题行换行">
              <n-switch v-model:value="headerTextWrap" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="显示汇总行">
              <n-switch v-model:value="showSummaryRow" size="small" />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 交互方式 -->
      <n-card title="交互方式" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="10">
          <n-gi>
            <n-form-item label="交互模式">
              <n-radio-group v-model:value="interactionMode" size="small">
                <n-space vertical>
                  <n-radio value="classic">经典模式</n-radio>
                  <n-text depth="3" class="description">点整行打开记录</n-text>
                  <n-radio value="spreadsheet">电子表格模式</n-radio>
                  <n-text depth="3" class="description">点单元格选中字段，按空格键打开记录</n-text>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="记录快捷方式">
              <n-switch v-model:value="showRecordShortcut" size="small" />
              <n-text depth="3" class="description">在记录前显示"更多"图标，点击后可以在下拉菜单中进行记录操作</n-text>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="行内编辑">
              <n-switch v-model:value="allowInlineEdit" size="small" />
              <n-text depth="3" class="description">无需打开记录详情，在表格行内直接编辑字段</n-text>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="右键菜单">
              <n-switch v-model:value="enableContextMenu" size="small" />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 数据操作 -->
      <n-card title="数据操作" size="small" class="mb-1">
        <n-grid :cols="2" :x-gap="16" :y-gap="10">
          <n-gi>
            <n-form-item label="显示创建按钮">
              <n-switch v-model:value="showCreateButton" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Excel导入">
              <n-switch v-model:value="excelImport" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="回收站">
              <n-switch v-model:value="recycleBin" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="编辑">
              <n-switch v-model:value="allowEdit" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="复制">
              <n-switch v-model:value="allowCopy" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="批量操作">
              <n-switch v-model:value="batchOperations" size="small" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid :cols="1" :y-gap="4" style="margin-top: 8px;">
          <n-gi><n-text depth="3" class="description">• 控制是否显示"新建"或"添加"按钮</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 允许通过上传Excel文件批量导入数据</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 开启后，删除操作将数据移入回收站，可恢复</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 允许对表格中的单条数据进行编辑</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 允许快速复制单条数据以创建新条目</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 启用复选框及批量删除、批量导出等操作</n-text></n-gi>
        </n-grid>
      </n-card>

      <!-- 导出打印 -->
      <n-card title="导出打印" size="small" class="mb-1">
        <n-grid :cols="2" :x-gap="16" :y-gap="10">
          <n-gi>
            <n-form-item label="系统打印">
              <n-switch v-model:value="systemPrint" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="数据导出">
              <n-switch v-model:value="allowExport" size="small" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid :cols="1" :y-gap="4" style="margin-top: 8px;">
          <n-gi><n-text depth="3" class="description">• 使用浏览器默认打印功能打印当前表格视图</n-text></n-gi>
          <n-gi><n-text depth="3" class="description">• 允许将表格数据导出为Excel、PDF等格式</n-text></n-gi>
        </n-grid>
      </n-card>

      <!-- 自动刷新 -->
      <n-card title="自动刷新" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="10">
          <n-gi>
            <n-form-item label="自动刷新">
              <n-switch v-model:value="autoRefresh" size="small" />
            </n-form-item>
          </n-gi>
          <n-gi v-if="autoRefresh">
            <n-form-item label="刷新间隔">
              <div class="input-with-unit">
                <n-input-number v-model:value="refreshInterval" :min="10" :max="300" size="small" style="width: 120px;" />
                <span>秒</span>
              </div>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-text depth="3" class="description">每隔一段时间后自动刷新当前视图</n-text>
          </n-gi>
        </n-grid>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';

const config = inject('tableConfig') as Ref<any>;

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
  padding: 4px;
}

.mb-1 {
  margin-bottom: 12px;
}

.description {
  font-size: 11px;
  color: #999;
  margin-left: 24px;
  display: block;
  line-height: 1.3;
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
