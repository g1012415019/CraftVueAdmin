<template>
  <NConfigProvider :theme="naiveTheme" :locale="naiveLocale" :date-locale="naiveDateLocale">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <NLayout has-sider>
              <AppSidebar />
              <NLayout>
                <AppHeader />
                <NLayoutContent>
                  <RouterView />
                </NLayoutContent>
              </NLayout>
            </NLayout>
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { locale } = useI18n()

const naiveTheme = computed(() => 
  appStore.theme === 'dark' ? darkTheme : null
)

const naiveLocale = computed(() => 
  locale.value === 'zh-CN' ? zhCN : enUS
)

const naiveDateLocale = computed(() => 
  locale.value === 'zh-CN' ? dateZhCN : dateEnUS
)

// 初始化主题
onMounted(() => {
  document.documentElement.setAttribute('data-theme', appStore.theme)
})

// 监听主题变化
watch(() => appStore.theme, (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-color-secondary);
  color: var(--text-color-primary);
  transition: background-color $transition-normal, color $transition-normal;
}

#app {
  height: 100vh;
}
</style>
