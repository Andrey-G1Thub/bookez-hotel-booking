import { useDispatch } from 'react-redux';
import { loginThunk } from '../../store/actions/userActions';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../store';

export const LoginPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const isSuccess = await dispatch(loginThunk({ email, password }));

		if (isSuccess) {
			navigate('/');
		}
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
					className="text-[#00a3a8] hover:underline font-medium"
				>
					Зарегистрироваться
				</button>
			</p>
		</div>
	);
};
