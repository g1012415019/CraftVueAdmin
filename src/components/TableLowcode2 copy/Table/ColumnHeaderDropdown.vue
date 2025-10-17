<template>
  <n-dropdown
    :show="show"
    :options="dropdownOptions"
    :x="x"
    :y="y"
    placement="bottom-start"
    @select="handleSelect"
    @clickoutside="handleClickOutside"
  />
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  x: number;
  y: number;
  columnKey: string;
  columnConfig: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:show': [value: boolean];
  'sort': [key: string, order: 'ascend' | 'descend' | null];
  'filter': [key: string];
  'hide': [key: string];
}>();

// 下拉菜单选项
const dropdownOptions = computed(() => {
  const options = [];
  
  // 排序选项
  if (props.columnConfig?.sortable) {
    options.push(
      { label: '升序排列', key: 'sort-asc' },
      { label: '降序排列', key: 'sort-desc' }
    );
  }
  
  // 过滤选项
  if (props.columnConfig?.filterable) {
    if (options.length > 0) options.push({ type: 'divider' });
    options.push({ label: '筛选', key: 'filter' });
  }
  
  // 列操作
  if (options.length > 0) options.push({ type: 'divider' });
  options.push(
    { label: '隐藏列', key: 'hide' },
    { label: '固定到左侧', key: 'pin-left' },
    { label: '固定到右侧', key: 'pin-right' },
    { label: '取消固定', key: 'unpin' }
  );
  
  return options;
});

const handleSelect = (key: string) => {
  switch (key) {
    case 'sort-asc':
      emit('sort', props.columnKey, 'ascend');
      break;
    case 'sort-desc':
      emit('sort', props.columnKey, 'descend');
      break;
    case 'filter':
      emit('filter', props.columnKey);
      break;
    case 'hide':
      emit('hide', props.columnKey);
      break;
  }
  emit('update:show', false);
};

const handleClickOutside = () => {
  emit('update:show', false);
};
</script>
