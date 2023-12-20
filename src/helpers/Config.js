const config = {
    dev: {
        baseApiUrl: 'http://192.168.1.108:4000/',
        AWS_S3_BASE_URL: 'https://mm-uat.s3.ap-southeast-2.amazonaws.com',
        REACT_APP_GOOGLE_PLACES_API_KEY: 'AIzaSyCA1aZSz1-4hIswnKPD5lHKA8NLbdKmrQI',
    },
};

const MMConfig = (env = 'dev') => {
    return MMConfigManual(env);
};

const MMConfigManual = (env) => {
    return config[env];
};

export default MMConfig;
export {
    MMConfigManual
};