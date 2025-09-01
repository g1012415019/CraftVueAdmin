<template>
  <div class="user-management">
    <PageHeader :title="t('user.title')">
      <template #extra>
        <NSpace>
          <NButton @click="handleRefresh">
            <template #icon>
              <NIcon :component="RefreshOutline" />
            </template>
            刷新
          </NButton>
          <NButton @click="viewStore.toggleConfigPanel">
            <template #icon>
              <NIcon :component="SettingsOutline" />
            </template>
            表格设置
          </NButton>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <NIcon :component="AddOutline" />
            </template>
            {{ t('user.addUser') }}
          </NButton>
        </NSpace>
      </template>
    </PageHeader>

    <!-- 视图管理 -->
    <ViewManager />

    <!-- 高级数据表格 -->
    <AdvancedDataTable
      :data="userStore.users"
      :loading="userStore.loading"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @row-click="handleRowClick"
    />

    <!-- 表格配置面板 -->
    <TableConfigPanel />

    <!-- 用户表单模态框 -->
    <Modal
      v-model:show="showModal"
      :title="isEdit ? t('user.editUser') : t('user.addUser')"
      :width="600"
      :mask-closable="false"
      @close="showModal = false"
    >
        <UserForm
          ref="userFormRef"
          :initial-data="currentUser"
          @submit="handleSubmit"
        />
        
        <template #action>
          <NSpace>
            <NButton @click="showModal = false">
              {{ t('common.cancel') }}
            </NButton>
            <NButton type="primary" @click="handleFormSubmit">
              {{ t('common.save') }}
            </NButton>
          </NSpace>
        </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { AddOutline, RefreshOutline, SettingsOutline } from '@vicons/ionicons5'
import type { User, CreateUserDto, UpdateUserDto } from '@/types'
import { useUserStore } from '@/stores/user'
import { useViewStore } from '@/stores/view'
import UserForm from '@/components/forms/UserForm.vue'
import Modal from '@/components/ui/Modal.vue'

const { t } = useI18n()
const message = useMessage()
const userStore = useUserStore()
const viewStore = useViewStore()

const showModal = ref(false)
const isEdit = ref(false)
const currentUser = ref<User | null>(null)
const userFormRef = ref<InstanceType<typeof UserForm> | null>(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const handleAdd = () => {
  isEdit.value = false
  currentUser.value = null
  showModal.value = true
}

const handleRowClick = (user: User) => {
  if (viewStore.currentView?.displaySettings.interactionMode === 'classic') {
    handleEdit(user)
  }
}

const handleEdit = (user: User) => {
  isEdit.value = true
  currentUser.value = user
  showModal.value = true
}

const handleFormSubmit = async () => {
  const success = await userFormRef.value?.validate()
  if (success) {
    // 表单验证通过，UserForm 组件会触发 submit 事件
  }
}

const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
  try {
    if (isEdit.value) {
      await userStore.updateUser(data as UpdateUserDto)
      message.success('更新成功')
    } else {
      await userStore.createUser(data as CreateUserDto)
      message.success('创建成功')
    }
    showModal.value = false
    await fetchUsers()
  } catch (error) {
    message.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchUsers()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  fetchUsers()
}

const handleRefresh = () => {
  fetchUsers()
  message.success('数据已刷新')
}

const fetchUsers = async () => {
  await userStore.fetchUsers(pagination.page, pagination.pageSize)
  pagination.total = userStore.total
}

// 初始化数据
onMounted(async () => {
  try {
    await fetchUsers()
    console.log('用户数据加载完成:', userStore.users.length)
  } catch (error) {
    console.error('用户数据加载失败:', error)
    message.error('数据加载失败')
  }
})
</script>

<style lang="scss" scoped>
.user-management {
  padding: 12px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-color-secondary);
  
  :deep(.page-header) {
    margin-bottom: 0;
    padding: 8px 0;
  }
  
  :deep(.view-manager) {
    margin: 0;
    padding: 4px 0;
  }
  
  :deep(.advanced-data-table) {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .n-data-table-wrapper {
      flex: 1;
    }
    
    .n-data-table {
      .n-data-table-th {
        padding: 6px 8px;
        font-size: 12px;
        line-height: 1.4;
      }
      
      .n-data-table-td {
        padding: 6px 8px;
        font-size: 12px;
        line-height: 1.4;
      }
    }
    
    .table-pagination {
      padding: 8px 0;
      margin: 0;
    }
  }
}
</style>
