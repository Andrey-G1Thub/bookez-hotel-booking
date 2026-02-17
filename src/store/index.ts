import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { bookingReducer } from './reducers/bookingReducer';
import { hotelReducer } from './reducers/hotelReducer';
import { userReducer } from './reducers/userReducer';

const rootReducer = combineReducers({
	bookings: bookingReducer,
	hotels: hotelReducer,
	users: userReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
