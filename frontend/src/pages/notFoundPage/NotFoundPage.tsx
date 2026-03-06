import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NotFoundPageProps } from '../../types/components';

export const NotFoundPage = ({ message = 'Маршрут не найден.' }: NotFoundPageProps) => {
	const navigate = useNavigate();
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
			<h2 className="text-6xl font-extrabold accent-text mb-4">404</h2>
			<p className="text-2xl text-gray-700 mb-6">{message}</p>
			<button
				onClick={() => navigate('/')}
				className="mt-6 inline-flex items-center py-3 px-8 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
			>
				<Home className="w-5 h-5 inline mr-2 " /> Вернуться на Главную
			</button>
		</div>
	);
};
