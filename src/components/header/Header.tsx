// - Компонент верхнего навигационного меню.

import { Hotel, LogOut, ShieldAlert, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/actions/userActions';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../../utils/permissions';
import { WeatherWidget } from './components/WeatherWidget';

export const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const currentUser = useSelector((state) => state.users.currentUser);

	const [city, setCity] = useState('');
	const [temperature, setTemperature] = useState('');
	const [weather, setWeather] = useState('');

	const userName = useMemo(
		() => currentUser?.name || currentUser?.email || 'Профиль',
		[currentUser],
	);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		if (window.confirm('Вы действительно хотите выйти?')) {
			dispatch(logoutThunk());
			navigate('/');
		}
	};

	return (
		<div className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
					{' '}
					{/* Увеличили высоту до h-20 для воздуха */}
					{/* ЛЕВАЯ ЧАСТЬ: Лого и Погода */}
					<div className="flex items-center gap-8">
						<Link
							to="/"
							className="text-2xl font-black text-teal-600 tracking-tight hover:opacity-80 transition"
						>
							Book<span className="text-amber-500">EZ</span>
						</Link>

						<WeatherWidget />
					</div>
					{/* ЦЕНТР: Навигация */}
					<nav className="hidden md:flex items-center space-x-1">
						<Link
							to="/"
							className="px-4 py-2 text-gray-600 hover:text-teal-600 transition font-semibold text-sm rounded-lg hover:bg-gray-50"
						>
							Главная
						</Link>
						{currentUser && (
							<Link
								to="/bookings"
								className="px-4 py-2 text-gray-600 hover:text-teal-600 transition font-semibold text-sm rounded-lg hover:bg-gray-50"
							>
								Мои Брони
							</Link>
						)}

						{(currentUser?.role === ROLES.MANAGER ||
							currentUser?.role === ROLES.ADMIN) && (
							<div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
						)}

						{currentUser?.role === ROLES.ADMIN && (
							<Link
								to="/admin"
								className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition font-bold text-sm rounded-lg"
							>
								<ShieldAlert size={16} />
								Админ
							</Link>
						)}

						{(currentUser?.role === ROLES.MANAGER ||
							currentUser?.role === ROLES.ADMIN) && (
							<Link
								to="/manager"
								className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 transition font-bold text-sm rounded-lg"
							>
								<Hotel size={16} />
								Менеджер
							</Link>
						)}
					</nav>
					{/* ПРАВАЯ ЧАСТЬ: Юзер */}
					<div className="flex items-center">
						{currentUser ? (
							<div className="relative group">
								<div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition cursor-pointer">
									<div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm">
										<User size={18} />
									</div>
									<span className="hidden sm:inline font-bold text-sm text-gray-700">
										{userName}
									</span>
								</div>

								<div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
									<button
										onClick={handleLogout}
										className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-semibold"
									>
										<LogOut className="w-4 h-4 mr-2" />
										Выйти
									</button>
								</div>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<Link
									to="/login"
									className="text-sm font-bold text-gray-600 hover:text-teal-600 transition"
								>
									Войти
								</Link>
								<Link
									to="/register"
									className="px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-full hover:bg-teal-700 transition shadow-md shadow-teal-100"
								>
									Начать
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
