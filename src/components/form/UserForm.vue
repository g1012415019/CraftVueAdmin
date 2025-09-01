<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="80"
  >
    <NFormItem :label="t('user.name')" path="name">
      <NInput
        v-model:value="formData.name"
        :placeholder="t('user.name')"
        clearable
      />
    </NFormItem>
    
    <NFormItem :label="t('user.email')" path="email">
      <NInput
        v-model:value="formData.email"
        :placeholder="t('user.email')"
        clearable
      />
    </NFormItem>
    
    <NFormItem :label="t('user.role')" path="role">
      <NSelect
        v-model:value="formData.role"
        :options="roleOptions"
        :placeholder="t('user.role')"
      />
    </NFormItem>
  </NForm>
</template>

<script setup lang="ts">
import type { FormInst, FormRules, SelectOption } from 'naive-ui'
import type { UserRole, CreateUserDto, UpdateUserDto } from '@/types'

interface Props {
  readonly initialData?: Partial<CreateUserDto | UpdateUserDto>
}

interface Emits {
  submit: [data: CreateUserDto | UpdateUserDto]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const formRef = ref<FormInst>()

const formData = reactive({
  name: '',
  email: '',
  role: 'user' as UserRole
})

const roleOptions: SelectOption[] = [
  { label: t('role.admin'), value: 'admin' },
  { label: t('role.user'), value: 'user' },
  { label: t('role.guest'), value: 'guest' }
]

const rules: FormRules = {
  name: [
    { required: true, message: t('user.name') + '不能为空', trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('user.email') + '不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: t('user.role') + '不能为空', trigger: 'change' }
  ]
}

const validate = async (): Promise<boolean> => {
  try {
    await formRef.value?.validate()
    return true
  } catch {
    return false
  }
}

const submit = async () => {
  if (await validate()) {
    emit('submit', { ...formData })
  }
}

const reset = () => {
  formRef.value?.restoreValidation()
  Object.assign(formData, {
    name: '',
    email: '',
    role: 'user' as UserRole
  })
}

// 初始化表单数据
watchEffect(() => {
  if (props.initialData) {
    Object.assign(formData, props.initialData)
  }
})

defineExpose({
  validate,
  submit,
  reset
})
</script>
