<template>
  <div class="config-panel">
    <h3>低代码表格配置</h3>
    <n-collapse arrow-placement="right" default-expanded-names="view-config">
      <n-collapse-item title="视图配置" name="view-config">
        <ViewConfigForm />
      </n-collapse-item>
      <n-collapse-item title="表格通用设置" name="general-settings">
        <TableGeneralSettingsForm />
      </n-collapse-item>
      <n-collapse-item title="列配置" name="column-config">
        <ColumnConfigForm />
      </n-collapse-item>
      <n-collapse-item title="操作列配置" name="action-column-config">
        <ActionColumnConfigForm />
      </n-collapse-item>
      <n-collapse-item title="数据源配置" name="data-source-config">
        <DataSourceConfigForm />
      </n-collapse-item>
      <!-- More configuration sections will be added here -->
    </n-collapse>
  </div>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem } from 'naive-ui';
import ViewConfigForm from './forms/ViewConfigForm.vue';
import TableGeneralSettingsForm from './forms/TableGeneralSettingsForm.vue';
import ColumnConfigForm from './forms/ColumnConfigForm.vue';
import ActionColumnConfigForm from './forms/ActionColumnConfigForm.vue';
import DataSourceConfigForm from './forms/DataSourceConfigForm.vue';
</script>

<style scoped>
.config-panel {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
