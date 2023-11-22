import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: null,
	header: '',
	reloadChapterList: false,
	reloadPage: false,
	reloadBookPage: false,
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
		reloadChapterList: (state, action) => {
			state.reloadChapterList = action.payload;
		},
		reloadPage: (state, action) => {
			state.reloadPage = action.payload;
		},
		reloadBookPage: (state, action) => {
			state.reloadBookPage = action.payload;
		}

	},
});

export default AppReducer;

export const {
	setBaby,
	setHeader,
	reloadChapterList,
	reloadPage,
	reloadBookPage
} = AppReducer.actions;
