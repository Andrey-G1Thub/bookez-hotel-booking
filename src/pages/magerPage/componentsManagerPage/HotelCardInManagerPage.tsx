import { Trash2 } from 'lucide-react';

export const HotelCardInManagerPage = ({
	hotel,
	cities,
	setSelectedHotel,
	setIsRoomModalOpen,
	handleDeleteHotel,
}) => (
	<div className="flex justify-between items-start">
		<div>
			<h3 className="font-bold text-xl text-gray-800">{hotel.name}</h3>
			<p className="text-sm text-gray-500">
				{cities.find((c: any) => c.id === hotel.cityId)?.name ||
					'Город не указан'}
			</p>
		</div>
		<div className="flex gap-2">
			<button
				onClick={() => {
					setSelectedHotel(hotel);
					setIsRoomModalOpen(true);
				}}
				className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-100 transition"
			>
				+ Номер
			</button>
			<button
				onClick={() => handleDeleteHotel(hotel.id)}
				className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
			>
				<Trash2 size={18} />
			</button>
		</div>
	</div>
);
