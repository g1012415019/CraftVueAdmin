<template>
  <NLayoutHeader class="app-header" bordered>
    <div class="app-header__left">
      <NButton
        quaternary
        circle
        @click="appStore.toggleSidebar"
      >
        <template #icon>
          <NIcon :component="MenuOutline" />
        </template>
      </NButton>
      <h1 class="app-header__title">{{ t('user.title') }}</h1>
    </div>
    
    <div class="app-header__right">
      <NSpace>
        <NSelect
          v-model:value="currentLocale"
          :options="localeOptions"
          size="small"
          style="width: 120px"
          @update:value="handleLocaleChange"
        />
        
        <NButton
          quaternary
          circle
          @click="toggleTheme"
        >
          <template #icon>
            <NIcon :component="appStore.theme === 'dark' ? SunnyOutline : MoonOutline" />
          </template>
        </NButton>
      </NSpace>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { MenuOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import { useAppStore } from '@/stores/app'
import { availableLocales } from '@/locales'
import type { Locale } from '@/types'

const { t, locale } = useI18n()
const appStore = useAppStore()

const currentLocale = ref<Locale>(appStore.locale)

const localeOptions = availableLocales.map(item => ({
  label: item.label,
  value: item.value
}))

const handleLocaleChange = (value: Locale) => {
  appStore.setLocale(value)
  locale.value = value
}

const toggleTheme = () => {
  const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
  appStore.setTheme(newTheme)
}

// 同步locale
watch(() => appStore.locale, (newLocale) => {
  currentLocale.value = newLocale
})
</script>

<style lang="scss" scoped>
.app-header {
  @include flex-between;
  height: $header-height;
  padding: 0 $space-lg;
  background: var(--bg-color);

  &__left {
    @include flex-center;
    gap: $space-md;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: 600;
    color: var(--text-color-primary);
  }

  &__right {
    @include flex-center;
  }
}
</style>
