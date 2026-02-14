import { X } from 'lucide-react';

export const HotelModal = ({
	selectedHotel,
	newHotel,
	setNewHotel,
	cities,
	photoUrl,
	setPhotoUrl,
	isModalOpen,
	setIsModalOpen,
	handleDeleteHotelPhoto,
	handleAddHotelPhoto,
	handleSaveHotel,
	isEditMode,
}) => {
	if (!isModalOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
				<button
					onClick={() => setIsModalOpen(false)}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				>
					<X size={24} />
				</button>
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					{isEditMode ? 'Редактирование отеля' : 'Новый отель'}
				</h2>

				{/* Секция управления фото отеля внутри модалки */}
				<div className="mt-4 p-3 bg-gray-50 rounded-xl">
					<p className="text-xs font-bold text-gray-400 mb-2 uppercase">
						Фотографии объекта:
					</p>
					<div className="flex flex-wrap gap-2 mb-3">
						{/* ИСПОЛЬЗУЕМ selectedHotel вместо hotel */}
						{selectedHotel?.images?.map((img: string) => (
							<div key={img} className="relative group w-16 h-16">
								<img
									src={img}
									className="w-full h-full object-cover rounded-lg"
									alt=""
								/>
								<button
									onClick={() =>
										handleDeleteHotelPhoto(selectedHotel.id, img)
									}
									className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
								>
									<X size={12} />
								</button>
							</div>
						))}
					</div>
					<div className="flex gap-2">
						<input
							type="text"
							value={photoUrl}
							placeholder="URL картинки"
							className="flex-1 text-xs border p-2 rounded-lg"
							onChange={(e) => setPhotoUrl(e.target.value)}
						/>
						<button
							type="button" // Важно, чтобы форма не отправлялась
							onClick={() => handleAddHotelPhoto(selectedHotel.id)}
							className="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs"
						>
							Добавить
						</button>
					</div>
				</div>

				<form onSubmit={handleSaveHotel} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Название
						</label>
						<input
							required
							type="text"
							value={newHotel.name}
							onChange={(e) =>
								setNewHotel({ ...newHotel, name: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							placeholder="Напр: Морской Бриз"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Город
						</label>
						<select
							required
							value={newHotel.cityId}
							onChange={(e) =>
								setNewHotel({
									...newHotel,
									cityId: e.target.value,
								})
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
						>
							<option value="">Выберите город</option>
							{cities.map((city: any) => (
								<option key={city.id} value={city.id}>
									{city.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Минимальная цена (за ночь)
						</label>
						<input
							required
							type="number"
							value={newHotel.priceFrom}
							onChange={(e) =>
								setNewHotel({
									...newHotel,
									priceFrom: e.target.value,
								})
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							placeholder="5000"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Описание
						</label>
						<textarea
							required
							value={newHotel.description}
							onChange={(e) =>
								setNewHotel({
									...newHotel,
									description: e.target.value,
								})
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none h-24"
							placeholder="Коротко об отеле..."
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Ссылка на главное фото отеля
						</label>
						<div className="flex gap-4 items-center">
							<input
								type="text"
								value={newHotel.images?.[0] || ''}
								onChange={(e) =>
									setNewHotel({
										...newHotel,
										images: [e.target.value],
									})
								}
								className="flex-1 border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
								placeholder="https://example.com/photo.jpg"
							/>
							{newHotel.images?.[0] && (
								<img
									src={newHotel.images[0]}
									alt="Preview"
									className="w-12 h-12 rounded-lg object-cover border"
								/>
							)}
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
					>
						{isEditMode ? 'Обновить данные' : 'Создать отель'}
					</button>
				</form>
			</div>
		</div>
	);
};
