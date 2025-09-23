<template>
  <div>
    <draggable
      :list="actions"
      item-key="key"
      handle=".drag-handle"
      class="space-y-2"
      @end="emit('update:actions', actions)"
    >
      <template #item="{ element: action, index }">
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
            <n-input
              v-model:value="action.label"
              placeholder="按钮文本"
              class="font-medium flex-1"
            />
            <n-button @click="removeAction(index)" size="small" quaternary circle type="error">
              <template #icon
                ><svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                  /></svg
              ></template>
            </n-button>
          </div>
          <div class="mt-4 pl-8 space-y-4">
            <n-form-item label="按钮样式" label-placement="left">
              <n-select v-model:value="action.type" :options="typeOptions" size="small" />
            </n-form-item>
            <n-form-item label="按钮图标" label-placement="left">
              <n-input v-model:value="action.icon" placeholder="输入图标名称" size="small" />
            </n-form-item>
            <n-form-item label="显示确认框" label-placement="left">
              <n-switch v-model:value="action.showConfirmation" size="small" />
            </n-form-item>
            <n-form-item v-if="action.showConfirmation" label="确认框文本" label-placement="left">
              <n-input
                v-model:value="action.confirmationText"
                placeholder="例如：确定要删除吗？"
                size="small"
              />
            </n-form-item>
          </div>
        </div>
      </template>
    </draggable>

    <n-button @click="addAction" dashed block class="mt-4">添加操作按钮</n-button>
  </div>
</template>

<script setup lang="ts">
  import draggable from 'vuedraggable';

  import { v4 as uuidv4 } from 'uuid';

  const props = defineProps<{ actions: any[] }>();
  const emit = defineEmits(['update:actions']);

  const typeOptions = [
    { label: '默认', value: 'default' },
    { label: '主要', value: 'primary' },
    { label: '成功', value: 'success' },
    { label: '信息', value: 'info' },
    { label: '警告', value: 'warning' },
    { label: '错误', value: 'error' },
  ];

  function addAction() {
    const newActions = [...props.actions];
    newActions.push({
      key: uuidv4(),
      label: '新操作',
      type: 'default',
      icon: '',
    });
    emit('update:actions', newActions);
  }

  function removeAction(index: number) {
    const newActions = [...props.actions];
    newActions.splice(index, 1);
    emit('update:actions', newActions);
  }
</script>
