import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: null,
	header: '',
	reloadChapterList: false,
	reloadPage: false,
	reloadBookPage: false,
	bookDetail: {
		productId: '',
		bookTitle: '',
		bookSubTitle: '',
		quantity: 1,
		totalPrice: ''
	},
	addressId: '',
	paymentId: ''
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
		},
		setBookDetail: (state, action) => {
			return {
				...state,
				bookDetail: { ...state.bookDetail, ...action.payload }
			}
		},
		setAddressId: (state, action) => {
			state.addressId = action.payload;
		},
		setPaymentId: (state, action) => {
			state.paymentId = action.payload;
		},
	},
});

export default AppReducer;

export const {
	setBaby,
	setHeader,
	reloadChapterList,
	reloadPage,
	reloadBookPage,
	setBookDetail,
	setAddressId,
	setPaymentId
} = AppReducer.actions;
