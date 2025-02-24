export interface IProduct {
  id: number
  price: number
  title: string
  img: string
  weight: number
  topSelling: boolean
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
