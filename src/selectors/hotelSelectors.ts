import type { RootState } from '../store';

export const selectAllHotels = (state: RootState) => state.hotels.allHotels;
export const selectCities = (state: RootState) => state.hotels.cities;
