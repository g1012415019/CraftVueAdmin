<template>
  <div>
    <div class="mb-4 p-2 border border-dashed border-gray-300 rounded-md">
      <p class="text-sm text-gray-600">使用第三方组件 <code>vuedraggable</code> 实现。</p>
      <p class="text-xs text-gray-400"
        >请确保您已在项目中安装依赖: <code>pnpm add vuedraggable@next</code></p
      >
    </div>

    <draggable v-model="config.columns" item-key="key" handle=".drag-handle" class="space-y-2">
      <template #item="{ element: column }">
        <div class="p-3 border rounded-md bg-white hover:shadow-sm transition-shadow">
          <div class="flex items-center gap-3">
            <div class="drag-handle cursor-move text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M9 3H7v2h2V3m4 0h-2v2h2V3m4 0h-2v2h2V3M9 7H7v2h2V7m4 0h-2v2h2V7m4 0h-2v2h2V7m-8 4H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2m-8 4H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2m-8 4H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2Z"
                />
              </svg>
            </div>
            <n-input v-model:value="column.label" placeholder="列标题" class="font-medium flex-1" />
            <n-switch v-model:value="column.visible" title="显示/隐藏" />
          </div>
          <div v-if="column.visible" class="mt-4 pl-8 space-y-4">
            <n-form-item label="列宽" label-placement="left">
              <n-input-number
                v-model:value="column.width"
                placeholder="自动"
                size="small"
                clearable
              />
            </n-form-item>
            <n-form-item label="固定列" label-placement="left">
              <n-select
                v-model:value="column.fixed"
                :options="fixedOptions"
                size="small"
                clearable
              />
            </n-form-item>
            <n-form-item label="对齐方式" label-placement="left">
              <n-select v-model:value="column.align" :options="alignOptions" size="small" />
            </n-form-item>

            <div class="border-t my-4"></div>

            <n-form-item label="启用排序" label-placement="left">
              <n-switch v-model:value="column.sortable" size="small" />
            </n-form-item>
            <n-form-item v-if="column.sortable" label="默认排序顺序" label-placement="left">
              <n-radio-group
                v-model:value="column.defaultSortOrder"
                name="column-default-sort-order"
              >
                <n-radio-button
                  v-for="option in sortOrderOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </n-radio-button>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="column.sortable" label="自定义排序器" label-placement="left">
              <n-select
                v-model:value="column.customSorter"
                :options="customSorterOptions"
                placeholder="选择自定义排序函数"
                size="small"
                clearable
              />
            </n-form-item>

            <div class="border-t my-4"></div>

            <n-form-item label="启用过滤" label-placement="left">
              <n-switch v-model:value="column.filterable" size="small" />
            </n-form-item>
            <n-form-item v-if="column.filterable" label="过滤器类型" label-placement="left">
              <n-select
                v-model:value="column.filterType"
                :options="filterTypeOptions"
                size="small"
              />
            </n-form-item>
            <n-form-item
              v-if="column.filterable && column.filterType === 'enum'"
              label="枚举选项 (逗号分隔)"
              label-placement="left"
            >
              <n-input
                v-model:value="column.filterOptions"
                placeholder="选项1,选项2"
                size="small"
              />
            </n-form-item>
            <n-form-item v-if="column.filterable" label="默认过滤值" label-placement="left">
              <n-input
                v-model:value="column.defaultFilterValue"
                placeholder="输入默认过滤值"
                size="small"
              />
            </n-form-item>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
  import { inject, Ref } from 'vue';
  // Inject the shared config state
  const config = inject('tableConfig') as Ref<any>;

  const fixedOptions = [
    { label: '不固定', value: null },
    { label: '左侧固定', value: 'left' },
    { label: '右侧固定', value: 'right' },
  ];

  const alignOptions = [
    { label: '左对齐', value: 'left' },
    { label: '居中对齐', value: 'center' },
    { label: '右对齐', value: 'right' },
  ];

  const sortOrderOptions = [
    { label: '无', value: null },
    { label: '升序', value: 'ascend' },
    { label: '降序', value: 'descend' },
  ];

  const customSorterOptions = [
    { label: '无', value: null },
    { label: '按数字排序', value: 'numberSorter' },
    { label: '按日期排序', value: 'dateSorter' },
  ];

  const filterTypeOptions = [
    { label: '无', value: 'none' },
    { label: '枚举筛选', value: 'enum' },
    { label: '文本筛选', value: 'text' },
    { label: '数值范围', value: 'numberRange' },
    { label: '日期范围', value: 'dateRange' },
    { label: '布尔筛选', value: 'boolean' },
  ];
</script>

<style scoped>
  .drag-handle {
    cursor: move;
  }
</style>
