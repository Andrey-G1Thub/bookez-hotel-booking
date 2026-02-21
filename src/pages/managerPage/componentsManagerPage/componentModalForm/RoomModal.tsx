import { Plus, X } from 'lucide-react';

export const RoomModal = ({
	isRoomModalOpen,
	setIsRoomModalOpen,
	selectedHotel,
	handleAddRoom,
	newRoom,
	setNewRoom,
	photoUrl,
	setPhotoUrl,
	isEditMode,
	handleOpenCreateModal,
	handleRemovePhoto,
}) => {
	if (!isRoomModalOpen) return null;

	const addPhotoToState = () => {
		if (!photoUrl.trim()) return;
		setNewRoom({
			...newRoom,
			images: [...newRoom.images, photoUrl],
		});
		setPhotoUrl(''); // Очищаем инпут после добавления
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
				<button
					onClick={() => setIsRoomModalOpen(false)}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				>
					<X size={24} />
				</button>

				<h2 className="text-2xl font-bold mb-1 text-gray-800">
					{isEditMode ? 'Редактировать номер' : 'Добавить номер'}
				</h2>
				<p className="text-sm text-gray-500 mb-6">Отель: {selectedHotel?.name}</p>

				<form onSubmit={handleAddRoom} className="space-y-4">
					{/* ДОБАВЛЕНИЕ ФОТО (Новый блок) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Фотографии номера (URL)
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={photoUrl}
								onChange={(e) => setPhotoUrl(e.target.value)}
								className="flex-1 border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
								placeholder="https://example.com/image.jpg"
							/>
							<button
								type="button"
								onClick={addPhotoToState}
								className="bg-teal-50 text-teal-600 p-3 rounded-xl hover:bg-teal-100 transition"
							>
								<Plus size={24} />
							</button>
						</div>
						{/* Список добавленных превью */}
						{newRoom.images.length > 0 && (
							<div className="flex gap-2 mt-3 overflow-x-auto pb-2">
								{newRoom.images.map((img, idx) => (
									<div key={idx} className="relative min-w-[80px] h-20">
										<img
											src={img}
											alt="preview"
											className="w-full h-full object-cover rounded-lg border border-gray-100"
										/>
										<button
											type="button"
											onClick={() => handleRemovePhoto(img)}
											className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
										>
											<X size={12} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
					{/* Название номера */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Тип номера
						</label>
						<input
							required
							type="text"
							value={newRoom.type}
							onChange={(e) =>
								setNewRoom({ ...newRoom, type: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							placeholder="Напр: Люкс, Стандарт"
						/>
					</div>

					{/* Вместимость и Цена */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Вместимость
							</label>
							<input
								required
								type="number"
								min="1"
								value={newRoom.capacity}
								onChange={(e) =>
									setNewRoom({
										...newRoom,
										capacity: Number(e.target.value),
									})
								}
								className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Цена за ночь
							</label>
							<input
								required
								type="number"
								value={newRoom.price}
								onChange={(e) =>
									setNewRoom({
										...newRoom,
										price: e.target.value,
									})
								}
								className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
								placeholder="3000"
							/>
						</div>
					</div>

					{/* Удобства */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Удобства (через запятую)
						</label>
						<input
							type="text"
							value={newRoom.amenities}
							onChange={(e) =>
								setNewRoom({
									...newRoom,
									amenities: e.target.value,
								})
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							placeholder="WiFi, Кондиционер, Завтрак"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
					>
						{isEditMode ? 'Сохранить изменения' : 'Создать номер'}
					</button>
				</form>
			</div>
		</div>
	);
};
