import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { extend, validateAll } from 'indicative/validator';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMEnums from '../../helpers/Enums';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMPinTextInput from '../../components/common/OTPTextView';
import MMImageBackground from '../../components/common/ImageBackground';
import MMSurface from '../../components/common/Surface';
import MMAuthHeader from '../../components/common/AuthHeader';

export default function OTPView({ navigation, route }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { mobileNumber } = route.params;
    const [isResendVisible, setIsResendVisible] = useState(false);
    const [isOverlayLoading, setOverlayLoading] = useState(false);

    const initState = {
        otp: null,
        errors: {},
    };

    const [state, setState] = useState(initState);

    useEffect(() => {
        async function Init() {
            setTimeout(() => {
                setIsResendVisible(true);
            }, MMConstants.otpTimeOut);
        }
        Init();
    }, []);

    const onApply = (value) => {
        setState({
            ...state,
            otp: value,
            errors: {
                ...state.errors,
                otp: '',
            },
        });

        if (value.length === 4) {
            onVerify(value);
        }
    };

    extend('validOTP', {
        validate() {
            if (_.size(state.otp) !== 4) {
                return false;
            }
            return true;
        },
    });


    const onResendOTP = async () => {
        setOverlayLoading(true);
        setIsResendVisible(false);
        const apiData = {
            mobileNumber: mobileNumber,
            deviceId: '65780c81d2a96049f98a0809'
        };
        const resendOTP = await MMApiService.resendOTP(apiData);
        if (resendOTP) {
            setState({
                ...state,
                otp: '',
                errors: {
                    ...state.errors
                },
            });
            setTimeout(() => {
                setIsResendVisible(true);
            }, MMConstants.otpTimeOut);
            setOverlayLoading(false);
            MMUtils.showToastMessage("OTP send successfully.")
        }
    }


    const onVerify = (otpValue = null) => {
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'otp.required': 'Please enter OTP.',
            'otp.validOTP': 'Please enter 4 digit OTP.',
        };

        const rules = {
            otp: 'validOTP|required',
        };

        if (!_.isNull(otpValue)) {
            state.otp = otpValue;
        }

        validateAll(state, rules, messages)
            .then(async () => {
                setOverlayLoading(true);
                onVerifyOtp();
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setOverlayLoading(false);
            });
    }

    async function onVerifyOtp() {
        try {
            const apiData = {
                mobileNumber: mobileNumber,
                otp: state.otp
            };

            await MMApiService.verifyOTP(apiData)
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
        } catch (err) {
            MMUtils.consoleError(err);
        }
    }

    const renderView = () => {
        return (
            <MMSurface margin={[0, 0, 0, 0]} style={styles(theme).surface}>
                <View style={{ padding: MMConstants.paddingLarge }}>
                    <MMAuthHeader title='OTP Verification' />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={theme.fonts.headlineSmall}>Enter OTP</Text>
                        <Text style={[theme.fonts.default, { paddingTop: MMConstants.paddingLarge }]}>{`We have sent a verification code to`}</Text>
                        <Text style={theme.fonts.titleMedium}>{mobileNumber}</Text>
                    </View>
                    <View>
                        <MMPinTextInput
                            value={state.otp}
                            setValue={(text) => onApply(text)}
                            errorText={state.errors.otp}
                            cellCount={4}
                        />
                    </View>
                    {
                        isResendVisible
                            ? (
                                <View style={{ marginTop: MMConstants.marginLarge, flexDirection: 'row', alignSelf: 'center' }}>
                                    <Text style={[theme.fonts.default]}>Didn’t get the OTP ? </Text>
                                    <MMTransparentButton label="Resend OTP" textColor={theme.colors.primary} onPress={() => onResendOTP()} />
                                </View>
                            )
                            : null
                    }


                </View>
                <MMButton
                    label="Verify"
                    onPress={() => onVerify()}
                />
            </MMSurface>

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

OTPView.propTypes = {
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