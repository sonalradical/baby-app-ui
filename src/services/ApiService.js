import axios from 'axios';


//------------------------------------------------------------------- Authentication APIs
//#region

async function userSignup(data) {
    const config = {
        url: `auth/register`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function verifyOTP(data) {
    const config = {
        url: `auth/verifyOTP`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function resendOTP(data) {
    const config = {
        url: `auth/resendOTP`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function userLoginWithPassword(authTokan) {
    const config = {
        url: `auth/login/${authTokan}`,
        method: 'post'
    };
    const result = await axios(config);
    return result;
}

async function userLoginWithOTP(data) {
    const config = {
        url: `auth/generateOTP`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function getLookupData() {
    const config = {
        url: `/lookup`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

//#endregion

//------------------------------------------------------------------- Manage User APIs

async function updateInItProfile(data) {
    const config = {
        url: `user/updateInitProfile`,
        method: 'put',
        data: data
    };
    const result = await axios(config);
    return result;
}

//#endregion

//------------------------------------------------------------------- Manage Baby APIs

async function babyList() {
    const config = {
        url: `baby/list`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

async function saveBaby(data) {
    const config = {
        url: `baby/save`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function getBabyById(babyId) {
    const config = {
        url: `baby/get/${babyId}`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

async function deleteBaby(babyId) {
    const config = {
        url: `baby/delete/${babyId}`,
        method: 'delete'
    };
    const result = await axios(config);
    return result;
}
//#end

//------------------------------------------------------------------- Manage Chapter APIs

async function getTypeList(babyId, type) {
    const config = {
        url: `chapter/list/${babyId}/${type}`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

//#end

//------------------------------------------------------------------ Quiz API

async function getQuiz(babyId, chapterId) {
    const config = {
        url: `quiz/get/${chapterId}/${babyId}`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

async function saveQuiz(data) {
    const config = {
        url: `quiz/save`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

//------------------------------------------------------------------ Book Preview API

async function getBookPreview(babyId) {
    const config = {
        url: `book/bookPreview/${babyId}`,
        method: 'post'
    };
    const result = await axios(config);
    return result;
}

async function getPagePreSignedUrl(babyId, fileName) {
    const config = {
        url: `page/getPreSignedUrl/${babyId}/${fileName}`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}


async function savePage(data) {
    const config = {
        url: `/page/save`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function deletePage(pageId) {
    const config = {
        url: `page/delete/${pageId}`,
        method: 'delete'
    };
    const result = await axios(config);
    return result;
}

//#end

//------------------------------------------------------------------ Product API

async function getProductList() {
    const config = {
        url: `product/list`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

//#end
//------------------------------------------------------------------ Image upload API

async function getPreSignedUrl(fileName) {
    const config = {
        url: `baby/getPreSignedUrl/${fileName}`,
        method: 'get'
    };
    const result = await axios(config);
    return result;
}

async function getFile(data) {
    const config = {
        url: `baby/getFile`,
        method: 'post',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function deleteFile(data) {
    const config = {
        url: `baby/deleteFile`,
        method: 'delete',
        data: data
    };
    const result = await axios(config);
    return result;
}

async function addInit() {
    const config = {
        url: `baby/addInit`,
        method: 'post',
    };
    const result = await axios(config);
    return result;
}
//#end
//------------------------------------------------------------------- Export All APIs
//#region
export default {
    userSignup,
    verifyOTP,
    resendOTP,
    userLoginWithPassword,
    userLoginWithOTP,
    getLookupData,
    updateInItProfile,
    babyList,
    addInit,
    getBabyById,
    saveBaby,
    deleteBaby,
    getTypeList,
    getQuiz,
    saveQuiz,
    getBookPreview,
    deletePage,
    savePage,
    getProductList,
    getPagePreSignedUrl,
    getPreSignedUrl,
    getFile,
    deleteFile,
};
//#endregion
