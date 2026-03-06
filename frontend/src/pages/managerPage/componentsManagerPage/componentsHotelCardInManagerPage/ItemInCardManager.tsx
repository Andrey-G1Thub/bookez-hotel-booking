import { useState } from 'react';
import type { ItemInCardManagerProps } from '../../../../types/components';
import { BedDouble, ChevronDown, ChevronUp } from 'lucide-react';
import { RoomItem } from './component/RoomItem';

export const ItemInCardManager = ({
	hotel,
	allBookings,
	handleDeleteRoom,
	handleEditRoomClick,
	handleDeleteBooking,
}: ItemInCardManagerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const hotelBookings = allBookings.filter((b) => b.hotelId === hotel._id);
	const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];

	const getRoomBookings = (roomId: string) =>
		hotelBookings.filter((b) => b.roomId === roomId);
	// Обработчик переключения
	const toggleOpen = () => setIsOpen((prev) => !prev);

	return (
		<div className="border-t pt-3 mt-3">
			<button
				onClick={toggleOpen}
				className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-200"
			>
				<div className="flex items-center gap-2 text-sm font-semibold text-teal-600 uppercase">
					<BedDouble size={16} />
					<span>Управление номерами ({rooms.length})</span>
					<span className="text-gray-300">|</span>
					<span
						className={
							hotelBookings.length > 0 ? 'text-amber-600' : 'text-teal-600'
						}
					>
						Бронирования ({hotelBookings.length})
					</span>
				</div>

				<div className="flex items-center gap-2">
					{hotelBookings.length > 0 && !isOpen && (
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
						</span>
					)}
					{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
				</div>
			</button>

			{isOpen && (
				<div className="mt-4 space-y-4 animate-in fade-in duration-300">
					{rooms.map((room) => (
						<RoomItem
							key={room._id}
							room={room}
							hotel={hotel}
							bookings={getRoomBookings(room._id)}
							onEdit={handleEditRoomClick}
							onDeleteRoom={handleDeleteRoom}
							onDeleteBooking={handleDeleteBooking}
						/>
					))}
				</div>
			)}
		</div>
	);
};
