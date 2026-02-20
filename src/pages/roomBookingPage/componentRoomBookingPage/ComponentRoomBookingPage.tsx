import {
	Calendar,
	ChevronRight,
	DollarSign,
	Hotel as HotelIcon,
	User,
	Zap,
} from 'lucide-react';
import { getMinDate } from '../../../utils/helpers';
import { calculateNights } from '../../../utils/calculateNights';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Hotel, Room } from '../../../store/reducers/hotelReducer';
import type { Booking } from '../../../store/reducers/bookingReducer';

interface Props {
	room: Room;
	hotel: Hotel;
	roomBookings: Booking[];
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	agreement: boolean;
	isPaying: boolean;
	setCheckIn: (val: string) => void;
	setCheckOut: (val: string) => void;
	setAgreement: (val: boolean) => void;
	handleBooking: (e: FormEvent<HTMLFormElement>) => void;
}

export const ComponentRoomBookingPage = ({
	room,
	hotel,
	roomBookings,
	setCheckIn,
	handleBooking,
	checkIn,
	setCheckOut,
	checkOut,
	totalPrice,
	agreement,
	setAgreement,
	isPaying,
}: Props) => {
	const navigate = useNavigate();
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
				{room.type}
			</h1>
			<p className="text-xl text-gray-600 mb-6 flex items-center">
				<HotelIcon className="w-5 h-5 mr-2 accent-text" />
				Отель: {hotel?.name || 'Неизвестно'}
			</p>

			<div className="bg-white p-6 card-shadow grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Левая колонка: Детали Номера */}
				<div>
					<div className="w-full h-64 rounded-xl mb-4 overflow-hidden shadow-md">
						{room.images && room.images.length > 0 ? (
							<img
								src={room.images[0]}
								alt={room.type}
								className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
								onError={(
									e: React.SyntheticEvent<HTMLImageElement, Event>,
								) => {
									e.currentTarget.onerror = null;
									e.currentTarget.src =
										'https://placehold.co/600x400?text=Room+Photo';
								}}
							/>
						) : (
							<div className="bg-teal-100 w-full h-full flex items-center justify-center text-teal-700 font-bold text-center p-4">
								Фото для номера <br /> "{room.type}" еще не добавлено
							</div>
						)}
						{/* </div> */}
					</div>
					<h3 className="text-2xl font-bold text-gray-800 mb-4">Детали</h3>
					<ul className="space-y-3">
						<li className="flex items-center text-gray-700">
							<User className="w-5 h-5 mr-2 accent-text" /> Макс. гостей:{' '}
							<span className="font-semibold ml-2">{room.capacity}</span>
						</li>
						<li className="flex items-center text-gray-700">
							<Zap className="w-5 h-5 mr-2 accent-text" /> Удобства:{' '}
							<span className="font-semibold ml-2">{room.amenities}</span>
						</li>
						<li className="flex items-center text-gray-700">
							<DollarSign className="w-5 h-5 mr-2 accent-text" /> Цена за
							ночь:{' '}
							<span className="font-semibold ml-2">{room.price} ₽</span>
						</li>
					</ul>
				</div>

				{/* Правая колонка: Форма Бронирования */}
				<div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
					<h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<Calendar className="w-6 h-6 mr-2 accent-text" /> Выберите Даты
					</h3>

					{/* ВИЗУАЛИЗАЦИЯ ЗАНЯТЫХ ДАТ */}
					<div className="mb-6 max-h-32 overflow-y-auto p-2 border rounded-lg bg-white">
						<p className="text-sm font-semibold text-red-600 mb-2 border-b pb-1">
							Занятые Даты в календаре:
						</p>
						<div className="flex flex-col gap-2">
							{roomBookings.length > 0 ? (
								roomBookings.map((b, index) => (
									<span
										key={index}
										className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded font-medium shadow-sm"
									>
										{b.checkIn} — {b.checkOut} ({b.roomType})
									</span>
								))
							) : (
								<span className="text-sm text-green-600">
									На данный момент нет занятых дат.
								</span>
							)}
						</div>
					</div>
					{/* КОНЕЦ ВИЗУАЛИЗАЦИИ ЗАНЯТЫХ ДАТ */}

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
										{room.price} ₽ ×{' '}
										{calculateNights(checkIn, checkOut)} ночи(ей)
									</span>
									<span>{totalPrice} ₽</span>
								</div>
								<div className="flex justify-between text-sm text-gray-600 mb-2">
									<span>Налоги и сборы</span>
									<span className="text-green-600">Бесплатно</span>
								</div>
								<div className="border-t border-teal-200 pt-2 flex justify-between items-center">
									<span className="font-bold text-gray-800">
										Итого к оплате:
									</span>
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
								<span className="text-teal-600 underline">
									условиями бронирования
								</span>{' '}
								и правилами предоставления услуг.
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
				</div>
			</div>
			<div className="mt-8">
				<button
					onClick={() => navigate(-1)}
					className="text-gray-500 hover:text-gray-700 flex items-center"
				>
					<ChevronRight className="w-4 h-4 transform rotate-180 mr-1" /> Назад
				</button>
			</div>
		</div>
	);
};
