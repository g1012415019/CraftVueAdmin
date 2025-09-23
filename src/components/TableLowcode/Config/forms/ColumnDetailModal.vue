<template>
  <n-modal
    :show="show"
    preset="card"
    :title="column ? `编辑列: ${column.title || column.field}` : '新增列'"
    style="width: 600px"
    :mask-closable="false"
    @update:show="(val) => emit('update:show', val)"
    @after-leave="handleAfterLeave"
  >
    <n-form
      v-if="column"
      :model="columnData"
      label-placement="left"
      :label-width="100"
      ref="formRef"
    >
      <n-form-item label="字段名" path="field">
        <n-input v-model:value="columnData.field" placeholder="请输入字段名" />
      </n-form-item>
      <n-form-item label="列标题" path="title">
        <n-input v-model:value="columnData.title" placeholder="请输入列标题" />
      </n-form-item>
      <n-form-item label="列类型" path="type">
        <n-select
          v-model:value="columnData.type"
          :options="columnTypeOptions"
          placeholder="请选择列类型"
        />
      </n-form-item>
      <n-form-item label="列宽度" path="width">
        <n-input-number v-model:value="columnData.width" placeholder="自动" :min="50">
          <template #suffix>px</template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="对齐方式" path="align">
        <n-radio-group v-model:value="columnData.align" name="align">
          <n-radio-button value="left">左对齐</n-radio-button>
          <n-radio-button value="center">居中</n-radio-button>
          <n-radio-button value="right">右对齐</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="可排序" path="sortable">
        <n-switch v-model:value="columnData.sortable" />
      </n-form-item>
      <n-form-item label="可筛选" path="filterable">
        <n-switch v-model:value="columnData.filterable" />
      </n-form-item>
      <n-form-item label="可调整宽度" path="resizable">
        <n-switch v-model:value="columnData.resizable" />
      </n-form-item>
      <n-form-item label="固定列" path="fixed">
        <n-radio-group v-model:value="columnData.fixed" name="fixed">
          <n-radio-button value="none">不固定</n-radio-button>
          <n-radio-button value="left">左固定</n-radio-button>
          <n-radio-button value="right">右固定</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="省略号" path="ellipsis">
        <n-switch v-model:value="columnData.ellipsis" />
      </n-form-item>
      <n-form-item label="隐藏列" path="hideInTable">
        <n-switch v-model:value="columnData.hideInTable" />
      </n-form-item>
      <!-- More fields can be added here -->
    </n-form>
    <template #footer>
      <n-button @click="handleCancel">取消</n-button>
      <n-button type="primary" @click="handleSave" style="margin-left: 12px">保存</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, PropType } from 'vue';
  import {
    NModal,
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    NRadioGroup,
    NRadioButton,
    NSwitch,
  } from 'naive-ui';
  import { ColumnConfig } from '../../../types/ColumnConfig';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Object as PropType<ColumnConfig | null>,
      default: null,
    },
  });

  const emit = defineEmits(['update:show', 'update:column']);

  const columnData = ref<ColumnConfig | null>(null);

  watch(
    () => props.column,
    (newVal) => {
      if (newVal) {
        columnData.value = { ...newVal };
      } else {
        columnData.value = null;
      }
    },
    { immediate: true, deep: true }
  );

  const columnTypeOptions = [
    { label: '文本', value: 'text' },
    { label: '数字', value: 'number' },
    { label: '日期', value: 'date' },
    { label: '布尔', value: 'boolean' },
    { label: '图片', value: 'image' },
    { label: '标签', value: 'tag' },
  ];

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleSave = () => {
    if (columnData.value) {
      emit('update:column', columnData.value);
    }
    emit('update:show', false);
  };

  const handleAfterLeave = () => {
    columnData.value = null; // Clear data after modal closes
  };
</script>
