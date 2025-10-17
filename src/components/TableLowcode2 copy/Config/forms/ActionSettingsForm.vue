<template>
  <n-space vertical>
    <n-text>操作配置功能开发中...</n-text>
  </n-space>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

// 注入共享的配置状态
const config = inject('tableConfig') as Ref<any>;
</script>
