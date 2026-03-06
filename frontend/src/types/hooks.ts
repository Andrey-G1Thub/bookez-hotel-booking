// import type { RoomFormFields } from '../pages/managerPage/hooks/useManagerLogic';
import type { EnrichedBooking } from './components';
import type { HotelFormFields, RoomFormFields } from './forms';
import type { City, Hotel, Room, User } from './models';

// Тип для возвращаемого значения useManagerForms
export interface ManagerFormsReturn {
	newHotel: HotelFormFields;
	setNewHotel: React.Dispatch<React.SetStateAction<HotelFormFields>>;
	resetHotel: () => void;
	newRoom: RoomFormFields;
	setNewRoom: React.Dispatch<React.SetStateAction<RoomFormFields>>;
	resetRoom: () => void;
	photoUrl: string;
	setPhotoUrl: (url: string) => void;
}

// Тип для состояния модалок (useManagerModals)
export interface ManagerModalsReturn {
	modals: {
		isModalOpen: boolean;
		isRoomModalOpen: boolean;
		isEditMode: boolean;
	};
	setModals: {
		setIsModalOpen: (val: boolean) => void;
		setIsRoomModalOpen: (val: boolean) => void;
		setIsEditMode: (val: boolean) => void;
	};
	editing: {
		editingHotelId: string | null;
		setEditingHotelId: (id: string | null) => void;
		editingRoomId: string | null;
		setEditingRoomId: (id: string | null) => void;
	};
}

// ГЛАВНЫЙ ТИП: Что возвращает useManagerLogic
export interface ManagerLogicReturn {
	state: {
		currentUser: User | null;
		myHotels: Hotel[];
		cities: City[];
		enrichedBookings: EnrichedBooking[];
		selectedHotel: Hotel | null;
		isAdmin: boolean;
		canAddHotel: boolean;
		canAddRoom: boolean;
		// Из хука форм
		newHotel: HotelFormFields;
		newRoom: RoomFormFields;
		photoUrl: string;
		// Из хука модалок
		isModalOpen: boolean;
		isRoomModalOpen: boolean;
		isEditMode: boolean;
	};
	actions: {
		// Сеттеры
		setNewHotel: React.Dispatch<React.SetStateAction<HotelFormFields>>;
		setNewRoom: React.Dispatch<React.SetStateAction<RoomFormFields>>;
		setPhotoUrl: (url: string) => void;
		setIsModalOpen: (val: boolean) => void;
		setIsRoomModalOpen: (val: boolean) => void;
		setSelectedHotel: (hotel: Hotel | null) => void;

		// Обработчики
		handleDeleteHotel: (id: string) => Promise<void>;
		handleDeleteRoom: (hotelId: string, roomId: string) => Promise<void>;
		handleAddRoom: (e: React.FormEvent) => Promise<void>;
		handleSaveHotel: (e: React.FormEvent) => Promise<void>;
		handleEditHotelClick: (hotel: Hotel) => void;
		handleEditRoomClick: (hotel: Hotel, room: Room) => void;
		handleDeleteBooking: (bookingId: string) => Promise<void>;
		handleOpenAddRoomModal: (hotel: Hotel) => void;
		handleOpenCreateModal: () => void;
		handleAddHotelPhoto: (hotelId: string) => Promise<void>;
		handleRemovePhoto: (type: 'hotel' | 'room', urlToRemove: string) => Promise<void>;
	};
}
export interface UseHotelActionsDeps {
	newHotel: HotelFormFields;
	isEditMode: boolean;
	editingHotelId: string | null;
	currentUser: User | null;
	allHotels: Hotel[];
	setIsModalOpen: (open: boolean) => void;
	filteredBookings: EnrichedBooking[];
}
export interface UseRoomActionsDeps {
	allHotels: Hotel[];
	newRoom: RoomFormFields & { imageFile?: File };
	resetRoom: () => void;
	selectedHotel: Hotel | null;
	editing: {
		editingRoomId: string | null;
		setEditingRoomId: (id: string | null) => void;
	};
	modals: {
		isEditMode: boolean;
		isRoomModalOpen: boolean;
	};
	setModals: {
		setIsRoomModalOpen: (val: boolean) => void;
	};
	filteredBookings: EnrichedBooking[];
}
