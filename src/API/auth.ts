import { url } from '@/API/url'
import type { IFormData } from '@/inretfaces'

export const apiAuth = {
  register: async (data: IFormData) => {
    const res = await fetch(url + '/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error('В процессе регистрации возникла ошибка.')
    }

    return res.json()
  },

  login: async (data: IFormData) => {
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

    if (!res.ok) {
      throw new Error('В процессе авторизации возникла ошибка.')
    }

    return res.json()
  },

  loginWithToken: async (token: string) => {
    const res = await fetch(url + '/auth_me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('В процессе авторизации через токен возникла ошибка.')
    }

    return res.json()
  },
}
