import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from 'react-native-paper';

import { validateAll } from 'indicative/validator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

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
    const dispatch = useDispatch();

    const initState = {
        mobileNumber: '',
        password: '',
        errors: {},
    };
    const [state, setState] = useState(initState);

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
            password: 'required|string|min:8|max:8',
        };
        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                const authTokan = MMUtils.encode(`${state.mobileNumber}:${state.password}`);
                await MMApiService.userLoginWithPassword(authTokan)
                    .then(function (response) {

                        const responseData = response.data;
                        if (responseData) {
                            const { accessToken, userDetail } = responseData;
                            const userDetails = {
                                accessToken,
                                userDetail: {
                                    _id: userDetail._id,
                                    mobileNumber: userDetail.mobileNumber,
                                    name: userDetail.name,
                                    email: userDetail.email,
                                    password: userDetail.password,
                                    gender: userDetail.gender,
                                    childCount: userDetail.childCount ? userDetail.childCount : 0
                                },
                            };
                            MMUtils.setItemToStorage(MMEnums.storage.accessToken, userDetails.accessToken);
                            MMUtils.setItemToStorage(MMEnums.storage.userDetail, JSON.stringify(userDetails.userDetail));

                            dispatch(setLogin({ userDetail: userDetails.userDetail, accessToken: userDetails.accessToken }));
                        }

                    })
                    .catch(function (error) {
                        setState({
                            ...state,
                            errors: MMUtils.apiErrorParamMessages(error)
                        });
                    });
                setOverlayLoading(false);
            })
            .catch(errors => {
                console.log("Validation Errors:", errors);
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

                await MMApiService.userLoginWithOTP(apiData)
                    .then(function (response) {
                        if (response) {
                            navigation.navigate('Otp', { mobileNumber: state.mobileNumber });
                        }

                    })
                    .catch(function (error) {
                        setState({
                            ...state,
                            errors: MMUtils.apiErrorParamMessages(error)
                        });
                    })
                setOverlayLoading(false);
            })
            .catch(errors => {
                console.log("Validation Errors:", errors);
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
                    <MMAuthHeader title='Get started' />
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
                        maxLength={8}
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
                        <MMTransparentButton label='SIGN UP' onPress={() => navigation.navigate('SignUp')} />
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