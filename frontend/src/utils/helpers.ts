export const getMinDate = () => {
	const today = new Date();
	return today.toISOString().split('T')[0];
};
