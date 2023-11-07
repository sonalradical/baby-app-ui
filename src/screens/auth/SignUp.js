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
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';

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
        terms: false,
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
            'gender.required': 'Please select gender.',
            'terms.required': 'please Accept Terms.'
        };

        const rules = {
            mobileNumber: 'required|string|min:10',
            name: 'required|string',
            email: 'required|string|email',
            password: 'required|min:8|max:8',
            gender: 'required',
            terms: 'required'
        };

        validateAll(state, rules, messages)
            .then(async () => {
                setIsOverlayLoading(true);
                if (checked) {
                    onSignUp();
                }

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
    const onTermsCheck = () => {
        // Update the checkbox state in the form data
        setChecked(!checked)
        setState({
            ...state,
            terms: !checked,
        });
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
            <View style={{ margin: 10 }}>
                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                    <Text style={theme.fonts.headlineLarge}>Your Profile</Text>
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
                    <Text style={theme.fonts.titleMedium}>Gender *</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {MMConstants.gender.map((option) => (
                            <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value={option.value}
                                    status={state.gender === option.value ? 'checked' : 'unchecked'}
                                    onPress={() => onGenderChange(option.value)}
                                />
                                <Text style={{ color: theme.colors.text.secondary }}>{option.label}</Text>
                            </View>
                        ))}
                    </View>
                    <MMFormErrorText errorText={state.errors.gender} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                        color={theme.colors.primary}
                        size="sm"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={onTermsCheck}
                        value={state.terms}
                        style={{ borderColor: theme.colors.primary }} />
                    <Text style={{ color: theme.colors.text.secondary }}>I accept <Text style={{ color: theme.colors.primary }}>Terms of Use </Text> and
                        <Text style={{ color: theme.colors.primary }}>  Privacy Policy</Text>.</Text>

                </View>
                {!checked && state.errors.terms ? <MMFormErrorText errorText={state.errors.terms} /> : null}
                <MMButton
                    label="Sign Up"
                    onPress={() => onSubmit()}
                />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: theme.colors.text.secondary, marginTop: 10 }}>Already have an account?</Text>
                        <MMTransparentButton variant="none" transparent label='SIGN IN'
                            style={{ marginTop: 2 }} onPress={() => navigation.navigate('Login')} />
                    </View>
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

SignUp.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};
