import fs from 'fs'
import path from 'path'

export const deleteFile = (fileUrl: string) => {
  if (!fileUrl) return

  const fileName = fileUrl.split('/').pop()
  const filePath = path.join(__dirname, '../../uploads', fileName || '')

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Ошибка при удалении файла с диска:', err)
      else console.log('Файл успешно удален:', filePath)
    })
  }
}
