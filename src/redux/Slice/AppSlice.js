import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selectedBaby: '',
	headerTitle: '',
};

// slice
const AppReducer = createSlice({
	name: 'AppReducer',
	initialState: initialState,
	reducers: {
		setSelectedBabyId: (state, action) => {
			state.selectedBaby = action.payload;
		},
		setHeaderTitle: (state, action) => {
			state.headerTitle = action.payload;
		}

	},
});

export default AppReducer;

export const {
	setSelectedBabyId,
	setHeaderTitle,
} = AppReducer.actions;
