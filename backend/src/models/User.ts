import { Schema, model } from 'mongoose'

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
