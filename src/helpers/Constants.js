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
    babyCategory: [
        { value: 'adoption', label: 'Adoption' },
        { value: 'surrogacy', label: 'Surrogacy' },
        { value: 'twins', label: 'Twins' }
    ],
    questionType: {
        radio: 'radio',
        checkbox: 'checkbox',
        text: 'text'
    },
    //AWS Base url
    AWS_S3_BASE_URL: 'https://skuvent-staging-field-inventory.s3.us-east-2.amazonaws.com',
    chapters: {
        pregnancy: require('../assets/images/chapter/pregnancy.png'),
        adoption: require('../assets/images/chapter/adoption.png'),
        surrogacy: require('../assets/images/chapter/surrogacy.png'),
        parents: require('../assets/images/chapter/parents.png'),
        family: require('../assets/images/chapter/family.png'),
        welcomeToTheWorld: require('../assets/images/chapter/welcomeToTheWorld.png'),
        newborn: require('../assets/images/chapter/newborn.png'),
        oneMonth: require('../assets/images/chapter/oneMonth.png'),
        twoMonths: require('../assets/images/chapter/twoMonths.png'),
        threeMonths: require('../assets/images/chapter/threeMonths.png'),
        fourMonths: require('../assets/images/chapter/fourMonths.png'),
        fiveMonths: require('../assets/images/chapter/fiveMonths.png'),
        sixMonths: require('../assets/images/chapter/sixMonths.png'),
        sevenMonths: require('../assets/images/chapter/sevenMonths.png'),
        eightMonths: require('../assets/images/chapter/eightMonths.png'),
        nineMonths: require('../assets/images/chapter/nineMonths.png'),
        tenMonths: require('../assets/images/chapter/tenMonths.png'),
        elevenMonths: require('../assets/images/chapter/elevenMonths.png'),
        oneYear: require('../assets/images/chapter/oneYear.png'),
    },
    milestones: {
        smile: require('../assets/images/milestone/smile.png'),
        laugh: require('../assets/images/milestone/laugh.png'),
        timeRolledOver: require('../assets/images/milestone/timeRolledOver.png'),
        timeBabbled: require('../assets/images/milestone/timeBabbled.png'),
        timeSittingUp: require('../assets/images/milestone/timeSittingUp.png'),
        timeCrawling: require('../assets/images/milestone/timeCrawling.png'),
        tooth: require('../assets/images/milestone/tooth.png'),
        timePullingUpToStand: require('../assets/images/milestone/timePullingUpToStand.png'),
        steps: require('../assets/images/milestone/steps.png'),
        word: require('../assets/images/milestone/word.png'),
        solidMeal: require('../assets/images/milestone/solidMeal.png'),
        nightInOwnRoom: require('../assets/images/milestone/nightInOwnRoom.png'),
        sleptThroughTheNight: require('../assets/images/milestone/sleptThroughTheNight.png'),
        socialOuting: require('../assets/images/milestone/socialOuting.png'),
        familyHoliday: require('../assets/images/milestone/familyHoliday.png'),
        christmas: require('../assets/images/milestone/christmas.png'),
        easter: require('../assets/images/milestone/easter.png'),
        wavedHelloGoodbye: require('../assets/images/milestone/wavedHelloGoodbye.png'),
        mothersDay: require('../assets/images/milestone/mothersDay.png'),
        fathersDay: require('../assets/images/milestone/fathersDay.png'),
        ultraSound: require('../assets/images/milestone/ultraSound.png'),
        babyMoveKick: require('../assets/images/milestone/babyMoveKick.png'),
    }
};

export default MMConstants;
