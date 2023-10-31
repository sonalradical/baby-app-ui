import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { extend, validateAll } from 'indicative/validator';
import { useDispatch } from 'react-redux';

import { setLogin } from '../../redux/Slice/AuthSlice';

import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMRoundButton, MMTransparentButton } from '../../components/common/Button';
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

    const renderView = () => {
        return (
            <MMSurface margin={[0, 0, 0, 0]} style={{
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                bottom: 0,
                position: 'absolute',
                backgroundColor: MMColors.backgroundColor
            }}>
                <View style={MMStyles.m5}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.title]}>OTP Verification</Text>
                        <Text style={[MMStyles.boldText, MMStyles.h4, MMStyles.mt30]}>Enter OTP</Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h5, MMStyles.mt20]}>{`We have sent a verification code to`}</Text>
                        <Text style={[MMStyles.boldText, MMStyles.h5]}>{mobileNumber}</Text>
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
                                <View style={[MMStyles.mt20, MMStyles.mb5]}>
                                    <Text style={[MMStyles.subTitle, MMStyles.h5, { alignSelf: 'center' }]}>Didn’t get the OTP?</Text>
                                    <MMTransparentButton label="Resend OTP" textColor={theme.colors.primary} onPress={() => onResendOTP()} />
                                </View>
                            )
                            : null
                    }


                </View>
                <MMRoundButton
                    optionalTextStyle={[MMStyles.h5]}
                    label="Verify"
                    onPress={() => onVerify()}
                    Style={[MMStyles.mt20]}
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

const styles = StyleSheet.create({
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 2,
    },
});