import { useState } from 'react';
import { initialRoomState } from '../useManagerLogic';
import type { HotelFormFields, RoomFormFields } from '../../../../types/forms';
import type { ManagerFormsReturn } from '../../../../types/hooks';

export const useManagerForms = (
	initialHotel: HotelFormFields,
	initialRoom: RoomFormFields,
): ManagerFormsReturn => {
	const [newHotel, setNewHotel] = useState<HotelFormFields>(initialHotel);
	const [newRoom, setNewRoom] = useState<RoomFormFields>(initialRoomState);
	const [photoUrl, setPhotoUrl] = useState('');

	const resetHotel = () => setNewHotel(initialHotel);
	const resetRoom = () => setNewRoom(initialRoom);

	return {
		newHotel,
		setNewHotel,
		resetHotel,
		newRoom,
		setNewRoom,
		resetRoom,
		photoUrl,
		setPhotoUrl,
	};
};
