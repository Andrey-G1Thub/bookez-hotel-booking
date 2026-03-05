import { Edit3, Trash2 } from 'lucide-react';
import type { HotelCardInManagerPageProps } from '../../../types/models';
// import type { City, Hotel } from '../../../store/reducers/hotelReducer';

// export interface HotelCardInManagerPageProps {
// 	hotel: Hotel;
// 	cities: City[];
// 	setSelectedHotel: (hotel: Hotel | null) => void;
// 	handleDeleteHotel: (_id: string) => void;
// 	handleEditHotelClick: (hotel: Hotel) => void;
// 	handleOpenAddRoomModal: (hotel: Hotel) => void;
// }

export const HotelCardInManagerPage = ({
	hotel,
	cities,
	setSelectedHotel,
	handleDeleteHotel,
	handleEditHotelClick,
	handleOpenAddRoomModal,
}: HotelCardInManagerPageProps) => (
	<div className="flex justify-between items-start">
		<div>
			<h3 className="font-bold text-xl text-gray-800">{hotel.name}</h3>
			<p className="text-sm text-gray-500">
				{cities.find((c) => c._id === hotel.cityId)?.name || 'Город не указан'}
			</p>
		</div>
		<div className="flex gap-2">
			<button
				onClick={() => {
					setSelectedHotel(hotel);
					handleOpenAddRoomModal(hotel);
				}}
				className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-100 transition"
			>
				Добавить Номер
			</button>
			<button
				onClick={() => handleEditHotelClick(hotel)}
				className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
			>
				<Edit3 size={18} />
			</button>
			<button
				onClick={() => handleDeleteHotel(hotel._id)}
				className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
			>
				<Trash2 size={18} />
			</button>
		</div>
	</div>
);
