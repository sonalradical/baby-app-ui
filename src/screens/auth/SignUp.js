import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Checkbox, RadioButton, TextInput, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';

import MMStyles from '../../helpers/Styles';
import MMConstants from '../../helpers/Constants';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMRoundButton, MMTransparentButton } from '../../components/common/Button';
import MMSurface from '../../components/common/Surface';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMImageBackground from '../../components/common/ImageBackground';

export default function SignUp({ navigation, route }) {
    const theme = useTheme();
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [passwordHide, setPasswordHide] = useState(true);

    const initState = {
        mobileNumber: '',
        name: '',
        email: '',
        password: '',
        gender: '',
        errors: {},
    };
    const [state, setState] = useState(initState);
    const [checked, setChecked] = useState(false);

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
        if (isOverlayLoading) {
            return;
        }

        const messages = {
            'mobileNumber.required': 'Please enter mobile no.',
            'mobileNumber.min': 'Mobile number must be 10 digits.',
            'name.required': 'Please enter name.',
            'email.required': 'Please enter email.',
            'email.email': 'Email address is not in a valid format.',
            'password.required': 'Please enter password.',
            'password.min': 'Password should have a minimum of 8 characters.',
            'gender.required': 'Please select gender',
        };

        const rules = {
            mobileNumber: 'required|string|min:10',
            name: 'required|string',
            email: 'required|string|email',
            password: 'required|min:8|max:8',
            gender: 'required',
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setIsOverlayLoading(true);
                onSignUp();
            })
            .catch((errors) => {
                console.log("Validation Errors:", errors);
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setIsOverlayLoading(false);
            });
    };

    const onGenderChange = (value) => {
        setState({ ...state, gender: value });
    };

    async function onSignUp() {
        try {
            const apiData = {
                mobileNumber: state.mobileNumber,
                name: state.name,
                email: state.email,
                password: state.password,
                gender: state.gender,
            };

            await MMApiService.userSignup(apiData)
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
            <MMSurface margin={[0, 0, 0, 0]} style={{
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                bottom: 0,
                position: 'absolute'
            }}>
                <View style={[MMStyles.mb30, { alignItems: 'center' }]}>
                    <Text style={[MMStyles.title]}>Your Profile</Text>
                </View>

                <MMInput
                    label='Phone Number *'
                    maxLength={10}
                    value={state.mobileNumber}
                    onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                    placeholder="Enter Phone Number"
                    name="mobileNumber"
                    errorText={state.errors.mobileNumber}
                    keyboardType="phone-pad"
                />
                <MMInput
                    label='Name *'
                    maxLength={50}
                    value={state.name}
                    onChangeText={(value) => onInputChange('name', value)}
                    placeholder="Enter Your Name"
                    errorText={state.errors.name}
                    optionalIconSize={20}
                />
                <MMInput
                    label='Email Address *'
                    value={state.email}
                    onChangeText={(value) => onInputChange('email', value)}
                    placeholder="Enter Email Address"
                    keyboardType="email-address"
                    autoCorrect={false}
                    maxLength={150}
                    errorText={state.errors.email}
                    optionalIconSize={20}
                />
                <MMInput
                    label='Password *'
                    value={state.password}
                    onChangeText={(value) => onInputChange('password', value)}
                    placeholder="Enter Password"
                    maxLength={8}
                    errorText={state.errors.password}
                    optionalIconSize={20}
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
                <View>
                    <Text style={MMStyles.boldText}>Gender *</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {MMConstants.gender.map((option) => (
                            <View key={option.value} style={MMStyles.rowCenter}>
                                <RadioButton
                                    value={option.value}
                                    status={state.gender === option.value ? 'checked' : 'unchecked'}
                                    onPress={() => onGenderChange(option.value)}
                                />
                                <Text style={MMStyles.subTitle}>{option.label}</Text>
                            </View>
                        ))}
                    </View>
                    <MMFormErrorText errorText={state.errors.gender} />
                </View>
                <View style={MMStyles.rowCenter}>
                    <Checkbox
                        color={theme.colors.primary}
                        size="sm"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                        style={{ borderColor: theme.colors.primary }} />
                    <Text style={MMStyles.subTitle}>I accept <Text style={{ color: theme.colors.primary }}>Terms of Use</Text> and
                        <Text style={{ color: theme.colors.primary }}> Privacy Policy</Text>.</Text>

                </View>
                <MMRoundButton
                    optionalTextStyle={[MMStyles.h5]}
                    label="Sign Up"
                    onPress={() => onSubmit()}
                    optionalStyle={[MMStyles.mt10]}
                />
                <View style={MMStyles.alignItems}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[MMStyles.boldText, MMStyles.h6, MMStyles.mt15]}>Already have an account?</Text>
                        <MMTransparentButton variant="none" transparent label='SIGN IN'
                            style={[MMStyles.subTitle, MMStyles.h6, MMStyles.mt5]} onPress={() => navigation.navigate('Login')} />
                    </View>
                </View>
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

SignUp.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
