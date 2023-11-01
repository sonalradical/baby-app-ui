import MMColors from "./Colors";

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
        bold: 'MaisonNeue-Bold',
        book: 'MaisonNeue-Book',
        wulkanDisplaymedium: 'Wulkan Display Medium',
        wulkanDisplayRegular: 'Wulkan Display Regular',
        tangerineregular: 'TangerineRegular',
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
    questionType: {
        radio: 'radio',
        checkbox: 'checkbox',
        text: 'text'
    },
    //AWS Base url
    AWS_S3_BASE_URL: 'https://skuvent-staging-field-inventory.s3.us-east-2.amazonaws.com',
    chapters: [
        { value: 'pregnancy', color: MMColors.orange, url: require('../assets/images/chapter/pregnancy.png') },
        { value: 'adoption', color: MMColors.purple, url: require('../assets/images/chapter/adoption.png') },
        { value: 'surrogacy', color: MMColors.lightPurple, url: require('../assets/images/chapter/surrogacy.png') },
        { value: 'parents', color: MMColors.orange, url: require('../assets/images/chapter/parents.png') },
        { value: 'family', color: MMColors.lightBlue, url: require('../assets/images/chapter/family.png') },
        { value: 'welcomeToTheWorld', color: MMColors.purple, url: require('../assets/images/chapter/welcomeToTheWorld.png') },
        { value: 'newborn', color: MMColors.orange, url: require('../assets/images/chapter/newborn.png') },
        { value: 'oneMonth', color: MMColors.lightBlue, url: require('../assets/images/chapter/oneMonth.png') },
        { value: 'twoMonths', color: MMColors.lightPurple, url: require('../assets/images/chapter/twoMonths.png') },
        { value: 'threeMonths', color: MMColors.orange, url: require('../assets/images/chapter/threeMonths.png') },
        { value: 'fourMonths', color: MMColors.lightPurple, url: require('../assets/images/chapter/fourMonths.png') },
        { value: 'fiveMonths', color: MMColors.orange, url: require('../assets/images/chapter/fiveMonths.png') },
        { value: 'sixMonths', color: MMColors.lightBlue, url: require('../assets/images/chapter/sixMonths.png') },
        { value: 'sevenMonths', color: MMColors.purple, url: require('../assets/images/chapter/sevenMonths.png') },
        { value: 'eightMonths', color: MMColors.orange, url: require('../assets/images/chapter/eightMonths.png') },
        { value: 'nineMonths', color: MMColors.lightBlue, url: require('../assets/images/chapter/nineMonths.png') },
        { value: 'tenMonths', color: MMColors.purple, url: require('../assets/images/chapter/tenMonths.png') },
        { value: 'elevenMonths', color: MMColors.lightPurple, url: require('../assets/images/chapter/elevenMonths.png') },
        { value: 'oneYear', color: MMColors.purple, url: require('../assets/images/chapter/oneYear.png') },
    ]
};

export default MMConstants;
