import { Zap } from 'lucide-react';
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
	const { roomsList } = useSelector((state) => state.rooms); // Берем все комнаты
	const { list: bookingsList } = useSelector((state) => state.bookings); // Берем все бронирования

	const safeRooms = roomsList || [];
	const safeBookings = bookingsList || [];
	const [searchFilters, setSearchFilters] = useState({
		cityId: null,
		checkIn: '',
		checkOut: '',
	});
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

	// ГЛАВНАЯ ЛОГИКА ФИЛЬТРАЦИИ
	const displayHotels = useMemo(() => {
		if (!searchFilters.cityId) return allHotels?.slice(0, 3);

		let filtered = allHotels.filter(
			(hotel) => Number(hotel.cityId) === Number(searchFilters.cityId),
		);

		if (searchFilters.checkIn && searchFilters.checkOut) {
			const userStart = new Date(searchFilters.checkIn);
			const userEnd = new Date(searchFilters.checkOut);

			filtered = filtered.filter((hotel) => {
				// Используем safeRooms вместо rooms
				const hotelRooms = safeRooms.filter(
					(room) => Number(room.hotelId) === Number(hotel.id),
				);

				// Если в отеле вообще нет комнат в базе, он не пройдет фильтр
				if (hotelRooms.length === 0) return false;

				return hotelRooms.some((room) => {
					// Используем safeBookings вместо bookings
					const roomBookings = safeBookings.filter(
						(b) => Number(b.roomId) === Number(room.id),
					);

					const isOccupied = roomBookings.some((b) => {
						const bStart = new Date(b.checkIn);
						const bEnd = new Date(b.checkOut);
						return userStart < bEnd && userEnd > bStart;
					});

					return !isOccupied;
				});
			});
		}

		return filtered;
	}, [allHotels, safeRooms, safeBookings, searchFilters]);

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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
		</main>
	);
};
