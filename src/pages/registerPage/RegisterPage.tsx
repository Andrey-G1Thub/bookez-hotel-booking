export const RegisterPage = ({ navigate, register }) => {
	const handleRegister = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		if (data.password !== data.confirmPassword) {
			alert('Пароли не совпадают. Пожалуйста, проверьте ввод.');
			return;
		}

		register({ name: data.name, email: data.email, password: data.password });
	};

	return (
		<div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Регистрация
			</h2>
			<form onSubmit={handleRegister} className="space-y-4">
				<input
					type="text"
					name="name"
					placeholder="Имя"
					required
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				/>
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
				{/* ПОЛЕ ПОДТВЕРЖДЕНИЯ ПАРОЛЯ */}
				<input
					type="password"
					name="confirmPassword"
					placeholder="Подтверждение Пароля"
					required
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				/>
				<button
					type="submit"
					className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
				>
					Зарегистрироваться
				</button>
			</form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Уже есть аккаунт?{' '}
				<button
					onClick={() => navigate('/login')}
					className="accent-text hover:underline font-medium"
				>
					Войти
				</button>
			</p>
		</div>
	);
};
