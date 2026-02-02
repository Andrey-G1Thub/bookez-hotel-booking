export const useHashRouter = () => {
	const [hash, setHash] = useState(window.location.hash.substring(1) || '');

	useEffect(() => {
		const handleHashChange = () => {
			setHash(window.location.hash.substring(1) || '');
		};
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	// Функция для навигации
	const navigate = useCallback((newHash) => {
		if (newHash.startsWith('/')) {
			newHash = newHash.substring(1);
		}
		window.location.hash = newHash;
	}, []);

	// Парсинг маршрута и параметров (например, 'city/1')
	const parts = hash.split('/').filter((p) => p);

	let route = '/';
	let params = {};

	if (parts.length === 1) {
		route = parts[0];
	} else if (parts[0] === 'city' && parts.length > 1) {
		route = 'cityDetails';
		params.cityId = parseInt(parts[1], 10);
	} else if (parts[0] === 'hotel' && parts.length > 1) {
		route = 'hotelDetails';
		params.hotelId = parseInt(parts[1], 10);
	} else if (parts[0] === 'room' && parts.length > 2) {
		route = 'roomBooking';
		params.roomId = parseInt(parts[2], 10);
	} else {
		route = hash;
	}

	return { route: route || '/', params, navigate };
};
