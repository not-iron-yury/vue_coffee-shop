import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { url } from '../API'
import type { IUser, IFormData, IUserData } from '../inretfaces'
import { useUserProductsStore } from './userProductsStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)
  const isAuthenticated = computed<boolean>(() => !!user.value)
  const userProductsStore = useUserProductsStore()
  const token = ref<string>('')

  const dataProcessing = (response: IUserData): void => {
    user.value = response.data
    token.value = response.token
    localStorage.setItem('token', response.token)
  }

  const handleError = (error: unknown) => {
    handleError(error)
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

      const response: IUserData = await res.json()
      dataProcessing(response)

      // после успешной регистрации создаем второй документ связанный с пользователем,
      // для хранения избранных товаров и товаров в корзине
      await userProductsStore.createUserProductsData(response.data.id)
    } catch (error) {
      handleError(error)
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

      const response: IUserData = await res.json()
      dataProcessing(response)

      await userProductsStore.getUserProductsData(response.data.id)
    } catch (error) {
      handleError(error)
    }
  }

  const loginWithToken = async (token: string): Promise<void> => {
    try {
      const res = await fetch(url + '/auth_me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('В процессе авторизации через токен возникла ошибка.')

      const response: IUser = await res.json()
      user.value = response

      // проверка id, является ли числом
      if (typeof user.value?.id === 'number') {
        userProductsStore.getUserProductsData(user.value.id) // ожидает числовой тип
      } else {
        console.warn('ID пользователя отсутствует или имеет неверный тип.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const logout = (): void => {
    user.value = null
    localStorage.removeItem('token')
    token.value = ''
  }

  return { user, isAuthenticated, register, login, logout, loginWithToken }
})
