import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selectedBaby: '',
	headerTitle: '',
	reloadChapterList: false,
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
		},
		setReloadChapterList: (state, action) => {
			state.reloadChapterList = action.payload;
		},

	},
});

export default AppReducer;

export const {
	setSelectedBabyId,
	setHeaderTitle,
	setReloadChapterList,
} = AppReducer.actions;
