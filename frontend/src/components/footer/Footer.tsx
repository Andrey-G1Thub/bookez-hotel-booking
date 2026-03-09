import { Link } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '../constants/navigation';

export const Footer = () => (
	<footer className="bg-gray-800 mt-12">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
			<div className="md:flex md:justify-between">
				<div className="mb-6 md:mb-0">
					<p className="text-2xl font-bold accent-text">BookEZ</p>
					<p className="text-sm text-gray-400 mt-2">
						Ваш надёжный сервис бронирования отелей.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
					<div>
						<h3 className="text-sm font-semibold text-gray-100 uppercase mb-4">
							Навигация
						</h3>
						<ul className="text-gray-400 space-y-2">
							{/* Используем map для чистоты кода */}
							{NAVIGATION_CONFIG.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="hover:text-white transition"
									>
										{link.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
			<div className="text-center">
				<span className="text-sm text-gray-400 sm:text-center">
					© 2026 BookEZ. Все права защищены.
				</span>
			</div>
		</div>
	</footer>
);
