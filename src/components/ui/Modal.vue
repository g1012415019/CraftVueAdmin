<template>
  <NModal
    v-model:show="visible"
    preset="card"
    :title="title || ''"
    :closable="closable || false"
    :mask-closable="maskClosable || true"
    :style="{ width: typeof width === 'number' ? `${width}px` : width }"
    :content-style="{ maxHeight: '60vh', overflowY: 'auto' }"
    @close="onClose"
  >
    <slot />
    
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
  </NModal>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  width?: string | number
  maskClosable?: boolean
  closable?: boolean
}

interface Emits {
  'update:show': [value: boolean]
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: 600,
  maskClosable: true,
  closable: true
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const onClose = () => {
  emit('close')
  visible.value = false
}
</script>

<style lang="scss">
.n-modal {
  .n-card {
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    
    .n-card__header {
      border-bottom: 1px solid var(--n-divider-color);
      
      .n-card-header__main {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .n-card__content {
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        
        &:hover {
          background: var(--n-primary-color);
        }
      }
    }
    
    .n-card__action {
      border-top: 1px solid var(--n-divider-color);
      padding: 16px 24px;
      
      .n-space {
        justify-content: flex-end;
      }
    }
  }
}
</style>
