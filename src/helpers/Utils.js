import { BackHandler, Platform } from 'react-native';

import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import * as _ from 'lodash';
import moment from 'moment';
import base64 from 'react-native-base64';

import MMConstants from './Constants';
import MMEnums from './Enums';
import MMConfig from './Config';
import { HttpStatusCode } from 'axios';

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
    return moment(date).format('DD/MM/yyyy');
}

function displayUtcDate(date) {
    return moment(`${date}Z`).format('DD/MM/yyyy');
}

function displayTime(dateTime) {
    return moment(`${dateTime}`).format('HH:mm');
}

function displayUtcTime(dateTime) {
    return moment(`${dateTime}Z`).format('HH:mm');
}

function displayFromNow(date) {
    return moment(date).fromNow(true);
}

function displayDateForPostApi(date) {
    return moment(date).format('yyyy-MM-DD');
}

function displayDateMonthYear(date) {
    return moment(date).format('Do [of] MMM YYYY');
}

function getDuration(date) {
    return moment.duration(moment(date).diff(getTodayDateTime()));
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
            textStyle: { padding: MMConstants.paddingMedium, textAlign: 'left' }
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
    const navigation = useNavigation();
    navigation.navigate('Logout');
}
// -------------------------------------------------------------- functions
function filterDataByQuery(data, query) {
    return _.filter(data, function (obj) {
        return _.some(query, function (val, key) {
            return _.get(obj, key)?.match(new RegExp(val, 'gi'));
        });
    });
}


function uploadPicture(picture, preSignedUrl) {
    const fileUri = isPlatformAndroid() ? picture.uri : picture.uri.replace('file:', '');
    const fileName = picture.fileName
    return uploadPictureToS3(preSignedUrl, fileUri, fileName);
};

function uploadPictureToS3(preSignedUrl, fileUri, fileName) {
    console.log(preSignedUrl, 'preSignedUrl')
    let result = {};

    // only xhr style works; axios and S3 doesn't seem to like each other.
    // todo: migrate this to use axios and/or use promises.
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', preSignedUrl);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === HttpStatusCode.Ok) {
                result = {
                    success: true
                };
            } else {
                result = {
                    success: false
                };
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'image/jpeg');
    xhr.send({
        uri: fileUri,
        type: 'image/jpeg',
        name: fileName
    });

    return result;
};

function getImagePath(picture) {
    return `${MMConfig().AWS_S3_BASE_URL}/${picture}`
}

const convertBelow100 = (n) => {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (n < 10) {
        return ones[n];
    } else if (10 <= n && n < 20) {
        return teens[n - 10];
    } else {
        return tens[Math.floor(n / 10)] + " " + ones[n % 10];
    }
};

const numberToWords = (num) => {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

    if (num === 0) {
        return "zero";
    }

    let result = "";

    if (num >= 1000) {
        result += ones[Math.floor(num / 1000)] + " thousand ";
        num %= 1000;
    }

    if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " hundred ";
        num %= 100;
        if (num > 0) {
            result += "and ";
        }
    }

    if (num > 0) {
        result += convertBelow100(num);
    }

    return result.trim();
};


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
    displayDateMonthYear,
    getDuration,
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
    parseMoment,
    parseDateTimeToMoment,
    handleBackButton,
    displayUtcTime,
    displayUtcDate,
    logout,
    filterDataByQuery,
    uploadPicture,
    uploadPictureToS3,
    getImagePath,
    numberToWords
};
