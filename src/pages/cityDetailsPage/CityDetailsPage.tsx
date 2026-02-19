import { ChevronRight } from 'lucide-react';
import { NotFoundPage } from '../notFoundPage/NotFoundPage';
import { HotelCard } from '../../components/index';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import {
	selectAllHotels,
	selectCities,
	selectIsLoading,
} from '../../selectors/hotelSelectors';
import { LoadingSpinner } from '../../components/componentsLoading/loadingSpinner';

export const CityDetailsPage = () => {
	const navigate = useNavigate();

	const { cityId } = useParams<{ cityId: string }>();

	const allHotels = useAppSelector(selectAllHotels);
	const cities = useAppSelector(selectCities);

	const isLoading = useAppSelector(selectIsLoading);
	// 1. Сначала проверяем, загрузились ли данные вообще
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<LoadingSpinner />
				<p className="text-[#00a3a8] font-medium animate-pulse">
					Загрузка данных о городе...
				</p>
			</div>
		);
	}

	const city = cities.find((c) => Number(c.id) === Number(cityId));

	const filteredHotels = allHotels.filter(
		(hotel) => Number(hotel.cityId) === Number(cityId),
	);

	if (!city) return <NotFoundPage message="Город не найден." />;

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
				{filteredHotels.length > 0 ? (
					filteredHotels.map((hotel) => (
						<HotelCard key={hotel.id} hotel={hotel} />
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
