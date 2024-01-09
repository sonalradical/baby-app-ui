import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from 'react-native-paper';

import { validateAll } from 'indicative/validator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMEnums from '../../helpers/Enums';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOutlineButton, MMButton, MMTransparentButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMSurface from '../../components/common/Surface';
import MMImageBackground from '../../components/common/ImageBackground';
import MMAuthHeader from '../../components/common/AuthHeader';

export default function Login({ navigation }) {
    const theme = useTheme();
    const [isOverlayLoading, setOverlayLoading] = useState(false);
    const [passwordHide, setPasswordHide] = useState(true);
    const [deviceId, setDeviceId] = useState(null);
    const dispatch = useDispatch();

    const initState = {
        mobileNumber: '',
        password: '',
        errors: {},
    };
    const [state, setState] = useState(initState);

    useEffect(() => {
        async function bootstrapAsync() {
            setOverlayLoading(true);
            try {
                const deviceId = await MMUtils.getItemFromStorage(MMEnums.storage.deviceId);
                if (_.isNil(deviceId)) {
                    addNewDevice();
                } else {
                    // device exists in store
                    // MMUtils.consoleError(`Device: ${deviceId} found in mobile cache`);
                    setDeviceId(deviceId);
                }
            } catch (error) {
                MMUtils.consoleError(error);
            }
            setOverlayLoading(false);
        }
        bootstrapAsync();
    }, []);

    const addNewDevice = async () => {
        const deviceJSON = {
            deviceId: await DeviceInfo.getDeviceId(),
            deviceName: await DeviceInfo.getDeviceName(),
            brand: await DeviceInfo.getBrand(),
            manufacturer: await DeviceInfo.getManufacturer(),
            appName: await DeviceInfo.getApplicationName(),
            appBuildId: await DeviceInfo.getBuildNumber(),
            osName: await DeviceInfo.getBaseOs(),
            osVersion: await DeviceInfo.getVersion(),
            osBuildId: await DeviceInfo.getBuildId(),
            totalMemory: await DeviceInfo.getTotalMemory(),
            totalDiskStorage: await DeviceInfo.getFreeDiskStorage(),
            ipAddress: await DeviceInfo.getIpAddress(),
        };
        try {
            const { data } = await MMApiService.saveDevice(deviceJSON);
            if (data) {
                setOverlayLoading(false);
                setDeviceId(data);
                await MMUtils.setItemToStorage(MMEnums.storage.deviceId, data);
            }
        } catch (err) {
            setOverlayLoading(false);
            setState({
                ...state,
                errors: MMUtils.apiErrorParamMessages(err)
            });
        }
    }

    const onInputChange = (field, value) => {
        setState({
            ...state,
            [field]: value,
            errors: {
                ...state.errors,
                [field]: '',
            },
        });
    };

    const messages = {
        'mobileNumber.required': 'Please enter mobile no.',
        'mobileNumber.min': 'Mobile number must be 10 digits.',
        'password.required': 'Please enter password.',
        'password.min': 'Password should have a minimum of 8 characters.',
    };

    function onLoginWithPassword() {
        const rules = {
            mobileNumber: 'required|string|min:10',
            password: 'required|string|min:8|max:50',
        };
        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                const authTokan = MMUtils.encode(`${state.mobileNumber}:${state.password}`);
                const { data, error } = await MMApiService.userLoginWithPassword(authTokan, deviceId);
                if (data) {
                    const { accessToken, refreshToken, userDetail } = data;
                    const userDetails = {
                        accessToken,
                        refreshToken,
                        userDetail: {
                            ...userDetail,
                            childCount: userDetail.childCount ? userDetail.childCount : 0,
                            dueDate: userDetail.dueDate ? userDetail.dueDate : null
                        },
                    };
                    MMUtils.setItemToStorage(MMEnums.storage.accessToken, userDetails.accessToken);
                    MMUtils.setItemToStorage(MMEnums.storage.refreshToken, userDetails.refreshToken);
                    MMUtils.setItemToStorage(MMEnums.storage.userDetail, JSON.stringify(userDetails.userDetail));

                    dispatch(setLogin({
                        userDetail: userDetails.userDetail,
                        accessToken: userDetails.accessToken,
                        refreshToken: userDetails.refreshToken
                    }));
                }
                else {
                    setState({
                        ...state,
                        errors: error
                    });
                }
                setOverlayLoading(false);
            })
            .catch(errors => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
            });
    }

    function onLoginWithOTP() {
        Keyboard.dismiss();
        const rules = {
            mobileNumber: 'required|string|min:10'
        };
        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                const apiData = {
                    mobileNumber: state.mobileNumber
                };
                const { data, error } = await MMApiService.userLoginWithOTP(apiData);
                if (data) {
                    navigation.navigate('Otp', { mobileNumber: state.mobileNumber, deviceId: deviceId });
                }
                else {
                    setState({
                        ...state,
                        errors: error
                    });
                }
                setOverlayLoading(false);
            })
            .catch(errors => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
            });
    }

    const renderView = () => {
        return (
            <MMSurface margin={[0, 0, 0, 0]} style={styles(theme).surface}>
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <MMAuthHeader title='Get Started' />
                    <MMInput
                        label='Phone Number *'
                        maxLength={10}
                        value={state.mobileNumber}
                        onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                        placeholder="Enter Phone Number"
                        errorText={state.errors.mobileNumber}
                        name="mobileNumber"
                        keyboardType="phone-pad"
                    />
                    <MMInput
                        label='Password *'
                        maxLength={50}
                        value={state.password}
                        onChangeText={(value) => { onInputChange('password', value); }}
                        placeholder="Enter Password"
                        errorText={state.errors.password}
                        secureTextEntry={passwordHide}
                        name="password"
                        rightIcon={passwordHide ? 'eye-off' : 'eye'}
                        onPress={passwordHide ? () => setPasswordHide(false) : () => setPasswordHide(true)}
                    />

                    <MMButton label="Login" onPress={() => onLoginWithPassword()} />
                    <View style={{ alignItems: 'center', padding: MMConstants.paddingLarge }}>
                        <Text style={theme.fonts.default}>Or</Text>
                    </View>
                    <MMOutlineButton
                        label="Login With OTP"
                        mode='text'
                        onPress={() => { onLoginWithOTP() }}
                        width={'70%'}
                    ></MMOutlineButton>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <Text style={[theme.fonts.default, { marginVertical: MMConstants.marginMedium }]}>By continuing you agree to our </Text>
                    <Text style={[theme.fonts.default, { marginBottom: MMConstants.marginMedium }]}>
                        <Text style={{ color: theme.colors.primary }}> Terms of Services</Text> and
                        <Text style={{ color: theme.colors.primary }}> Privacy Policy</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={[theme.fonts.default]}>Need an account ? </Text>
                        <MMTransparentButton label='SIGN UP' onPress={() => navigation.navigate('SignUp', { deviceId: deviceId })} />
                    </View>
                </View>
            </MMSurface >
        );
    };

    return (
        <MMImageBackground>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMImageBackground>
    );
}

Login.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = (theme) => StyleSheet.create({
    surface: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        bottom: 0,
        position: 'absolute',
        backgroundColor: theme.colors.background
    }
});