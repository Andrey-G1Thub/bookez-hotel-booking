export interface City {
	id: string;
	name: string;
}

export interface Hotel {
	id: string;
	name: string;
	city: string;
	pricePerNight: number;
	rating: number;
	imageUrl: string;
	description: string;
}

export interface Booking {
	id: string;
	hotelId: string;
	userId: string;
	checkIn: string; // ISO формат даты
	checkOut: string;
	totalPrice: number;
}
