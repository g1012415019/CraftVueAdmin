<template>
  <NLayoutSider
    :collapsed="appStore.sidebarCollapsed"
    :collapsed-width="64"
    :width="240"
    collapse-mode="width"
    bordered
    show-trigger
    @collapse="appStore.toggleSidebar"
    @expand="appStore.toggleSidebar"
  >
    <NMenu
      :collapsed="appStore.sidebarCollapsed"
      :collapsed-width="64"
      :options="menuOptions"
      :value="currentRoute"
      @update:value="handleMenuSelect"
    />
  </NLayoutSider>
</template>

<script setup lang="ts">
import { PeopleOutline } from '@vicons/ionicons5'
import { useAppStore } from '@/stores/app'
import type { MenuOption } from 'naive-ui'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const currentRoute = computed(() => route.name as string)

const menuOptions: MenuOption[] = [
  {
    label: t('user.title'),
    key: 'UserManagement',
    icon: () => h(NIcon, { component: PeopleOutline })
  }
]

const handleMenuSelect = (key: string) => {
  router.push({ name: key })
}
</script>

<style lang="scss" scoped>
:deep(.n-layout-sider) {
  background: var(--bg-color);
}
</style>
