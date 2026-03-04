import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import hotelRoutes from './routes/hotelRoutes'
import userRoutes from './routes/userRoutes'
import cityRoutes from './routes/cityRoutes'
import bookingRoutes from './routes/bookingRoutes'
// import path from 'node:path'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

app.use(cors())
app.use(express.json())
app.use('/api/hotels', hotelRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cities', cityRoutes)
app.use('/api/bookings', bookingRoutes)

// app.use('/backend/uploads/', express.static('uploads'))
app.use('/backend/uploads', express.static(path.join(__dirname, '../uploads')))
// Подключение к MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена успешно'))
  .catch((err) => console.error('❌ Ошибка подключения к MongoDB:', err))

app.get('/', (req: Request, res: Response) => {
  res.send('API работает, база подключена!')
})

app.listen(PORT, () => {
  console.log(`🚀 Сервер: http://localhost:${PORT}`)
})
