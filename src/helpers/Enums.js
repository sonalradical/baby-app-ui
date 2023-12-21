const MMEnums = {
    toastType: {
        default: 'default',
        error: 'error',
        info: 'info',
        success: 'success',
        warning: 'warning',
    },
    // serviceResult code
    ServiceResult: {
        Ok: 200,
        NotFound: 404,
        UnAuthorized: 401,
        BadRequest: 400,
        AccessDenied: 403,
        ValidationError: 406,
        Timeout: 408,
        InternalServerError: 500,
        InsufficientStorage: 507,
    },
    // Storage
    storage: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        userDetail: 'userDetail',
        selectedBaby: 'selectedBaby',

    },
    questionType: {
        radio: 'radio',
        checkbox: 'checkbox',
        text: 'text',
        textArea: 'textArea',
        textImage: 'textImage'
    },
    situation: {
        currentlyPregnant: 'currentlyPregnant',
        justGivenBirth: 'justGivenBirth',
        toddlerMum: 'toddlerMum',
        mumToMultiple: 'mumToMultiple'
    },
    addressType: {
        home: 'home',
        work: 'work',
        other: 'other'
    }
};

export default MMEnums;