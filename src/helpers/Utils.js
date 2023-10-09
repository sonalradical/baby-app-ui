import { BackHandler, Platform } from 'react-native';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from 'lodash';
import moment from 'moment';

import MMConstants from './Constants';

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
function showToastSuccess(msg) {
    Toast.show({
        status: 'success',
        title: msg,
        duration: MMConstants.toastDuration,
        isClosable: true
    });
}
function showToastError(error) {
    Toast.show({
        title: error,
        status: 'error',
        duration: MMConstants.toastDuration,
        isClosable: true
    });
}
function showToastInfo(title, body) {
    Toast.show({
        status: 'info',
        title: title,
        isClosable: true,
        variant: "subtle",
        description: body,
        placement: "top"

    });
}

// #endregion

// ------------------------------------------------------------------- For validateEmail Functions

function validateEmail(emailAddress) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAddress.match(regexEmail)) {
        return true;
    }
    return false;
}

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
    showToastSuccess,
    showToastError,
    showToastInfo,
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
    displayUtcDate
};
