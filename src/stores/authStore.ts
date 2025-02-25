import { defineStore } from 'pinia'
import { ref } from 'vue'
import { url } from '../API'
import type { IUser, IFormData, IUserData } from '../inretfaces'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)
  const isAuthenticated = ref<boolean>(false)

  const dataProcessing = (response: IUserData): void => {
    user.value = response.data
    isAuthenticated.value = true
    localStorage.setItem('token', response.token)
  }

  const register = async (data: IFormData): Promise<void> => {
    try {
      const res = await fetch(url + '/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('В процессе регистрации возникла ошибка.')

      const response = await res.json()
      dataProcessing(response)
    } catch (error) {
      console.error(error)
    }
  }

  const login = async (data: IFormData): Promise<void> => {
    try {
      const res = await fetch(url + '/auth', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!res.ok) throw new Error('В процессе авторизации возникла ошибка.')

      const response = await res.json()

      dataProcessing(response)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = (): void => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return { user, isAuthenticated, register, login, logout }
})
