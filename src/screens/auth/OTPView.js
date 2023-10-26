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
import MMFormErrorText from '../../components/common/FormErrorText';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import MMContentContainer from '../../components/common/ContentContainer';
import MMPinTextInput from '../../components/common/OTPTextView';


export default function OTPView({ navigation, route }) {
    const dispatch = useDispatch();
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

        if (value.length === 6) {
            onVerify(value);
        }
    };

    extend('validOTP', {
        validate() {
            if (_.size(state.otp) !== 6) {
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
            'otp.validOTP': 'Please enter 6 digit OTP.',
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

            <View style={MMStyles.containerPadding}>
                <View >
                    <Image
                        textAlign="center"
                        resizeMode="contain"
                        style={[MMStyles.responsiveImage, { height: Dimensions.get('window').height / 3 }]}
                        source={require('../../assets/images/otp.png')}
                    />
                </View>
                <View style={MMStyles.m5}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>OTP Verification</Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h4, MMStyles.mt30]}>Enter OTP</Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h5, MMStyles.mt20]}>{`We have sent a verification code to`}</Text>
                        <Text style={[MMStyles.subTitle, MMStyles.h5]}>{mobileNumber}</Text>
                    </View>
                    <View >
                        <MMPinTextInput
                            value={state.otp}
                            setValue={(text) => onApply(text)}
                            errorText={state.errors.otp}
                            cellCount={6}
                        />
                    </View>
                    {
                        isResendVisible
                            ? (
                                <View style={[MMStyles.mt20, MMStyles.mb10]}>
                                    <Text style={[MMStyles.titleText, MMStyles.h5, { alignSelf: 'center' }]}>Didn’t get the OTP?</Text>
                                    <MMTransparentButton label="Resend OTP" textColor={MMColors.orange} onPress={() => onResendOTP()} />
                                </View>
                            )
                            : null
                    }

                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Verify"
                        onPress={() => onVerify()}
                        optionalStyle={[MMStyles.mt20]}
                    />
                </View>
            </View>

        );
    };

    return (
        <MMContentContainer>
            <MMScrollView>
                {renderView()}
            </MMScrollView>
            <MMOverlaySpinner visible={isOverlayLoading} />
        </MMContentContainer>
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