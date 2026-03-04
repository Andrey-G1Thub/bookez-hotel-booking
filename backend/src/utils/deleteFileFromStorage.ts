import path from 'node:path'
import fs from 'fs'

export const deleteFileFromStorage = (fileUrl: string) => {
  if (!fileUrl || !fileUrl.startsWith('/backend/uploads/')) return

  const fileName = fileUrl.split('/').pop()
  if (!fileName) return

  // Путь от контроллера (src/controllers) до папки uploads в корне
  const filePath = path.join(__dirname, '../../uploads/', fileName)

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`✅ Файл удален: ${fileName}`)
    }
  } catch (err) {
    console.error(`❌ Ошибка при удалении файла ${fileName}:`, err)
  }
}
