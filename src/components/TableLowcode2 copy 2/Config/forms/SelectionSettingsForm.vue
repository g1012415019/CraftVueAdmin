<template>
  <n-form label-placement="left" label-width="100px" size="small">
    <n-card title="选择功能" size="small" class="mb-4">
      <n-form-item label="启用选择">
        <n-switch v-model:value="config.selection.enabled" />
      </n-form-item>
      
      <template v-if="config.selection.enabled">
        <n-form-item label="选择模式">
          <n-radio-group v-model:value="config.selection.mode" size="small">
            <n-radio-button value="single">单选</n-radio-button>
            <n-radio-button value="multiple">多选</n-radio-button>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="列位置">
          <n-radio-group v-model:value="config.selection.columnPosition" size="small">
            <n-radio-button value="left">左侧</n-radio-button>
            <n-radio-button value="right">右侧</n-radio-button>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="翻页保持">
          <n-switch v-model:value="config.selection.keepOnPageChange" />
        </n-form-item>
      </template>
    </n-card>
  </n-form>
</template>

<script setup lang="ts">
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;
</script>
