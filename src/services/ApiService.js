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

//#endregion

//------------------------------------------------------------------- Export All APIs
//#region
export default {
    userSignup,
    verifyOTP,
};
//#endregion
