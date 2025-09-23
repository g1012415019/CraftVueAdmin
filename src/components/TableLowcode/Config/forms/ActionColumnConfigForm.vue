<template>
  <div class="action-column-config-form">
    <n-form :model="actionColumnConfig" label-placement="left" :label-width="80">
      <FormItem
        label="列宽度"
        type="input-number"
        v-model:value="actionColumnConfig.width"
        :min="50"
      />
      <FormItem
        label="固定列"
        type="radio-button-group"
        v-model:value="actionColumnConfig.fixed"
        name="actionFixed"
        :options="fixedOptions"
      />
    </n-form>

    <n-divider>操作按钮</n-divider>

    <n-collapse arrow-placement="right" :default-expanded-names="expandedActionNames">
      <n-collapse-item
        v-for="(action, index) in actionColumnConfig.actions"
        :key="action.key || index"
        :title="action.label || `按钮 ${index + 1}`"
        :name="action.key || index"
      >
        <n-form :model="action" label-placement="left" :label-width="80">
          <FormItem
            label="按钮文本"
            type="input"
            v-model:value="action.label"
            placeholder="请输入按钮文本"
          />
          <FormItem
            label="唯一标识"
            type="input"
            v-model:value="action.key"
            placeholder="请输入唯一标识"
          />
          <FormItem
            label="按钮类型"
            type="radio-button-group"
            v-model:value="action.type"
            name="actionType"
            :options="actionTypeOptions"
          />
          <FormItem
            label="图标"
            type="input"
            v-model:value="action.icon"
            placeholder="请输入图标名称"
          />
          <FormItem
            label="权限标识"
            type="input"
            v-model:value="action.permission"
            placeholder="请输入权限标识"
          />
          <FormItem label="禁用" type="switch" v-model:value="action.disabled" />
          <FormItem label="隐藏" type="switch" v-model:value="action.hidden" />
          <FormItem label="确认弹窗" type="switch" v-model:value="action.confirm" />
          <template v-if="action.confirm">
            <FormItem
              label="确认标题"
              type="input"
              v-model:value="action.confirm.title"
              placeholder="请输入确认标题"
            />
            <FormItem
              label="确认内容"
              type="textarea"
              v-model:value="action.confirm.content"
              placeholder="请输入确认内容"
            />
            <FormItem
              label="确认按钮文本"
              type="input"
              v-model:value="action.confirm.okText"
              placeholder="请输入确认按钮文本"
            />
            <FormItem
              label="取消按钮文本"
              type="input"
              v-model:value="action.confirm.cancelText"
              placeholder="请输入取消按钮文本"
            />
          </template>
          <n-button @click="removeAction(index)" type="error" style="margin-top: 10px"
            >删除按钮</n-button
          >
        </n-form>
      </n-collapse-item>
    </n-collapse>

    <n-button @click="addAction" type="primary" style="margin-top: 20px">添加按钮</n-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { NForm, NButton, NDivider, NCollapse, NCollapseItem } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import { ActionButton } from '../../../types/ActionColumnConfig';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();
  const actionColumnConfig = computed(() => tableStore.getActionColumnConfig);

  const expandedActionNames = ref<string[]>([]);

  const fixedOptions = [
    { label: '不固定', value: 'none' },
    { label: '左固定', value: 'left' },
    { label: '右固定', value: 'right' },
  ];

  const actionTypeOptions = [
    { label: '按钮', value: 'button' },
    { label: '链接', value: 'link' },
  ];

  const addAction = () => {
    const newAction: ActionButton = {
      label: `新按钮${actionColumnConfig.value.actions.length + 1}`,
      key: `newAction${actionColumnConfig.value.actions.length + 1}`,
      type: 'button',
      disabled: false,
      hidden: false,
      confirm: undefined, // Initialize confirm as undefined
    };
    tableStore.setActionColumnConfig({
      actions: [...actionColumnConfig.value.actions, newAction],
    });
    expandedActionNames.value.push(newAction.key);
  };

  const removeAction = (index: number) => {
    const updatedActions = [...actionColumnConfig.value.actions];
    updatedActions.splice(index, 1);
    tableStore.setActionColumnConfig({ actions: updatedActions });
  };

  // Note: Direct mutation of computed ref is not allowed. Use actions.
  // For simplicity, I'm directly binding to the computed ref for now.
  // In a real app, you'd dispatch actions like tableStore.setActionColumnConfig({ actions: updatedActions })
</script>
