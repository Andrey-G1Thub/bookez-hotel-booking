// - Компонент верхнего навигационного меню.

import { useMemo } from 'react';

export const Header = ({ currentUser, logout, navigate }) => {
	// ОТОБРАЖЕНИЕ ИМЕНИ ЗАРЕГИСТРИРОВАННОГО ПОЛЬЗОВАТЕЛЯ
	const userName = useMemo(
		() => currentUser?.name || currentUser?.email || 'Профиль',
		[currentUser],
	);

	return (
		<div className="bg-white shadow-lg sticky top-0 z-10">
			<CustomStyles />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Логотип */}
					<div className="flex-shrink-0">
						<button
							onClick={() => navigate('/')}
							className="text-2xl font-bold accent-text hover:opacity-80"
						>
							BookEZ
						</button>
					</div>

					{/* Навигация */}
					<nav className="hidden md:flex space-x-6">
						<button
							onClick={() => navigate('/')}
							className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
						>
							Главная
						</button>
						{currentUser && (
							<button
								onClick={() => navigate('/bookings')}
								className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium"
							>
								Мои Брони
							</button>
						)}
						{/* Меню Менеджера/Админа */}
						{currentUser?.role === 'manager' && (
							<button
								onClick={() => navigate('/manager')}
								className="text-amber-600 hover:text-amber-800 transition duration-150 font-bold"
							>
								Панель Менеджера
							</button>
						)}
					</nav>

					{/* Авторизация/Профиль */}
					<div className="flex items-center space-x-3">
						{currentUser ? (
							<div className="relative group">
								<button className="flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
									<User className="h-6 w-6 accent-text" />
									{/* Отображение имени пользователя */}
									<span className="ml-2 hidden sm:inline font-semibold text-gray-700">
										{userName}
									</span>
								</button>

								<div className="absolute right-0 mt-2 w-48 bg-white card-shadow hidden group-hover:block transition z-20 overflow-hidden">
									<button
										onClick={logout}
										className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium"
									>
										<LogOut className="w-4 h-4 mr-2" /> Выход
									</button>
								</div>
							</div>
						) : (
							<>
								<button
									onClick={() => navigate('/login')}
									className="px-4 py-2 text-sm rounded-full border-2 accent-border accent-text hover:bg-gray-50 transition font-semibold"
								>
									Войти
								</button>
								<button
									onClick={() => navigate('/register')}
									className="px-4 py-2 text-sm rounded-full text-white accent-color accent-hover transition hidden sm:inline font-semibold shadow-md"
								>
									Регистрация
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// const appState = '';

// export const Header = () => {
// 	return (
// 		<div className="bg-white shadow-md sticky top-0 z-10">
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// 				<div className="flex justify-between items-center h-16">
// 					{/* Логотип */}
// 					<div className="flex-shrink-0">
// 						<a href="#/" className="text-2xl font-bold accent-text">
// 							BookEZ
// 						</a>
// 					</div>

// 					{/* Навигация */}
// 					<nav className="hidden md:flex space-x-4">
// 						<a
// 							href="#/"
// 							className="text-gray-600 hover:text-gray-900 transition duration-150"
// 						>
// 							Главная
// 						</a>
// 						{/* ИСПРАВЛЕНО: Условный рендеринг */}
// 						{appState.currentUser && (
// 							<a
// 								href="#/bookings"
// 								className="text-gray-600 hover:text-gray-900 transition duration-150"
// 							>
// 								Мои Брони
// 							</a>
// 						)}
// 					</nav>

// 					{/* Авторизация/Профиль */}
// 					<div className="flex items-center space-x-3">
// 						{/* ИСПРАВЛЕНО: Условный рендеринг */}
// 						{appState.currentUser ? (
// 							<div className="relative group">
// 								<button className="flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
// 									<svg
// 										xmlns="http://www.w3.org/2000/svg"
// 										className="h-6 w-6 accent-text"
// 										fill="none"
// 										viewBox="0 0 24 24"
// 										stroke="currentColor"
// 									>
// 										<path
// 											strokeLinecap="round"
// 											strokeLinejoin="round"
// 											strokeWidth="2"
// 											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
// 										/>
// 									</svg>
// 									<span className="ml-2 hidden sm:inline">
// 										{userName}
// 									</span>
// 								</button>
// 								<div className="absolute right-0 mt-2 w-48 bg-white card-shadow hidden group-hover:block transition z-20">
// 									{/* ИСПРАВЛЕНО: Обработчик onClick */}
// 									<a
// 										href="#"
// 										onClick={logout}
// 										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// 									>
// 										Выход
// 									</a>
// 								</div>
// 							</div>
// 						) : (
// 							<>
// 								{' '}
// 								{/* Фрагмент для объединения двух ссылок */}
// 								<a
// 									href="#/login"
// 									className="px-4 py-1 text-sm rounded-full border accent-border accent-text hover:bg-gray-50 transition"
// 								>
// 									Войти
// 								</a>
// 								<a
// 									href="#/register"
// 									className="px-4 py-1 text-sm rounded-full text-white accent-color accent-hover transition hidden sm:inline"
// 								>
// 									Регистрация
// 								</a>
// 							</>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
