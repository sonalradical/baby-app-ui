import axios from 'axios';
import * as _ from 'lodash';

import { store } from '../redux/Store/configureStores';
import { setLogout } from '../redux/Slice/AuthSlice';

import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';
import MMConfig from '../helpers/Config';

// Defaults
axios.defaults.baseURL = 'http://localhost:4000/';

const { dispatch, getState } = store;

// Request interceptor
axios.interceptors.request.use(async (config) => {
    const { AuthReducer } = getState();
    const accessToken = AuthReducer.auth.accessToken;
    if (accessToken) {
        config.headers['Authorization'] = 'Bearer ' + accessToken;
    }
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers['Request-Type'] = 'application';

    return config;
}, (error) => {
    console.log('API Request Error: ', error);
    return Promise.reject(error);
});

// Response interceptor
axios.interceptors.response.use(async (response) => {

    const { status, friendlyMassage } = response.data;
    switch (status) {
        case MMEnums.ServiceResult.Ok:
            if (friendlyMassage) {
                MMUtils.showToastMessage(friendlyMassage);
            }
            return response.data;
        case MMEnums.ServiceResult.NotFound:
            MMUtils.showToastMessage(friendlyMassage);
            break;
        case MMEnums.ServiceResult.UnAuthorized:
            MMUtils.removeItemFromStorage(MMEnums.storage.accessToken);
            MMUtils.removeItemFromStorage(MMEnums.storage.userDetail);
            dispatch(setLogout());
            break;
        default:
            MMUtils.showToastMessage(friendlyMassage);
            return null;
    }

}, async (error) => {
    console.log('API Response Errors: ', error);
    if (error.message === 'Network Error') {
        // Handle network errors separately
        MMUtils.showToastMessage('Network Error: Please check your internet connection.');
    }
    else if (error.response.status === MMEnums.ServiceResult.NotFound) {
        const errorMessage = error.response.data.message;
        MMUtils.showToastMessage(errorMessage);
    }
    else if (error.response.status === MMEnums.ServiceResult.UnAuthorized) {
        MMUtils.removeItemFromStorage(MMEnums.storage.accessToken);
        MMUtils.removeItemFromStorage(MMEnums.storage.userDetail);
        dispatch(setLogout());
    }
    else if (error.response.status === MMEnums.ServiceResult.BadRequest) {
        const errorMessage = error.response.data.message;
        MMUtils.showToastMessage(errorMessage);
    }
    else {
        error.response.data.message ?
            MMUtils.showToastMessage(error.response.data.message) :
            MMUtils.showToastMessage(error.message);
    }
    return null;
});