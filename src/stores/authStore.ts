import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUser, IFormData, IUserData } from '../inretfaces'
import { useUserProductsStore } from './userProductsStore'
import { apiAuth } from '@/API/auth'

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
    console.log(error)
  }

  const register = async (data: IFormData) => {
    try {
      const response: IUserData = await apiAuth.register(data)
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
      const response: IUserData = await apiAuth.login(data)
      dataProcessing(response)

      await userProductsStore.getUserProductsData(response.data.id)
    } catch (error) {
      handleError(error)
    }
  }

  const loginWithToken = async (token: string): Promise<void> => {
    try {
      const response: IUser = await apiAuth.loginWithToken(token)
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
