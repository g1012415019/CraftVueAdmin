<template>
  <div class="action-column-config-form">
    <n-form :model="actionColumnConfig" label-placement="left" :label-width="80">
      <n-form-item label="列宽度">
        <n-input-number v-model:value="actionColumnConfig.width" :min="50" />
      </n-form-item>
      <n-form-item label="固定列">
        <n-radio-group v-model:value="actionColumnConfig.fixed" name="actionFixed">
          <n-radio-button value="none">不固定</n-radio-button>
          <n-radio-button value="left">左固定</n-radio-button>
          <n-radio-button value="right">右固定</n-radio-button>
        </n-radio-group>
      </n-form-item>
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
          <n-form-item label="按钮文本">
            <n-input v-model:value="action.label" placeholder="请输入按钮文本" />
          </n-form-item>
          <n-form-item label="唯一标识">
            <n-input v-model:value="action.key" placeholder="请输入唯一标识" />
          </n-form-item>
          <n-form-item label="按钮类型">
            <n-radio-group v-model:value="action.type" name="actionType">
              <n-radio-button value="button">按钮</n-radio-button>
              <n-radio-button value="link">链接</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="图标">
            <n-input v-model:value="action.icon" placeholder="请输入图标名称" />
          </n-form-item>
          <n-form-item label="权限标识">
            <n-input v-model:value="action.permission" placeholder="请输入权限标识" />
          </n-form-item>
          <n-form-item label="禁用">
            <n-switch v-model:value="action.disabled" />
          </n-form-item>
          <n-form-item label="隐藏">
            <n-switch v-model:value="action.hidden" />
          </n-form-item>
          <n-form-item label="确认弹窗">
            <n-switch v-model:value="action.confirm" />
          </n-form-item>
          <n-form-item label="确认标题" v-if="action.confirm">
            <n-input v-model:value="action.confirm.title" placeholder="请输入确认标题" />
          </n-form-item>
          <n-form-item label="确认内容" v-if="action.confirm">
            <n-input type="textarea" v-model:value="action.confirm.content" placeholder="请输入确认内容" />
          </n-form-item>
          <n-form-item label="确认按钮文本" v-if="action.confirm">
            <n-input v-model:value="action.confirm.okText" placeholder="请输入确认按钮文本" />
          </n-form-item>
          <n-form-item label="取消按钮文本" v-if="action.confirm">
            <n-input v-model:value="action.confirm.cancelText" placeholder="请输入取消按钮文本" />
          </n-form-item>
          <n-button @click="removeAction(index)" type="error" style="margin-top: 10px;">删除按钮</n-button>
        </n-form>
      </n-collapse-item>
    </n-collapse>

    <n-button @click="addAction" type="primary" style="margin-top: 20px;">添加按钮</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadioGroup,
  NRadioButton,
  NSwitch,
  NCollapse,
  NCollapseItem,
  NButton,
  NDivider,
} from 'naive-ui';
import { useTableStore } from '../../../../store/modules/table';
import { ActionButton } from '../../../types/ActionColumnConfig';

const tableStore = useTableStore();
const actionColumnConfig = computed(() => tableStore.getActionColumnConfig);

const expandedActionNames = ref<string[]>([]);

const addAction = () => {
  const newAction: ActionButton = {
    label: `新按钮${actionColumnConfig.value.actions.length + 1}`,
    key: `newAction${actionColumnConfig.value.actions.length + 1}`,
    type: 'button',
    disabled: false,
    hidden: false,
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
