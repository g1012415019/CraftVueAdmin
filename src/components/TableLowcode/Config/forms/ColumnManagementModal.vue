<template>
  <n-modal
    :show="show"
    preset="card"
    title="列管理"
    style="width: 90%; max-width: 1200px"
    :mask-closable="false"
    @update:show="(val) => emit('update:show', val)"
    @after-leave="handleAfterLeave"
  >
    <template #header-extra>
      <n-space>
        <n-button size="small" type="primary" @click="addColumn">添加列</n-button>
        <n-button size="small" type="error" @click="removeSelectedColumns">删除选中列</n-button>
      </n-space>
    </template>

    <n-data-table
      :columns="columnsDefinition"
      :data="editableColumns"
      :bordered="true"
      :single-line="false"
      :pagination="false"
      size="small"
      :row-key="rowKey"
      v-model:checked-row-keys="checkedRowKeys"
    />

    <template #footer>
      <n-button @click="handleCancel">取消</n-button>
      <n-button type="primary" @click="handleSave" style="margin-left: 12px">保存</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, h, PropType } from 'vue';
  import {
    NModal,
    NButton,
    NSpace,
    NDataTable,
    NInput,
    NInputNumber,
    NSelect,
    NRadioGroup,
    NRadioButton,
    NSwitch,
  } from 'naive-ui';
  import type { DataTableColumn } from 'naive-ui';
  import { ColumnConfig } from '../../../types/ColumnConfig';

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array as PropType<ColumnConfig[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:show', 'update:columns']);

  const editableColumns = ref<ColumnConfig[]>([]);
  const checkedRowKeys = ref<Array<string | number>>([]);

  watch(
    () => props.columns,
    (newVal) => {
      editableColumns.value = JSON.parse(JSON.stringify(newVal)); // Deep copy
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

  const alignOptions = [
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' },
  ];

  const fixedOptions = [
    { label: '不固定', value: 'none' },
    { label: '左固定', value: 'left' },
    { label: '右固定', value: 'right' },
  ];

  const rowKey = (row: ColumnConfig) => row.field; // Use field as row key

  const renderInput = (row: ColumnConfig, key: keyof ColumnConfig) =>
    h(NInput, {
      value: row[key] as string,
      'onUpdate:value': (val: string) => {
        (row[key] as string) = val;
      },
      size: 'small',
    });

  const renderInputNumber = (
    row: ColumnConfig,
    key: keyof ColumnConfig,
    min?: number,
    placeholder?: string
  ) =>
    h(NInputNumber, {
      value: row[key] as number,
      'onUpdate:value': (val: number) => {
        (row[key] as number) = val;
      },
      min,
      placeholder,
      size: 'small',
    });

  const renderSelect = (row: ColumnConfig, key: keyof ColumnConfig, options: SelectOption[]) =>
    h(NSelect, {
      value: row[key] as string,
      'onUpdate:value': (val: string) => {
        (row[key] as string) = val;
      },
      options,
      size: 'small',
    });

  const renderSwitch = (row: ColumnConfig, key: keyof ColumnConfig) =>
    h(NSwitch, {
      value: row[key] as boolean,
      'onUpdate:value': (val: boolean) => {
        (row[key] as boolean) = val;
      },
      checkedColor: '#1890ff', // Consistent with other switches
      uncheckedColor: '#bfbfbf',
      size: 'small',
    });

  const columnsDefinition = computed<DataTableColumn[]>(() => [
    {
      type: 'selection',
      fixed: 'left',
    },
    {
      title: '字段名',
      key: 'field',
      width: 120,
      render: (row: ColumnConfig) => renderInput(row, 'field'),
    },
    {
      title: '列标题',
      key: 'title',
      width: 120,
      render: (row: ColumnConfig) => renderInput(row, 'title'),
    },
    {
      title: '类型',
      key: 'type',
      width: 100,
      render: (row: ColumnConfig) => renderSelect(row, 'type', columnTypeOptions),
    },
    {
      title: '宽度',
      key: 'width',
      width: 80,
      render: (row: ColumnConfig) => renderInputNumber(row, 'width', 50, '自动'),
    },
    {
      title: '对齐',
      key: 'align',
      width: 100,
      render: (row: ColumnConfig) => renderSelect(row, 'align', alignOptions),
    },
    {
      title: '排序',
      key: 'sortable',
      width: 80,
      render: (row: ColumnConfig) => renderSwitch(row, 'sortable'),
    },
    {
      title: '筛选',
      key: 'filterable',
      width: 80,
      render: (row: ColumnConfig) => renderSwitch(row, 'filterable'),
    },
    {
      title: '调整宽',
      key: 'resizable',
      width: 80,
      render: (row: ColumnConfig) => renderSwitch(row, 'resizable'),
    },
    {
      title: '固定',
      key: 'fixed',
      width: 100,
      render: (row: ColumnConfig) => renderSelect(row, 'fixed', fixedOptions),
    },
    {
      title: '省略',
      key: 'ellipsis',
      width: 80,
      render: (row: ColumnConfig) => renderSwitch(row, 'ellipsis'),
    },
    {
      title: '隐藏',
      key: 'hideInTable',
      width: 80,
      render: (row: ColumnConfig) => renderSwitch(row, 'hideInTable'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (row: ColumnConfig, index: number) =>
        h(
          NButton,
          { size: 'small', type: 'error', onClick: () => removeColumn(index) },
          { default: () => '删除' }
        ),
    },
  ]);

  const addColumn = () => {
    const newColumn: ColumnConfig = {
      field: `newColumn${editableColumns.value.length + 1}`,
      title: `新列 ${editableColumns.value.length + 1}`,
      type: 'text',
      width: 'auto',
      align: 'left',
      sortable: false,
      filterable: false,
      resizable: false,
      fixed: 'none',
      ellipsis: false,
      hideInTable: false,
    };
    editableColumns.value.push(newColumn);
  };

  const removeColumn = (index: number) => {
    editableColumns.value.splice(index, 1);
  };

  const removeSelectedColumns = () => {
    editableColumns.value = editableColumns.value.filter(
      (col) => !checkedRowKeys.value.includes(col.field)
    );
    checkedRowKeys.value = [];
  };

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleSave = () => {
    emit('update:columns', editableColumns.value);
    emit('update:show', false);
  };

  const handleAfterLeave = () => {
    // Reset state if needed after modal closes
    checkedRowKeys.value = [];
  };
</script>
