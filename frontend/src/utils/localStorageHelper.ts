export const getInitialUser = () => {
	const saved = localStorage.getItem('bookez_user');
	if (!saved) return null;
	try {
		return JSON.parse(saved);
	} catch (e) {
		return null;
	}
};
