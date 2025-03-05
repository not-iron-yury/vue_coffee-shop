export interface IProduct {
  id: number
  price: number
  title: string
  img: string
  weight: number
  topSelling: boolean
  inFavorites?: boolean
  inCart?: boolean
}

export interface IFormData {
  fullName?: string
  email: string
  password: string
}

export interface IUser {
  id: number
  fullName: string
  email: string
}

export interface IUserData {
  token: string
  data: IUser
}

export interface IUserProducts {
  id?: number
  user_id: number
  favorites: number[]
  cart: TCart
}

type TCart = { [key: number]: number }

export type TlistName = 'favorites' | 'cart'
export type TProductStatusProp = 'inFavorites' | 'inCart'
