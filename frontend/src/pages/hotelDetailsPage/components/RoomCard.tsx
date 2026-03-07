import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../../../utils/getFullImageUrl';
import type { RoomCardProps } from '../../../types/components';
import { ROUTES } from '../../../components/constants/route';

export const RoomCard = ({ room }: RoomCardProps) => {
	const navigate = useNavigate();

	return (
		<div className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow">
			<div className="md:w-1/3 h-52 md:h-auto bg-gray-200">
				<img
					src={getFullImageUrl(room.images?.[0])}
					alt={room.type}
					className="w-full h-full object-cover"
					onError={(e) => {
						e.currentTarget.src =
							'https://placehold.co/400x300?text=No+Photo';
					}}
				/>
			</div>
			<div className="p-6 flex-1 flex flex-col justify-between">
				<div>
					<h3 className="text-2xl font-bold text-[#00a3a8] mb-2">
						{room.type}
					</h3>
					<div className="space-y-2">
						<p className="text-gray-600 flex items-center text-sm">
							<User className="w-4 h-4 mr-2" /> Вместимость: {room.capacity}{' '}
							чел.
						</p>
						<p className="text-gray-500 text-sm">
							<span className="font-semibold text-gray-700">Удобства:</span>{' '}
							{room.amenities}
						</p>
					</div>
				</div>
				<div className="mt-6 flex items-center justify-between border-t pt-4">
					<div>
						<span className="text-3xl font-black text-gray-800">
							{room.price} ₽
						</span>
						<span className="text-gray-500 text-sm ml-1">/ ночь</span>
					</div>
					<button
						// onClick={() => navigate(`/room/${room.hotelId}/${room._id}`)}
						onClick={() => navigate(ROUTES.ROOM(room.hotelId, room._id))}
						className="px-8 py-3 bg-[#00a3a8] text-white rounded-xl font-bold hover:bg-[#008c91] transition-colors shadow-lg"
					>
						Забронировать
					</button>
				</div>
			</div>
		</div>
	);
};
