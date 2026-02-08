import { ChevronRight } from 'lucide-react';
import { Rating } from '../rating/Rating';

export const HotelCard = ({ hotel, navigate }) => {
	// Используем чистую заглушку для изображения
	const hotelImage = `https://placehold.co/400x250/E6F6F6/007C80?text=${encodeURIComponent(hotel.name)}`;

	return (
		<div
			onClick={() => navigate(`/hotel/${hotel.id}`)}
			className="bg-white card-shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
		>
			<img
				src={hotelImage}
				alt={hotel.name}
				className="w-full h-48 object-cover"
				onError={(e) => {
					e.target.onerror = null;
					e.target.src = 'https://placehold.co/400x250?text=No+Photo';
				}}
			/>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-gray-800 mb-1">{hotel.name}</h3>
				<div className="flex justify-between items-center mt-2">
					<Rating rating={hotel.rating} />
					<span className="text-sm text-gray-500">
						({hotel.reviewCount} отзывов)
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
