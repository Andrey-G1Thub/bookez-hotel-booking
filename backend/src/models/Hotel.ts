import { Schema, model } from 'mongoose'

// Описываем интерфейс для TypeScript
interface IHotel {
  name: string
  location: string
  pricePerNight: number
  description?: string
  rating: number
}

// Создаем схему для MongoDB
const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  description: { type: String },
  rating: { type: Number, default: 0 },
})

export const Hotel = model<IHotel>('Hotel', hotelSchema)
