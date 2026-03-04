import { ChevronRight, MessageSquare } from 'lucide-react';
import { Rating } from '../rating/Rating';
import { useNavigate } from 'react-router-dom';
import type { Hotel } from '../../store/reducers/hotelReducer';
import { SERVER_URL } from '../constants/serverUrl';
import { useMemo } from 'react';

interface HotelCardProps {
	hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
	const navigate = useNavigate();

	// Считаем количество отзывов динамически из массива comments
	const reviewsCount = hotel.comments ? hotel.comments?.length : 0;

	// const hotelImage =
	// 	hotel.images && hotel.images.length > 0
	// 		? hotel.images[0]
	// 		: `https://placehold.co/400x250/E6F6F6/007C80?text=${encodeURIComponent(hotel.name)}`;

	const hotelImage = useMemo(() => {
		// 1. Если картинок нет вообще
		if (!hotel.images || hotel.images.length === 0 || !hotel.images[0]) {
			// Ограничим текст только названием (без лишних данных) или просто напишем "No Photo"
			const placeholderText = hotel.name
				? encodeURIComponent(hotel.name.substring(0, 10))
				: 'No+Photo';
			return `https://placehold.co/400x250?text=${placeholderText}`;
		}

		const firstImage = hotel.images[0];

		// Если это уже полная ссылка (начинается с http или data:image)
		if (firstImage.startsWith('http') || firstImage.startsWith('data:')) {
			return firstImage;
		}

		// Если это локальный путь с бэкенда (убеждаемся, что нет лишних слешей)
		const cleanPath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
		return `${SERVER_URL}${cleanPath}`;
	}, [hotel.images, hotel.name]);

	return (
		<div
			onClick={() => navigate(`/hotel/${hotel._id}`)}
			className="bg-white card-shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
		>
			<img
				src={hotelImage}
				alt={hotel.name}
				className="w-full h-48 object-cover"
				onError={(e) => {
					e.currentTarget.src = 'https://placehold.co/400x250?text=Photo+Error';
				}}
			/>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-gray-800 mb-1">{hotel.name}</h3>
				<div className="flex justify-between items-center mt-2">
					<Rating rating={hotel.rating} />
					<span className="text-sm text-gray-500">
						<MessageSquare className="w-3 h-3 mr-1" />({reviewsCount} отзывов)
					</span>
				</div>
				<p className="text-2xl font-bold accent-text mt-3">
					от {hotel.priceFrom} ₽{' '}
					<span className="text-base font-normal text-gray-500">/ ночь</span>
				</p>
				<div className="mt-4 flex justify-end">
					<button className="flex items-center text-sm font-semibold accent-text hover:opacity-80">
						Подробнее <ChevronRight className="w-4 h-4 ml-1" />
					</button>
				</div>
			</div>
		</div>
	);
};
