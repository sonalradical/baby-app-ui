import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selectedBaby: '',
};

// slice
const AppReducer = createSlice({
	name: 'AppReducer',
	initialState: initialState,
	reducers: {
		setSelectedBabyId: (state, action) => {
			state.selectedBaby = action.payload;
		},

	},
});

export default AppReducer;

export const {
	setSelectedBabyId,
} = AppReducer.actions;
