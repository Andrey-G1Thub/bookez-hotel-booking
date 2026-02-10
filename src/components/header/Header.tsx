// - Компонент верхнего навигационного меню.

import { LogOut, User } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/actions/userActions';
import { useNavigate, Link } from 'react-router-dom';

export const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const currentUser = useSelector((state) => state.users.currentUser);

	const userName = useMemo(
		() => currentUser?.name || currentUser?.email || 'Профиль',
		[currentUser],
	);

	const handleLogout = (e) => {
		e.preventDefault();
		if (window.confirm('Вы действительно хотите выйти?')) {
			dispatch(logoutThunk());
			navigate('/');
		}
	};

	return (
		<div className="bg-white shadow-lg sticky top-0 z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex-shrink-0">
						<Link
							to="/"
							className="text-2xl font-bold accent-text hover:opacity-80"
						>
							BookEZ
						</Link>
					</div>

					{/* Навигация */}
					<nav className="hidden md:flex space-x-6">
						<Link
							to="/"
							className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
						>
							Главная
						</Link>
						{currentUser && (
							<Link
								to="/bookings"
								className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
							>
								Мои Брони
							</Link>
						)}
						{/* Меню Менеджера/Админа */}
						{currentUser?.role === 'manager' && (
							<Link
								to="/manager"
								className="text-amber-600 hover:text-amber-800 transition duration-150 font-bold"
							>
								Панель Менеджера
							</Link>
						)}
					</nav>

					{/* Блок пользователя / Авторизация */}
					<div className="flex items-center space-x-3">
						{currentUser ? (
							<div className="relative group">
								{/* Кнопка Профиля */}
								<div className="flex items-center p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition cursor-pointer">
									<User className="h-6 w-6 accent-text" />
									<span className="ml-2 hidden sm:inline font-semibold text-gray-700">
										{userName}
									</span>
								</div>

								{/* Выпадающее меню при наведении */}
								<div className="absolute right-0 mt-0 w-48 bg-white shadow-xl rounded-b-lg border-t-2 accent-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
									<div className="py-1">
										<button
											onClick={handleLogout}
											className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
										>
											<LogOut className="w-4 h-4 mr-2 " />
											Выйти
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<Link
									to="/login"
									className="px-4 py-2 text-sm rounded-full border-2 accent-border accent-text hover:bg-gray-50 transition font-semibold"
								>
									Войти
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 text-sm rounded-full text-white accent-color accent-hover transition hidden sm:inline font-semibold shadow-md"
								>
									Регистрация
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
