import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

import { validateAll } from 'indicative/validator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOutlineButton, MMButton, MMTransparentButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMSurface from '../../components/common/Surface';
import MMImageBackground from '../../components/common/ImageBackground';
import MMEnums from '../../helpers/Enums';

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
                <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', paddingBottom: 15 }}>
                        <Text style={theme.fonts.headlineLarge}>Get Started</Text>
                    </View>

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
                        right={passwordHide ? (
                            <TextInput.Icon
                                color={theme.colors.primary}
                                icon='eye-off'
                                onPress={() => setPasswordHide(false)}
                            />
                        ) : <TextInput.Icon
                            color={theme.colors.primary}
                            icon='eye'
                            onPress={() => setPasswordHide(true)}
                        />}
                    />

                    <MMButton
                        label="Login"
                        onPress={() => onLoginWithPassword()}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={theme.fonts.default}>Or</Text>
                    </View>
                    <MMOutlineButton
                        label="Login With OTP"
                        mode='text'
                        onPress={() => { onLoginWithOTP() }}
                        width={'70%'}
                    ></MMOutlineButton>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[theme.fonts.default]}>By continuing you agree to our </Text>
                    <Text style={[theme.fonts.default]}>
                        <Text style={{ color: theme.colors.primary }}> Terms of Services</Text> and
                        <Text style={{ color: theme.colors.primary }}> Privacy Policy</Text></Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[theme.fonts.default, { paddingTop: 20 }]}>Need an account ?</Text>
                        <MMTransparentButton variant="none" transparent label='SIGN UP'
                            style={{ paddingTop: 12 }} onPress={() => navigation.navigate('SignUp')} />
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