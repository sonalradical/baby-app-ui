import { combineReducers } from '@reduxjs/toolkit';

import AuthReducer from './Slice/AuthSlice';

const reducer = combineReducers({
	AuthReducer: AuthReducer.reducer,
});

const rootReducer = (state, action) => {
	return reducer(state, action);
};

export default rootReducer;
