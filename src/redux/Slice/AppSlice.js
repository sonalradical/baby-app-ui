import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: '',
	headerTitle: '',
	reloadChapterList: false,
	setReloadPage: false,
};

// slice
const AppReducer = createSlice({
	name: 'AppReducer',
	initialState: initialState,
	reducers: {
		setBaby: (state, action) => {
			state.baby = action.payload;
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
	setBaby,
	setHeaderTitle,
	setReloadChapterList,
	setReloadPage
} = AppReducer.actions;
