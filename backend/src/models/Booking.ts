import { Schema, model } from 'mongoose'

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },

  roomId: {
    type: String,
    required: true,
  },
  hotelOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelName: { type: String },
  roomType: { type: String },
  checkIn: { type: Schema.Types.Mixed, required: true },
  checkOut: { type: Schema.Types.Mixed, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'Подтверждено' },
})

export const Booking = model('Booking', bookingSchema)
