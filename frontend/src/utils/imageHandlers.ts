export const handleImageError = (
	e: React.SyntheticEvent<HTMLImageElement, Event>,
	placeholder = 'https://placehold.co/600x400?text=Room+Photo',
) => {
	const target = e.currentTarget;
	target.onerror = null;
	target.src = placeholder;
};
