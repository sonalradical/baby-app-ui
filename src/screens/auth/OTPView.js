import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { extend, validateAll } from 'indicative/validator';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPinTextInput from '../../components/common/OTPTextView';
import MMImageBackground from '../../components/common/ImageBackground';
import MMSurface from '../../components/common/Surface';
import { useTheme } from 'react-native-paper';


export default function OTPView({ navigation, route }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const otpRef = useRef(null);
    const { mobileNumber } = route.params;
    const [isResendVisible, setIsResendVisible] = useState(false);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

    const initState = {
        otp: null,
        errors: {},
    };

    const [state, setState] = useState(initState);

    useEffect(() => {
        async function Init() {
            setTimeout(() => {
                setIsResendVisible(true);
            }, 60000);
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
        setIsOverlayLoading(true);
        setIsResendVisible(false);
        const apiData = {
            mobileNumber: mobileNumber
        };
        const resendOTP = await MMApiService.resendOTP(apiData);
        if (resendOTP) {
            setIsOverlayLoading(false);
            setState({
                ...state,
                otp: '',
                errors: {
                    ...state.errors
                },
            });
            setTimeout(() => {
                setIsResendVisible(true);
            }, 60000);
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
                setIsOverlayLoading(true);
                onVerifyOtp();
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setIsOverlayLoading(false);
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
                        console.log(responseData)
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
                        console.log(userDetails.userDetail, 'userDetails.userDetail')
                        MMUtils.setItemToStorage(MMConstants.storage.accessToken, userDetails.accessToken);
                        MMUtils.setItemToStorage(MMConstants.storage.userDetail, JSON.stringify(userDetails.userDetail));

                        dispatch(setLogin({ userDetail: userDetails.userDetail, accessToken: userDetails.accessToken }));
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
            <MMSurface margin={[0, 0, 0, 0]} style={styles(theme).surface}>
                <View style={{ margin: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[theme.fonts.headlineLarge, { marginBottom: 15 }]}>OTP Verification</Text>
                        <Text style={theme.fonts.headlineSmall}>Enter OTP</Text>
                        <Text style={[theme.fonts.default, { marginTop: 10 }]}>{`We have sent a verification code to`}</Text>
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
                                <View style={{ marginTop: 20 }}>
                                    <Text style={[theme.fonts.default, { alignSelf: 'center' }]}>Didn’t get the OTP?</Text>
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