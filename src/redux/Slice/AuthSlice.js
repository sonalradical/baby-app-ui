import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	auth: {
		isLoggedOut: false,
		isLoading: false,
		userDetail: null,
		accessToken: null,
		refreshToken: null,
	},
	lookupData: []
};

// slice
const AuthReducer = createSlice({
	name: 'AuthReducer',
	initialState: initialState,
	reducers: {
		setLogin: (state, action) => {
			return {
				...state,
				auth: { ...state.auth, ...action.payload }
			}
		},
		setLogout: (state, action) => {
			state.auth = {
				...state.auth,
				isLoggedOut: true,
				userDetail: null,
				accessToken: null,
				refreshToken: null
			};
		},
		setLookupData: (state, action) => {
			state.lookupData = action.payload;
		}
	},
});

export default AuthReducer;

export const {
	setLogin,
	setLogout,
	setLookupData
} = AuthReducer.actions;
