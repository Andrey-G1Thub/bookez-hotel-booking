import { ChevronRight } from 'lucide-react';
import { MOCK_DATA } from '../../data/mockData.js';
import { NotFoundPage } from '../notFoundPage/NotFoundPage.js';
import { HotelCard } from '../../components/index.js';

export const CityDetailsPage = ({ params, navigate }) => {
	const city = MOCK_DATA.CITIES.find((c) => c.id === params.cityId);
	// ФИЛЬТРАЦИЯ ОТЕЛЕЙ ПО ID ГОРОДА
	const hotels = MOCK_DATA.HOTELS.filter((h) => h.cityId === params.cityId);

	if (!city) return <NotFoundPage message="Город не найден." navigate={navigate} />;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-4xl font-extrabold text-gray-800 mb-4">
				Отели в городе {city.name}
			</h1>
			<p className="text-xl text-gray-600 mb-8 max-w-3xl">{city.description}</p>

			<h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
				Результаты поиска
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{hotels.length > 0 ? (
					hotels.map((hotel) => (
						<HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
					))
				) : (
					<p className="text-gray-500 col-span-full">
						В этом городе пока нет доступных отелей.
					</p>
				)}
			</div>

			<div className="mt-10">
				<button
					onClick={() => navigate('/')}
					className="text-gray-500 hover:text-gray-700 flex items-center"
				>
					<ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />{' '}
					Вернуться на Главную
				</button>
			</div>
		</div>
	);
};
