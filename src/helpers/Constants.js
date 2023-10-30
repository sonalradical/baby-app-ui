const MMConstants = {
    platformIos: 'ios',
    platformAndroid: 'android',
    emailRegex: '[a-z0-9]+@[a-z]+.[a-z]{2,3}',
    toastDuration: 3000,
    // serviceResult code
    ServiceResult: {
        Ok: 200,
        Unauthorized: 201,
        BadRequest: 400,
        AccessDenied: 403,
        NotFound: 404,
        ValidationError: 406,
        Timeout: 408,
        InternalServerError: 500,
        InsufficientStorage: 507,
    },
    // Storage
    storage: {
        userProfile: 'userProfile',
        deviceToken: 'deviceToken',
        apiPlaceholder: 'apiPlaceholder',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        userDetail: 'userDetail',
        selectedBaby: 'selectedBaby',

    },
    format: {
        dateTimePickerTime: 'hh:mm A',
    },
    fonts: {
        // new fonts
        black: 'Lexend-Black',
        bold: 'Lexend-Bold',
        extraBold: 'Lexend-ExtraBold',
        extraLight: 'Lexend-ExtraLight',
        light: 'Lexend-Light',
        medium: 'Lexend-Medium',
        regular: 'Lexend-Regular',
        semiBlod: 'Lexend-SemiBold',
    },
    reducerAction: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        userDetail: 'userDetail',
        getLookup: 'getLookup',
        userLogout: 'userLogout',
        login: 'login',
        notification: 'notification'
    },
    gender: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ],
    chapterChip: [
        { label: 'All', value: 'all' },
        { label: 'Pregnancy', value: 'pregnancy' },
        { label: 'Surrogacy', value: 'surrogacy' },
        { label: 'Adoption', value: 'adoption' },
        { label: '0-1 Year', value: 'zeroToOneYearChapter' }
    ],
    questionType: {
        radio: 'radio',
        checkbox: 'checkbox',
        text: 'text'
    },
    //AWS Base url
    AWS_S3_BASE_URL: 'https://skuvent-staging-field-inventory.s3.us-east-2.amazonaws.com',
};

export default MMConstants;
