import type { FormEvent, JSX } from 'react';
import type { HotelFormFields } from './forms';
import type { Booking, City, Comments, Hotel, Room, User } from './models';

// Пропсы компонентов
export interface EnrichedBooking extends Booking {
	client?: {
		name: string;
		phone: string;
		_id?: string;
	} | null;
}
export interface HotelModalProps {
	newHotel: HotelFormFields & { imageFile?: File };
	setNewHotel: (value: React.SetStateAction<HotelFormFields>) => void;
	cities: City[];
	isModalOpen: boolean;
	setIsModalOpen: (open: boolean) => void;
	handleSaveHotel: (e: React.FormEvent) => void;
	isEditMode: boolean;
	handleRemovePhoto: (url: string) => void;
}
export interface RoomModalProps {
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
export interface DashboardHeaderProps {
	isAdmin: boolean;
	currentUser: User | null;
	myHotels: Hotel[];
	canAddHotel: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
}
export interface HotelCardInManagerPageProps {
	hotel: Hotel;
	cities: City[];
	setSelectedHotel: (hotel: Hotel | null) => void;
	handleDeleteHotel: (_id: string) => void;
	handleEditHotelClick: (hotel: Hotel) => void;
	handleOpenAddRoomModal: (hotel: Hotel) => void;
}
export interface ItemInCardManagerProps {
	hotel: Hotel;
	allBookings: EnrichedBooking[];
	handleDeleteRoom: (hotelId: string, roomId: string) => void;
	handleEditRoomClick: (hotel: Hotel, room: Room) => void;
	handleDeleteBooking: (bookingId: string) => void;
}

export interface BookingListProps {
	myBookings: EnrichedBooking[];
	isAdmin: boolean;
	handleDeleteBooking: (_id: string) => void;
}
//это старое название Props
export interface BookingFormProps {
	room: Room;
	hotel: Hotel;
	roomBookings: Booking[];
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	agreement: boolean;
	isPaying: boolean;
	setCheckIn: (val: string) => void;
	setCheckOut: (val: string) => void;
	setAgreement: (val: boolean) => void;
	handleBooking: (e: FormEvent<HTMLFormElement>) => void;
}
export interface PhotoPreviewProps {
	src: string | File;
	onRemove: () => void;
	isPrimary?: boolean;
}
export interface NotFoundPageProps {
	message?: string;
}
export interface HotelCardProps {
	hotel: Hotel;
}

export interface RatingProps {
	rating: number;
}
export interface PrivateRouteProps {
	children: JSX.Element;
	roles?: string[];
}
export interface WeatherResponse {
	name: string;
	main: {
		temp: number;
	};
	weather: Array<{
		description: string;
		icon: string;
	}>;
}
export interface LoadingSpinnerProps {
	message?: string;
}
export interface BookingCardProps {
	booking: Booking;
	variant: 'active' | 'canceled';
	actionButton?: React.ReactNode;
}
export interface CityModalProps {
	isOpen: boolean;
	onClose: () => void;
}
export interface RoomCardProps {
	room: Room;
}
export interface CommentFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export interface CommentItemProps {
	comment: Comments;
	canDelete: boolean;
	onDelete: (id: string | undefined) => void;
}
export interface CommentsClientProps {
	commentsRef: React.RefObject<HTMLDivElement | null>;
	comments: Comments[];
	canAddComment: boolean;
	handleAddComment: (e: React.FormEvent<HTMLFormElement>) => void;
	canDeleteComment: (comment: Comments) => boolean;
	handleDeleteComment: (commentId: string | undefined) => void;
}
export interface RoomItemProps {
	room: Room;
	hotel: Hotel;
	bookings: EnrichedBooking[];
	onEdit: (hotel: Hotel, room: Room) => void;
	onDeleteRoom: (hotelId: string, roomId: string) => void;
	onDeleteBooking: (bookingId: string) => void;
}
export interface BookingFormChildProps {
	room: Room;
	handleBooking: (e: FormEvent<HTMLFormElement>) => void;
	setCheckIn: (date: string) => void;
	checkIn: string;
	setCheckOut: (date: string) => void;
	checkOut: string;
	totalPrice: number;
	calculateNights: (start: string, end: string) => number;
	agreement: boolean;
	setAgreement: (val: boolean) => void;
	isPaying: boolean;
}
