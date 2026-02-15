import React from 'react';
import { ClipboardList, Trash2 } from 'lucide-react';

export const BookingList = ({ myBookings, isAdmin, handleDeleteBooking }) => {
	return (
		<div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
			<h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
				<ClipboardList className="text-blue-600" />
				{isAdmin ? 'Все бронирования' : 'Последние брони'}
			</h2>

			<div className="space-y-4">
				{myBookings.map((book: any) => (
					<div
						key={book.id}
						className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-sm relative group"
					>
						{/* КНОПКА УДАЛЕНИЯ БРОНИ (Видна всем менеджерам/админам в этой панели) */}
						<button
							onClick={() => handleDeleteBooking(book.id)}
							className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors"
							title="Удалить бронирование"
						>
							<Trash2 size={16} />
						</button>

						<div className="flex justify-between font-bold text-gray-800 mb-1 pr-6">
							<span>{book.hotelName}</span>
							<span className="text-teal-600">{book.price}₽</span>
						</div>

						<div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
							<p className="font-semibold text-gray-700">
								Клиент: {book.client?.name || 'Неизвестный'}
							</p>
							<p className="text-blue-600 text-xs">
								тел: {book.client?.phone || 'не указан'}
							</p>
						</div>

						<div className="text-gray-500 text-xs">
							{book.checkIn} — {book.checkOut}
						</div>

						<div className="mt-2 flex justify-between items-center">
							<div className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] uppercase font-bold">
								{book.status}
							</div>
							<span className="text-[10px] text-gray-400">
								ID: {book.id}
							</span>
						</div>
					</div>
				))}
				{myBookings.length === 0 && (
					<p className="text-center text-gray-400 py-10">
						Бронирований пока нет
					</p>
				)}
			</div>
		</div>
	);
};
