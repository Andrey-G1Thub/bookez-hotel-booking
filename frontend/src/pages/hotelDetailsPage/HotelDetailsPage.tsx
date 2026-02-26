// Страница деталей отеля: список номеров _/;

import {
	ChevronRight,
	MapPin,
	MessageSquare,
	Send,
	Star,
	Trash2,
	User,
} from 'lucide-react';
import { NotFoundPage } from '../notFoundPage/NotFoundPage';
import { Rating } from '../../components/index';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { addCommentThunk, deleteCommentThunk } from '../../store/actions/hotelActions';
import type { AppDispatch } from '../../store';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../selectors';
import {
	selectAllHotels,
	selectCities,
	selectIsLoading,
} from '../../selectors/hotelSelectors';
import type { Comments } from '../../store/reducers/hotelReducer';
import { LoadingSpinner } from '../../components/componentsLoading/loadingSpinner';

export const HotelDetailsPage = () => {
	const { hotelId } = useParams<{ hotelId: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const commentsRef = useRef<HTMLDivElement>(null);

	const allHotels = useAppSelector(selectAllHotels);
	const cities = useAppSelector(selectCities);
	const user = useAppSelector(selectCurrentUser);

	const isLoading = useAppSelector(selectIsLoading);

	const hotel = useMemo(
		() => allHotels.find((h) => h._id === hotelId),
		[allHotels, hotelId],
	);
	const city = cities.find((c) => c._id === hotel?.cityId);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!hotel) return <NotFoundPage message="Отель не найден." />;

	const comments = hotel.comments || [];
	const rooms = hotel?.rooms || [];

	const canDeleteComment = (comment: Comments): boolean => {
		if (!user) return false;
		if (user.role === 'admin') return true;
		if (user.role === 'manager' && hotel.ownerId === user._id) return true;

		// 3. Обычный пользователь удаляет только свои
		return user._id === comment.userId;
	};

	const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const text = formData.get('comment') as string;

		if (!text.trim() || !user) return;

		const newComment: Comments = {
			_id: String(Date.now()),
			userId: user._id,
			userName: user.name,
			text: text,
			date: new Date().toLocaleDateString('ru-RU'),
		};
		dispatch(addCommentThunk(hotel._id, newComment));
		e.currentTarget.reset();
	};

	const handleDeleteComment = (commentId: string) => {
		if (window.confirm('Удалить этот отзыв?')) {
			dispatch(deleteCommentThunk(hotel._id, commentId));
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Заголовок */}
			<header className="mb-8">
				<h1 className="text-4xl font-extrabold text-gray-800 mb-2">
					{hotel.name}
				</h1>
				<div className="text-xl text-gray-600 flex items-center flex-wrap gap-4">
					<span className="flex items-center">
						<MapPin className="w-5 h-5 mr-2 text-[#00a3a8]" />
						Город: {city?.name || 'Неизвестно'}
					</span>
					<Rating rating={hotel.rating ?? 0} />
				</div>
			</header>

			{/* Главное фото */}
			<div className="w-full h-[450px] mb-10 overflow-hidden rounded-3xl shadow-2xl bg-gray-100 relative group">
				{hotel.images?.[0] ? (
					<img
						src={hotel.images[0]}
						alt={hotel.name}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-400 italic">
						Фото отеля временно отсутствует
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
			</div>

			<section className="mb-12">
				<p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
					{hotel.description}
				</p>
			</section>

			{/* Номера */}
			<section className="mb-16">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
					Доступные Номера
				</h2>
				<div className="grid gap-6">
					{rooms.length > 0 ? (
						rooms.map((room) => (
							<div
								key={room._id}
								className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow"
							>
								<div className="md:w-1/3 h-52 md:h-auto bg-gray-200">
									<img
										src={
											room.images?.[0] ||
											'https://placehold.co/400x300?text=No+Photo'
										}
										alt={room.type}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="p-6 flex-1 flex flex-col justify-between">
									<div>
										<h3 className="text-2xl font-bold text-[#00a3a8] mb-2">
											{room.type}
										</h3>
										<div className="space-y-2">
											<p className="text-gray-600 flex items-center text-sm">
												<User className="w-4 h-4 mr-2" />{' '}
												Вместимость: {room.capacity} чел.
											</p>
											<p className="text-gray-500 text-sm">
												<span className="font-semibold text-gray-700">
													Удобства:
												</span>{' '}
												{room.amenities}
											</p>
										</div>
									</div>
									<div className="mt-6 flex items-center justify-between border-t pt-4">
										<div>
											<span className="text-3xl font-black text-gray-800">
												{room.price} ₽
											</span>
											<span className="text-gray-500 text-sm ml-1">
												/ ночь
											</span>
										</div>
										<button
											onClick={() =>
												navigate(
													`/room/${room.hotelId}/${room._id}`,
												)
											}
											className="px-8 py-3 bg-[#00a3a8] text-white rounded-xl font-bold hover:bg-[#008c91] transition-colors shadow-lg shadow-teal-100"
										>
											Забронировать
										</button>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
							<p className="text-gray-500">
								В этом отеле пока нет свободных номеров.
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Комментарии */}
			<section id="comments" ref={commentsRef} className="pt-10 border-t">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
					<MessageSquare className="mr-3 text-[#00a3a8]" />
					Отзывы гостей ({comments.length})
				</h2>

				{user ? (
					<form
						onSubmit={handleAddComment}
						className="mb-12 bg-teal-50/30 p-8 rounded-2xl border border-teal-100"
					>
						<label className="block text-gray-800 font-bold mb-3">
							Ваш отзыв
						</label>
						<div className="flex flex-col sm:flex-row gap-4">
							<textarea
								name="comment"
								required
								className="flex-1 p-4 border rounded-xl focus:ring-2 focus:ring-[#00a3a8] outline-none min-h-[100px] resize-none"
								placeholder="Расскажите о вашем отдыхе..."
							/>
							<button
								type="submit"
								className="sm:self-end p-5 bg-[#00a3a8] text-white rounded-xl hover:bg-[#008c91] transition shadow-md"
							>
								<Send className="w-6 h-6" />
							</button>
						</div>
					</form>
				) : (
					<div className="bg-amber-50 p-5 rounded-xl mb-10 text-amber-800 border border-amber-100 flex items-center">
						<Star className="w-5 h-5 mr-3" />
						Войдите в систему, чтобы оставить свой отзыв.
					</div>
				)}

				<div className="space-y-6">
					{comments.length > 0 ? (
						[...comments].reverse().map((c) => (
							<div
								key={c._id}
								className="bg-white p-6 rounded-2xl shadow-sm border hover:border-[#00a3a8]/30 transition-colors flex justify-between gap-4"
							>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-[#00a3a8] font-bold">
											{c.userName?.[0]?.toUpperCase() || '?'}
										</div>
										<div>
											<p className="font-bold text-gray-800 leading-none mb-1">
												{c.userName}
											</p>
											<p className="text-xs text-gray-400">
												{c.date}
											</p>
										</div>
									</div>
									<p className="text-gray-600 leading-relaxed">
										{c.text}
									</p>
								</div>
								{canDeleteComment(c) && (
									<button
										onClick={() => handleDeleteComment(c._id)}
										className="text-gray-300 hover:text-red-500 transition-colors self-start p-2"
										title="Удалить отзыв"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								)}
							</div>
						))
					) : (
						<p className="text-center text-gray-400 py-10 italic">
							Здесь пока пусто. Станьте первым, кто напишет отзыв!
						</p>
					)}
				</div>
			</section>

			<button
				onClick={() => navigate(-1)}
				className="mt-12 group text-gray-400 hover:text-gray-700 flex items-center font-medium transition-colors"
			>
				<ChevronRight className="w-5 h-5 transform rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" />
				Вернуться назад
			</button>
		</div>
	);
};
