import { defineStore } from 'pinia'
import type { Theme, Locale } from '@/types'

interface AppState {
  theme: Theme
  locale: Locale
  sidebarCollapsed: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    locale: (localStorage.getItem('locale') as Locale) || 'zh-CN',
    sidebarCollapsed: false
  }),

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },

    setLocale(locale: Locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
})
