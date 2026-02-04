import { Zap } from 'lucide-react';
import { MOCK_DATA } from '../../data/mockData';
import { HotelCard } from '../../components/hotelCard/HotelCard';
import { getMinDate } from '../../utils/helpers';

// <!-- /\*_ Главная страница с поиском и каталогом городов/отелей _/
export const HomePage = ({ navigate }) => {
	// Показываем все отели как рекомендуемые, чтобы не усложнять компонент
	const featuredHotels = MOCK_DATA.HOTELS.slice(0, 3);

	const handleSearch = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const cityName = formData.get('city');

		if (!cityName) {
			alert('Пожалуйста, выберите город.');
			return;
		}

		const selectedCity = MOCK_DATA.CITIES.find((c) => c.name === cityName);

		if (selectedCity) {
			console.log('Выполнен поиск:', Object.fromEntries(formData.entries()));
			// НАВИГАЦИЯ НА СТРАНИЦУ ГОРОДА ДЛЯ ОТОБРАЖЕНИЯ ФИЛЬТРОВАННЫХ ОТЕЛЕЙ
			navigate(`/city/${selectedCity.id}`);
		} else {
			alert('Ошибка: выбранный город не найден.');
		}
	};

	return (
		<main>
			{/* Секция Hero с Поиском */}
			<div
				className="relative h-96 accent-color"
				style={{
					backgroundImage:
						'linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark))',
				}}
			>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-full max-w-4xl p-4 md:p-8">
						<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-xl">
							Бронируйте с Доверием
						</h1>

						{/* Модуль Поиска */}
						<form
							onSubmit={handleSearch}
							className="bg-white p-4 md:p-6 rounded-xl card-shadow flex flex-col md:flex-row gap-3"
						>
							{/* ПОЛЕ ВЫБОРА ГОРОДА (ВЫПАДАЮЩИЙ СПИСОК) */}
							<select
								name="city"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border bg-white"
								defaultValue=""
								required
							>
								<option value="" disabled>
									Выберите город
								</option>
								{MOCK_DATA.CITIES.map((city) => (
									// Используем имя города в качестве значения
									<option key={city.id} value={city.name}>
										{city.name}
									</option>
								))}
							</select>

							<input
								type="date"
								name="checkIn"
								placeholder="Дата Заезда"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
								min={getMinDate()}
								required
							/>
							<input
								type="date"
								name="checkOut"
								placeholder="Дата Выезда"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
								min={getMinDate()}
								required
							/>
							<button
								type="submit"
								className="px-6 py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
							>
								<Zap className="w-5 h-5 inline mr-1 -mt-1" /> Найти
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Секция с Рекомендуемыми Отелями */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
					Популярные Отели
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{featuredHotels.map((hotel) => (
						<HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
					))}
				</div>
			</div>
		</main>
	);
};
