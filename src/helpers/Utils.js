import { BackHandler, Platform } from 'react-native';

import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from 'lodash';
import moment from 'moment';
import base64 from 'react-native-base64';

import MMConstants from './Constants';
import MMEnums from './Enums';

// ------------------------------------------------------------------- Device Functions
// #region
function isPlatformAndroid() {
    return Platform.OS === MMConstants.platformAndroid;
}

function isPlatformIos() {
    return Platform.OS === MMConstants.platformIos;
}
// #endregion

// ------------------------------------------------------------------- For Timepicker Functions
const getTodayDateTime = () => moment();

const getTodayUtcDateTime = () => moment().utc();

function displayDate(date) {
    return moment(date).format('MM/DD/yyyy');
}

function displayUtcDate(date) {
    return moment(`${date}Z`).format('MM/DD/yyyy');
}

function displayTime(dateTime) {
    return moment(`${dateTime}`).format('HH:mm');
}

function displayUtcTime(dateTime) {
    return moment(`${dateTime}Z`).format('HH:mm');
}

function displayFromNow(date) {
    return moment(date).fromNow();
}

function displayDateForPostApi(date) {
    return moment(date).format('yyyy-MM-DD');
}

function getNewDate() {
    return new Date();
}

function parseMoment(date) {
    return moment(date);
}

function parseDateTimeToMoment(dateTime) {
    return moment(`${dateTime}Z`);
}

function extractTimeSpan(dateValue) {
    const localDate = moment(dateValue).local();
    return { hours: localDate.hours(), minutes: localDate.minutes() }
}

function displayConsoleLog(msg, data) {
    return console.log(msg, data);
}

function handleBackButton() {
    BackHandler.exitApp();
    return true;
}

// #endregion

// ------------------------------------------------------------------- For showToast Functions
function showToastMessage(message, delay = 0, type = MMEnums.toastType.default) {
    // todo: need to pull it from theme.palette
    let bgColor = '';
    switch (type) {
        case MMEnums.toastType.error:
            bgColor = '#c62828';
            break;
        case MMEnums.toastType.info:
            bgColor = '#01579b';
            break;
        case MMEnums.toastType.success:
            bgColor = '#1b5e20';
            break;
        case MMEnums.toastType.warning:
            bgColor = '#e65100';
            break;
        case MMEnums.toastType.default:
        default:
            bgColor = '#0d0d0d';
            break;
    }

    Toast.show(message,
        {
            duration: MMConstants.toastDuration,
            delay: delay,
            containerStyle: { width: '90%', backgroundColor: bgColor },
            textStyle: { padding: 4, textAlign: 'left' }
        });
    return true;
};

function encode(value = null) {
    if (_.isNil(value)) {
        return base64.encode('null');
    }
    value = _.toString(value);
    return base64.encode(value);
}

function decode(value = null) {
    if (_.isNil(value)) {
        return base64.decode('null');
    }
    return base64.decode(value);
}

async function logout() {
    navigate('Logout');
}
// -------------------------------------------------------------- functions
function filterDataByQuery(data, query) {
    return _.filter(data, function (obj) {
        return _.some(query, function (val, key) {
            return _.get(obj, key)?.match(new RegExp(val, 'gi'));
        });
    });
}
// #endregion

// ------------------------------------------------------------------- For error handling Functions

function validateEmail(emailAddress) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAddress.match(regexEmail)) {
        return true;
    }
    return false;
}

function apiErrorParamMessages(error) {
    const errors = error?.response?.data?.errors;
    if (errors) {
        const formattedErrors = {};
        errors.forEach(error => formattedErrors[error.param] = error.msg);
        return formattedErrors;
    }
    return {};
};

function clientErrorMessages(errors) {
    const formattedErrors = {};
    errors.forEach(error => formattedErrors[error.field] = error.message);
    return formattedErrors;
};

function apiErrorMessage(error) {
    const errors = error?.response?.data?.errors;
    if (errors) {
        if (_.some(errors)) {
            const error = _.head(errors);
            if (error.param === null || error.param === 'Error') {
                Sentry.Native.captureException(error);
            }
            return error.msg;
        }
    }
    return '';
};

function consoleError(error) {
    console.error(error);
};

// #endregion

// ------------------------------------------------------------------- Storage Functions

async function setItemToStorage(key, value) {
    await AsyncStorage.setItem(key, value);
}

async function getItemFromStorage(key) {
    const value = await AsyncStorage.getItem(key);
    if (!_.isNil(value)) {
        return value;
    }
    return null;
}

async function clearStorage() {
    await AsyncStorage.clear();
}

async function getToken() {
    return await getItemFromStorage(MMConstants.storage.accessToken);
}

async function removeItemFromStorage(key) {
    await AsyncStorage.removeItem(key);
}

// #endregion

function formatString(stringToFormat, ...args) {
    const newString = stringToFormat.replace(/{(\d+)}/g, (match, index) => args[index]);
    return newString;
}

export default {
    displayFromNow,
    isPlatformAndroid,
    isPlatformIos,
    displayDateForPostApi,
    displayDate,
    displayTime,
    getTodayDateTime,
    getTodayUtcDateTime,
    getNewDate,
    extractTimeSpan,
    displayConsoleLog,
    showToastMessage,
    encode,
    decode,
    apiErrorParamMessages,
    clientErrorMessages,
    apiErrorMessage,
    consoleError,
    validateEmail,
    formatString,
    getItemFromStorage,
    setItemToStorage,
    clearStorage,
    removeItemFromStorage,
    getToken,
    parseMoment,
    parseDateTimeToMoment,
    handleBackButton,
    displayUtcTime,
    displayUtcDate,
    logout,
    filterDataByQuery
};
