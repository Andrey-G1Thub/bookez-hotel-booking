import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { City } from '../../../../store/reducers/hotelReducer';
import type { HotelFormFields } from '../../../../types/forms';

interface HotelModalProps {
	newHotel: HotelFormFields;
	setNewHotel: (value: React.SetStateAction<HotelFormFields>) => void;
	cities: City[];
	isModalOpen: boolean;
	setIsModalOpen: (open: boolean) => void;
	handleSaveHotel: (e: React.FormEvent) => void;
	isEditMode: boolean;
	handleRemovePhoto: (url: string) => void;
}

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
	console.log('Доступные города в модалке:', cities);

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

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Ссылка на главное фото отеля
					</label>
					<div className="flex gap-4 items-center">
						<input
							type="text"
							value={hotelPhotoUrl}
							onChange={(e) => setHotelPhotoUrl(e.target.value)}
							className="flex-1 border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-teal-500 outline-none"
							placeholder="https://example.com/hotel.jpg"
						/>
						<button
							type="button"
							onClick={addPhoto}
							className="bg-teal-50 text-teal-600 p-3 rounded-xl hover:bg-teal-100 transition"
						>
							<Plus size={24} />
						</button>
					</div>

					{/* ПРЕВЬЮ ЗАГРУЖЕННЫХ ФОТО */}
					<div className="flex flex-wrap gap-2">
						{newHotel.images?.map((img, idx) => (
							<div key={idx} className="relative w-20 h-20">
								<img
									src={img}
									alt="Preview"
									className="w-full h-full rounded-lg object-cover border"
								/>
								<button
									type="button"
									onClick={() => handleRemovePhoto(img)}
									className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
								>
									<X size={12} />
								</button>
							</div>
						))}
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
							{cities.map((city) => (
								<option key={city._id} value={city._id}>
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
