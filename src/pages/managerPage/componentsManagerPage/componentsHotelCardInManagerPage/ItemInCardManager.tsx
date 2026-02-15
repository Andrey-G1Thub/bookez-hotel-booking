import { Edit3, Trash2, X } from 'lucide-react';

interface ItemInCardManagerProps {
	hotel: any;
	handleDeleteRoom: (hotelId: number, roomId: number) => void;
	// handleAddRoomPhoto: (hotelId: number, roomId: number, url: string) => void;
	handleEditRoomClick: (hotel: any, room: any) => void;
}

export const ItemInCardManager = ({
	hotel,
	handleDeleteRoom,
	// handleAddRoomPhoto,
	handleEditRoomClick,
}: ItemInCardManagerProps) => {
	// Функция-посредник для обработки клика
	// const onAddPhotoClick = (roomId: number) => {
	// 	const input = document.getElementById(`input-room-${roomId}`) as HTMLInputElement;
	// 	if (input && input.value) {
	// 		handleAddRoomPhoto(hotel.id, roomId, input.value);
	// 		input.value = ''; // очистка
	// 	}
	// };

	if (!hotel.rooms || hotel.rooms.length === 0) return null;

	return (
		<div className="border-t pt-3 mt-3">
			<p className="text-xs font-semibold text-gray-400 uppercase mb-2">
				Номера и фото:
			</p>
			<div className="grid grid-cols-1 gap-3">
				{hotel.rooms.map((room: any) => (
					<div
						key={room.id}
						className="bg-gray-50 p-3 rounded-xl border border-gray-100"
					>
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-bold text-gray-700">
								{room.type} ({room.price}₽)
							</span>
							<button
								onClick={() => handleEditRoomClick(hotel, room)}
								className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition  ml-140"
							>
								<Edit3 size={18} />
							</button>
							<button
								onClick={() => handleDeleteRoom(hotel.id, room.id)}
								className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
							>
								<Trash2 size={18} />
							</button>
						</div>

						{/* Поле добавления фото */}
						{/* <div className="flex gap-2">
							<input
								type="text"
								id={`input-room-${room.id}`}
								placeholder="URL фото номера"
								className="flex-1 text-[10px] p-2 border rounded-lg focus:ring-1 focus:ring-teal-500 outline-none"
							/>
							<button
								type="button"
								onClick={() => onAddPhotoClick(room.id)}
								className="bg-teal-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold"
							>
								ОК
							</button>
						</div> */}

						{/* Галерея */}
						{room.images && room.images.length > 0 && (
							<div className="flex gap-1 mt-2 overflow-x-auto pb-1">
								{room.images.map((img: string, idx: number) => (
									<img
										key={idx}
										src={img}
										className="w-10 h-10 object-cover rounded border border-gray-200"
										alt="Room"
									/>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
