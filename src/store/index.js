import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // не забудь установить: npm install redux-thunk
import { bookingReducer } from './reducers/bookingReducer';
import { hotelReducer } from './reducers/hotelReducer';
import { userReducer } from './reducers/userReducer';
import { roomReducer } from './reducers/roomReducer';

// 1. Объединяем редьюсеры
// Именно здесь рождается имя "bookings", которое ты видишь в useSelector
const rootReducer = combineReducers({
	bookings: bookingReducer, // Ветка state.bookings
	hotels: hotelReducer, // Ветка state.hotels
	users: userReducer,
	rooms: roomReducer,
});

// 2. Создаем стор с поддержкой Thunk
export const store = createStore(rootReducer, applyMiddleware(thunk));
