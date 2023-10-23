import { configureStore } from '@reduxjs/toolkit';

import AuthReducer from '../Slice/AuthSlice';
import AppReducer from '../Slice/AppSlice';

export const store = configureStore({
	reducer: {
		AuthReducer: AuthReducer.reducer,
		AppReducer: AppReducer.reducer,
	}
});
