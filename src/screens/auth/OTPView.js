import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import OTPTextView from 'react-native-otp-textinput';
import { extend, validateAll } from 'indicative/validator';

import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMApiService from '../../services/ApiService';
import { MMRoundButton, MMTransparentButton } from '../../components/common/Button';
import MMFormErrorText from '../../components/common/FormErrorText';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';

export default function OTPView({ navigation, route }) {
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
        const otpValue = _.join(value, '');
        setState({
            ...state,
            otp: otpValue,
            errors: {
                ...state.errors,
                otp: '',
            },
        });

        if (otpValue.length === 6) {
            onVerify(otpValue);
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
            setTimeout(() => {
                setIsResendVisible(true);
            }, 10000);
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
                const apiData = {
                    mobileNumber: mobileNumber,
                    otp: state.otp
                };
                const { data } = await MMApiService.verifyOTP(apiData);
                if (data) {
                    setIsOverlayLoading(false);
                    const userDetail = {
                        accessToken: data.accessToken,
                        userDetail: {
                            mobileNumber: data.mobileNumber,
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            gender: data.gender
                        },
                    };
                    await MMUtils.setItemToStorage(MMConstants.storage.accessToken, userDetail.accessToken);
                    await MMUtils.setItemToStorage(MMConstants.storage.userDetail, JSON.stringify(userDetail.userDetail));
                }
                else {
                    setIsOverlayLoading(false);
                }
            })
            .catch((errors) => {
                // Handle validation errors
                const formattedErrors = {};
                errors.forEach((error) => {
                    formattedErrors[error.field] = [error.message];
                });
                setState({
                    ...state,
                    errors: formattedErrors,
                });
                setIsOverlayLoading(false);
            });
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
                        <OTPTextView
                            handleTextChange={(text) => onApply(text)}
                            inputCount={6}
                            tintColor={MMColors.orange}
                            keyboardType="number-pad"
                            containerStyle={MMStyles.mt20}
                            textInputStyle={styles.roundedTextInput}
                        />
                    </View>
                    <MMFormErrorText errorText={state.errors.otp} />

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
        <View style={MMStyles.container}>
            <MMScrollView>
                {renderView()}
                <MMOverlaySpinner visible={isOverlayLoading} />
            </MMScrollView>
        </View>
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