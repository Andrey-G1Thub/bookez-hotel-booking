const getApiUrl = () => {
	// Принудительно говорим TS рассматривать import.meta как any
	const meta = import.meta as any;

	// Теперь ошибки не будет
	if (meta.env && meta.env.MODE === 'development') {
		return 'http://localhost:5000/api';
	}

	return `${window.location.origin}/api`;
};

export const API_BASE_URL = getApiUrl();
