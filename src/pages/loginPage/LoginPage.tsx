import { useDispatch } from 'react-redux';
import { loginThunk } from '../../store/actions/userActions';

export const LoginPage = ({ navigate }) => {
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const email = formData.get('email');
		const password = formData.get('password');

		// Имитация получения данных (в реальном приложении здесь будет запрос к API)
		const name = email.split('@')[0];

		// Отправляем данные в Redux Thunk
		dispatch(loginThunk({ email, name, password }));
		navigate('/'); // После входа перенаправляем на главную
	};

	return (
		<div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Вход в BookEZ
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					name="email"
					placeholder="Email"
					required
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				/>
				<input
					type="password"
					name="password"
					placeholder="Пароль"
					required
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				/>
				<button
					type="submit"
					className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
				>
					Войти
				</button>
			</form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Нет аккаунта?{' '}
				<button
					onClick={() => navigate('/register')}
					className="accent-text hover:underline font-medium"
				>
					Зарегистрироваться
				</button>
			</p>
		</div>
	);
};
