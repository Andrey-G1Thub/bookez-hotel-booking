import { Schema, model } from 'mongoose'
import { UserDocument } from './User'
export interface AuthenticatedRequest extends Request {
  user?: UserDocument
}
// Схема для комментариев
const commentSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
}) // MongoDB сама добавит _id каждому комментарию

// Схема для комнат
const roomSchema = new Schema({
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  amenities: { type: String },
  images: [String],
  hotelId: { type: String }, // Будет ссылаться на _id родительского отеля
})

// Основная схема отеля
const hotelSchema = new Schema({
  name: { type: String, required: true },
  cityId: { type: String, required: true },
  description: { type: String },
  priceFrom: { type: Number, required: true },
  images: [String],
  // ownerId: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  comments: [commentSchema],
  rooms: [roomSchema],
})

export const Hotel = model('Hotel', hotelSchema)
