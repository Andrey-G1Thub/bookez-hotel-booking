import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import hotelRoutes from './roures/hotelRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''

app.use(cors())
app.use(express.json())
app.use('/api/hotels', hotelRoutes)

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
