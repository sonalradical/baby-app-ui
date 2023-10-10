import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import OTPTextView from 'react-native-otp-textinput';

import MMColors from '../../helpers/Colors';
import MMStyles from '../../helpers/Styles';
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
            onSignInPress(otpValue);
        }
    };


    const onSignInPress = () => {

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
                                    <MMTransparentButton label="Resend OTP" textColor={MMColors.orange} />
                                </View>
                            )
                            : null
                    }

                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Verify"
                        onPress={() => onSignInPress()}
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