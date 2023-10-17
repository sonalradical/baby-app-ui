const MMEnums = {
    responseStatusCodes: {
        Success: 200,
        BadRequest: 400,
        NotFound: 404,
        authentication: 401,
        NoDataFound: 108,
        RecordAlreadyExists: 121,
    },
    toastType: {
        default: 'default',
        error: 'error',
        info: 'info',
        success: 'success',
        warning: 'warning',
    },
};

export default MMEnums;