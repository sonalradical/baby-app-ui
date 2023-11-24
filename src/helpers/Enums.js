import Blank from "../screens/templates/Blank";
import Column2 from "../screens/templates/Column2";
import Column2Row from "../screens/templates/Column2-Row";
import Row2 from "../screens/templates/Row2";
import Row2Column2 from "../screens/templates/Row2-Column2";

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
        Row2: Row2,
        "Row2-Column2": Row2Column2,
        "Column2-Row": Column2Row
    }
};

export default MMEnums;