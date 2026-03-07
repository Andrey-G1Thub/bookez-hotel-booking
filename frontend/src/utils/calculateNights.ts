export const calculateNights = (
	checkIn: string | Date,
	checkOut: string | Date,
): number => {
	if (!checkIn || !checkOut) return 0;

	const start = new Date(checkIn).getTime();
	const end = new Date(checkOut).getTime();

	if (end <= start) return 0;

	const diffTime = end - start;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
