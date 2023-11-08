import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selectedBaby: '',
	headerTitle: '',
	reloadChapterList: false,
	setReloadPage: false,
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
		setReloadPage: (state, action) => {
			state.reloadPage = action.payload;
		}

	},
});

export default AppReducer;

export const {
	setSelectedBabyId,
	setHeaderTitle,
	setReloadChapterList,
	setReloadPage
} = AppReducer.actions;
