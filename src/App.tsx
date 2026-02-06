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
import { fetchBookings, SET_BOOKINGS } from './store/actions/bookingActions';

export const App = () => {
	const dispatch = useDispatch();
	// 1. Имитация глобального состояния пользователя
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		dispatch(fetchBookings()); // Запрос к JSON-server
		dispatch({ type: 'SET_HOTELS', payload: MOCK_DATA.HOTELS });

		// dispatch({ type: SET_BOOKINGS, payload: initialBookings });

		const savedUser = localStorage.getItem('bookez_user');
		if (savedUser) {
			setCurrentUser(JSON.parse(savedUser)); // Превращаем строку обратно в объект
		}
	}, [dispatch]);
	// 2. Роутинг на основе хэша
	const { route, params, navigate } = useHashRouter();

	// 3. Имитация авторизации и выхода
	const login = (userData) => {
		const user = {
			id: 'user-123', // Вот твой строковый ID
			email: userData.email,
			name: userData.name || userData.email.split('@')[0],
			role: 'user',
		};
		setCurrentUser(user);
		alert(`Вы вошли как ${user.name}!`);
		// Сохраняем локальную переменную user, а не стейт!
		localStorage.setItem('bookez_user', JSON.stringify(user));
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
		// ТЕПЕРЬ МЫ НЕ ПЕРЕДАЕМ bookings и cancelBooking как пропсы!
		// Компонент сам возьмет их из Redux через useSelector и useDispatch
		content = isUserLoggedIn ? (
			<BookingsPage navigate={navigate} currentUser={currentUser} />
		) : (
			<NotFoundPage navigate={navigate} message="Нужна авторизация" />
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
