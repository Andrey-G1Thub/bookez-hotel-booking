export const apiFetch = async (url: string, options: RequestInit = {}) => {
	const token = localStorage.getItem('bookez_token');

	// const headers = {
	// 	'Content-Type': 'application/json',
	// 	...(token ? { Authorization: `Bearer ${token}` } : {}), // Добавляем токен, если он есть
	// 	...options.headers, // переопределяет заголовки
	// };

	//  объект заголовков
	const headers: Record<string, string> = {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...((options.headers as Record<string, string>) || {}),
	};

	//  Если body — это FormData, удаляем Content-Type, чтобы браузер поставил его сам
	if (options.body instanceof FormData) {
		delete headers['Content-Type'];
	} else if (!headers['Content-Type']) {
		// Для обычных JSON запросов ставим по умолчанию, если не задано
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, { ...options, headers });

	// разлогинивать пользователя
	if (response.status === 401) {
		localStorage.removeItem('bookez_token');
		window.location.href = '/login';
	}

	return response;
};
