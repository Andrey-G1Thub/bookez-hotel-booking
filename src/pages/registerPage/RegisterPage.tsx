import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { registerThunk } from '../../store/actions/userActions';

export const registerSchema = yup.object().shape({
	name: yup.string().required('Имя обязательно').min(2, 'Минимум 2 символа'),
	email: yup.string().email('Неверный формат email').required('Email обязателен'),
	phone: yup
		.string()
		.required('Телефон обязателен')
		.matches(/^[0-9+]+$/, 'Только цифры и знак +'),
	password: yup
		.string()
		.required('Заполните пароль')
		.min(6, 'Пароль минимум 6 символов')
		.max(30, 'Пароль максимум 30 символов'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
		.required('Подтвердите пароль'),
});

export const RegisterPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(registerSchema),
	});

	const onSubmit = async (data) => {
		const success = await dispatch(registerThunk(data));
		if (success) {
			alert('Регистрация успешна! Войдите в аккаунт.');
			navigate('/login');
		}
	};

	// return (
	// 	<div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100">
	// 		<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
	// 			Регистрация
	// 		</h2>
	// 		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
	// 			<input
	// 				type="text"
	// 				name="name"
	// 				placeholder="Имя"
	// 				required
	// 				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
	// 			/>
	// 			<input
	// 				type="email"
	// 				name="email"
	// 				placeholder="Email"
	// 				required
	// 				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
	// 			/>
	// 			<input
	// 				type="password"
	// 				name="password"
	// 				placeholder="Пароль"
	// 				required
	// 				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
	// 			/>
	// 			{/* ПОЛЕ ПОДТВЕРЖДЕНИЯ ПАРОЛЯ */}
	// 			<input
	// 				type="password"
	// 				name="confirmPassword"
	// 				placeholder="Подтверждение Пароля"
	// 				required
	// 				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
	// 			/>
	// 			<button
	// 				type="submit"
	// 				className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
	// 			>
	// 				Зарегистрироваться
	// 			</button>
	// 		</form>
	// 		<p className="mt-4 text-center text-sm text-gray-600">
	// 			Уже есть аккаунт?{' '}
	// 			<button
	// 				onClick={() => navigate('/login')}
	// 				className="accent-text hover:underline font-medium"
	// 			>
	// 				Войти
	// 			</button>
	// 		</p>
	// 	</div>
	// );
	return (
		<div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100 rounded-xl">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Регистрация
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<input
						{...register('name')}
						placeholder="Имя"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
				</div>

				<div>
					<input
						{...register('email')}
						placeholder="Email"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
				</div>

				<div>
					<input
						{...register('phone')}
						placeholder="Телефон"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>
				</div>

				<div>
					<input
						type="password"
						{...register('password')}
						placeholder="Пароль"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
					/>
					<p className="text-red-500 text-xs mt-1">
						{errors.password?.message}
					</p>
				</div>

				<div>
					<input
						type="password"
						{...register('confirmPassword')}
						placeholder="Подтверждение пароля"
						className={`w-full p-3 border rounded-lg focus:ring-2 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
					/>
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
