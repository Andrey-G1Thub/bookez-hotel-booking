import { ArrowLeft, Hotel } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	deleteBookingThunk,
	fetchBookingsThunk,
} from '../../store/actions/bookingActions';
import type { AppDispatch } from '../../store';
import {
	selectBookingIsLoading,
	selectBookingList,
} from '../../selectors/bookingSelectors';
import { selectCurrentUser } from '../../selectors';
import { useAppSelector } from '../../store/hooks';
import { LoadingSpinner } from '../../components/componentsLoading/loadingSpinner';
import { BookingCard } from './component/bookingCard';

export const BookingsPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const allBookings = useAppSelector(selectBookingList);
	const currentUser = useAppSelector(selectCurrentUser);
	const isLoading = useAppSelector(selectBookingIsLoading);

	useEffect(() => {
		if (currentUser?._id) {
			dispatch(fetchBookingsThunk(currentUser._id));
		}
	}, [dispatch, currentUser?._id]);

	// Фильтрация остается в useMemo для производительности
	const activeBookings = useMemo(
		() =>
			allBookings.filter(
				(b) => b.status === 'Подтверждено' && b.userId === currentUser?._id,
			),
		[allBookings, currentUser],
	);

	const canceledBookings = useMemo(
		() =>
			allBookings.filter(
				(b) => b.status === 'Отменено' && b.userId === currentUser?._id,
			),
		[allBookings, currentUser],
	);

	const handleDelete = (_id: string) => {
		if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
			dispatch(deleteBookingThunk(_id));
		}
	};
	if (!currentUser) return <div className="p-10 text-center">Загрузка...</div>;
	if (isLoading) return <LoadingSpinner />;

	// return (
	// 	<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	// 		<button
	// 			onClick={() => navigate(-1)}
	// 			className="flex items-center text-gray-500 hover:text-[#00a3a8] mb-8 group"
	// 		>
	// 			<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
	// 			<span>Назад</span>
	// 		</button>

	// 		{/*  "Мои Бронирования" */}
	// 		<h2 className="text-3xl font-bold text-gray-800 mb-6">Мои Бронирования</h2>

	// 		<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4 mb-8">
	// 			<h3 className="text-2xl font-semibold text-green-700 border-b pb-2">
	// 				Активные ({activeBookings.length})
	// 			</h3>
	// 			{activeBookings.map((booking) => {
	// 				// Здесь canDelete всегда будет true, так как это личные брони
	// 				// Но проверку оставляем для соблюдения архитектуры
	// 				const canDelete = checkPermission(currentUser, 'DELETE_BOOKING', {
	// 					userId: booking.userId,
	// 					hotelOwnerId: booking.hotelOwnerId,
	// 				});

	// 				return (
	// 					<div
	// 						key={booking._id}
	// 						className="p-4 border rounded-xl bg-green-50 flex justify-between items-center"
	// 					>
	// 						<div>
	// 							<p className="font-semibold text-green-700 flex items-center">
	// 								<Hotel className="w-5 h-5 mr-2" /> {booking.hotelName}
	// 							</p>
	// 							<p className="text-sm">
	// 								{booking.roomType}, с {booking.checkIn} по{' '}
	// 								{booking.checkOut}
	// 							</p>
	// 						</div>

	// 						{canDelete && booking._id && (
	// 							<button
	// 								onClick={() => handleDelete(booking._id!)}
	// 								className="text-red-600 border border-red-300 bg-white hover:bg-red-50 px-4 py-2 rounded-lg text-sm transition-colors"
	// 							>
	// 								Отменить
	// 							</button>
	// 						)}
	// 					</div>
	// 				);
	// 			})}
	// 		</div>

	// 		{/* Секция Отмененные */}
	// 		<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4">
	// 			<h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
	// 				Отмененные ({canceledBookings.length})
	// 			</h3>
	// 			{canceledBookings.length > 0 ? (
	// 				canceledBookings.map((booking) => (
	// 					<div
	// 						key={booking._id}
	// 						className="p-4 border rounded-xl bg-gray-100 border-gray-300 text-gray-500"
	// 					>
	// 						<p className="font-semibold flex items-center">
	// 							<Hotel className="w-5 h-5 mr-2" /> {booking.hotelName}
	// 						</p>
	// 						<p className="text-sm mt-1">
	// 							{booking.roomType}, даты: {booking.checkIn} по{' '}
	// 							{booking.checkOut}.
	// 						</p>
	// 						<p className="text-sm font-bold text-red-400 mt-1 flex items-center">
	// 							<span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
	// 							Статус: {booking.status}
	// 						</p>
	// 					</div>
	// 				))
	// 			) : (
	// 				<p className="text-gray-500 italic">Нет отмененных бронирований.</p>
	// 			)}
	// 		</div>
	// 	</div>
	// );

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			{/* Кнопка Назад */}
			<button
				onClick={() => navigate(-1)}
				className="flex items-center text-gray-500 hover:text-teal-600 mb-8 group transition-colors"
			>
				<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
				<span className="font-medium">Назад к поиску</span>
			</button>

			<h2 className="text-3xl font-black text-gray-800 mb-10 tracking-tight">
				Мои Бронирования
			</h2>

			{/* Секция: Активные */}
			<section className="mb-12">
				<div className="flex items-center justify-between mb-6 border-b pb-2">
					<h3 className="text-xl font-bold text-gray-800">Активные</h3>
					<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
						{activeBookings.length}
					</span>
				</div>

				<div className="grid gap-4">
					{activeBookings.length > 0 ? (
						activeBookings.map((booking) => (
							<BookingCard
								key={booking._id}
								variant="active"
								booking={booking}
								actionButton={
									booking._id && (
										<button
											onClick={() => handleDelete(booking._id!)}
											className="text-red-600 border border-red-200 bg-white hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
										>
											Отменить
										</button>
									)
								}
							/>
						))
					) : (
						<p className="text-gray-400 italic py-4 text-center border-2 border-dashed rounded-xl">
							У вас пока нет активных бронирований
						</p>
					)}
				</div>
			</section>

			{/* Секция: Отмененные */}
			<section>
				<div className="flex items-center justify-between mb-6 border-b pb-2">
					<h3 className="text-xl font-bold text-gray-800">
						История / Отмененные
					</h3>
					<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
						{canceledBookings.length}
					</span>
				</div>

				<div className="grid gap-4">
					{canceledBookings.length > 0 ? (
						canceledBookings.map((booking) => (
							<BookingCard
								key={booking._id}
								variant="canceled"
								booking={booking}
							/>
						))
					) : (
						<p className="text-gray-400 italic py-4 text-center">
							История пуста
						</p>
					)}
				</div>
			</section>
		</div>
	);
};
