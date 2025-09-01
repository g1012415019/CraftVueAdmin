<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="90px"
    require-mark-placement="right-hanging"
    :show-require-mark="true"
    size="medium"
  >
    <NGrid :cols="1" :y-gap="24">
      <NFormItemGi label="姓名" path="name">
        <NInput
          v-model:value="formData.name"
          placeholder="请输入用户姓名"
          clearable
          maxlength="20"
          show-count
        />
      </NFormItemGi>

      <NFormItemGi label="邮箱" path="email">
        <NInput
          v-model:value="formData.email"
          placeholder="请输入邮箱地址"
          clearable
          maxlength="50"
        />
      </NFormItemGi>

      <NFormItemGi label="角色" path="role">
        <NSelect
          v-model:value="formData.role"
          placeholder="请选择用户角色"
          :options="roleOptions"
        />
      </NFormItemGi>

      <NFormItemGi label="状态" path="status">
        <NSelect
          v-model:value="formData.status"
          placeholder="请选择用户状态"
          :options="statusOptions"
        />
      </NFormItemGi>

      <NFormItemGi label="头像" path="avatar">
        <NInput
          v-model:value="formData.avatar"
          placeholder="请输入头像URL（可选）"
          clearable
          maxlength="200"
        />
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import type { User, CreateUserDto, UpdateUserDto, UserRole, UserStatus } from '@/types'

interface Props {
  initialData?: User | null
}

interface Emits {
  submit: [data: CreateUserDto | UpdateUserDto]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInst | null>(null)

const formData = reactive({
  name: '',
  email: '',
  role: 'user' as UserRole,
  status: 'active' as UserStatus,
  avatar: ''
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '用户', value: 'user' },
  { label: '访客', value: 'guest' }
]

const statusOptions = [
  { label: '激活', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '待审核', value: 'pending' }
]

const rules: FormRules = {
  name: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应为2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ]
}

// 初始化表单数据
watchEffect(() => {
  if (props.initialData) {
    Object.assign(formData, props.initialData)
  } else {
    Object.assign(formData, {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      avatar: ''
    })
  }
})

// 验证并提交表单
const validate = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData })
    return true
  } catch {
    return false
  }
}

defineExpose({
  validate
})
</script>
