import { defineStore } from 'pinia'
import type { User, CreateUserDto, UpdateUserDto } from '@/types'
import { userService } from '@/services/user'

interface UserState {
  users: User[]
  loading: boolean
  total: number
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [] as User[],
    loading: false,
    total: 0
  }),

  actions: {
    async fetchUsers(page = 1, pageSize = 10) {
      this.loading = true
      try {
        const response = await userService.getUsers(page, pageSize)
        this.users = response.items as User[]
        this.total = response.pagination.total
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: CreateUserDto) {
      const user = await userService.createUser(userData)
      this.users.unshift(user)
      this.total++
      return user
    },

    async updateUser(userData: UpdateUserDto) {
      const user = await userService.updateUser(userData)
      const index = this.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        this.users[index] = user
      }
      return user
    },

    async deleteUser(id: number) {
      await userService.deleteUser(id)
      const index = this.users.findIndex(u => u.id === id)
      if (index !== -1) {
        this.users.splice(index, 1)
        this.total--
      }
    }
  }
})
