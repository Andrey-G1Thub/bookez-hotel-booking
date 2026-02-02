export const BookingsPage = ({ navigate, currentUser, bookings, cancelBooking }) => {
	// ФИЛЬТРАЦИЯ АКТУАЛЬНЫХ БРОНИРОВАНИЙ (только со статусом "Подтверждено")
	const activeBookings = bookings.filter(
		(b) => b.userId === currentUser?.id && b.status === 'Подтверждено',
	);
	const canceledBookings = bookings.filter(
		(b) => b.userId === currentUser?.id && b.status === 'Отменено',
	);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h2 className="text-3xl font-bold text-gray-800 mb-6">Мои Бронирования</h2>

			{/* Активные бронирования */}
			<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4 mb-8">
				<h3 className="text-2xl font-semibold text-green-700 border-b pb-2">
					Активные ({activeBookings.length})
				</h3>
				{activeBookings.length > 0 ? (
					activeBookings.map((booking) => (
						<div
							key={booking.id}
							className="p-4 border rounded-xl bg-green-50 border-green-200 flex justify-between items-center"
						>
							<div>
								<p className="font-semibold text-green-700 flex items-center">
									<Hotel className="w-5 h-5 mr-2" /> Отель:{' '}
									{booking.hotelName}
								</p>
								<p className="text-sm text-green-600 mt-1">
									Номер:{' '}
									<span className="font-bold">{booking.roomType}</span>,
									с {booking.checkIn} по {booking.checkOut}.
								</p>
								<p className="text-sm text-green-600">
									Цена: {booking.price} ₽
								</p>
							</div>
							{/* КНОПКА ОТМЕНЫ БРОНИРОВАНИЯ */}
							<button
								onClick={() => cancelBooking(booking.id)}
								className="text-red-600 border border-red-300 bg-white hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
							>
								Отменить
							</button>
						</div>
					))
				) : (
					<div className="p-4 border rounded-xl bg-gray-50 text-gray-600">
						<p>У вас пока нет активных бронирований.</p>
					</div>
				)}
			</div>

			{/* Отмененные бронирования */}
			<div className="bg-white p-6 card-shadow border border-gray-100 space-y-4">
				<h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">
					Отмененные ({canceledBookings.length})
				</h3>
				{canceledBookings.length > 0 ? (
					canceledBookings.map((booking) => (
						<div
							key={booking.id}
							className="p-4 border rounded-xl bg-gray-100 border-gray-300 text-gray-500"
						>
							<p className="font-semibold flex items-center">
								<Hotel className="w-5 h-5 mr-2" /> Отель:{' '}
								{booking.hotelName}
							</p>
							<p className="text-sm mt-1">
								Номер:{' '}
								<span className="font-bold">{booking.roomType}</span>,
								даты: {booking.checkIn} по {booking.checkOut}.
							</p>
							<p className="text-sm font-bold text-red-500">
								Статус: {booking.status}
							</p>
						</div>
					))
				) : (
					<div className="p-4 border rounded-xl bg-gray-50 text-gray-600">
						<p>Нет отмененных бронирований.</p>
					</div>
				)}
			</div>
		</div>
	);
};
