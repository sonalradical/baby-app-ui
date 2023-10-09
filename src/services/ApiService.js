import axios from 'axios';


//------------------------------------------------------------------- Authentication APIs
//#region

async function userSignup(data) {
    const config = {
        url: `auth/register`,
        method: 'post',
        data: data
    };
    console.log(config.url, config.data, 'data')
    console.log('API Request URL:,', config.url);
    const result = await axios(config);
    return result;
}

//#endregion

//------------------------------------------------------------------- Export All APIs
//#region
export default {
    userSignup
};
//#endregion
