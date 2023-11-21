import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Checkbox, RadioButton, useTheme } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';
import { useSelector } from 'react-redux';

import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMButton, MMTransparentButton } from '../../components/common/Button';
import MMFormErrorText from '../../components/common/FormErrorText';
import MMContentContainer from '../../components/common/ContentContainer';
import MMRadioButton from '../../components/common/RadioButton';

export default function SignUp({ navigation, route }) {
    const theme = useTheme();
    const lookupData = useSelector((state) => state.AuthReducer.lookupData);
    const [isOverlayLoading, setOverlayLoading] = useState(false);
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
            'terms.required': 'please Accept Terms.',
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
                setOverlayLoading(true);

                if (state.terms) {
                    onSignUp();
                }

            })
            .catch((errors) => {
                setState({
                    ...state,
                    errors: MMUtils.clientErrorMessages(errors)
                });
                setOverlayLoading(false);
            });
    };

    const onGenderChange = (value) => {
        setState({ ...state, gender: value });
    };
    const onTermsCheck = () => {
        // Update the checkbox state in the form data
        setState({
            ...state,
            terms: !state.terms,
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
            setOverlayLoading(false);
        }
    }


    const renderView = () => {
        return (
            <View style={{ padding: 10 }}>
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
                />
                <MMInput
                    label='Password *'
                    value={state.password}
                    onChangeText={(value) => onInputChange('password', value)}
                    placeholder="Enter Password"
                    maxLength={8}
                    errorText={state.errors.password}
                    secureTextEntry={passwordHide}
                    name="password"
                    rightIcon={passwordHide ? 'eye-off' : 'eye'}
                    onPress={passwordHide ? () => setPasswordHide(false) : () => setPasswordHide(true)}
                />
                <MMRadioButton
                    label='Gender *'
                    options={lookupData.gender}
                    selectedValue={state.gender}
                    onValueChange={onGenderChange}
                    errorText={state.errors.gender}
                />
                <View style={{ paddingTop: 30, flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox.Android
                        color={theme.colors.primary}
                        size="sm"
                        status={state.terms ? 'checked' : 'unchecked'}
                        onPress={onTermsCheck}
                        value={state.terms}
                        style={{ borderColor: theme.colors.primary }} />
                    <Text style={theme.fonts.default}>I accept <Text style={{ color: theme.colors.primary }}>Terms of Use </Text> and
                        <Text style={{ color: theme.colors.primary }}>  Privacy Policy</Text>.</Text>

                </View>
                <MMFormErrorText errorText={state.errors.terms} />
                <MMButton
                    label="Sign Up"
                    onPress={() => onSubmit()}
                />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[theme.fonts.default, { paddingTop: 10 }]}>Already have an account?</Text>
                        <MMTransparentButton variant="none" transparent label='SIGN IN'
                            style={{ paddingTop: 0 }} onPress={() => navigation.navigate('Login')} />
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
