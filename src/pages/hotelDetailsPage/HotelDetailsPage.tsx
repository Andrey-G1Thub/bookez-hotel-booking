// /\*_ Страница деталей отеля: список номеров _/;

import { ChevronRight, MapPin, Star, User } from 'lucide-react';
import { NotFoundPage } from '../notFoundPage/NotFoundPage.js';
import { Rating } from '../../components/index.js';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export const HotelDetailsPage = () => {
	const navigate = useNavigate();
	const { hotelId } = useParams();

	const { allHotels, cities } = useSelector((state) => state.hotels);

	const hotel = allHotels.find((h) => Number(h.id) === Number(hotelId));

	const rooms = hotel?.rooms || [];

	// Ищем город по ID, который указан в объекте отеля
	const city = cities.find((c) => Number(c.id) === Number(hotel?.cityId));

	if (!hotel) return <NotFoundPage message="Отель не найден." />;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-4xl font-extrabold text-gray-800 mb-2">{hotel.name}</h1>
			<div className="text-xl text-gray-600 mb-6 flex items-center">
				<MapPin className="w-5 h-5 mr-2 accent-text" />
				Город: {city?.name || 'Неизвестно'}
				<span className="ml-4">
					<Rating rating={hotel.rating} />
				</span>
			</div>

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
		</div>
	);
};
