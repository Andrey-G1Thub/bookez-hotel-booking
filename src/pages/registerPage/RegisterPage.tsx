import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { PatternFormat } from 'react-number-format';
import { Eye, EyeOff } from 'lucide-react';

import * as yup from 'yup';
import { registerThunk } from '../../store/actions/userActions';
import type { AppDispatch } from '../../store';

export const registerSchema = yup.object().shape({
	name: yup.string().required('Имя обязательно').min(2, 'Минимум 2 символа'),
	email: yup.string().email('Неверный формат email').required('Email обязателен'),
	phone: yup
		.string()
		.required('Телефон обязателен')
		//маска
		.test('len', 'Введите полный номер телефона', (val) => {
			const digits = val?.replace(/\D/g, '');
			return digits?.length === 10; // Проверка на 10 цифр
		}),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются только буквы, цифры и знаки # %',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
	confirmPassword: yup
		.string()
		.required('Заполните повтор пароля')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

//  Извлекает тип из схемы автоматически!
type RegisterFormData = yup.InferType<typeof registerSchema>;

export const RegisterPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	// Состояния для видимости паролей
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		control, // Нужен для интеграции маски
		watch,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: yupResolver(registerSchema),
		mode: 'onChange',
	});
	const passwordValue = watch('password', '');

	const strength = useMemo(() => {
		if (!passwordValue) return { score: 0, label: '', color: 'bg-gray-200' };

		let score = 0;
		if (passwordValue.length >= 6) score++; // Базовая длина
		if (/[A-Z]/.test(passwordValue) || /[a-z]/.test(passwordValue)) score++; // Есть буквы
		if (/[0-9]/.test(passwordValue)) score++; // Есть цифры
		if (/[#%_]/.test(passwordValue)) score++; // Есть спецсимволы

		if (score <= 2)
			return { score, label: 'Слабый', color: 'bg-red-500', width: '33%' };
		if (score === 3)
			return { score, label: 'Средний', color: 'bg-yellow-500', width: '66%' };
		return { score, label: 'Сложный', color: 'bg-green-500', width: '100%' };
	}, [passwordValue]);

	const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
		const success = await dispatch(registerThunk(data));
		if (success) {
			alert('Регистрация успешна! Войдите в аккаунт.');
			navigate('/login');
		}
	};

	return (
		<div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100 rounded-xl">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Регистрация
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Имя */}
				<div>
					<input
						{...register('name')}
						placeholder="Имя"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
				</div>
				{/* Email */}
				<div>
					<input
						{...register('email')}
						placeholder="Email"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
				</div>
				{/* Телефон с современной маской */}
				<div>
					<Controller
						name="phone"
						control={control}
						render={({ field: { onChange, value } }) => (
							<PatternFormat
								format="+7 (###) ###-##-##"
								mask="_"
								value={value}
								onValueChange={(values) => {
									// Передаем форматированное значение в react-hook-form
									onChange(values.value);
								}}
								placeholder="Телефон +7 (___) ___-__-__"
								className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
							/>
						)}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>
				</div>
				{/* Пароль */}
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						{...register('password')}
						placeholder="Пароль"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none password-input-custom ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<button
						type="button" //  Чтобы не сабмитил форму
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
					<p className="text-red-500 text-xs mt-1">
						{errors.password?.message}
					</p>
				</div>
				{/* Визуальный индикатор сложности */}
				{passwordValue && (
					<div className="mt-2">
						<div className="flex h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
							<div
								className={`transition-all duration-500 ${strength.color}`}
								style={{ width: strength.width }}
							></div>
						</div>
						<p
							className={`text-[10px] mt-1 font-semibold ${strength.color.replace('bg-', 'text-')}`}
						>
							Сложность: {strength.label}
						</p>
					</div>
				)}
				{/* Подтверждение пароля */}
				<div className="relative">
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						{...register('confirmPassword')}
						placeholder="Подтверждение пароля"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none password-input-custom ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
					>
						{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
					<p className="text-red-500 text-xs mt-1">
						{errors.confirmPassword?.message}
					</p>
				</div>

				<button
					type="submit"
					className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
