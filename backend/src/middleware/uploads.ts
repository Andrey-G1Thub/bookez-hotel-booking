import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Создаем папку, если её нет
const uploadDir = 'uploads/'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя: timestamp + оригинальное имя
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Лимит 5МБ
})
