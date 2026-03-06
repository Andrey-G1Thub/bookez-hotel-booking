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

import { LoadingSpinner } from '../../components/componentsLoading/loadingSpinner';
import { checkPermission } from '../../utils/permissions';
import { getFullImageUrl } from '../../utils/getFullImageUrl';
import { RoomCard } from './components/RoomCard';
import type { Comments } from '../../types/models';
import { CommentsClient } from './components/commentsClient/CommentsCLient';

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

	const canAddComment = checkPermission(user, 'ADD_COMMENT');

	const canDeleteComment = (comment: Comments): boolean => {
		return checkPermission(user, 'DELETE_COMMENT', {
			userId: comment.userId,
			hotelOwnerId: hotel.ownerId,
		});
	};

	const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Проверка прав перед действием
		if (!canAddComment || !user) {
			alert('У вас нет прав для добавления комментария');
			return;
		}

		const formData = new FormData(e.currentTarget);
		const text = formData.get('comment') as string;

		if (!text.trim() || !user) return;

		const newComment: Comments = {
			userId: user._id,
			userName: user.name,
			text: text,
			date: new Date().toLocaleDateString('ru-RU'),
		};
		dispatch(addCommentThunk(hotel._id, newComment));
		e.currentTarget.reset();
	};

	const handleDeleteComment = (commentId: string | undefined) => {
		if (!commentId) return;
		if (window.confirm('Удалить этот отзыв?')) {
			dispatch(deleteCommentThunk(hotel._id, commentId));
		}
	};

	const mainPhoto = getFullImageUrl(hotel.images?.[0]);

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
						src={mainPhoto}
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
						rooms.map((room) => <RoomCard key={room._id} room={room} />)
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
			<CommentsClient
				commentsRef={commentsRef}
				comments={comments}
				canAddComment={canAddComment}
				handleAddComment={handleAddComment}
				canDeleteComment={canDeleteComment}
				handleDeleteComment={handleDeleteComment}
			/>

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
