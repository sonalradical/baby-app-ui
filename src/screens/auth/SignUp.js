import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';

import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { validateAll } from 'indicative/validator';

import MMStyles from '../../helpers/Styles';
import MMConstants from '../../helpers/Constants';
import MMColors from '../../helpers/Colors';
import MMUtils from '../../helpers/Utils'
import MMApiService from '../../services/ApiService';
import { MMOverlaySpinner } from '../../components/common/Spinner';
import MMInput from '../../components/common/Input';
import MMScrollView from '../../components/common/ScrollView';
import { MMRoundButton } from '../../components/common/Button';
import MMPicker from '../../components/common/Picker';
import MMContentContainer from '../../components/common/ContentContainer';
import MMSurface from '../../components/common/Surface';

export default function SignUp({ navigation, route }) {
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

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
            <>
                <MMSurface padding={[18, 18, 18, 18]}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[MMStyles.titleText, MMStyles.h2]}>Your Profile</Text>
                    </View>
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        maxLength={10}
                        value={state.mobileNumber}
                        onChangeText={(value) => { onInputChange('mobileNumber', value); }}
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        errorText={state.errors.mobileNumber}
                        keyboardType="phone-pad"
                        left={<TextInput.Icon
                            icon='cellphone' />}
                    />
                    <MMInput
                        maxLength={50}
                        optionalStyle={MMStyles.mt20}
                        value={state.name}
                        onChangeText={(value) => onInputChange('name', value)}
                        placeholder="Name"
                        errorText={state.errors.name}
                        optionalIconSize={20}
                        left={<TextInput.Icon
                            icon='account' />}
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        value={state.email}
                        onChangeText={(value) => onInputChange('email', value)}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCorrect={false}
                        maxLength={150}
                        errorText={state.errors.email}
                        optionalIconSize={20}
                        left={<TextInput.Icon
                            icon='email' />}
                    />
                    <MMInput
                        optionalStyle={MMStyles.mt20}
                        value={state.password}
                        onChangeText={(value) => onInputChange('password', value)}
                        placeholder="Password"
                        maxLength={8}
                        errorText={state.errors.password}
                        optionalIconSize={20}
                        type={'password'}
                        left={<TextInput.Icon
                            icon='lock' />}
                    />
                    <MMPicker
                        optionalStyle={MMStyles.mt20}
                        label="Gender"
                        value={state.gender}
                        items={MMConstants.gender}
                        errorText={(value) => onInputChange('gender', value)}
                        errorMessage={state.errors.gender}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            color={MMColors.orange}
                            size="sm"
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                            style={{ borderColor: MMColors.orange }} />
                        <Text style={[MMStyles.h6, MMStyles.ml5]}>I accept <Text style={{ color: MMColors.orange }}>Terms of Use </Text>and <Text style={{ color: MMColors.orange }}>Privacy Policy</Text>.</Text>

                    </View>
                    <MMRoundButton
                        optionalTextStyle={[MMStyles.h5]}
                        label="Sign Up"
                        onPress={() => onSubmit()}
                        optionalStyle={[MMStyles.mt10]}
                    />
                </MMSurface>
                <View style={[MMStyles.mt30, { alignSelf: 'center', flexDirection: 'row' }]}>
                    <Text style={[MMStyles.subTitle, MMStyles.h5]}>Already have an account?</Text>
                    <Button variant="none" transparent style={[MMStyles.subTitle, MMStyles.h6, { bottom: 7 }]}
                        onPress={() => navigation.navigate('Login')}> SIGN IN </Button>
                </View>
            </>
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
