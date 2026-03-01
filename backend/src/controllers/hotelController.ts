import { Request, Response } from 'express'
import { AuthenticatedRequest, Hotel } from '../models/Hotel'
import { UserDocument } from '../models/User'
import { ROLES } from '../constats/roles'

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find()
    res.json(hotels)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отелей', error })
  }
}

export const createHotel = async (req: Request, res: Response) => {
  try {
    // const user = req.user as UserDocument
    // const user = (req as AuthenticatedRequest).user
    const user = (req as any).user as UserDocument

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не определен' })
    }

    const ownerId = user._id
    const userRole = user.role

    if (userRole === 'manager') {
      const currentHotelsCount = await Hotel.countDocuments({
        ownerId: ownerId,
      })

      // const maxHotels = user.limits?.maxHotels || 0
      const maxHotels = user.limits?.maxHotels ?? 0

      if (currentHotelsCount >= maxHotels) {
        return res.status(403).json({ message: 'Лимит отелей исчерпан' })
      }
    }

    // Создаем отель, добавляя ID владельца из токена
    const newHotel = new Hotel({
      ...req.body,
      ownerId: ownerId, // Важно привязать отель к создателю!
    })

    const savedHotel = await newHotel.save()
    res.status(201).json(savedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании отеля', error })
  }
}

export const updateHotel = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user

    const hotel = await Hotel.findById(id)

    if (!hotel) return res.status(404).json({ message: 'Отель не найден' })
    console.log('User ID from token:', user._id)
    console.log('Hotel Owner ID from DB:', hotel.ownerId)

    // ПРОВЕРКА: Только админ или владелец может редактировать
    if (
      user.role === ROLES.MANAGER &&
      hotel.ownerId.toString() !== user._id.toString()
    ) {
      return res

        .status(403)
        .json({ message: 'Нет прав на редактирование чужого отеля' })
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true },
    )

    if (!updatedHotel) {
      return res.status(404).json({ message: 'Отель не найден' })
    }

    res.json(updatedHotel)
  } catch (error) {
    console.error('Update Error:', error)
    res.status(400).json({ message: 'Ошибка при обновлении', error })
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
      { new: true },
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
      { new: true },
    )
    res.json(updatedHotel)
  } catch (error) {
    res.status(400).json({ message: 'Ошибка удаления комментария' })
  }
}
