import type { User, CreateUserDto, UpdateUserDto, ListResponse } from '@/types'
import { mockUsers } from './mockData'

class UserService {
  private users: User[] = [...mockUsers]
  private nextId = Math.max(...mockUsers.map(u => u.id)) + 1

  async getUsers(page = 1, pageSize = 10): Promise<ListResponse<User>> {
    await this.delay(300)
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = this.users.slice(start, end)
    
    return {
      items,
      pagination: {
        page,
        pageSize,
        total: this.users.length
      }
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    await this.delay(500)
    
    const user: User = {
      id: this.nextId++,
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.users.unshift(user)
    return user
  }

  async updateUser(userData: UpdateUserDto): Promise<User> {
    await this.delay(500)
    
    const index = this.users.findIndex(u => u.id === userData.id)
    if (index === -1) throw new Error('User not found')
    
    const user: User = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    }
    
    this.users[index] = user
    return user
  }

  async deleteUser(id: number): Promise<void> {
    await this.delay(300)
    
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    this.users.splice(index, 1)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const userService = new UserService()
