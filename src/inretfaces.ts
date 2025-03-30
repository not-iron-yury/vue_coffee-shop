export interface IProduct {
  id: number
  price: number
  title: string
  img: string
  weight: number
  topSelling: boolean
  count?: number
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

export type TCart = { [key: string]: number }

export type TlistName = 'favorites' | 'cart'
export type TProductStatusProp = 'inFavorites' | 'inCart'

type TSortingKey = 'price' | 'weight' // типы названий свойств, по которым выполняется сортировка
type TSortingValue = 'maxtomin' | 'mintomax' // типы для направлений сортировки
export type TSortingType = `${TSortingKey}-${TSortingValue}` // тип сортировки
// export type TSortingType = 'price-maxtomin' | 'price-mintomax' | 'weight-maxtomin' | 'weight-mintomax'
