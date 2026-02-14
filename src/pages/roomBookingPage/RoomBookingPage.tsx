import { Calendar, ChevronRight, DollarSign, Hotel, User, Zap } from 'lucide-react';
// import { MOCK_DATA } from '../../data/mockData.js';
import { getMinDate } from '../../utils/helpers.js';
import { NotFoundPage } from '../notFoundPage/NotFoundPage.js';
import { useDispatch, useSelector } from 'react-redux';
import { addBookingThunk } from '../../store/actions/bookingActions.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../components/Skeleton.js';

/\*_ Страница бронирования конкретного номера _/;
export const RoomBookingPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { hotelId, roomId } = useParams();

	const currentUser = useSelector((state) => state.users.currentUser);
	const { allHotels } = useSelector((state) => state.hotels);
	const bookings = useSelector((state) => state.bookings.list) || [];

	// Считаем, сколько отелей уже есть у менеджера
	const myHotels = allHotels.filter((h) => h.ownerId === currentUser.id);

	// Проверка лимита (берем из юзера или ставим дефолт)
	const maxHotels = currentUser.limits?.maxHotels || 1;

	const canAddMore = myHotels.length < maxHotels;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Имитируем загрузку 800мс, чтобы глаз успел увидеть скелетон
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);
		return () => clearTimeout(timer);
	}, []);

	// const targetHotelId = Number(hotelId);
	// const targetRoomId = Number(roomId);

	// // 1. Сначала ищем отель
	// const hotel = allHotels.find((h) => Number(h.id) === targetHotelId);
	// // 2. Затем ищем комнату ВНУТРИ этого отеля
	// const room = hotel?.rooms?.find((r) => Number(r.id) === targetRoomId);
	// Используем String(), чтобы точно сравнить значения,
	// даже если одно из них пришло как строка из URL
	const hotel = allHotels.find((h) => String(h.id) === String(hotelId));
	const room = hotel?.rooms?.find((r) => String(r.id) === String(roomId));

	const displayHotelId = hotelId || 'не указан';
	const displayRoomId = roomId || 'не указан';

	// 3. Создаем состояния для дат и итоговой цены
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [isPaying, setIsPaying] = useState(false);
	const [agreement, setAgreement] = useState(false);

	// Эффект для автоматического пересчета цены при изменении дат
	useEffect(() => {
		if (checkIn && checkOut && room) {
			const s = new Date(checkIn);
			const e = new Date(checkOut);
			const diffTime = e - s;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			// Если даты валидны (выезд позже заезда)
			if (diffDays > 0) {
				setTotalPrice(diffDays * room.price);
			} else {
				setTotalPrice(room.price); // Или 0
			}
		} else if (room) {
			setTotalPrice(room.price); // Цена за 1 ночь по умолчанию
		}
	}, [checkIn, checkOut, room]);

	// Состояние загрузки
	if (isLoading || allHotels.length === 0) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Скелетон заголовка */}
				<Skeleton className="h-10 w-3/4 mb-4" />
				<Skeleton className="h-6 w-1/2 mb-8" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Левая колонка */}
					<div className="space-y-4">
						<Skeleton className="h-48 w-full rounded-xl" />
						<Skeleton className="h-8 w-1/3" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
					{/* Правая колонка */}
					<div className="p-6 border rounded-xl space-y-4">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-12 w-full" />
					</div>
				</div>
			</div>
		);
	}
	// Если отель или комната не найдены
	if (!hotel || !room) {
		return (
			<NotFoundPage
				message={`Отель #${displayHotelId} или номер #${displayRoomId} не найден.`}
			/>
		);
	}

	// Фильтруем бронирования именно для этого номера (используем ID для надежности)
	const roomBookings = bookings.filter(
		(b) => Number(b.roomId) === room.id && b.status === 'Подтверждено',
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
			return newStart < bookedEnd && newEnd > bookedStart;
		});

		if (isOverlap) {
			return {
				overlap: true,
				message: 'Эти даты уже заняты. Пожалуйста, выберите другие.',
			};
		}

		return { overlap: false };
	};

	const handleBooking = async (e) => {
		e.preventDefault();

		if (!currentUser) {
			alert('Пожалуйста, войдите в систему, чтобы забронировать номер.');
			navigate('/login');
			return;
		}

		// Проверка галочки (на всякий случай, хотя кнопка будет заблокирована)
		if (!agreement) {
			alert('Пожалуйста, подтвердите согласие с условиями оферты.');
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
		setIsPaying(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			// Создание новой брони с привязкой по ID
			const newBooking = {
				id: Date.now(),
				userId: currentUser.id,
				hotelId: hotel.id,
				roomId: room.id,
				hotelName: hotel.name,
				roomType: room.type,
				checkIn,
				checkOut,
				// price: room.price,
				price: totalPrice,
				status: 'Подтверждено',
			};

			dispatch(addBookingThunk(newBooking));
			alert(`Оплата прошла успешно! Номер "${room.type}" забронирован.`);
			navigate('/bookings');
		} catch (error) {
			alert('Ошибка при оплате. Попробуйте еще раз.');
		} finally {
			setIsPaying(false);
		}
	};
	const calculateTotal = (start, end) => {
		if (!start || !end) return;
		const s = new Date(start);
		const e = new Date(end);
		const diffTime = Math.abs(e - s);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		// Если заезд и выезд в один день, считаем как 1 ночь
		setTotalPrice((diffDays || 1) * room.price);
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
					{/* <div className="bg-teal-100 w-full h-48 rounded-xl mb-4 flex items-center justify-center text-teal-700 font-bold text-center p-4"> */}
					<div className="w-full h-64 rounded-xl mb-4 overflow-hidden shadow-md">
						{room.images && room.images.length > 0 ? (
							<img
								src={room.images[0]}
								alt={room.type}
								className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src =
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
								onChange={(e) => setCheckIn(e.target.value)}
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
										{Math.ceil(
											(new Date(checkOut) - new Date(checkIn)) /
												(1000 * 60 * 60 * 24),
										)}{' '}
										ночи(ей)
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
