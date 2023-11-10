import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: '',
	header: '',
	reloadChapterList: false,
	reloadPage: false,
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
		}

	},
});

export default AppReducer;

export const {
	setBaby,
	setHeader,
	reloadChapterList,
	reloadPage
} = AppReducer.actions;
