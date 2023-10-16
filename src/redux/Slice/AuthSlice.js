import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	auth: {
		isLoggedOut: false,
		isLoading: false,
		userDetail: null,
		accessToken: null,
	}
};

// slice
const AuthReducer = createSlice({
	name: 'AuthReducer',
	initialState: initialState,
	reducers: {
		setLogin: (state, action) => {
			state.auth = {
				...state.auth,
				isLoggedOut: false,
				userDetail: action.payload.userDetail,
				accessToken: action.payload.accessToken,
				isLoading: false
			};
		},
		setLogout: (state, action) => {
			state.auth = {
				...state.auth,
				isLoggedOut: true,
				userDetail: null,
				accessToken: null,
			};
		},
	},
});

export default AuthReducer;

export const {
	setLogin,
	setLogout
} = AuthReducer.actions;
