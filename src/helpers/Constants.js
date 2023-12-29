const MMConstants = {
    platformIos: 'ios',
    platformAndroid: 'android',
    emailRegex: '[a-z0-9]+@[a-z]+.[a-z]{2,3}',
    toastDuration: 3000,

    dateTimePickerTime: 'hh:mm A',

    otpTimeOut: 60000,

    screens: {
        login: 'Login',
        otpView: 'OTPView',
        signUp: 'SignUp',
        addEditBaby: 'AddEditBaby',
        logout: 'Logout',
        chapterList: 'ChapterList',
        chapterQuiz: 'ChapterQuiz',
        footer: 'Footer',
        header: 'Header',
        milestoneList: 'MilestoneList',
        milestoneQuiz: 'MilestoneQuiz',
        initialSetup: 'InitialSetup',
        templateList: 'TemplateList',
        mainTemplate: 'MainTemplate',
        order: 'Order',
        address: 'Address',
        addAddress: 'AddAddress',
        home: 'Home',
        bookPreview: 'BookPreview',
        profile: 'Profile'
    },

    chapters: {
        pregnancy: require('../assets/images/chapter/pregnancy.png'),
        adoption: require('../assets/images/chapter/adoption.png'),
        surrogacy: require('../assets/images/chapter/surrogacy.png'),
        mum: require('../assets/images/chapter/mum.png'),
        dad: require('../assets/images/chapter/dad.png'),
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
        rollover: require('../assets/images/milestone/rollover.png'),
        babble: require('../assets/images/milestone/babble.png'),
        situp: require('../assets/images/milestone/situp.png'),
        crawl: require('../assets/images/milestone/crawl.png'),
        tooth: require('../assets/images/milestone/tooth.png'),
        pulluptoStand: require('../assets/images/milestone/pulluptoStand.png'),
        steps: require('../assets/images/milestone/steps.png'),
        word: require('../assets/images/milestone/word.png'),
        solidmeal: require('../assets/images/milestone/solidmeal.png'),
        nightinownroom: require('../assets/images/milestone/nightinownroom.png'),
        continuoussleep: require('../assets/images/milestone/continuoussleep.png'),
        socialouting: require('../assets/images/milestone/socialouting.png'),
        familyholiday: require('../assets/images/milestone/familyholiday.png'),
        christmas: require('../assets/images/milestone/christmas.png'),
        easter: require('../assets/images/milestone/easter.png'),
        wave: require('../assets/images/milestone/wave.png'),
        mothersday: require('../assets/images/milestone/mothersday.png'),
        fathersday: require('../assets/images/milestone/fathersday.png'),
        ultrasound: require('../assets/images/milestone/ultrasound.png'),
        babymove: require('../assets/images/milestone/babymove.png'),
        bath: require('../assets/images/milestone/bath.png'),
        swim: require('../assets/images/milestone/swim.png'),
        birthday: require('../assets/images/milestone/birthday.png'),
        beachtrip: require('../assets/images/milestone/beachtrip.png'),
    },
    templates: {
        "Blank": require('../assets/images/template/Blank.png'),
        "Column2": require('../assets/images/template/Column2.png'),
        "Row2": require('../assets/images/template/Row2.png'),
        "Row2-Column2": require('../assets/images/template/Row2-Column2.png'),
        "Column2-Row": require('../assets/images/template/Column2-Row.png'),
        "Row-Column2": require('../assets/images/template/Row-Column2.png'),
        "Column-Row2": require('../assets/images/template/Column-Row2.png'),
        "Row2-Column": require('../assets/images/template/Row2-Column.png'),
        "Column1-Row3": require('../assets/images/template/Column1-Row3.png'),
        "Row3-Column1": require('../assets/images/template/Row3-Column1.png'),
        "Row1-Column3": require('../assets/images/template/Row1-Column3.png'),
        "Column3-Row1": require('../assets/images/template/Column3-Row1.png'),
        "Row3-Column3": require('../assets/images/template/Row3-Column3.png'),
        "Row4-Column4": require('../assets/images/template/Row4-Column4.png'),
    },
    familyMember: [
        { label: 'Father', value: 'father' },
        { label: 'Mother', value: 'mother' },
        { label: 'Daughter', value: 'daughter' },
        { label: 'Uncle', value: 'uncle' },
        { label: 'Aunt', value: 'aunt' },
        { label: 'Brother', value: 'brother' },
        { label: 'Sister', value: 'sister' },
        { label: 'Husband', value: 'husband' },
        { label: 'Wife', value: 'wife' },
    ],

    paddingMedium: 5,
    paddingLarge: 10,
    marginSmall: 5,
    marginMedium: 10,
    marginLarge: 20,
};

export default MMConstants;
