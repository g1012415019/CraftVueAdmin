<template>
  <div class="page-header">
    <div class="page-header__content">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="description" class="page-header__description">{{ description }}</p>
    </div>
    <div v-if="$slots.extra" class="page-header__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  readonly title: string
  readonly description?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.page-header {
  @include flex-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;

  &__content {
    flex: 1;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color-primary);
    line-height: 1.4;
  }

  &__description {
    margin: 4px 0 0;
    color: var(--text-color-secondary);
    font-size: 13px;
    line-height: 1.4;
  }

  &__extra {
    margin-left: 16px;
  }
}
</style>
