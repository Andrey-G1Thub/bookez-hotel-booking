export const apiFetch = async (url: string, options: RequestInit = {}) => {
	const token = localStorage.getItem('bookez_token');

	// Настраиваем заголовки
	const headers = {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}), // Добавляем токен, если он есть
		...options.headers, // переопределяет заголовки
	};

	const response = await fetch(url, { ...options, headers });

	// разлогинивать пользователя
	if (response.status === 401) {
		localStorage.removeItem('bookez_token');
		window.location.href = '/login';
	}

	return response;
};
