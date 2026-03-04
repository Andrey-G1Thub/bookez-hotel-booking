import { Plus, X } from 'lucide-react';
import type { Hotel, Room } from '../../../../store/reducers/hotelReducer';
import { getFullImageUrl } from '../../../../utils/getFullImageUrl';
import { PhotoPreview } from './component/PhotoPreview';

interface RoomModalProps {
	isRoomModalOpen: boolean;
	setIsRoomModalOpen: (open: boolean) => void;
	selectedHotel: Hotel | null;
	handleAddRoom: (e: React.FormEvent) => Promise<void>;
	newRoom: Omit<Room, '_id' | 'hotelId'> & { imageFile?: File };
	setNewRoom: React.Dispatch<React.SetStateAction<any>>;
	photoUrl: string;
	setPhotoUrl: (url: string) => void;
	isEditMode: boolean;
	handleRemovePhoto: (type: 'hotel' | 'room', url: string) => void;
}

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
	handleRemovePhoto,
}: RoomModalProps) => {
	if (!isRoomModalOpen) return null;

	const addPhotoToState = () => {
		if (!photoUrl.trim()) return;
		setNewRoom({
			...newRoom,
			images: [...newRoom.images, photoUrl],
		});
		setPhotoUrl('');
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
				<button
					onClick={() => setIsRoomModalOpen(false)}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<X size={24} />
				</button>

				<h2 className="text-2xl font-bold mb-1 text-gray-800">
					{isEditMode ? 'Редактировать номер' : 'Добавить номер'}
				</h2>
				<p className="text-sm text-gray-500 mb-6 border-b pb-2">
					Отель:{' '}
					<span className="font-semibold text-gray-700">
						{selectedHotel?.name}
					</span>
				</p>

				<div className="space-y-4 mb-6">
					{/* ЗАГРУЗКА С ПК */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Загрузить главное фото с ПК
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setNewRoom({ ...newRoom, imageFile: file });
								}
							}}
							className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
						/>
					</div>

					{/* ДОБАВЛЕНИЕ ПО ССЫЛКЕ */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Дополнительные фото (URL)
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={photoUrl}
								onChange={(e) => setPhotoUrl(e.target.value)}
								className="flex-1 border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="https://..."
							/>
							<button
								type="button"
								onClick={addPhotoToState}
								className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition"
							>
								<Plus size={24} />
							</button>
						</div>
					</div>

					{/* ПРЕВЬЮ ВСЕХ ФОТО */}
					<div className="flex flex-wrap gap-3 mt-2">
						{/* Локальное фото */}
						{newRoom.imageFile && (
							<PhotoPreview
								src={newRoom.imageFile}
								isPrimary={true}
								onRemove={() => {
									const { imageFile, ...rest } = newRoom;
									setNewRoom(rest);
								}}
							/>
						)}

						{/* Фото по ссылкам */}
						{newRoom.images?.map((img: string, idx: number) => (
							<PhotoPreview
								key={idx}
								src={img}
								onRemove={() => handleRemovePhoto('room', img)}
							/>
						))}
					</div>
				</div>

				<form onSubmit={handleAddRoom} className="space-y-4">
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
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="Напр: Люкс, Стандарт"
						/>
					</div>

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
								className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
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
									setNewRoom({ ...newRoom, price: e.target.value })
								}
								className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="3000"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Удобства (через запятую)
						</label>
						<input
							type="text"
							value={newRoom.amenities}
							onChange={(e) =>
								setNewRoom({ ...newRoom, amenities: e.target.value })
							}
							className="w-full border-gray-200 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="WiFi, Кондиционер, Завтрак"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-2"
					>
						{isEditMode ? 'Сохранить изменения' : 'Создать номер'}
					</button>
				</form>
			</div>
		</div>
	);
};
