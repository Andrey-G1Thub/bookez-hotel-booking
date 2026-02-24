import { useEffect, useState } from 'react';
import { CloudSun, MapPin } from 'lucide-react';

interface WeatherResponse {
	name: string;
	main: {
		temp: number;
	};
	weather: Array<{
		description: string;
		icon: string;
	}>;
}

export const WeatherWidget = () => {
	const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
	const [loading, setLoading] = useState(true); // Состояние загрузки

	useEffect(() => {
		fetch(
			'https://api.openweathermap.org/data/2.5/weather?q=Genichesk&units=metric&lang=ru&appid=08399ac1acb42de7366d5aef660f772a',
		)
			.then((res) => res.json())
			.then((data: WeatherResponse) => {
				setWeatherData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Weather error:', err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
				<div className="w-12 h-8 bg-gray-200 rounded-lg"></div>
				<div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
			</div>
		);
	}

	if (!weatherData || !weatherData.main) return null;

	const temp = Math.round(weatherData.main.temp);
	const description = weatherData.weather?.[0]?.description || 'Нет данных';
	const cityName = weatherData.name;

	return (
		<div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
			<div className="flex flex-col items-end">
				<span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
					<MapPin size={10} /> {cityName}
				</span>
				<span className="text-sm font-extrabold text-blue-600">{temp}°C</span>
			</div>
			<div className="h-8 w-[1px] bg-blue-200/50"></div>
			<div className="flex flex-col">
				<span className="text-[10px] font-medium text-blue-500 capitalize">
					{description}
				</span>
				<span className="text-[10px] text-blue-400 font-medium">
					{new Date().toLocaleString('ru', { day: 'numeric', month: 'short' })}
				</span>
			</div>
			<CloudSun className="text-blue-500 ml-1" size={20} />
		</div>
	);
};
