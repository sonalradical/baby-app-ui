import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	baby: null,
	header: '',
	reloadChapterList: false,
	reloadPage: false,
	reloadBookPage: false,
	reloadAddressPage: true,
	bookDetail: {
		productId: '',
		bookTitle: 'Birthday',
		bookSubTitle: '',
		quantity: 1,
		totalPrice: '',
		productName: '',
		productImage: ''
	},
	addressId: '',
	paymentId: '123'
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
		reloadAddressPage: (state, action) => {
			state.reloadAddressPage = action.payload;
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
	reloadAddressPage,
	setBookDetail,
	setAddressId,
	setPaymentId
} = AppReducer.actions;
