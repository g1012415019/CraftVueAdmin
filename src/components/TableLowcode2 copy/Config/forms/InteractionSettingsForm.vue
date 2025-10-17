<template>
  <n-form label-placement="left" label-width="100px" size="small">
    <n-card title="行交互" size="small" class="mb-4">
      <n-form-item label="单击行">
        <n-switch v-model:value="config.interaction.rowClick" />
      </n-form-item>
      <n-form-item label="双击行">
        <n-switch v-model:value="config.interaction.rowDblClick" />
      </n-form-item>
    </n-card>
    
    <n-card title="拖拽功能" size="small" class="mb-4">
      <n-form-item label="拖拽排序">
        <n-switch v-model:value="config.interaction.dragSort" />
      </n-form-item>
    </n-card>
    
    <n-card title="右键菜单" size="small" class="mb-4">
      <n-form-item label="启用菜单">
        <n-switch v-model:value="config.interaction.contextMenu" />
      </n-form-item>
    </n-card>
    
    <n-card title="行内编辑" size="small" class="mb-4">
      <n-form-item label="启用编辑">
        <n-switch v-model:value="config.editing.inlineEditingEnabled" />
      </n-form-item>
      
      <template v-if="config.editing.inlineEditingEnabled">
        <n-form-item label="编辑模式">
          <n-radio-group v-model:value="config.editing.mode" size="small">
            <n-radio-button value="row">整行</n-radio-button>
            <n-radio-button value="cell">单元格</n-radio-button>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="触发方式">
          <n-radio-group v-model:value="config.editing.trigger" size="small">
            <n-radio-button value="dblclick">双击</n-radio-button>
            <n-radio-button value="button">按钮</n-radio-button>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="按钮位置" v-if="config.editing.trigger === 'button'">
          <n-radio-group v-model:value="config.editing.buttonsPosition" size="small">
            <n-radio-button value="inline">行内</n-radio-button>
            <n-radio-button value="bottom">底部</n-radio-button>
          </n-radio-group>
        </n-form-item>
      </template>
    </n-card>
  </n-form>
</template>

<script setup lang="ts">
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;
</script>
