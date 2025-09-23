<template>
  <div class="sort-settings px-6 py-4">
    <div class="space-y-4">
      <div v-for="sort in sorts" :key="sort.id" class="flex items-center gap-3">
        <n-select
          v-model:value="sort.field"
          :options="fieldOptions"
          placeholder="排序字段"
          style="width: 200px"
        />
        <n-select
          v-model:value="sort.order"
          :options="orderOptions"
          placeholder="排序方式"
          style="width: 120px"
        />
        <n-button size="small" @click="removeSort(sort.id)">删除</n-button>
      </div>
      <n-button @click="addSort">添加排序</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { NSelect, NButton } from 'naive-ui';

  const sorts = ref([{ id: 1, field: null, order: 'asc' }]);

  const fieldOptions = [
    { label: '创建时间', value: 'createTime' },
    { label: '名称', value: 'name' },
    { label: '状态', value: 'status' },
  ];

  const orderOptions = [
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ];

  const addSort = () => {
    sorts.value.push({ id: Date.now(), field: null, order: 'asc' });
  };

  const removeSort = (id: number) => {
    sorts.value = sorts.value.filter((s) => s.id !== id);
  };
</script>
