import axios from 'axios';
import * as _ from 'lodash';

import MMConfig from '../helpers/Config';
import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';

// Defaults
axios.defaults.baseURL = MMConfig().baseApiUrl;


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

    const { status, friendlyMassage } = response.data;
    switch (status) {
        case MMEnums.responseStatusCodes.Success:
            return _.isNil(response.data.data) ? true : response.data.data;
    }

    MMUtils.showToastError(friendlyMassage);

    return null;
}, async (error) => {
    console.log('API Response Error: ', error);
    return null;
});