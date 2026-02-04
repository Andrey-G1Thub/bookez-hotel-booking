import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
	ChevronRight,
	Calendar,
	User,
	LogOut,
	MapPin,
	DollarSign,
	Hotel,
	Home,
	Zap,
} from 'lucide-react';
import { useHashRouter } from './hooks/useHashRouter';
import { LoginPage } from './pages/loginPage/LoginPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { BookingsPage } from './pages/bookingsPage/BookingsPage';
import { NotFoundPage } from './pages/notFoundPage/NotFoundPage';
import { CityDetailsPage } from './pages/cityDetailsPage/CityDetailsPage';
import { HotelDetailsPage } from './pages/hotelDetailsPage/HotelDetailsPage';
import { RoomBookingPage } from './pages/roomBookingPage/RoomBookingPage';
import { Footer, Header } from './components';
import { HomePage } from './pages/homePage/HomePage';
import { getMinDate } from './utils/helpers';
import './App.css';
import { MOCK_DATA } from './data/mockData';
import { useDispatch } from 'react-redux';
import { SET_HOTELS } from './store/actions/hotelActions';

export const App = () => {
	const dispatch = useDispatch();
	// 1. Имитация глобального состояния пользователя
	const [currentUser, setCurrentUser] = useState(null);

	// ИМИТАЦИЯ СОСТОЯНИЯ БРОНИРОВАНИЙ
	const [bookings, setBookings] = useState([
		{
			id: 1,
			userId: 'user-123',
			hotelName: 'Москва Гранд Отель',
			roomType: 'Люкс с Видом',
			checkIn: '2025-12-15',
			checkOut: '2025-12-20',
			price: 15000,
			status: 'Подтверждено',
		},
		{
			id: 2,
			userId: 'user-123',
			hotelName: 'Отель у Парка',
			roomType: 'Стандартный Двухместный',
			checkIn: '2025-11-25',
			checkOut: '2025-11-28',
			price: 5200,
			status: 'Подтверждено',
		},
		{
			id: 3,
			userId: 'user-456',
			hotelName: 'Солнечный Берег',
			roomType: 'Эконом',
			checkIn: '2026-01-10',
			checkOut: '2026-01-15',
			price: 4500,
			status: 'Подтверждено',
		},
	]);
	useEffect(() => {
		dispatch({ type: 'SET_HOTELS', payload: MOCK_DATA.HOTELS });
		const savedUser = localStorage.getItem('bookez_user');
		if (savedUser) {
			setCurrentUser(JSON.parse(savedUser)); // Превращаем строку обратно в объект
		}
	}, [dispatch]);
	// 2. Роутинг на основе хэша
	const { route, params, navigate } = useHashRouter();

	// 3. Имитация авторизации и выхода
	const login = (userData) => {
		// Имитируем успешный вход с данными из формы
		setCurrentUser({
			id: 'user-123',
			email: userData.email,
			name: userData.name || userData.email.split('@')[0],
			role: 'user',
		});
		alert(
			`Вы успешно вошли в систему как ${userData.name || userData.email.split('@')[0]}!`,
		);
		localStorage.setItem('bookez_user', JSON.stringify(currentUser));
		navigate('/');
	};

	const register = (userData) => {
		console.log('Registered user:', userData);
		alert(
			`Регистрация пользователя ${userData.name} прошла успешно! Теперь войдите.`,
		);
		navigate('/login');
	};

	const logout = (e) => {
		e.preventDefault();
		setCurrentUser(null);
		alert('Вы вышли из системы.');
		localStorage.removeItem('bookez_user');
		navigate('/');
	};

	const addBooking = (newBooking) => {
		setBookings((prev) => [
			...prev,
			{
				...newBooking,
				id: Date.now(),
				userId: currentUser.id,
				status: 'Подтверждено',
			},
		]);
	};

	// ФУНКЦИЯ ОТМЕНЫ БРОНИРОВАНИЯ
	const cancelBooking = (bookingId) => {
		setBookings((prev) =>
			prev.map((b) =>
				b.id === bookingId && b.userId === currentUser.id
					? { ...b, status: 'Отменено', cancelledAt: getMinDate() }
					: b,
			),
		);
		alert(`Бронирование #${bookingId} отменено.`);
	};

	// 4. Определение содержимого страницы
	let content;
	const isUserLoggedIn = !!currentUser;
	const isManager = currentUser?.role === 'manager';

	if (route === '/') {
		content = <HomePage navigate={navigate} />;
	} else if (route === 'login') {
		content = <LoginPage login={login} navigate={navigate} />;
	} else if (route === 'register') {
		// Передача функции регистрации
		content = <RegisterPage navigate={navigate} register={register} />;
	} else if (route === 'bookings') {
		// Передача функции отмены бронирования
		content = isUserLoggedIn ? (
			<BookingsPage
				navigate={navigate}
				currentUser={currentUser}
				bookings={bookings}
				cancelBooking={cancelBooking}
			/>
		) : (
			<NotFoundPage
				navigate={navigate}
				message="Доступ только для авторизованных пользователей."
			/>
		);
	} else if (route === 'cityDetails') {
		content = <CityDetailsPage params={params} navigate={navigate} />;
	} else if (route === 'hotelDetails') {
		content = <HotelDetailsPage params={params} navigate={navigate} />;
	} else if (route === 'roomBooking') {
		content = (
			<RoomBookingPage
				params={params}
				navigate={navigate}
				currentUser={currentUser}
				bookings={bookings}
				addBooking={addBooking}
			/>
		);
	} else if (route === 'manager') {
		content = isManager ? (
			<NotFoundPage
				navigate={navigate}
				message="Панель менеджера (скоро здесь будет функционал управления)."
			/>
		) : (
			<NotFoundPage
				navigate={navigate}
				message="У вас нет прав доступа к этой странице."
			/>
		);
	} else {
		content = <NotFoundPage navigate={navigate} />;
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Header currentUser={currentUser} logout={logout} navigate={navigate} />
			<div className="flex-grow">{content}</div>
			<Footer />
		</div>
	);
};

// import './App.css';
// // import { Header } from './components/index.js';
// import { Zap } from 'lucide-react';
// import { MOCK_DATA } from './data/mockData.js';
// import { Footer, Header } from './components/index.js';

// // const MOCK_DATA = {
// // 	CITIES: [
// // 		{ id: '1', name: 'Геническ' },
// // 		{ id: '2', name: 'Севастополь' },
// // 		{ id: '3', name: 'Ялта' },
// // 		{ id: '4', name: 'Евпатория' },
// // 		{ id: '5', name: 'Арабатская стрелка' },
// // 	],
// // };
// const featuredHotels = [];
// const navigate = () => {};

// const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
// 	event.preventDefault();
// 	const formData = new FormData(event.currentTarget);
// 	const data = {
// 		city: formData.get('city'),
// 		checkIn: formData.get('checkIn'),
// 		checkOut: formData.get('checkOut'),
// 	};
// 	console.log('Поиск отеля в:', data);
// };

// const getMinDate = (): string => new Date().toISOString().split('T')[0];

// export const App = () => {
// 	return (
// 		<main>
// 			<Header />
// 			{/* Секция Hero с Поиском */}
// 			<div
// 				className="relative h-96 accent-color"
// 				style={{
// 					backgroundImage:
// 						'linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark))',
// 				}}
// 			>
// 				<div className="absolute inset-0 flex items-center justify-center">
// 					<div className="w-full max-w-4xl p-4 md:p-8">
// 						<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-xl">
// 							Бронируйте с Доверием
// 						</h1>

// 						{/* Модуль Поиска */}
// 						<form
// 							onSubmit={handleSearch}
// 							className="bg-white p-4 md:p-6 rounded-xl card-shadow flex flex-col md:flex-row gap-3"
// 						>
// 							{/* ПОЛЕ ВЫБОРА ГОРОДА (ВЫПАДАЮЩИЙ СПИСОК) */}
// 							<select
// 								name="city"
// 								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border bg-white"
// 								defaultValue=""
// 								required
// 							>
// 								<option value="" disabled>
// 									Выберите город
// 								</option>
// 								{MOCK_DATA.CITIES.map((city) => (
// 									// Используем имя города в качестве значения
// 									<option key={city.id} value={city.name}>
// 										{city.name}
// 									</option>
// 								))}
// 							</select>

// 							<input
// 								type="date"
// 								name="checkIn"
// 								placeholder="Дата Заезда"
// 								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
// 								min={getMinDate()}
// 								required
// 							/>
// 							<input
// 								type="date"
// 								name="checkOut"
// 								placeholder="Дата Выезда"
// 								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
// 								min={getMinDate()}
// 								required
// 							/>
// 							<button
// 								type="submit"
// 								className="px-6 py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
// 							>
// 								<Zap className="w-5 h-5 inline mr-1 -mt-1" /> Найти
// 							</button>
// 						</form>
// 					</div>
// 				</div>
// 			</div>
// 			{/* Секция с Рекомендуемыми Отелями */}
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// 				<h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
// 					Популярные Отели
// 				</h2>
// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// 					{featuredHotels.map((hotel) => (
// 						<HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
// 					))}
// 				</div>
// 			</div>
// 			<Footer />
// 		</main>
// 	);
// };

// // - Возвращает сегодняшнюю дату в формате YYYY-MM-DD.
