import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Footer, Header } from './components';
import { BookingsPage } from './pages/bookingsPage/BookingsPage';
import { CityDetailsPage } from './pages/cityDetailsPage/CityDetailsPage';
import { HomePage } from './pages/homePage/HomePage';
import { HotelDetailsPage } from './pages/hotelDetailsPage/HotelDetailsPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import { NotFoundPage } from './pages/notFoundPage/NotFoundPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { RoomBookingPage } from './pages/roomBookingPage/RoomBookingPage';

import './App.css';
import { SET_USER } from './store/actions/userActions';
import { fetchHotelsThunk } from './store/actions/hotelActions';
import { fetchBookings, fetchBookingsThunk } from './store/actions/bookingActions';
import { fetchCitiesThunk } from './store/actions/hotelActions';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRouter';
import { AdminPage } from './pages/adminPage/AdminPage';
import { ROLES } from './utils/permissions';
import { ManagerPage } from './pages/magerPage/ManagerPage';
// import { PrivateRoute } from './components/PrivateRouter';

export const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.users.currentUser);

	useEffect(() => {
		// dispatch(fetchBookings());
		dispatch(fetchHotelsThunk());
		dispatch(fetchCitiesThunk());

		const savedUser = localStorage.getItem('bookez_user');
		if (savedUser) {
			const user = JSON.parse(savedUser);
			dispatch({ type: SET_USER, payload: user });
			dispatch(fetchBookingsThunk(user.id));
		}
	}, [dispatch]);

	// 4. Определение содержимого страницы
	const isUserLoggedIn = !!currentUser;
	const isManager = currentUser?.role === 'manager';

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* Параметризованные маршруты */}
					<Route path="/city/:cityId" element={<CityDetailsPage />} />
					<Route path="/hotel/:hotelId" element={<HotelDetailsPage />} />
					<Route path="/room/:hotelId/:roomId" element={<RoomBookingPage />} />

					{/* Защищенные маршруты */}
					<Route
						path="/bookings"
						element={
							<PrivateRoute>
								<BookingsPage />
							</PrivateRoute>
						}
					/>

					<Route
						path="/admin"
						element={
							<PrivateRoute roles={[ROLES.ADMIN]}>
								<AdminPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/manager"
						element={
							<PrivateRoute roles={[ROLES.ADMIN, ROLES.MANAGER]}>
								<ManagerPage />
							</PrivateRoute>
						}
					></Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
};
