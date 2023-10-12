import React, { useState } from 'react';
import { Image, View, Text, Dimensions, StyleSheet, Keyboard } from 'react-native';
import { Button } from 'react-native-paper';

import { validateAll } from 'indicative/validator';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import MMInput from '../../components/common/Input';
import { MMRoundButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';

export default function Login({ navigation }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

    const initState = {
        mobileNumber: '+91',
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
            'mobileNumber.min': 'Mobile number must be 13 digits.',
            'password.required': 'Please enter password.',
            'password.min': 'Password should have a minimum of 8 characters.',
        };

        const rules = loginType === 'password' ? {
            mobileNumber: 'required|string|min:13',
            password: 'required|string|min:8|max:8',
        } : {
            mobileNumber: 'required|string|min:13'
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
            <View style={MMStyles.containerPadding}>
                <View>
                    <Image
                        textAlign="center"
                        resizeMode="contain"
                        style={[MMStyles.responsiveImage, { height: Dimensions.get('window').height / 4 }]}
                        source={require('../../assets/images/loginImage.png')}
                    />
                </View>
                <View style={MMStyles.m5}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>Get Started</Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h4, MMStyles.mt10]}>Login</Text>
                    </View>

                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        maxLength={15}
                        value={state.mobileNumber}
                        onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                        placeholder="Enter Mobile Number"
                        errorMessage={state.errors.mobileNumber}
                        name="mobileNumber"
                        iconName="cellphone"
                        keyboardType="phone-pad"
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt15}
                        maxLength={8}
                        value={state.password}
                        onChangeText={(value) => { onInputChange('password', value); }}
                        placeholder="Enter Password"
                        errorMessage={state.errors.password}
                        iconName="lock"
                        name="password"
                    />

                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Login"
                        onPress={() => onLogin('password')}
                        optionalStyle={[MMStyles.mt20]}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.separator} />
                        <Text style={[MMStyles.mt20, MMStyles.p10, MMStyles.cardHeaderText]}>OR</Text>
                        <View style={styles.separator} />
                    </View>
                    <MMRoundButton
                        label="Login With OTP"
                        mode='text'
                        onPress={() => { onLogin('otp') }}
                        optionalStyle={[MMStyles.mt15]}
                    ></MMRoundButton>
                </View>
                <View style={[MMStyles.mt30, { alignItems: 'center' }]}>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>By continuing you agree to our Terms</Text>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>of Services and Privacy Policy</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt15]}>Need an account ?</Text>
                        <Button variant="none" transparent style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt5]} onPress={() => navigation.navigate('SignUp')}>
                            SIGN UP
                        </Button>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={MMStyles.container}>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </View>
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