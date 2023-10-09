
const config = {
    dev: {
        baseApiUrl: 'http://192.168.1.117:4000/',
    }
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