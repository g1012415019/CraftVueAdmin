<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="排序模式">
      <n-select v-model:value="config.sortFilter.sortMode" :options="sortModeOptions" />
    </n-form-item>
    <n-form-item label="过滤模式">
      <n-select v-model:value="config.sortFilter.filterMode" :options="filterModeOptions" />
    </n-form-item>
    <n-form-item label="防抖延迟 (毫秒)">
      <n-input-number
        v-model:value="config.sortFilter.debounceDelay"
        :min="0"
        placeholder="例如: 300"
      />
    </n-form-item>

    <div class="border-t my-4"></div>

    <n-form-item label="功能开关" label-placement="top">
      <n-space justify="space-between" wrap>
        <n-switch v-model:value="config.sortFilter.columnSort">
          <template #checked>列排序</template>
          <template #unchecked>无列排序</template>
        </n-switch>
        <n-switch v-model:value="config.sortFilter.showGlobalSearch">
          <template #checked>全局搜索</template>
          <template #unchecked>无全局搜索</template>
        </n-switch>
        <n-switch v-model:value="config.sortFilter.showFilterTags">
          <template #checked>筛选标签</template>
          <template #unchecked>无筛选标签</template>
        </n-switch>
      </n-space>
    </n-form-item>

    <div class="border-t my-4"></div>

    <n-form-item label="全局搜索列">
      <n-select
        v-model:value="config.sortFilter.globalSearchColumns"
        :options="columnOptions"
        placeholder="选择全局搜索的列"
        multiple
        clearable
      />
    </n-form-item>

    <div class="border-t my-4"></div>

    <n-form-item label="默认排序列">
      <n-select
        v-model:value="config.sortFilter.defaultSort.key"
        :options="columnOptions"
        placeholder="选择默认排序列"
        clearable
      />
    </n-form-item>
    <n-form-item label="默认排序顺序">
      <n-radio-group v-model:value="config.sortFilter.defaultSort.order" name="default-sort-order">
        <n-radio-button v-for="option in orderOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>

    <div class="border-t my-4"></div>

    <n-form-item label="筛选器类型">
      <p class="text-gray-400 text-xs"
        >注：筛选器类型（如输入框、下拉框等）应在“列配置”中针对每一列单独设置。</p
      >
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;

  // 从列配置中动态生成可用于排序的列选项
  const columnOptions = computed(() =>
    config.value.columns.map((col: any) => ({
      label: col.label,
      value: col.key,
    }))
  );

  // 定义排序顺序选项
  const orderOptions = [
    { label: '升序', value: 'ascend' },
    { label: '降序', value: 'descend' },
  ];

  const sortModeOptions = [
    { label: '前端排序', value: 'frontend' },
    { label: '后端排序', value: 'backend' },
  ];

  const filterModeOptions = [
    { label: '前端过滤', value: 'frontend' },
    { label: '后端过滤', value: 'backend' },
  ];
</script>
