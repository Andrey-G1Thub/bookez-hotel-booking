import { ArrowUpDown, Plus, Search, Zap } from 'lucide-react';
import { HotelCard } from '../../components/hotelCard/HotelCard';
import { getMinDate } from '../../utils/helpers';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { fetchHotelsThunk } from '../../store/actions/hotelActions';
import { LoadingSpinner } from '../../components/componentsLoading/loadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAllHotels, selectCities } from '../../selectors/hotelSelectors';
import { selectBookingList } from '../../selectors/bookingSelectors';
import { selectCurrentUser } from '../../selectors';
import { ROLES } from '../../utils/permissions';
import type { SearchFilters } from '../../types/forms';
import { CityModal } from './component/cityModal';
import { fetchBookingsThunk } from '../../store/actions/bookingActions';

//  Главная страница с поиском и каталогом городов/отелей _/
export const HomePage = () => {
	const dispatch = useAppDispatch();
	const allHotels = useAppSelector(selectAllHotels);
	const cities = useAppSelector(selectCities);

	const currentUser = useAppSelector(selectCurrentUser);
	const bookingsList = useAppSelector(selectBookingList); //

	const [nameSearch, setNameSearch] = useState('');
	const [sortBy, setSortBy] = useState('rating'); // 'rating' или 'price'
	const [currentPage, setCurrentPage] = useState(1);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({
		cityId: null,
		checkIn: '',
		checkOut: '',
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isCityModalOpen, setIsCityModalOpen] = useState(false);

	const isAdmin = currentUser?.role === ROLES.ADMIN;

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			await Promise.all([
				dispatch(fetchHotelsThunk()),
				dispatch(fetchBookingsThunk()),
			]);
			setIsLoading(false);
		};
		loadData();
	}, [dispatch]);

	const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectedCity = cities.find((c) => c.name === e.target.value);
		setSearchFilters((prev) => ({ ...prev, cityId: selectedCity?._id || null }));
	};

	// 2. Логика кнопки "Найти" (с учетом дат)
	const handleSearch = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		setSearchFilters({
			cityId: cities.find((c) => c.name === formData.get('city'))?._id || null,
			checkIn: formData.get('checkIn') as string,
			checkOut: formData.get('checkOut') as string,
		});
	};

	const filteredAndSortedHotels = useMemo(() => {
		// быстрые фильтры (город, название)
		let result = allHotels.filter((h) => {
			const matchCity = !searchFilters.cityId || h.cityId === searchFilters.cityId;
			const matchName =
				!nameSearch || h.name.toLowerCase().includes(nameSearch.toLowerCase());
			return matchCity && matchName;
		});

		// фильтр по датам
		if (searchFilters.checkIn && searchFilters.checkOut) {
			const userStart = new Date(searchFilters.checkIn);
			const userEnd = new Date(searchFilters.checkOut);

			result = result.filter((hotel) =>
				hotel.rooms?.some((room) => {
					const roomBookings =
						bookingsList?.filter((b) => b.roomId === room._id) || [];
					return !roomBookings.some((b) => {
						const bStart = new Date(b.checkIn);
						const bEnd = new Date(b.checkOut);
						return userStart < bEnd && userEnd > bStart;
					});
				}),
			);
		}

		// Сортировка
		return result.sort((a, b) =>
			sortBy === 'price'
				? Number(a.priceFrom) - Number(b.priceFrom)
				: (b.rating || 0) - (a.rating || 0),
		);
	}, [allHotels, searchFilters, nameSearch, sortBy, bookingsList]);

	const hotelsPerPage = 9;
	const totalPages = Math.ceil(filteredAndSortedHotels.length / hotelsPerPage);
	const currentHotels = filteredAndSortedHotels.slice(
		(currentPage - 1) * hotelsPerPage,
		currentPage * hotelsPerPage,
	);
	if (isLoading) return <LoadingSpinner />;

	const onCitySelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		if (value === 'ADD_NEW_CITY_ACTION') {
			setIsCityModalOpen(true);
			e.target.value = '';
			return;
		}

		handleCityChange(e);
	};

	return (
		<main>
			{/* Секция Hero с Поиском */}
			<div className="relative h-96 accent-gradient flex items-center justify-center">
				<div className="w-full max-w-4xl p-4 md:p-8">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-xl">
						Бронируйте с Доверием
					</h1>

					{/* Модуль Поиска */}
					<form
						onSubmit={handleSearch}
						className="bg-white p-4 md:p-6 rounded-xl card-shadow flex flex-col md:flex-row gap-3"
					>
						<select
							name="city"
							onChange={onCitySelectChange}
							className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 bg-white"
							defaultValue=""
							required
						>
							{isAdmin && (
								<option
									value="ADD_NEW_CITY_ACTION"
									className="text-red-600 font-bold"
								>
									+ Добавить новый город
								</option>
							)}
							<option value="" disabled>
								Выберите город
							</option>
							{cities.map((city) => (
								<option key={city._id} value={city.name}>
									{city.name}
								</option>
							))}
						</select>

						<input
							type="date"
							name="checkIn"
							placeholder="Дата Заезда"
							className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
							min={getMinDate()}
							required
						/>
						<input
							type="date"
							name="checkOut"
							placeholder="Дата Выезда"
							className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
							min={getMinDate()}
							required
						/>
						<button
							type="submit"
							className="px-6 py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
						>
							<Zap className="w-5 h-5 inline mr-1 -mt-1" /> Найти
						</button>
					</form>
				</div>
				{/* </div> */}
			</div>

			<div className="max-w-7xl mx-auto px-4 mt-8">
				{/* ПАНЕЛЬ ДОПОЛНИТЕЛЬНЫХ ФИЛЬТРОВ */}
				<div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
					<div className="relative flex-grow">
						<Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Поиск по названию..."
							className="w-full pl-10 p-2 border rounded-md"
							value={nameSearch}
							onChange={(e) => {
								setNameSearch(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<ArrowUpDown className="w-5 h-5 text-gray-500" />
						<select
							className="p-2 border rounded-md bg-white"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
						>
							<option value="rating">По рейтингу</option>
							<option value="price">Сначала дешевые</option>
						</select>
					</div>
				</div>

				{/* СЕТКА ОТЕЛЕЙ */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{currentHotels.map((hotel) => (
						<HotelCard key={hotel._id} hotel={hotel} />
					))}
				</div>

				{/* ПАГИНАЦИЯ */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-10 gap-2">
						{Array.from({ length: totalPages }).map((_, i) => (
							<button
								// key={i}
								key={`page-${i + 1}`}
								onClick={() => setCurrentPage(i + 1)}
								className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
							>
								{i + 1}
							</button>
						))}
					</div>
				)}
			</div>
			{/* МОДАЛКА  */}
			<CityModal
				isOpen={isCityModalOpen}
				onClose={() => setIsCityModalOpen(false)}
			/>
		</main>
	);
};
