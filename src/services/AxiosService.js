import axios from 'axios';
import * as _ from 'lodash';

import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';

// Defaults
axios.defaults.baseURL = 'http://192.168.1.117:4000/';


// Request interceptor
axios.interceptors.request.use(async (config) => {
    const token = await MMUtils.getToken();
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
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
    console.log(response.data, 'response')

    const { status, friendlyMassage, error } = response.data;
    switch (status) {
        case MMEnums.responseStatusCodes.Success:
            MMUtils.showToastMessage(friendlyMassage);
            return _.isNil(response.data) ? true : response.data;
        case MMEnums.responseStatusCodes.NotFound:
            MMUtils.showToastMessage(friendlyMassage);
            MMUtils.showToastMessage(error.message);
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
    else if (error.response.status === MMEnums.responseStatusCodes.NotFound) {
        const errorMessage = error.response.data.message;
        MMUtils.showToastMessage(errorMessage);
    }
    else {
        MMUtils.showToastMessage(error.message);
    }
    return null;
});