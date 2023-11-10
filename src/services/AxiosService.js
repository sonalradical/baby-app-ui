import axios from 'axios';
import * as _ from 'lodash';

import { useNavigation } from '@react-navigation/native';

import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';

// Defaults
axios.defaults.baseURL = 'http://localhost:4000/';


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
    console.log(response.data, 'response axioss')

    const { status, friendlyMassage, error } = response.data;
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
            const navigation = useNavigation();
            navigation.navigate('Logout');
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
    else if (error.response.status === MMEnums.ServiceResult.NotFound) {
        const errorMessage = error.response.data.message;
        MMUtils.showToastMessage(errorMessage);
    }
    else if (error.response.status === MMEnums.ServiceResult.UnAuthorized) {
        const navigation = useNavigation();
        navigation.navigate('Logout');
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