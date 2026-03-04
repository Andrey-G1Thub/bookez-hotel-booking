import { SERVER_URL } from '../components/constants/serverUrl';

export const getFullImageUrl = (path: string | undefined) => {
	if (!path) return 'https://placehold.co/1200x450?text=No+Photo';
	if (path.startsWith('http') || path.startsWith('data:')) return path;
	return `${SERVER_URL}${path.startsWith('/') ? path : '/' + path}`;
};
