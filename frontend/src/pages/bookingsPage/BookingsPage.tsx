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
import { checkPermission } from '../../utils/permissions';
import type { Booking } from '../../types/models';

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

	const filterByRole = (bookings: Booking[], status: 'Подтверждено' | 'Отменено') => {
		return bookings.filter((b) => {
			const matchStatus = b.status === status;
			if (!matchStatus) return false;
			return b.userId === currentUser?._id;
		});
	};

	const activeBookings = useMemo<Booking[]>(
		() => filterByRole(allBookings, 'Подтверждено'),
		[allBookings, currentUser],
	);

	const canceledBookings = useMemo<Booking[]>(
		() => filterByRole(allBookings, 'Отменено'),
		[allBookings, currentUser],
	);

	const handleDelete = (_id: string) => {
		if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
			dispatch(deleteBookingThunk(_id));
		}
	};
	if (!currentUser) return <div className="p-10 text-center">Загрузка...</div>;
	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<button
				onClick={() => navigate(-1)}
				className="flex items-center text-gray-500 hover:text-[#00a3a8] mb-8 group"
			>
				<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
				<span>Назад</span>
			</button>

			{/* Заголовок теперь всегда "Мои Бронирования", так как это личный кабинет */}
			<h2 className="text-3xl font-bold text-gray-800 mb-6">Мои Бронирования</h2>

			<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4 mb-8">
				<h3 className="text-2xl font-semibold text-green-700 border-b pb-2">
					Активные ({activeBookings.length})
				</h3>
				{activeBookings.map((booking) => {
					// Здесь canDelete всегда будет true, так как это личные брони
					// Но проверку оставляем для соблюдения архитектуры
					const canDelete = checkPermission(currentUser, 'DELETE_BOOKING', {
						userId: booking.userId,
						hotelOwnerId: booking.hotelOwnerId,
					});

					return (
						<div
							key={booking._id}
							className="p-4 border rounded-xl bg-green-50 flex justify-between items-center"
						>
							<div>
								<p className="font-semibold text-green-700 flex items-center">
									<Hotel className="w-5 h-5 mr-2" /> {booking.hotelName}
								</p>
								<p className="text-sm">
									{booking.roomType}, с {booking.checkIn} по{' '}
									{booking.checkOut}
								</p>
							</div>

							{canDelete && booking._id && (
								<button
									onClick={() => handleDelete(booking._id!)}
									className="text-red-600 border border-red-300 bg-white hover:bg-red-50 px-4 py-2 rounded-lg text-sm transition-colors"
								>
									Отменить
								</button>
							)}
						</div>
					);
				})}
			</div>

			{/* Секция Отмененные */}
			<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4">
				<h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
					Отмененные ({canceledBookings.length})
				</h3>
				{canceledBookings.length > 0 ? (
					canceledBookings.map((booking) => (
						<div
							key={booking._id}
							className="p-4 border rounded-xl bg-gray-100 border-gray-300 text-gray-500"
						>
							<p className="font-semibold flex items-center">
								<Hotel className="w-5 h-5 mr-2" /> {booking.hotelName}
							</p>
							<p className="text-sm mt-1">
								{booking.roomType}, даты: {booking.checkIn} по{' '}
								{booking.checkOut}.
							</p>
							<p className="text-sm font-bold text-red-400 mt-1 flex items-center">
								<span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
								Статус: {booking.status}
							</p>
						</div>
					))
				) : (
					<p className="text-gray-500 italic">Нет отмененных бронирований.</p>
				)}
			</div>
		</div>
	);
};
