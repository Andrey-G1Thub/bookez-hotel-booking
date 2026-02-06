import { Calendar, ChevronRight, DollarSign, Hotel, User, Zap } from 'lucide-react';
import { MOCK_DATA } from '../../data/mockData.js';
import { getMinDate } from '../../utils/helpers.js';
import { NotFoundPage } from '../notFoundPage/NotFoundPage.js';
import { useDispatch, useSelector } from 'react-redux';
import { addBookingThunk } from '../../store/actions/bookingActions.js';

/\*_ Страница бронирования конкретного номера _/;
export const RoomBookingPage = ({ params, navigate, currentUser }) => {
	const dispatch = useDispatch();

	const bookings = useSelector((state) => state.bookings.list) || [];

	const room = MOCK_DATA.ROOMS.find((r) => r.id === Number(params.roomId));

	if (!room) return <NotFoundPage message="Номер не найден." navigate={navigate} />;

	const hotel = MOCK_DATA.HOTELS.find((h) => h.id === room.hotelId);

	// Фильтруем бронирования для этого номера, только подтвержденные
	const roomBookings = bookings.filter(
		(b) =>
			b.hotelName === hotel.name &&
			b.roomType === room.type &&
			b.status === 'Подтверждено',
	);

	// ФУНКЦИЯ ПРОВЕРКИ ПЕРЕСЕЧЕНИЯ ДАТ (ЗАПРЕТ ДВОЙНОГО БРОНИРОВАНИЯ)
	const checkDateOverlap = (checkIn, checkOut) => {
		// Нормализация дат до начала дня для корректного сравнения
		const newStart = new Date(checkIn + 'T00:00:00');
		const newEnd = new Date(checkOut + 'T00:00:00');
		const today = new Date(getMinDate() + 'T00:00:00');

		if (newStart >= newEnd) {
			return {
				overlap: true,
				message: 'Дата выезда должна быть позже даты заезда.',
			};
		}
		if (newStart < today) {
			return { overlap: true, message: 'Дата заезда не может быть в прошлом.' };
		}

		// Проверка на пересечение с существующими бронями
		const isOverlap = roomBookings.some((booking) => {
			const bookedStart = new Date(booking.checkIn + 'T00:00:00');
			const bookedEnd = new Date(booking.checkOut + 'T00:00:00');

			// Условие пересечения: (Начало нового < Конец старого) И (Конец нового > Начало старого)
			// Это предотвращает бронирование, даже если день выезда совпадает с днем заезда
			return newStart < bookedEnd && newEnd > bookedStart;
		});

		if (isOverlap) {
			return {
				overlap: true,
				message:
					'Введенные даты пересекаются с существующим бронированием. Выберите другие даты.',
			};
		}

		return { overlap: false };
	};
	const handleCancel = (id) => {
		if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
			dispatch(deleteBookingThunk(id));
		}
	};

	const handleBooking = (e) => {
		e.preventDefault();
		if (!currentUser) {
			alert('Пожалуйста, войдите в систему, чтобы забронировать номер.');
			navigate('/login');
			return;
		}

		const formData = new FormData(e.target);
		const checkIn = formData.get('checkIn');
		const checkOut = formData.get('checkOut');

		const overlapResult = checkDateOverlap(checkIn, checkOut);
		if (overlapResult.overlap) {
			alert(overlapResult.message);
			return;
		}

		// Создание новой брони
		const newBooking = {
			id: Date.now(), // Генерируем временный ID
			userId: currentUser.id,
			hotelName: hotel.name,
			roomType: room.type,
			checkIn: formData.get('checkIn'),
			checkOut: formData.get('checkOut'),
			price: room.price,
			status: 'Подтверждено',
		};
		dispatch(addBookingThunk(newBooking));

		alert(
			`Бронирование номера "${room.type}" оформлено! (Смотри консоль и раздел 'Мои Брони')`,
		);
		navigate('/bookings');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
				{room.type}
			</h1>
			<p className="text-xl text-gray-600 mb-6 flex items-center">
				<Hotel className="w-5 h-5 mr-2 accent-text" />
				Отель: {hotel?.name || 'Неизвестно'}
			</p>

			<div className="bg-white p-6 card-shadow grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Левая колонка: Детали Номера */}
				<div>
					<img
						src={`https://placehold.co/600x400/007C80/ffffff?text=${encodeURIComponent(room.type)}`}
						alt={room.type}
						className="w-full h-auto object-cover rounded-xl mb-4"
					/>
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
								min={getMinDate()}
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg mt-4"
						>
							Забронировать за {room.price} ₽
						</button>
					</form>
				</div>
			</div>
			<div className="mt-8">
				<button
					onClick={() => navigate(`/hotel/${room.hotelId}`)}
					className="text-gray-500 hover:text-gray-700 flex items-center"
				>
					<ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />{' '}
					Вернуться к номерам отеля
				</button>
			</div>
		</div>
	);
};
