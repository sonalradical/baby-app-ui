import React, { useState } from 'react';
import { Image, View, Text, Keyboard, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';

import MMStyles from '../../helpers/Styles';
import MMColors from '../../helpers/Colors';
import MMConstants from '../../helpers/Constants';
import MMInput from '../../components/common/Input';
import { MMRoundButton } from '../../components/common/Button';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMScrollView from '../../components/common/ScrollView';
import { Button } from 'native-base';

export default function Login({ navigation }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

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
    const onSubmit = () => {
        navigation.navigate('Otp');
    }

    const onNavigate = () => {
        navigation.navigate('SignUp');
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
                        name="mobileNumber"
                        iconName="mobile"
                        keyboardType="phone-pad"
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt15}
                        maxLength={8}
                        value={state.password}
                        onChangeText={(value) => { onInputChange('password', value); }}
                        placeholder="Enter Password"
                        iconName="lock"
                        name="password"
                    />

                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Login"
                        //onPress={() => onSubmit()}
                        optionalStyle={[MMStyles.mt20]}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.separator} />
                        <Text style={[MMStyles.mt20, MMStyles.p10, MMStyles.cardHeaderText]}>OR</Text>
                        <View style={styles.separator} />
                    </View>
                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Login With OTP"
                        onPress={() => onSubmit()}
                        optionalStyle={[MMStyles.mt15]}
                    />
                </View>
                <View style={[MMStyles.mt30, { alignItems: 'center' }]}>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>By continuing you agree to our Terms</Text>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>of Services and Privacy Policy</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt15]}>Need an account ?</Text>
                        <Button variant="none" transparent style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt5]} onPress={() => onNavigate()}>
                            SIGN UP
                        </Button>
                    </View>
                </View>
            </View >
        );
    };

    return (
        <>
            <View style={MMStyles.container}>
                <MMScrollView>
                    {renderView()}
                    <MMOverlaySpinner visible={isOverlayLoading} />
                </MMScrollView>
            </View>
        </>
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