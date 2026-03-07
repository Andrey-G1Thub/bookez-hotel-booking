import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { addCityThunk } from '../../../store/actions/cityActions';
import type { CityModalProps } from '../../../types/components';

export const CityModal = ({ isOpen, onClose }: CityModalProps) => {
	const dispatch = useAppDispatch();
	const [newCityData, setNewCityData] = useState({ name: '', description: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		const success = await dispatch(addCityThunk(newCityData));
		setIsSubmitting(false);

		if (success) {
			setNewCityData({ name: '', description: '' });
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
			<div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					Добавить новый город
				</h2>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Название
						</label>
						<input
							className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
							placeholder="Например: Бердянск"
							value={newCityData.name}
							onChange={(e) =>
								setNewCityData({ ...newCityData, name: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Описание
						</label>
						<textarea
							className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all min-h-[100px]"
							placeholder="Краткое описание города..."
							value={newCityData.description}
							onChange={(e) =>
								setNewCityData({
									...newCityData,
									description: e.target.value,
								})
							}
							required
						/>
					</div>
					<div className="flex gap-3 mt-8">
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-grow bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors disabled:bg-gray-400"
						>
							{isSubmitting ? 'Сохранение...' : 'Сохранить'}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
						>
							Отмена
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
