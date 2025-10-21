<template>
  <div class="simple-config">
    <n-card title="快速配置表格" size="small">
      <template #header-extra>
        <n-button size="small" text @click="$emit('close')">×</n-button>
      </template>
      
      <n-form :model="simpleConfig" label-placement="left" label-width="80px">
        
        <!-- 基础信息 -->
        <n-form-item label="表格标题">
          <n-input v-model:value="simpleConfig.title" placeholder="请输入表格标题" />
        </n-form-item>
        
        <!-- 字段配置 -->
        <n-form-item label="字段配置">
          <div class="fields-config">
            <div v-for="(field, index) in simpleConfig.fields" :key="index" class="field-item">
              <n-input v-model:value="field.key" placeholder="字段名" style="width: 100px;" />
              <n-input v-model:value="field.label" placeholder="显示名" style="width: 100px;" />
              <n-select 
                v-model:value="field.type" 
                :options="typeOptions" 
                placeholder="类型"
                style="width: 80px;"
              />
              <n-input-number 
                v-model:value="field.width" 
                placeholder="宽度"
                style="width: 80px;"
                :min="50"
              />
              <n-button size="small" @click="removeField(index)" type="error" text>删除</n-button>
            </div>
            <n-button size="small" @click="addField" dashed block>+ 添加字段</n-button>
          </div>
        </n-form-item>
        
        <!-- 功能开关 -->
        <n-form-item label="功能开关">
          <n-space>
            <n-checkbox v-model:checked="simpleConfig.features.pagination">分页</n-checkbox>
            <n-checkbox v-model:checked="simpleConfig.features.search">搜索</n-checkbox>
            <n-checkbox v-model:checked="simpleConfig.features.export">导出</n-checkbox>
            <n-checkbox v-model:checked="simpleConfig.features.selection">多选</n-checkbox>
            <n-checkbox v-model:checked="simpleConfig.features.editing">编辑</n-checkbox>
          </n-space>
        </n-form-item>
        
        <!-- 主题选择 -->
        <n-form-item label="主题样式">
          <n-radio-group v-model:value="simpleConfig.theme">
            <n-radio value="light">默认</n-radio>
            <n-radio value="dark">深色</n-radio>
            <n-radio value="compact">紧凑</n-radio>
          </n-radio-group>
        </n-form-item>
        
        <!-- 操作按钮 -->
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="generateConfig">生成表格配置</n-button>
            <n-button @click="previewConfig">预览配置</n-button>
            <n-button @click="resetConfig">重置</n-button>
          </n-space>
        </n-form-item>
        
      </n-form>
    </n-card>
    
    <!-- 配置预览 -->
    <n-modal v-model:show="showPreview" preset="card" title="配置预览" style="width: 80%;">
      <n-code :code="JSON.stringify(generatedConfig, null, 2)" language="json" />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { mapToTableConfig, type SimpleTableConfig } from './utils/configMapper';

const emit = defineEmits<{
  configGenerated: [config: any];
  close: [];
}>();

// 简化配置
const simpleConfig = reactive<SimpleTableConfig>({
  title: '我的数据表格',
  fields: [
    { key: 'id', label: 'ID', type: 'number', width: 80 },
    { key: 'name', label: '姓名', type: 'text', width: 120 },
    { key: 'email', label: '邮箱', type: 'text', width: 200 },
  ],
  features: {
    pagination: true,
    search: true,
    export: false,
    selection: false,
    editing: false,
  },
  theme: 'light'
});

// 字段类型选项
const typeOptions = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '选择', value: 'select' },
  { label: '图片', value: 'image' },
];

// 生成的配置
const generatedConfig = ref({});
const showPreview = ref(false);

// 添加字段
const addField = () => {
  simpleConfig.fields.push({
    key: `field_${simpleConfig.fields.length + 1}`,
    label: '新字段',
    type: 'text',
    width: 120
  });
};

// 删除字段
const removeField = (index: number) => {
  simpleConfig.fields.splice(index, 1);
};

// 生成配置
const generateConfig = () => {
  generatedConfig.value = mapToTableConfig(simpleConfig);
  emit('configGenerated', generatedConfig.value);
  window.$message?.success('表格配置已生成！');
};

// 预览配置
const previewConfig = () => {
  generatedConfig.value = mapToTableConfig(simpleConfig);
  showPreview.value = true;
};

// 重置配置
const resetConfig = () => {
  Object.assign(simpleConfig, {
    title: '我的数据表格',
    fields: [
      { key: 'id', label: 'ID', type: 'number', width: 80 },
      { key: 'name', label: '姓名', type: 'text', width: 120 },
      { key: 'email', label: '邮箱', type: 'text', width: 200 },
    ],
    features: {
      pagination: true,
      search: true,
      export: false,
      selection: false,
      editing: false,
    },
    theme: 'light'
  });
};
</script>

<style scoped>
.simple-config {
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.fields-config {
  width: 100%;
}

.field-item {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

:deep(.n-card) {
  max-height: none;
}

:deep(.n-card__content) {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
