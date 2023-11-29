const config = {
    dev: {
        baseApiUrl: 'http://192.168.1.108:4000/',
        AWS_S3_BASE_URL: 'https://mm-uat.s3.ap-southeast-2.amazonaws.com',
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