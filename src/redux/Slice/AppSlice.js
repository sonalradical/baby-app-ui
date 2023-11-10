import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: '',
	header: '',
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
		setHeader: (state, action) => {
			state.header = action.payload;
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
	setHeader,
	setReloadChapterList,
	setReloadPage
} = AppReducer.actions;
