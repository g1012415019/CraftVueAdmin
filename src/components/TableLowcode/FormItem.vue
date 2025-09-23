<template>
  <n-form-item :label="label" :path="path">
    <template v-if="type === 'radio-button-group'">
      <n-radio-group :value="value" @update:value="handleUpdate" :name="name" button-style="solid">
        <n-radio-button v-for="option in options" :key="option.value" :value="option.value">{{
          option.label
        }}</n-radio-button>
      </n-radio-group>
    </template>
    <template v-else-if="type === 'checkbox-group'">
      <n-grid :cols="cols" x-gap="12">
        <n-gi v-for="option in options" :key="option.value">
          <n-checkbox
            :checked="value && value[option.value]"
            @update:checked="(val) => handleCheckboxUpdate(option.value, val)"
          >
            {{ option.label }}
          </n-checkbox>
        </n-gi>
      </n-grid>
    </template>
    <template v-else-if="type === 'switch'">
      <n-switch
        :value="value"
        @update:value="handleUpdate"
        checked-color="#1890ff"
        unchecked-color="#bfbfbf"
      />
    </template>
    <template v-else-if="type === 'input-number'">
      <n-input-number
        :value="value"
        @update:value="handleUpdate"
        :min="min"
        :max="max"
        :placeholder="placeholder"
      >
        <template #suffix v-if="suffix">{{ suffix }}</template>
      </n-input-number>
    </template>
    <template v-else-if="type === 'input'">
      <n-input :value="value" @update:value="handleUpdate" :placeholder="placeholder" />
    </template>
    <template v-else-if="type === 'textarea'">
      <n-input
        type="textarea"
        :value="value"
        @update:value="handleUpdate"
        :placeholder="placeholder"
      />
    </template>
    <template v-else-if="type === 'select'">
      <n-select
        :value="value"
        @update:value="handleUpdate"
        :options="options"
        :placeholder="placeholder"
      />
    </template>
  </n-form-item>
</template>

<script setup lang="ts">
  import {
    NFormItem,
    NRadioGroup,
    NRadioButton,
    NCheckbox,
    NSwitch,
    NInputNumber,
    NInput,
    NSelect,
    NGrid,
    NGi,
  } from 'naive-ui';

  const props = defineProps({
    label: String,
    path: String,
    value: [String, Number, Boolean, Object] as PropType<any>,
    type: {
      type: String,
      required: true,
    },
    name: String,
    options: Array as PropType<{ label: string; value: any }[]>,
    min: Number,
    max: Number,
    suffix: String,
    placeholder: String,
    cols: Number,
  });

  const emit = defineEmits(['update:value']);

  const handleUpdate = (val: any) => {
    emit('update:value', val);
  };

  const handleCheckboxUpdate = (key: string, checked: boolean) => {
    const newValue = { ...(props.value || {}) };
    newValue[key] = checked;
    emit('update:value', newValue);
  };
</script>
