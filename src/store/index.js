import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { bookingReducer } from './reducers/bookingReducer';
import { hotelReducer } from './reducers/hotelReducer';
import { userReducer } from './reducers/userReducer';
import { roomReducer } from './reducers/roomReducer';

const rootReducer = combineReducers({
	bookings: bookingReducer,
	hotels: hotelReducer,
	users: userReducer,
	rooms: roomReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
