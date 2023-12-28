import axios from 'axios';
import * as _ from 'lodash';

import { store } from '../redux/Store/configureStores';
import { setLogin, setLogout } from '../redux/Slice/AuthSlice';

import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';
import MMConfig from '../helpers/Config';
import MMApiService from '../services/ApiService';

axios.defaults.baseURL = MMConfig().baseApiUrl;
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

axios.interceptors.response.use(
    async response => {
        console.log('call responce')
        return response?.data;
    },
    async error => {
        console.log('call')
        const originalRequest = error.config;
        if (error?.response) {
            const defaultErrorMessage = 'The server was not reachable or an internal server error occurred. Please close and re-open the app again.';
            const { status, data } = error.response;

            if (status === axios.HttpStatusCode.BadRequest) {
                console.log('mmmm')
                const { error } = data;
                if (_.isArray(error.message)) {
                    return { data: null, error: formatValidationError(error.message) }
                } else {
                    MMUtils.showToastMessage(error.message || defaultErrorMessage);
                }

            } else if (status === axios.HttpStatusCode.Unauthorized && !originalRequest._retry) {
                originalRequest._retry = true;

                const isTokenUpdated = await refreshTokens();
                if (isTokenUpdated) {
                    return await axios(originalRequest);
                } else {
                    MMUtils.removeItemFromStorage(MMEnums.storage.accessToken);
                    MMUtils.removeItemFromStorage(MMEnums.storage.userDetail);
                    dispatch(setLogout());

                    MMUtils.showToastMessage({ message: _.first(errors)?.msg || defaultErrorMessage });
                    return { data: null };
                }
            } else {
                const { error } = data;
                console.log("called else in erroe", error);
                MMUtils.showToastMessage(error.message || defaultErrorMessage);
            }

            return { data: null };
        }

        return { data: null };
    })

async function refreshTokens() {
    const state = getState();
    const { accessToken } = state.auth;
    let { refreshToken } = state.auth;

    if (isNull(accessToken) || isNull(refreshToken)) {
        return false;
    }

    // todo:: changes refresh code according new axios service
    const { data } = await MMApiService.getToken(refreshToken);
    if (data) {
        MMUtils.setItemToStorage(MMEnums.storage.accessToken, data.accessToken);
        dispatch(setLogin({ accessToken: data.accessToken }));
        return true;
    }

    return false;
}

const formatValidationError = (errors) => {
    const validationErrors = {};
    errors.map((err) => {
        validationErrors[err.param] = err.msg;
    });

    return validationErrors;
}