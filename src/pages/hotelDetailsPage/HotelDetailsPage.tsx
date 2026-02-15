// /\*_ Страница деталей отеля: список номеров _/;

import {
	ChevronRight,
	MapPin,
	MessageSquare,
	Send,
	Star,
	Trash2,
	User,
} from 'lucide-react';
import { NotFoundPage } from '../notFoundPage/NotFoundPage.js';
import { Rating } from '../../components/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { addCommentThunk, deleteCommentThunk } from '../../store/actions/hotelActions.js';

export const HotelDetailsPage = () => {
	const { hotelId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const commentsRef = useRef(null); // Для скролла к комментариям

	const { allHotels, cities } = useSelector((state) => state.hotels);
	const user = useSelector((state) => state.users.currentUser);

	const hotel = allHotels.find((h) => Number(h.id) === Number(hotelId));
	const city = cities.find((c) => Number(c.id) === Number(hotel?.cityId));

	if (!hotel) return <NotFoundPage message="Отель не найден." />;

	const comments = hotel.comments || [];
	const rooms = hotel?.rooms || [];

	const canDeleteComment = (comment) => {
		if (!user) return false;

		// 1. Админ может удалять всё
		if (user.role === 'admin') return true;

		// 2. Менеджер может удалять в своих отелях

		if (user.role === 'manager' && Number(hotel.ownerId) === Number(user.id))
			return true;

		// 3. Обычный пользователь удаляет только свои
		return Number(user.id) === Number(comment.userId);
	};

	const handleAddComment = (e) => {
		e.preventDefault();
		const text = e.target.comment.value;
		if (!text.trim() || !user) return;

		const newComment = {
			id: Date.now(),
			userId: user.id, // ID из db.json (например, 1770884155361)
			userName: user.name, // Имя из db.json (например, "user1")
			text: text,
			date: new Date().toLocaleDateString('ru-RU'),
		};
		dispatch(addCommentThunk(hotel.id, newComment));
		e.target.reset();
	};

	const handleDeleteComment = (commentId) => {
		if (window.confirm('Удалить этот отзыв?')) {
			dispatch(deleteCommentThunk(hotel.id, commentId));
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Заголовок и локация */}
			<h1 className="text-4xl font-extrabold text-gray-800 mb-2">{hotel.name}</h1>
			<div className="text-xl text-gray-600 mb-6 flex items-center">
				<MapPin className="w-5 h-5 mr-2 accent-text" />
				Город: {city?.name || 'Неизвестно'}
				<span className="ml-4">
					<Rating rating={hotel.rating} />
				</span>
			</div>

			{/* --- ГЛАВНОЕ ФОТО ОТЕЛЯ --- */}
			<div className="w-full h-[450px] mb-10 overflow-hidden rounded-3xl shadow-2xl bg-gray-200 relative group">
				{hotel.images && hotel.images.length > 0 ? (
					<img
						src={hotel.images[0]}
						alt={hotel.name}
						className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-400">
						Фото отеля отсутствует
					</div>
				)}
				{/* Легкий градиент поверх фото для красоты */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
			</div>

			{/* Описание */}
			<p className="text-gray-700 mb-8 max-w-3xl">{hotel.description}</p>

			<h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
				Доступные Номера
			</h2>

			<div className="space-y-6">
				{rooms.length > 0 ? (
					rooms.map((room) => (
						<div
							key={room.id}
							className="bg-white p-6 card-shadow flex flex-col md:flex-row items-center justify-between transition hover:shadow-xl"
						>
							{/* БЛОК С ФОТО */}
							<div className="md:w-1/4 h-48 md:h-auto relative bg-gray-200">
								{room.images && room.images.length > 0 ? (
									<img
										src={room.images[0]}
										alt={room.type}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="flex items-center justify-center h-full text-gray-400">
										Нет фото
									</div>
								)}
							</div>
							{/* ТЕКСТОВЫЙ БЛОК */}
							<div className="flex-1 p-6 flex flex-col justify-between md:flex-row items-center">
								<div className="md:w-3/5">
									<h3 className="text-2xl font-semibold accent-text mb-1">
										{room.type}
									</h3>
									<p className="text-gray-600 text-sm flex items-center mb-2">
										<User className="w-4 h-4 mr-1 text-gray-500" />{' '}
										Макс. гостей: {room.capacity}
									</p>
									<p className="text-gray-500 text-sm">
										Удобства: {room.amenities}
									</p>
								</div>
								<div className="md:w-2/5 mt-4 md:mt-0 md:text-right">
									<p className="text-3xl font-bold text-gray-800">
										{room.price} ₽
									</p>
									<p className="text-sm text-gray-500">за ночь</p>
									<button
										onClick={() =>
											navigate(`/room/${room.hotelId}/${room.id}`)
										}
										className="mt-3 px-6 py-2 rounded-lg text-white font-semibold accent-color accent-hover shadow-md"
									>
										Забронировать
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<p className="text-gray-500">
						В этом отеле пока нет доступных номеров.
					</p>
				)}
			</div>

			<div className="mt-10">
				<button
					onClick={() => navigate(-1)}
					className="text-gray-500 hover:text-gray-700 flex items-center"
				>
					<ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />
					Назад
				</button>
			</div>

			{/* СЕКЦИЯ КОММЕНТАРИЕВ */}
			<div id="comments" ref={commentsRef} className="mt-16 border-t pt-10">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
					<MessageSquare className="mr-3 accent-text" />
					Отзывы ({comments.length})
				</h2>

				{/* Форма добавления (только для залогиненных) */}
				{user ? (
					<form
						onSubmit={handleAddComment}
						className="mb-10 bg-gray-50 p-6 rounded-xl border"
					>
						<label className="block text-gray-700 font-semibold mb-2">
							Оставить отзыв
						</label>
						<div className="flex gap-4">
							<textarea
								name="comment"
								className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
								placeholder="Ваше впечатление об отеле..."
								rows="3"
							/>
							<button
								type="submit"
								className="self-end p-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
							>
								<Send className="w-5 h-5" />
							</button>
						</div>
					</form>
				) : (
					<div className="bg-blue-50 p-4 rounded-lg mb-8 text-blue-700">
						Только зарегистрированные пользователи могут оставлять
						комментарии.
					</div>
				)}

				{/* Список комментариев */}
				<div className="space-y-6">
					{comments.length > 0 ? (
						comments.map((c) => (
							<div
								key={c.id}
								className="bg-white p-5 rounded-lg shadow-sm border flex justify-between"
							>
								<div>
									<div className="flex items-center gap-3 mb-2">
										<span className="font-bold text-gray-800">
											{c.userName}
										</span>
										<span className="text-sm text-gray-400">
											{c.date}
										</span>
									</div>
									<p className="text-gray-600">{c.text}</p>
								</div>
								{/* удаление комментов */}
								{canDeleteComment(c) && (
									<button
										onClick={() => handleDeleteComment(c.id)}
										className="text-red-400 hover:text-red-600 transition self-start p-1"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								)}
							</div>
						))
					) : (
						<p className="text-gray-400 italic">
							Пока никто не оставил отзыв. Будьте первыми!
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
