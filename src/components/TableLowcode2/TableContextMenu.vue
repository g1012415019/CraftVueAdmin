<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="dropdownX"
    :y="dropdownY"
    :options="contextMenuOptions"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { DropdownOption } from 'naive-ui';

const props = defineProps<{
  showDropdown: boolean;
  dropdownX: number;
  dropdownY: number;
  contextMenuOptions: DropdownOption[];
  onClickoutside: () => void;
  handleMenuSelect: (key: string | number) => void;
}>();
</script>
