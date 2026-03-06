import { Plus, X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { PhotoPreview } from './component/PhotoPreview';
import type { HotelModalProps } from '../../../../types/components';

export const HotelModal = ({
	newHotel,
	setNewHotel,
	cities,
	isModalOpen,
	setIsModalOpen,
	handleSaveHotel,
	isEditMode,
	handleRemovePhoto,
}: HotelModalProps) => {
	const [hotelPhotoUrl, setHotelPhotoUrl] = useState<string>('');

	if (!isModalOpen) return null;

	const addPhoto = () => {
		if (!hotelPhotoUrl.trim()) return;
		setNewHotel((prev) => ({
			...prev,
			images: [...(prev.images || []), hotelPhotoUrl],
		}));
		setHotelPhotoUrl('');
	};
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewHotel({ ...newHotel, imageFile: file });
		}
	};

	const removeLocalFile = () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { imageFile, ...rest } = newHotel;
		setNewHotel(rest);
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
				<button
					onClick={() => setIsModalOpen(false)}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				>
					<X size={24} />
				</button>
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					{isEditMode ? 'Редактирование отеля' : 'Новый отель'}
				</h2>

				<div className="space-y-4 mb-6">
					{/* ЗАГРУЗКА С ПК */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Загрузить фото с ПК
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
						/>
					</div>

					{/* ССЫЛКА (URL) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Добавить по ссылке (URL)
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={hotelPhotoUrl}
								onChange={(e) => setHotelPhotoUrl(e.target.value)}
								className="flex-1 border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
								placeholder="https://..."
							/>
							<button
								type="button"
								onClick={addPhoto}
								className="bg-teal-50 text-teal-600 p-3 rounded-xl hover:bg-teal-100 transition"
							>
								<Plus size={24} />
							</button>
						</div>
					</div>

					<div className="flex flex-wrap gap-3 mt-2">
						{/* Локальное фото с ПК */}
						{newHotel.imageFile && (
							<PhotoPreview
								src={newHotel.imageFile}
								isPrimary={true}
								onRemove={removeLocalFile}
							/>
						)}

						{/* Фото из галереи (URL) */}
						{newHotel.images?.map((img, idx) => (
							<PhotoPreview
								key={idx}
								src={img}
								onRemove={() => handleRemovePhoto(img)}
							/>
						))}
					</div>
				</div>

				<form onSubmit={handleSaveHotel} className="space-y-4">
					{/* Поля формы */}
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
							className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-teal-500"
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
								setNewHotel({ ...newHotel, cityId: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option value="">Выберите город</option>
							{cities.map((city) => (
								<option key={city._id} value={city._id}>
									{city.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Мин. цена
						</label>
						<input
							required
							type="number"
							value={newHotel.priceFrom}
							onChange={(e) =>
								setNewHotel({ ...newHotel, priceFrom: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-teal-500"
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
								setNewHotel({ ...newHotel, description: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border outline-none h-24 focus:ring-2 focus:ring-teal-500"
						/>
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
