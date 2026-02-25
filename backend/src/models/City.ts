import { Schema, model } from 'mongoose'

const citySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
})

export const City = model('City', citySchema)
