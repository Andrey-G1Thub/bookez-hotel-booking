import { Hotel } from 'lucide-react';
import type { BookingCardProps } from '../../../types/components';

export const BookingCard = ({ booking, variant, actionButton }: BookingCardProps) => {
	const isActive = variant === 'active';

	return (
		<div
			className={`p-4 border rounded-xl flex justify-between items-center transition-all ${
				isActive
					? 'bg-green-50 border-green-100'
					: 'bg-gray-50 border-gray-200 opacity-75'
			}`}
		>
			<div>
				<p
					className={`font-semibold flex items-center ${isActive ? 'text-green-700' : 'text-gray-600'}`}
				>
					<Hotel className="w-5 h-5 mr-2" /> {booking.hotelName}
				</p>
				<p className="text-sm text-gray-600 mt-1">
					{booking.roomType}, с {booking.checkIn} по {booking.checkOut}
				</p>
				{!isActive && (
					<p className="text-xs font-bold text-red-400 mt-2 flex items-center uppercase tracking-wider">
						<span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
						Статус: {booking.status}
					</p>
				)}
			</div>
			{actionButton}
		</div>
	);
};
