import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotFoundPage } from '../notFoundPage/NotFoundPage';
import { addBookingThunk } from '../../store/actions/bookingActions';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { AppDispatch } from '../../store/index';
import { selectCurrentUser } from '../../selectors/userSelectors';
import { useAppSelector } from '../../store/hooks';
import { selectAllHotels } from '../../selectors/hotelSelectors';
import { selectBookingList } from '../../selectors/bookingSelectors';
import { BookingSkeleton } from '../../components/componentsLoading/BookingSkeletron';
import { calculateNights } from '../../utils/calculateNights';
import { ComponentRoomBookingPage } from './componentRoomBookingPage/ComponentRoomBookingPage';
import { NAVIGATION_CONFIG } from '../../components/constants/navigation';
import { checkDateOverlap } from '../../utils/dataHelpers';
import type { Hotel, Room } from '../../store/reducers/hotelReducer';
import type { Booking } from '../../store/reducers/bookingReducer';

// Страница бронирования конкретного номера _/;
export const RoomBookingPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();

	const currentUser = useAppSelector(selectCurrentUser);
	const allHotels = useAppSelector(selectAllHotels);
	const bookings = useAppSelector(selectBookingList) || [];

	const [isLoading, setIsLoading] = useState(true);
	//  состояния для дат и итоговой цены
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [isPaying, setIsPaying] = useState(false);
	const [agreement, setAgreement] = useState(false);

	const hotel = useMemo<Hotel | undefined>(
		() => allHotels.find((h) => String(h.id) === String(hotelId)),
		[allHotels, hotelId],
	);
	const room = useMemo<Room | undefined>(
		() => hotel?.rooms?.find((r) => String(r.id) === String(roomId)),
		[hotel, roomId],
	);
	const roomBookings = useMemo<Booking[]>(() => {
		if (!room) return [];
		return bookings.filter(
			(b: Booking) => Number(b.roomId) === room.id && b.status === 'Подтверждено',
		);
	}, [bookings, room]);

	useEffect(() => {
		//  загрузку 800мс для скелетрона
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (checkIn && checkOut && room) {
			const nights = calculateNights(checkIn, checkOut);
			if (nights > 0) {
				setTotalPrice(nights * room.price);
			} else {
				setTotalPrice(room.price);
			}
		}
	}, [checkIn, checkOut, room]);

	const displayHotelId = hotelId || 'не указан';
	const displayRoomId = roomId || 'не указан';

	if (isLoading || allHotels.length === 0) {
		return <BookingSkeleton />;
	}
	// Если отель или комната не найдены
	if (!hotel || !room) {
		return (
			<NotFoundPage
				message={`Отель #${displayHotelId} или номер #${displayRoomId} не найден.`}
			/>
		);
	}

	const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!currentUser) {
			alert('Пожалуйста, войдите в систему, чтобы забронировать номер.');
			navigate('/login');
			return;
		}
		if (!agreement) {
			alert('Пожалуйста, подтвердите согласие с условиями оферты.');
			return;
		}

		const formData = new FormData(e.currentTarget);
		const checkIn = formData.get('checkIn') as string;
		const checkOut = formData.get('checkOut') as string;

		const overlapResult = checkDateOverlap(checkIn, checkOut, roomBookings);
		if (overlapResult.overlap) {
			alert(overlapResult.message);
			return;
		}
		setIsPaying(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			// Создание новой брони с привязкой по ID
			const newBooking = {
				id: Date.now(),
				userId: currentUser.id,
				hotelId: hotel.id,
				roomId: room.id,
				hotelName: hotel.name,
				roomType: room.type,
				checkIn,
				checkOut,
				price: totalPrice,
				status: 'Подтверждено' as const,
			};

			await dispatch(addBookingThunk(newBooking));
			alert(
				`Сумма к оплате зафиксирована успешно! Номер "${room.type}" забронирован. Скоро с Вами свяжется менеджер нашего отеля.`,
			);
			const myBookingsPath =
				NAVIGATION_CONFIG.find((item) => item.title === 'Мои Брони')?.path ||
				'/bookings';
			navigate(myBookingsPath);
		} catch (error) {
			alert('Ошибка при оплате. Попробуйте еще раз.');
		} finally {
			setIsPaying(false);
		}
	};

	return (
		<ComponentRoomBookingPage
			room={room}
			hotel={hotel}
			roomBookings={roomBookings}
			setCheckIn={setCheckIn}
			handleBooking={handleBooking}
			checkIn={checkIn}
			setCheckOut={setCheckOut}
			checkOut={checkOut}
			totalPrice={totalPrice}
			agreement={agreement}
			setAgreement={setAgreement}
			isPaying={isPaying}
		/>
	);
};
