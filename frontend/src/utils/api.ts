import { API_BASE_URL } from '../components/constants/api_base_url';
import { ROUTES } from '../components/constants/route';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
	const url = endpoint.startsWith('http')
		? endpoint
		: `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
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
