import './App.css';
import { Header } from './components/index.js';
import { Zap } from 'lucide-react';
import { MOCK_DATA } from './data/mockData.js';

// const MOCK_DATA = {
// 	CITIES: [
// 		{ id: '1', name: 'Геническ' },
// 		{ id: '2', name: 'Севастополь' },
// 		{ id: '3', name: 'Ялта' },
// 		{ id: '4', name: 'Евпатория' },
// 		{ id: '5', name: 'Арабатская стрелка' },
// 	],
// };
const featuredHotels = [];
const navigate = () => {};

const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	const data = {
		city: formData.get('city'),
		checkIn: formData.get('checkIn'),
		checkOut: formData.get('checkOut'),
	};
	console.log('Поиск отеля в:', data);
};

const getMinDate = (): string => new Date().toISOString().split('T')[0];

export const App = () => {
	return (
		<main>
			<Header></Header>
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

// - Возвращает сегодняшнюю дату в формате YYYY-MM-DD.

export const getMinDate = () => {
	const today = new Date();
	// Используем 'T00:00:00' для нормализации даты до начала дня по местному времени
	return today.toISOString().split('T')[0];
};
