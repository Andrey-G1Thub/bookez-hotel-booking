import { Request, Response } from 'express'
import { Hotel } from '../models/Hotel'
import { User } from '../models/User'
import { ROLES } from '../constats/roles'
import fs from 'fs'
import path from 'path'
import { deleteFileFromStorage } from '../utils/deleteFileFromStorage'
import { Booking } from '../models/Booking'

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find()
    res.json(hotels)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отелей', error })
  }
}

// Создание отеля с фото
export const createHotel = async (req: any, res: Response) => {
  try {
    const user = req.user
    const hotelData = req.body

    // Если загружен основной файл отеля
    if (req.file) {
      hotelData.images = [`/backend/uploads/${req.file.filename}`]
    }

    const newHotel = new Hotel({
      ...hotelData,
      ownerId: user._id,
      // Если комнаты пришли строкой, их надо распарсить
      rooms: hotelData.rooms ? JSON.parse(hotelData.rooms) : [],
    })

    const savedHotel = await newHotel.save()
    res.status(201).json(savedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка создания отеля', error })
  }
}

export const updateHotel = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user
    const updateData = { ...req.body }

    const hotel = await Hotel.findById(id)
    if (!hotel) return res.status(404).json({ message: 'Отель не найден' })

    // Только админ или владелец может редактировать
    if (
      user.role === ROLES.MANAGER &&
      hotel.ownerId.toString() !== user._id.toString()
    ) {
      return res

        .status(403)
        .json({ message: 'Нет прав на редактирование чужого отеля' })
    }

    let finalImages = []
    if (updateData.images) {
      try {
        finalImages =
          typeof updateData.images === 'string'
            ? JSON.parse(updateData.images)
            : updateData.images
      } catch (e) {
        finalImages = []
      }
    }

    if (req.file) {
      const newFilePath = `/backend/uploads/${req.file.filename}`
      finalImages.push(newFilePath)
    }

    if (updateData.imageUrl) {
      finalImages.push(updateData.imageUrl)
    }

    updateData.images = [...new Set(finalImages)]

    delete updateData.imageUrl

    // Парсим комнаты, если они пришли строкой
    if (typeof updateData.rooms === 'string') {
      updateData.rooms = JSON.parse(updateData.rooms)
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' },
    )

    res.json(updatedHotel)
  } catch (error) {
    console.error('Update Error:', error)
    res.status(400).json({ message: 'Ошибка при обновлении', error })
  }
}

export const updateHotelRooms = async (req: any, res: Response) => {
  try {
    const { hotelId } = req.params
    const userFromToken = req.user
    let newRooms =
      typeof req.body.rooms === 'string'
        ? JSON.parse(req.body.rooms)
        : req.body.rooms

    const oldHotel = await Hotel.findById(hotelId)
    if (!oldHotel) return res.status(404).json({ message: 'Отель не найден' })

    // --- ПРОВЕРКА ЛИМИТОВ ---
    if (userFromToken.role !== ROLES.ADMIN) {
      // Подтягиваем свежие данные пользователя, чтобы увидеть актуальные лимиты
      const fullUser = await User.findById(userFromToken._id)

      if (!fullUser) {
        return res.status(404).json({ message: 'Пользователь не найден' })
      }

      const maxRooms = fullUser.limits?.maxRooms || 0

      // Если количество комнат
      if (newRooms.length > maxRooms) {
        // Если мы пытаемся ДОБАВИТЬ новую (длина выросла), а не просто редактируем старую
        if (newRooms.length > oldHotel.rooms.length) {
          return res.status(403).json({
            message: `Превышен лимит комнат. Ваш максимум: ${maxRooms}`,
          })
        }
      }
    }
    // ЛОГИКА ОЧИСТКИ ФАЙЛОВ:
    const newRoomIds = newRooms.map((r: any) => r._id?.toString())
    const removedRooms = oldHotel.rooms.filter(
      (oldRoom: any) => !newRoomIds.includes(oldRoom._id.toString()),
    )

    // Удаляем фото удаленных комнат и брони
    // removedRooms.forEach((room: any) => {
    //   room.images?.forEach((img: string) => deleteFileFromStorage(img))
    // })
    if (removedRooms.length > 0) {
      for (const room of removedRooms) {
        // 1. Удаляем фото из хранилища
        room.images?.forEach((img: string) => deleteFileFromStorage(img))

        // 2. УДАЛЯЕМ ВСЕ БРОНИРОВАНИЯ ЭТОГО НОМЕРА
        // Это решит проблему с "зависшими" бронями
        await Booking.deleteMany({ roomId: room._id.toString() })
        console.log(` Бронирования для номера ${room._id} удалены`)
      }
    }

    const targetRoomId = req.body.editingRoomId
    if (req.file) {
      const imageUrl = `/backend/uploads/${req.file.filename}`
      const roomIndex = targetRoomId
        ? newRooms.findIndex((r: any) => r._id === targetRoomId)
        : newRooms.length - 1

      if (roomIndex !== -1) {
        if (!newRooms[roomIndex].images) newRooms[roomIndex].images = []
        newRooms[roomIndex].images.push(imageUrl)
      }
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $set: { rooms: newRooms } },
      { returnDocument: 'after' },
    )
    res.json(updatedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении комнат', error })
  }
}

export const deleteHotel = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user

    const hotel = await Hotel.findById(id)

    if (!hotel) return res.status(404).json({ message: 'Отель не найден' })

    //  Адми н может всё, Менеджер — только своё
    if (
      user.role === ROLES.MANAGER &&
      hotel.ownerId.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Вы не можете удалить чужой отель' })
    }

    // 1. Собираем ВСЕ фото отеля
    const allPhotos: string[] = [...(hotel.images || [])]

    // 2. Добавляем фото из всех комнат
    hotel.rooms.forEach((room: any) => {
      if (room.images && room.images.length > 0) {
        allPhotos.push(...room.images)
      }
    })

    // 3. Физически удаляем каждый файл
    allPhotos.forEach((photoUrl) => deleteFileFromStorage(photoUrl))

    await Hotel.findByIdAndDelete(id)
    res.json({ message: 'Отель успешно удален' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении отеля', error })
  }
}
// Добавить комментарий
export const addComment = async (req: any, res: Response) => {
  try {
    const { hotelId } = req.params
    const { text } = req.body
    const user = req.user // Данные из токена

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не авторизован' })
    }

    const commentData = {
      userId: user._id,
      userName: user.name,
      text: text,
      date: new Date().toLocaleDateString('ru-RU'),
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { comments: commentData } }, // Добавляем только один объект
      { returnDocument: 'after' },
    )

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Отель не найден' })
    }

    res.json(updatedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка добавления комментария' })
  }
}

// Удалить комментарий
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { hotelId, commentId } = req.params

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { comments: { _id: commentId } } }, // Удаляем по конкретному _id внутри массива
      { returnDocument: 'after' },
    )
    res.json(updatedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка удаления комментария' })
  }
}

export const removePhoto = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params
    const { imageUrl, type, roomId } = req.body

    let updateQuery = {}
    let options: any = { returnDocument: 'after' }

    if (type === 'hotel') {
      updateQuery = { $pull: { images: imageUrl } }
    } else if (type === 'room' && roomId) {
      updateQuery = { $pull: { 'rooms.$[elem].images': imageUrl } }
      // arrayFilters нужен ТОЛЬКО если мы удаляем из комнаты
      options.arrayFilters = [{ 'elem._id': roomId }]
    }

    const hotel = await Hotel.findByIdAndUpdate(hotelId, updateQuery, options)

    if (!hotel) {
      return res.status(404).json({ message: 'Отель не найден' })
    }

    // Физическое удаление файла
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop()
      // Учитывая src/controllers -> ../../uploads
      const filePath = path.join(__dirname, '../../uploads', fileName)

      console.log('Попытка удаления файла:', filePath)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      } else {
        console.log('Файл не найден на диске, но удален из БД')
      }
    }

    res.json(hotel)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления', error })
  }
}
