import { combineReducers } from '@reduxjs/toolkit';

import AuthReducer from './Slice/AuthSlice';
import AppReducer from './Slice/AppSlice';

const reducer = combineReducers({
	AuthReducer: AuthReducer.reducer,
	AppReducer: AppReducer.reducer,
});

const rootReducer = (state, action) => {
	return reducer(state, action);
};

export default rootReducer;
