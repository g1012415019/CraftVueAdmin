<template>
  <div class="view-manager">
    <NTabs
      :value="viewStore.currentViewId"
      type="card"
      closable
      addable
      @update:value="viewStore.setCurrentView"
      @close="handleCloseView"
      @add="showCreateViewModal = true"
    >
      <NTabPane
        v-for="view in viewStore.views"
        :key="view.id"
        :name="view.id"
        :tab="view.name"
        :closable="!view.isDefault"
      />
    </NTabs>

    <!-- 创建视图模态框 -->
    <Modal 
      v-model:show="showCreateViewModal" 
      title="创建新视图" 
      :width="600"
      @close="showCreateViewModal = false"
    >
      <NForm ref="formRef" :model="newViewForm" :rules="rules">
        <NFormItem label="视图名称" path="name">
          <NInput v-model:value="newViewForm.name" placeholder="输入视图名称" />
        </NFormItem>
        
        <NFormItem label="视图类型" path="type">
          <NGrid :cols="3" :x-gap="12" :y-gap="12">
            <NGridItem v-for="viewType in viewTypes" :key="viewType.value">
              <NCard
                :class="{ 'selected': newViewForm.type === viewType.value }"
                class="view-type-card"
                hoverable
                @click="newViewForm.type = viewType.value as any"
              >
                <div class="view-type-content">
                  <NIcon :component="viewType.icon" size="24" />
                  <div class="view-type-info">
                    <div class="view-type-title">{{ viewType.label }}</div>
                    <div class="view-type-desc">{{ viewType.description }}</div>
                  </div>
                </div>
              </NCard>
            </NGridItem>
          </NGrid>
        </NFormItem>
      </NForm>

      <template #action>
        <NSpace>
          <NButton @click="showCreateViewModal = false">取消</NButton>
          <NButton type="primary" @click="handleCreateView">创建</NButton>
        </NSpace>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { 
  GridOutline, 
  ListOutline, 
  CalendarOutline, 
  ImagesOutline, 
  DocumentTextOutline,
  GitNetworkOutline,
  MapOutline,
  BarChartOutline
} from '@vicons/ionicons5'
import type { FormInst, FormRules } from 'naive-ui'
import type { ViewType } from '@/types'
import { useViewStore } from '@/stores/view'
import Modal from '@/components/ui/Modal.vue'

const viewStore = useViewStore()
const message = useMessage()

const showCreateViewModal = ref(false)
const formRef = ref<FormInst>()

const newViewForm = reactive({
  name: '',
  type: 'grid' as ViewType
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入视图名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择视图类型', trigger: 'change' }
  ]
}

const viewTypes = [
  {
    value: 'grid',
    label: '表格视图',
    description: '以行列形式展示数据',
    icon: GridOutline
  },
  {
    value: 'kanban',
    label: '看板视图',
    description: '以卡片形式管理流程',
    icon: ListOutline
  },
  {
    value: 'calendar',
    label: '日历视图',
    description: '按日期展示数据',
    icon: CalendarOutline
  },
  {
    value: 'gallery',
    label: '画廊视图',
    description: '以图片形式展示',
    icon: ImagesOutline
  },
  {
    value: 'detail',
    label: '详情视图',
    description: '逐条展示详细信息',
    icon: DocumentTextOutline
  },
  {
    value: 'hierarchy',
    label: '层级视图',
    description: '展示父子关系数据',
    icon: GitNetworkOutline
  },
  {
    value: 'map',
    label: '地图视图',
    description: '在地图上标记数据',
    icon: MapOutline
  },
  {
    value: 'gantt',
    label: '甘特图',
    description: '项目排期和进度',
    icon: BarChartOutline
  }
]

const handleCloseView = (viewId: string) => {
  viewStore.deleteView(viewId)
}

const handleCreateView = async () => {
  try {
    await formRef.value?.validate()
    viewStore.createView(newViewForm.name, newViewForm.type)
    message.success('视图创建成功')
    showCreateViewModal.value = false
    
    // 重置表单
    newViewForm.name = ''
    newViewForm.type = 'grid'
  } catch (error) {
    // 验证失败
  }
}
</script>

<style lang="scss" scoped>
.view-manager {
  margin-bottom: $space-lg;
}

.view-type-card {
  cursor: pointer;
  transition: all $transition-fast;
  
  &.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &:hover {
    border-color: var(--primary-color);
  }
}

.view-type-content {
  @include flex-center;
  flex-direction: column;
  text-align: center;
  padding: $space-md;
}

.view-type-info {
  margin-top: $space-sm;
}

.view-type-title {
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: $space-xs;
}

.view-type-desc {
  font-size: $font-size-sm;
  color: var(--text-color-secondary);
}
</style>
