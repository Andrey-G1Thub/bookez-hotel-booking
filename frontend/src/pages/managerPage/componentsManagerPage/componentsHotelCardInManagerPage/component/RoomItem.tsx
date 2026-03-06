import { BedDouble, CalendarCheck, Edit3, Phone, Trash2, User, X } from 'lucide-react';
import { getFullImageUrl } from '../../../../../utils/getFullImageUrl';
import type { RoomItemProps } from '../../../../../types/components';

export const RoomItem = ({
	room,
	hotel,
	bookings,
	onEdit,
	onDeleteRoom,
	onDeleteBooking,
}: RoomItemProps) => {
	return (
		<div className="border rounded-xl overflow-hidden bg-white">
			{/* КАРТОЧКА НОМЕРА */}
			<div className="bg-gray-50 p-3 flex justify-between items-center border-b">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
						{room.images?.[0] ? (
							<img
								src={getFullImageUrl(room.images[0])}
								className="object-cover w-full h-full"
								alt={room.type}
								onError={(e) => {
									e.currentTarget.src =
										'https://placehold.co/40x40?text=Error';
								}}
							/>
						) : (
							<BedDouble className="text-gray-300" size={16} />
						)}
					</div>
					<div>
						<p className="text-sm font-bold text-gray-700">{room.type}</p>
						<p className="text-xs text-gray-500">
							{room.price.toLocaleString()} ₽ / ночь
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					{bookings.length > 0 && (
						<span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold mr-2">
							{bookings.length} бронь
						</span>
					)}
					<button
						onClick={() => onEdit(hotel, room)}
						className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
					>
						<Edit3 size={16} />
					</button>
					<button
						onClick={() => onDeleteRoom(hotel._id, room._id)}
						className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* СПИСОК БРОНЕЙ */}
			{bookings.length > 0 && (
				<div className="p-2 bg-white space-y-2">
					{bookings.map((book) => (
						<div
							key={book._id}
							className="bg-amber-50/30 p-3 rounded-lg border border-amber-100/50 flex justify-between items-center"
						>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm font-bold text-gray-800">
									<User size={14} className="text-amber-600" />
									{book.client?.name || 'Гость'}
									<span className="text-amber-700 ml-2 bg-white px-2 py-0.5 rounded border border-amber-200 text-xs">
										{book.price?.toLocaleString()} ₽
									</span>
								</div>
								<div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
									<div className="flex items-center gap-1">
										<Phone size={12} className="text-gray-400" />
										{book.client?.phone || 'нет номера'}
									</div>
									<div className="flex items-center gap-1 text-amber-700 font-medium">
										<CalendarCheck size={12} />
										{book.checkIn} — {book.checkOut}
									</div>
								</div>
							</div>
							<button
								onClick={() => book._id && onDeleteBooking(book._id)}
								className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
