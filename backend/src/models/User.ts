// import { UserDocument } from './User';
import { Schema, Types, model, Document } from 'mongoose'

export interface UserDocument extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  role: string
  limits: {
    maxHotels: number
    maxRooms: number
  }
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  limits: {
    maxHotels: { type: Number, default: 0 },
    maxRooms: { type: Number, default: 0 },
  },
})

export const User = model('User', userSchema)
