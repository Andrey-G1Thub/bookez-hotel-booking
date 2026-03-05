// hooks/useManagerModals.ts
import { useState } from 'react';

export const useManagerModals = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
	const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

	return {
		modals: { isModalOpen, isRoomModalOpen, isEditMode },
		setModals: { setIsModalOpen, setIsRoomModalOpen, setIsEditMode },
		editing: { editingHotelId, setEditingHotelId, editingRoomId, setEditingRoomId },
	};
};
