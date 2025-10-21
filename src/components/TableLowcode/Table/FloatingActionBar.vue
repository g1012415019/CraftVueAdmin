<template>
  <div
    v-if="show && currentRow"
    class="floating-action-bar"
    :style="{
      position: 'absolute',
      top: y + 'px',
      left: x + 'px',
      zIndex: 1000,
    }"
  >
    <n-space size="small">
      <n-button
        v-for="action in actions"
        :key="action.key"
        :type="action.type"
        size="small"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  x: number;
  y: number;
  currentRow: any;
  actions: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'action': [action: any, row: any];
}>();

const handleAction = (action: any) => {
  emit('action', action, props.currentRow);
};
</script>

<style scoped>
.floating-action-bar {
  background: white;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
