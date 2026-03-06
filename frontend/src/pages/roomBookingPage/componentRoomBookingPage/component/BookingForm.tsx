import type { ChangeEvent } from 'react';
import type { BookingFormChildProps } from '../../../../types/components';
import { getMinDate } from '../../../../utils/helpers';

export const BookingForm = ({
	room,
	handleBooking,
	setCheckIn,
	checkIn,
	setCheckOut,
	checkOut,
	totalPrice,
	calculateNights,
	agreement,
	setAgreement,
	isPaying,
}: BookingFormChildProps) => (
	<form onSubmit={handleBooking} className="space-y-4">
		<div>
			<label
				htmlFor="checkIn"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Дата Заезда
			</label>
			<input
				id="checkIn"
				type="date"
				name="checkIn"
				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				min={getMinDate()}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setCheckIn(e.target.value)
				}
				required
			/>
		</div>
		<div>
			<label
				htmlFor="checkOut"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Дата Выезда
			</label>
			<input
				id="checkOut"
				type="date"
				name="checkOut"
				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
				min={checkIn || getMinDate()}
				onChange={(e) => setCheckOut(e.target.value)}
				required
			/>
		</div>
		{checkIn && checkOut && totalPrice > 0 && (
			<div className="bg-teal-50 p-4 rounded-lg border border-teal-100 my-4 animate-in fade-in duration-500">
				<h4 className="text-sm font-bold text-teal-800 uppercase mb-2">
					Детали платежа
				</h4>
				<div className="flex justify-between text-sm text-gray-600 mb-1">
					<span>
						{room.price} ₽ × {calculateNights(checkIn, checkOut)} ночи(ей)
					</span>
					<span>{totalPrice} ₽</span>
				</div>
				<div className="flex justify-between text-sm text-gray-600 mb-2">
					<span>Налоги и сборы</span>
					<span className="text-green-600">Бесплатно</span>
				</div>
				<div className="border-t border-teal-200 pt-2 flex justify-between items-center">
					<span className="font-bold text-gray-800">Итого к оплате:</span>
					<span className="text-xl font-extrabold text-teal-700">
						{totalPrice} ₽
					</span>
				</div>
			</div>
		)}
		<div className="flex items-start mt-4 mb-2">
			<input
				id="agreement"
				type="checkbox"
				checked={agreement}
				onChange={(e) => setAgreement(e.target.checked)}
				className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
				required
			/>
			<label
				htmlFor="agreement"
				className="ml-2 text-sm text-gray-600 cursor-pointer"
			>
				Я согласен с{' '}
				<span className="text-teal-600 underline">условиями бронирования</span> и
				правилами предоставления услуг.
			</label>
		</div>
		<button
			type="submit"
			// Кнопка не нажмется, если нет дат, идет оплата или не стоит галочка
			disabled={isPaying || !checkIn || !checkOut || !agreement}
			className={`w-full py-3 rounded-lg text-white font-semibold transition shadow-lg mt-2 ${
				isPaying || !agreement || !checkIn || !checkOut
					? 'bg-gray-400 cursor-not-allowed'
					: 'bg-teal-600 hover:bg-teal-700'
			}`}
		>
			{isPaying ? (
				<div className="flex items-center justify-center">
					{/* Простой CSS-спиннер через Tailwind */}
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
					Связь с банком...
				</div>
			) : (
				`Оплатить и забронировать: ${totalPrice} ₽`
			)}
		</button>
	</form>
);
