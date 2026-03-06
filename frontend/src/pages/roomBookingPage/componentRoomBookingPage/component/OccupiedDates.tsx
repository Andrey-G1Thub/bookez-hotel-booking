import type { Booking } from '../../../../types/models';

// Вне основного компонента или внутри него
export const OccupiedDates = ({ roomBookings }: { roomBookings: Booking[] }) => (
	<div className="mb-6 max-h-32 overflow-y-auto p-2 border rounded-lg bg-white">
		<p className="text-sm font-semibold text-red-600 mb-2 border-b pb-1">
			Занятые Даты в календаре:
		</p>
		<div className="flex flex-col gap-2">
			{roomBookings.length > 0 ? (
				roomBookings.map((b, index) => (
					<span
						key={index}
						className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded font-medium shadow-sm"
					>
						{b.checkIn} — {b.checkOut} ({b.roomType})
					</span>
				))
			) : (
				<span className="text-sm text-green-600">
					На данный момент нет занятых дат.
				</span>
			)}
		</div>
	</div>
);
