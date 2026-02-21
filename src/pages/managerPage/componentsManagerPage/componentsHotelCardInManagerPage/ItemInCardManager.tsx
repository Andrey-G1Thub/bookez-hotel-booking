import { useState } from 'react';
import {
	Edit3,
	Trash2,
	ChevronDown,
	ChevronUp,
	BedDouble,
	CalendarCheck,
	X,
	Mail,
	Phone,
	User,
} from 'lucide-react';

interface ItemInCardManagerProps {
	hotel: any;
	allBookings: any[]; // Передаем все бронирования для фильтрации
	handleDeleteRoom: (hotelId: number, roomId: number) => void;
	handleEditRoomClick: (hotel: any, room: any) => void;
	handleDeleteBooking: (bookingId: number) => void;
}

export const ItemInCardManager = ({
	hotel,
	allBookings,
	handleDeleteRoom,
	handleEditRoomClick,
	handleDeleteBooking,
}: ItemInCardManagerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	// Фильтруем бронирования только для этого отеля
	const hotelBookings = allBookings.filter((b) => b.hotelId === hotel.id);
	const roomsCount = Array.isArray(hotel.rooms) ? hotel.rooms.length : 0;
	const bookingsCount = hotelBookings.length;
	const totalBookingsCount = hotelBookings.length;

	return (
		<div className="border-t pt-3 mt-3">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-200"
			>
				<div className="flex items-center gap-2 text-sm font-semibold text-teal-600 uppercase">
					<BedDouble size={16} />

					<span>Управление номерами ({roomsCount})</span>
					<span className="text-gray-300">|</span>
					{/* Подсвечиваем брони, если они есть */}
					<span
						className={bookingsCount > 0 ? 'text-amber-600' : 'text-teal-600'}
					>
						Бронирования ({bookingsCount})
					</span>
				</div>
				<div className="flex items-center gap-2">
					{/* Маленький индикатор-точка, если есть активные брони */}
					{bookingsCount > 0 && !isOpen && (
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
						</span>
					)}
				</div>
				{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
			</button>

			{isOpen && (
				<div className="mt-4 space-y-4 animate-in fade-in duration-300">
					{(Array.isArray(hotel.rooms) ? hotel.rooms : []).map((room: any) => {
						// ФИЛЬТРАЦИЯ: Находим бронирования именно для этого номера
						const roomBookings = hotelBookings.filter(
							(b) => b.roomId === room.id,
						);

						return (
							<div
								key={room.id}
								className="border rounded-xl overflow-hidden bg-white"
							>
								{/* КАРТОЧКА НОМЕРА */}
								<div className="bg-gray-50 p-3 flex justify-between items-center border-b">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
											{room.images?.[0] ? (
												<img
													src={room.images[0]}
													className="object-cover w-full h-full"
													alt=""
												/>
											) : (
												<BedDouble
													className="text-gray-300"
													size={16}
												/>
											)}
										</div>
										<div>
											<p className="text-sm font-bold text-gray-700">
												{room.type}
											</p>
											<p className="text-xs text-gray-500">
												{room.price.toLocaleString()} ₽ / ночь
											</p>
										</div>
									</div>

									<div className="flex items-center gap-1">
										{/* Счетчик броней на конкретный номер */}
										{roomBookings.length > 0 && (
											<span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold mr-2">
												{roomBookings.length} бронь
											</span>
										)}
										<button
											onClick={() =>
												handleEditRoomClick(hotel, room)
											}
											className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg"
										>
											<Edit3 size={16} />
										</button>
										<button
											onClick={() =>
												handleDeleteRoom(hotel.id, room.id)
											}
											className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>

								{/* СПИСОК БРОНЕЙ ПОД НОМЕРОМ */}
								{roomBookings.length > 0 && (
									<div className="p-2 bg-white space-y-2">
										{roomBookings.map((book: any) => (
											<div
												key={book.id}
												className="bg-amber-50/30 p-3 rounded-lg border border-amber-100/50 flex justify-between items-center"
											>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm font-bold text-gray-800">
														<User
															size={14}
															className="text-amber-600"
														/>
														{book.client?.name || 'Гость'}
														<span className="text-amber-700 ml-2 bg-white px-2 py-0.5 rounded border border-amber-200 text-xs">
															{book.price?.toLocaleString()}{' '}
															₽
														</span>
													</div>

													<div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
														<div className="flex items-center gap-1">
															<Phone
																size={12}
																className="text-gray-400"
															/>
															{book.client?.phone || 'нет'}
														</div>
														<div className="flex items-center gap-1 text-amber-700 font-medium">
															<CalendarCheck size={12} />
															{book.checkIn} —{' '}
															{book.checkOut}
														</div>
													</div>
												</div>
												<button
													onClick={() =>
														handleDeleteBooking(book.id)
													}
													className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
													title="Отменить бронь"
												>
													<X size={16} />
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
