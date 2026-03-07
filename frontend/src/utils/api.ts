import { ROUTES } from '../components/constants/route';

export const apiFetch = async (url: string, options: RequestInit = {}) => {
	const token = localStorage.getItem('bookez_token');

	//  объект заголовков
	const headers: Record<string, string> = {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...((options.headers as Record<string, string>) || {}),
	};

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
		window.location.href = ROUTES.LOGIN;
	}

	return response;
};
