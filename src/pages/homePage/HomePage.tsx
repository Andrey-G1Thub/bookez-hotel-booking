import { ArrowUpDown, Search, Zap } from 'lucide-react';
import { MOCK_DATA } from '../../data/mockData';
import { HotelCard } from '../../components/hotelCard/HotelCard';
import { getMinDate } from '../../utils/helpers';
import { useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
// import React, { useState, useMemo } from 'react';
// import { useSelector } from 'react-redux';

// <!-- /\*_ Главная страница с поиском и каталогом городов/отелей _/
export const HomePage = ({ navigate }) => {
	const { allHotels, cities } = useSelector((state) => state.hotels);

	const { list: bookingsList } = useSelector((state) => state.bookings); //

	const [nameSearch, setNameSearch] = useState('');
	const [sortBy, setSortBy] = useState('rating'); // 'rating' или 'price'
	const [currentPage, setCurrentPage] = useState(1);
	const [searchFilters, setSearchFilters] = useState({
		cityId: null,
		checkIn: '',
		checkOut: '',
	});

	const hotelsPerPage = 9;

	const safeBookings = bookingsList || [];

	// Показываем все отели как рекомендуемые, чтобы не усложнять компонент
	const featuredHotels = allHotels?.slice(0, 3);

	const handleCityChange = (e) => {
		const selectedCity = cities.find((c) => c.name === e.target.value);
		setSearchFilters((prev) => ({ ...prev, cityId: selectedCity?.id || null }));
	};

	// 2. Логика кнопки "Найти" (с учетом дат)
	const handleSearch = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);

		setSearchFilters({
			cityId: cities.find((c) => c.name === formData.get('city'))?.id || null,
			checkIn: formData.get('checkIn'),
			checkOut: formData.get('checkOut'),
		});
	};

	// ГЛАВНАЯ ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ
	const filteredAndSortedHotels = useMemo(() => {
		let result = [...allHotels];

		// 1. Фильтр по городу
		if (searchFilters.cityId) {
			result = result.filter(
				(h) => Number(h.cityId) === Number(searchFilters.cityId),
			);
		}

		// 2. Поиск по названию
		if (nameSearch) {
			result = result.filter((h) =>
				h.name.toLowerCase().includes(nameSearch.toLowerCase()),
			);
		}

		// 3. Фильтр по датам (теперь комнаты берем из объекта отеля h.rooms)
		if (searchFilters.checkIn && searchFilters.checkOut) {
			const userStart = new Date(searchFilters.checkIn);
			const userEnd = new Date(searchFilters.checkOut);

			result = result.filter((hotel) => {
				if (!hotel.rooms) return false;
				return hotel.rooms.some((room) => {
					const roomBookings = (bookingsList || []).filter(
						(b) => Number(b.roomId) === Number(room.id),
					);
					return !roomBookings.some((b) => {
						const bStart = new Date(b.checkIn);
						const bEnd = new Date(b.checkOut);
						return userStart < bEnd && userEnd > bStart;
					});
				});
			});
		}

		// 4. Сортировка
		result.sort((a, b) => {
			if (sortBy === 'price') return a.priceFrom - b.priceFrom;
			return b.rating - a.rating; // По умолчанию рейтинг (от высокого к низкому)
		});

		return result;
	}, [allHotels, searchFilters, nameSearch, sortBy, bookingsList]);
	const lastHotelIndex = currentPage * hotelsPerPage;
	const firstHotelIndex = lastHotelIndex - hotelsPerPage;
	const currentHotels = filteredAndSortedHotels.slice(firstHotelIndex, lastHotelIndex);
	const totalPages = Math.ceil(filteredAndSortedHotels.length / hotelsPerPage);

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
								onChange={handleCityChange}
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border bg-white"
								defaultValue=""
								required
							>
								<option value="" disabled>
									Выберите город
								</option>
								{cities.map((city) => (
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

			<div className="max-w-7xl mx-auto px-4 mt-8">
				{/* ПАНЕЛЬ ДОПОЛНИТЕЛЬНЫХ ФИЛЬТРОВ */}
				<div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
					<div className="relative flex-grow">
						<Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Поиск по названию..."
							className="w-full pl-10 p-2 border rounded-md"
							value={nameSearch}
							onChange={(e) => {
								setNameSearch(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<ArrowUpDown className="w-5 h-5 text-gray-500" />
						<select
							className="p-2 border rounded-md bg-white"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="rating">По рейтингу</option>
							<option value="price">Сначала дешевые</option>
						</select>
					</div>
				</div>

				{/* СЕТКА ОТЕЛЕЙ */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{currentHotels.map((hotel) => (
						<HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
					))}
				</div>

				{/* ПАГИНАЦИЯ */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-10 gap-2">
						{[...Array(totalPages)].map((_, i) => (
							<button
								key={i}
								onClick={() => setCurrentPage(i + 1)}
								className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
							>
								{i + 1}
							</button>
						))}
					</div>
				)}
			</div>

			{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{displayHotels.length > 0 ? (
					displayHotels.map((hotel) => (
						<HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
					))
				) : (
					<p className="text-gray-500 col-span-full text-center py-10">
						К сожалению, подходящих отелей не найдено.
					</p>
				)}
			</div>
             */}
		</main>
	);
};
