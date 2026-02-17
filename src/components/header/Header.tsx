// - Компонент верхнего навигационного меню.

import { LogOut, User } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/actions/userActions';
import { useNavigate, Link } from 'react-router-dom';
import { WeatherWidget } from './components/WeatherWidget';
import { selectCurrentUser } from '../../selectors';
import { NAVIGATION_CONFIG } from '../constants/navigation';
import { ROLES } from '../../utils/permissions';
import { useAppSelector } from '../../store/hooks';

export const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// const currentUser = useSelector(selectCurrentUser);
	const currentUser = useAppSelector(selectCurrentUser);

	const filteredLinks = useMemo(() => {
		return NAVIGATION_CONFIG.filter((link) => {
			// Если ссылка только для авторизованных
			if (link.onlyAuth && !currentUser) return false;
			// Если у ссылки прописаны роли
			if (link.roles) {
				return link.roles.includes(currentUser?.role || '');
			}
			return true;
		});
	}, [currentUser]);

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
					{/* ЛЕВАЯ ЧАСТЬ */}
					<div className="flex items-center gap-8">
						<Link
							to="/"
							className="text-2xl font-black text-teal-600 tracking-tight hover:opacity-80 transition"
						>
							Book<span className="text-amber-500">EZ</span>
						</Link>
						<WeatherWidget />
					</div>

					{/* ЦЕНТР: Теперь тут один цикл по отфильтрованным ссылкам */}
					<nav className="hidden md:flex items-center space-x-1">
						{filteredLinks.map((link, index) => {
							// Определяем, стафф ли это, чтобы понять, нужен ли разделитель
							const isStaff =
								link.roles?.includes(ROLES.ADMIN) ||
								link.roles?.includes(ROLES.MANAGER);

							return (
								<div key={link.path} className="flex items-center">
									{/* Если это первая ссылка стаффа, рисуем перед ней полоску */}
									{isStaff &&
										index > 0 &&
										!filteredLinks[index - 1].roles && (
											<div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
										)}

									<Link
										to={link.path}
										className={`flex items-center gap-2 px-4 py-2 transition text-sm rounded-lg ${
											link.className ||
											'text-gray-600 hover:text-teal-600 font-semibold hover:bg-gray-50'
										}`}
									>
										{link.icon}
										{link.title}
									</Link>
								</div>
							);
						})}
					</nav>

					{/* ПРАВАЯ ЧАСТЬ */}
					<div className="flex items-center">
						{currentUser ? (
							<div className="relative group">
								<div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition cursor-pointer">
									<div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
										<User size={18} />
									</div>
									<span className="hidden sm:inline font-bold text-sm text-gray-700">
										{userName}
									</span>
								</div>

								<div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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
									className="px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-full hover:bg-teal-700 transition shadow-md"
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
