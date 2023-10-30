import React, { useState } from 'react';
import { Image, View, Text, Dimensions, StyleSheet, Keyboard } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

import { validateAll } from 'indicative/validator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMOutlineButton, MMRoundButton, MMTransparentButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';

export default function Login({ navigation }) {
    const theme = useTheme();
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
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

    const onLogin = (loginType) => {
        Keyboard.dismiss();

        const messages = {
            'mobileNumber.required': 'Please enter mobile no.',
            'mobileNumber.min': 'Mobile number must be 10 digits.',
            'password.required': 'Please enter password.',
            'password.min': 'Password should have a minimum of 8 characters.',
        };

        const rules = loginType === 'password' ? {
            mobileNumber: 'required|string|min:10',
            password: 'required|string|min:8|max:8',
        } : {
            mobileNumber: 'required|string|min:10'
        };

        validateAll(state, rules, messages)
            .then(() => {
                setIsOverlayLoading(true);
                if (loginType === 'password') {
                    onLoginWithPassword();
                } else {
                    onLoginWithOTP();
                }
            })
            .catch(errors => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
            });
    };

    async function onLoginWithPassword() {
        try {
            const authTokan = MMUtils.encode(`${state.mobileNumber}:${state.password}`);

            await MMApiService.userLoginWithPassword(authTokan)
                .then(function (response) {

                    const responseData = response.data;
                    if (responseData) {
                        const { accessToken, mobileNumber, name, email, password, gender } = responseData;
                        const userDetail = {
                            accessToken,
                            userDetail: {
                                mobileNumber,
                                name,
                                email,
                                password,
                                gender
                            },
                        };

                        MMUtils.setItemToStorage(MMConstants.storage.accessToken, userDetail.accessToken);
                        MMUtils.setItemToStorage(MMConstants.storage.userDetail, JSON.stringify(userDetail.userDetail));
                        dispatch(setLogin({ userDetail: userDetail.userDetail, accessToken: userDetail.accessToken }));
                    }
                    setIsOverlayLoading(false);
                })
                .catch(function (error) {
                    setIsOverlayLoading(false);
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }

    async function onLoginWithOTP() {
        try {
            const apiData = {
                mobileNumber: state.mobileNumber
            };

            await MMApiService.userLoginWithOTP(apiData)
                .then(function (response) {
                    if (response) {
                        navigation.navigate('Otp', { mobileNumber: state.mobileNumber });
                    }
                    setIsOverlayLoading(false);
                })
                .catch(function (error) {
                    setIsOverlayLoading(false);
                    setState({
                        ...state,
                        errors: MMUtils.apiErrorParamMessages(error)
                    });
                });
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }

    const renderView = () => {
        return (
            <MMSurface padding={[18, 18, 8, 18]}>
                <View>
                    <Image
                        textAlign="center"
                        resizeMode="contain"
                        style={[MMStyles.responsiveImage, { height: Dimensions.get('window').height / 4 }]}
                        source={require('../../assets/images/loginImage.png')}
                    />
                </View>
                <View style={MMStyles.m5}>
                    <View style={[MMStyles.mb30, { alignItems: 'center' }]}>
                        <Text style={[MMStyles.title]}>Get Started</Text>
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
                        name="password"
                        right={<TextInput.Icon color={theme.colors.primary}
                            icon='eye' />}
                    />

                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Login"
                        onPress={() => onLogin('password')}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Text >Or</Text>
                    </View>
                    <MMOutlineButton
                        label="Login With OTP"
                        mode='text'
                        onPress={() => { onLogin('otp') }}
                        width={'70%'}
                    ></MMOutlineButton>
                </View>
                <View style={[MMStyles.mt15, { alignItems: 'center' }]}>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>By continuing you agree to our </Text>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}><Text style={{ color: theme.colors.primary }}>Terms of Services</Text> and
                        <Text style={{ color: theme.colors.primary }}> Privacy Policy</Text></Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt15]}>Need an account ?</Text>
                        <MMTransparentButton variant="none" transparent label='SIGN UP'
                            style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt5]} onPress={() => navigation.navigate('SignUp')} />
                    </View>
                </View>
            </MMSurface>
        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer >
    );
}

Login.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const styles = StyleSheet.create({
    separator: {
        height: 2,
        width: 150,
        backgroundColor: 'black',
        marginTop: 20,
    },
});