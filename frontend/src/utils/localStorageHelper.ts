const savedUser = localStorage.getItem('bookez_user');

export const getInitialUser = () => {
	if (!savedUser || savedUser === 'undefined') return null;
	try {
		return JSON.parse(savedUser);
	} catch (e) {
		return null;
	}
};
