export const getMinDate = () => {
	const today = new Date();
	// Используем 'T00:00:00' для нормализации даты до начала дня по местному времени
	return today.toISOString().split('T')[0];
};
