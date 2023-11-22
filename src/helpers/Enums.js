import Blank from "../screens/templates/Blank";
import Column2 from "../screens/templates/Column2";
import Row2 from "../screens/templates/Row2";

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
        text: 'text'
    },
    situation: {
        currentlyPregnant: 'currentlyPregnant'
    },
    Components: {
        Blank: Blank,
        Column2: Column2,
        Row2: Row2
    }
};

export default MMEnums;